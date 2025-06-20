"""
REST API server for archive analyzer.
Provides HTTP endpoints for easy integration with Node.js backend.
"""

import json
import logging
import os
import tempfile
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

try:
    from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
    from fastapi.responses import FileResponse, JSONResponse
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, Field
    import uvicorn
except ImportError:
    raise ImportError("FastAPI is required. Install with: pip install fastapi uvicorn[standard]")

try:
    import aioredis

    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    aioredis = None

from .comparator import ArchiveComparator
from .reports import ReportGeneratorFactory

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)


# Pydantic models for API
class CompareRequest(BaseModel):
    """Request model for archive comparison."""
    report_format: str = Field(default="json", description="Report format (json or csv)")
    timeout_per_file: float = Field(default=30.0, description="Timeout per file in seconds")
    max_workers: int = Field(default=4, description="Maximum parallel workers")
    include_details: bool = Field(default=True, description="Include detailed comparisons")


class CompareResponse(BaseModel):
    """Response model for archive comparison."""
    job_id: str
    status: str
    message: str
    result_url: Optional[str] = None
    report_url: Optional[str] = None


class JobStatus(BaseModel):
    """Model for job status."""
    job_id: str
    status: str  # pending, processing, completed, failed
    progress: float
    result: Optional[Dict] = None
    error: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None


class BatchCompareRequest(BaseModel):
    """Request model for batch comparison."""
    reference_archive: str
    archives: List[str]
    threshold: float = Field(default=0.8, description="Similarity threshold for flagging")


# Create FastAPI app
app = FastAPI(
    title="Archive Analyzer API",
    description="API for comparing archives and detecting plagiarism",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JobManager:
    """Manages background jobs and their status."""

    def __init__(self):
        """Initialize job manager."""
        self.jobs: Dict[str, JobStatus] = {}
        self.redis = None
        self.comparator = ArchiveComparator()

    async def init_redis(self):
        """Initialize Redis connection if available."""
        if REDIS_AVAILABLE:
            try:
                self.redis = await aioredis.create_redis_pool(
                    os.getenv('REDIS_URL', 'redis://localhost:6379')
                )
                logger.info("Redis connection established")
            except Exception as e:
                logger.warning(f"Failed to connect to Redis: {e}")

    async def close_redis(self):
        """Close Redis connection."""
        if self.redis:
            self.redis.close()
            await self.redis.wait_closed()

    def create_job(self) -> str:
        """Create a new job and return its ID."""
        job_id = str(uuid.uuid4())
        self.jobs[job_id] = JobStatus(
            job_id=job_id,
            status="pending",
            progress=0.0,
            created_at=datetime.now()
        )
        return job_id

    async def update_job(self, job_id: str, **kwargs):
        """Update job status."""
        if job_id in self.jobs:
            for key, value in kwargs.items():
                setattr(self.jobs[job_id], key, value)

            # Store in Redis if available
            if self.redis:
                await self.redis.setex(
                    f"job:{job_id}",
                    3600,  # 1 hour expiry
                    json.dumps(self.jobs[job_id].dict(), default=str)
                )

    async def get_job(self, job_id: str) -> Optional[JobStatus]:
        """Get job status."""
        # Check memory first
        if job_id in self.jobs:
            return self.jobs[job_id]

        # Check Redis if available
        if self.redis:
            data = await self.redis.get(f"job:{job_id}")
            if data:
                job_data = json.loads(data)
                return JobStatus(**job_data)

        return None

    async def process_comparison(self, job_id: str, file1_path: Path, file2_path: Path,
                                 request: CompareRequest):
        """Process archive comparison in background."""
        try:
            await self.update_job(job_id, status="processing", progress=0.1)

            # Perform comparison
            comparison = self.comparator.compare_archives(file1_path, file2_path)

            await self.update_job(job_id, progress=0.7)

            # Generate report
            report_path = Path(f"reports/{job_id}.{request.report_format}")
            report_path.parent.mkdir(exist_ok=True)

            generator = ReportGeneratorFactory.create_generator(
                request.report_format,
                include_details=request.include_details
            )
            generator.generate(comparison, report_path)

            await self.update_job(job_id, progress=0.9)

            # Prepare result
            result = {
                "global_similarity": comparison.global_similarity.overall_score,
                "summary": {
                    "common_files": len(comparison.common_files),
                    "unique_to_archive1": len(comparison.unique_to_archive1),
                    "unique_to_archive2": len(comparison.unique_to_archive2),
                    "errors": len(comparison.errors)
                },
                "report_path": str(report_path)
            }

            await self.update_job(
                job_id,
                status="completed",
                progress=1.0,
                result=result,
                completed_at=datetime.now()
            )

        except Exception as e:
            logger.error(f"Job {job_id} failed: {e}")
            await self.update_job(
                job_id,
                status="failed",
                error=str(e),
                completed_at=datetime.now()
            )
        finally:
            # Cleanup temporary files
            try:
                file1_path.unlink()
                file2_path.unlink()
            except Exception:
                pass


# Initialize job manager
job_manager = JobManager()


@app.on_event("startup")
async def startup_event():
    """Initialize resources on startup."""
    await job_manager.init_redis()


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup resources on shutdown."""
    await job_manager.close_redis()


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Archive Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "compare": "/api/compare",
            "status": "/api/status/{job_id}",
            "report": "/api/report/{job_id}",
            "health": "/health"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "redis": "connected" if job_manager.redis else "not connected"
    }


@app.post("/api/compare", response_model=CompareResponse)
async def compare_archives(
        background_tasks: BackgroundTasks,
        archive1: UploadFile = File(...),
        archive2: UploadFile = File(...),
        request: CompareRequest = CompareRequest()
):
    """
    Compare two uploaded archives.

    Returns a job ID that can be used to check the status.
    """
    # Validate file types
    allowed_extensions = {'.zip', '.rar', '.7z'}

    for archive in [archive1, archive2]:
        ext = Path(archive.filename).suffix.lower()
        if ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {ext}. Allowed: {allowed_extensions}"
            )

    # Create job
    job_id = job_manager.create_job()

    # Save uploaded files
    temp_dir = Path("temp")
    temp_dir.mkdir(exist_ok=True)

    file1_path = temp_dir / f"{job_id}_1{Path(archive1.filename).suffix}"
    file2_path = temp_dir / f"{job_id}_2{Path(archive2.filename).suffix}"

    with open(file1_path, "wb") as f:
        f.write(await archive1.read())

    with open(file2_path, "wb") as f:
        f.write(await archive2.read())

    # Start background processing
    background_tasks.add_task(
        job_manager.process_comparison,
        job_id, file1_path, file2_path, request
    )

    return CompareResponse(
        job_id=job_id,
        status="pending",
        message="Comparison started. Check status with job ID.",
        result_url=f"/api/status/{job_id}"
    )


@app.get("/api/status/{job_id}")
async def get_job_status(job_id: str):
    """Get the status of a comparison job."""
    job = await job_manager.get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return job


@app.get("/api/report/{job_id}")
async def download_report(job_id: str, format: str = "json"):
    """Download the report for a completed job."""
    job = await job_manager.get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Job is {job.status}. Report only available for completed jobs."
        )

    report_path = Path(f"reports/{job_id}.{format}")

    if not report_path.exists():
        raise HTTPException(status_code=404, detail="Report file not found")

    return FileResponse(
        report_path,
        media_type="application/json" if format == "json" else "text/csv",
        filename=f"comparison_report_{job_id}.{format}"
    )


@app.post("/api/compare-sync")
async def compare_archives_sync(
        archive1: UploadFile = File(...),
        archive2: UploadFile = File(...),
        timeout: float = 30.0,
        format: str = "json"
):
    """
    Synchronous comparison endpoint for simple use cases.

    Returns the comparison result directly (blocking).
    """
    # Save uploaded files temporarily
    with tempfile.NamedTemporaryFile(suffix=Path(archive1.filename).suffix, delete=False) as f1:
        f1.write(await archive1.read())
        file1_path = Path(f1.name)

    with tempfile.NamedTemporaryFile(suffix=Path(archive2.filename).suffix, delete=False) as f2:
        f2.write(await archive2.read())
        file2_path = Path(f2.name)

    try:
        # Perform comparison
        comparator = ArchiveComparator(timeout_per_file=timeout)
        comparison = comparator.compare_archives(file1_path, file2_path)

        # Generate report if requested
        report_data = None
        if format in ["json", "csv"]:
            report_path = Path(f"reports/sync_{uuid.uuid4()}.{format}")
            report_path.parent.mkdir(exist_ok=True)

            generator = ReportGeneratorFactory.create_generator(format)
            generator.generate(comparison, report_path)

            if format == "json":
                with open(report_path, "r") as f:
                    report_data = json.load(f)

        return {
            "success": True,
            "global_similarity": comparison.global_similarity.overall_score,
            "summary": {
                "common_files": len(comparison.common_files),
                "unique_to_archive1": len(comparison.unique_to_archive1),
                "unique_to_archive2": len(comparison.unique_to_archive2),
                "errors": len(comparison.errors)
            },
            "report": report_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Cleanup
        file1_path.unlink(missing_ok=True)
        file2_path.unlink(missing_ok=True)


# Run server if executed directly
if __name__ == "__main__":
    uvicorn.run(
        "archive_analyzer.server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )