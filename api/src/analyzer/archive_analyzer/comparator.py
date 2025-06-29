"""Main archive comparison engine with timeout handling."""

import logging
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeoutError
from pathlib import Path
from typing import Dict, List, Optional

from .content_analyzers import ContentAnalyzerFactory
from .core import (
    ArchiveComparison, FileComparison, FileContent,
    SimilarityScore
)
from .extractors import ExtractorFactory
from .similarity import SimilarityEngine

logger = logging.getLogger(__name__)


class ArchiveComparator:
    """Main class for comparing archives with comprehensive analysis."""

    def __init__(self,
                 timeout_per_file: float = 30.0,
                 max_workers: int = 4,
                 similarity_engine: Optional[SimilarityEngine] = None):
        """
        Initialize the archive comparator.

        Args:
            timeout_per_file: Maximum time in seconds to analyze each file
            max_workers: Maximum number of parallel workers for file analysis
            similarity_engine: Custom similarity engine to use
        """
        self.timeout_per_file = timeout_per_file
        self.max_workers = max_workers
        self.extractor_factory = ExtractorFactory()
        self.content_factory = ContentAnalyzerFactory()
        self.similarity_engine = similarity_engine or SimilarityEngine()

    def compare_archives(self,
                         archive1_path: Path,
                         archive2_path: Path) -> ArchiveComparison:
        """
        Compare two archives and generate detailed comparison results.

        Args:
            archive1_path: Path to the first archive
            archive2_path: Path to the second archive

        Returns:
            ArchiveComparison with complete analysis results
        """
        start_time = time.time()
        errors = []

        # Validate input files
        if not archive1_path.exists():
            raise FileNotFoundError(f"Archive not found: {archive1_path}")
        if not archive2_path.exists():
            raise FileNotFoundError(f"Archive not found: {archive2_path}")

        # Extract archives
        logger.info(f"Starting comparison: {archive1_path.name} vs {archive2_path.name}")

        try:
            files1 = self._extract_archive(archive1_path)
        except Exception as e:
            logger.error(f"Failed to extract {archive1_path}: {e}")
            errors.append(f"Extraction failed for {archive1_path.name}: {str(e)}")
            files1 = {}

        try:
            files2 = self._extract_archive(archive2_path)
        except Exception as e:
            logger.error(f"Failed to extract {archive2_path}: {e}")
            errors.append(f"Extraction failed for {archive2_path.name}: {str(e)}")
            files2 = {}

        # Analyze file sets
        common_files = sorted(set(files1.keys()) & set(files2.keys()))
        unique_to_archive1 = sorted(set(files1.keys()) - set(files2.keys()))
        unique_to_archive2 = sorted(set(files2.keys()) - set(files1.keys()))

        logger.info(f"File analysis: {len(common_files)} common, "
                    f"{len(unique_to_archive1)} unique to first, "
                    f"{len(unique_to_archive2)} unique to second")

        # Compare common files
        file_comparisons = self._compare_files(files1, files2, common_files, errors)

        # Calculate global similarity
        global_similarity = self._calculate_global_similarity(
            file_comparisons,
            len(unique_to_archive1),
            len(unique_to_archive2)
        )

        total_time = time.time() - start_time

        return ArchiveComparison(
            archive1_path=str(archive1_path),
            archive2_path=str(archive2_path),
            global_similarity=global_similarity,
            file_comparisons=file_comparisons,
            common_files=common_files,
            unique_to_archive1=unique_to_archive1,
            unique_to_archive2=unique_to_archive2,
            total_comparison_time=total_time,
            errors=errors
        )

    def _extract_archive(self, archive_path: Path) -> Dict[str, FileContent]:
        """Extract files from an archive."""
        extractor = self.extractor_factory.get_extractor(archive_path)
        if not extractor:
            raise ValueError(f"Unsupported archive format: {archive_path.suffix}")

        return extractor.extract(archive_path)

    def _compare_files(self,
                       files1: Dict[str, FileContent],
                       files2: Dict[str, FileContent],
                       common_files: List[str],
                       errors: List[str]) -> List[FileComparison]:
        """Compare common files between two archives."""
        comparisons = []

        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all comparison tasks
            futures = {}
            for file_path in common_files:
                future = executor.submit(
                    self._compare_single_file,
                    file_path,
                    files1[file_path],
                    files2[file_path]
                )
                futures[future] = file_path

            # Collect results with timeout
            for future in futures:
                file_path = futures[future]
                try:
                    comparison = future.result(timeout=self.timeout_per_file)
                    comparisons.append(comparison)

                    if comparison.error:
                        errors.append(f"Comparison error for {file_path}: {comparison.error}")
                    else:
                        logger.info(f"Compared {file_path}: "
                                    f"similarity={comparison.similarity.overall_score:.3f}")

                except FutureTimeoutError:
                    error_msg = f"Timeout after {self.timeout_per_file}s"
                    logger.error(f"Timeout comparing {file_path}")
                    errors.append(f"Timeout comparing {file_path} after {self.timeout_per_file}s")

                    comparisons.append(FileComparison(
                        file1_path=file_path,
                        file2_path=file_path,
                        similarity=SimilarityScore(overall_score=0.0),
                        comparison_time=self.timeout_per_file,
                        error=error_msg
                    ))

                except Exception as e:
                    logger.error(f"Unexpected error comparing {file_path}: {e}")
                    errors.append(f"Unexpected error comparing {file_path}: {str(e)}")

                    comparisons.append(FileComparison(
                        file1_path=file_path,
                        file2_path=file_path,
                        similarity=SimilarityScore(overall_score=0.0),
                        comparison_time=0.0,
                        error=str(e)
                    ))

        return comparisons

    def _compare_single_file(self,
                             file_path: str,
                             file1: FileContent,
                             file2: FileContent) -> FileComparison:
        """Compare a single file from both archives."""
        start_time = time.time()

        try:
            # Quick check: if hashes match, files are identical
            if file1.hash and file2.hash and file1.hash == file2.hash:
                return FileComparison(
                    file1_path=file_path,
                    file2_path=file_path,
                    similarity=SimilarityScore(
                        overall_score=1.0,
                        text_similarity=1.0,
                        method_used="hash_match"
                    ),
                    comparison_time=time.time() - start_time
                )

            # Extract text content for comparison
            text1 = self._extract_text_content(file1)
            text2 = self._extract_text_content(file2)

            # Calculate similarity
            similarity = self.similarity_engine.calculate_similarity(
                text1, text2, file_path
            )

            return FileComparison(
                file1_path=file_path,
                file2_path=file_path,
                similarity=similarity,
                comparison_time=time.time() - start_time
            )

        except Exception as e:
            logger.error(f"Error comparing {file_path}: {e}")
            return FileComparison(
                file1_path=file_path,
                file2_path=file_path,
                similarity=SimilarityScore(overall_score=0.0),
                comparison_time=time.time() - start_time,
                error=str(e)
            )

    def _extract_text_content(self, file_content: FileContent) -> str:
        """Extract analyzable text from file content."""
        if file_content.error:
            return ""

        # Use content analyzer factory to extract text
        return self.content_factory.extract_text(file_content)

    @staticmethod
    def _calculate_global_similarity(file_comparisons: List[FileComparison],
                                     unique_count1: int,
                                     unique_count2: int) -> SimilarityScore:
        """Calculate overall similarity score for the archives."""
        if not file_comparisons and unique_count1 == 0 and unique_count2 == 0:
            # Empty archives are considered identical
            return SimilarityScore(overall_score=1.0, method_used="empty_archives")

        # Calculate weighted average of file similarities
        total_files = len(file_comparisons) + unique_count1 + unique_count2

        if total_files == 0:
            return SimilarityScore(overall_score=0.0, method_used="no_files")

        # Sum similarities for common files
        similarity_sum = sum(
            comp.similarity.overall_score
            for comp in file_comparisons
            if not comp.error
        )

        # Count files with errors
        error_count = sum(1 for comp in file_comparisons if comp.error)

        # Unique files contribute 0 to similarity
        # Files with errors are treated as similarity 0
        overall_score = similarity_sum / total_files

        # Calculate average similarities for detailed metrics
        valid_comparisons = [c for c in file_comparisons if not c.error]

        avg_text_similarity = (
                sum(c.similarity.text_similarity for c in valid_comparisons) /
                len(valid_comparisons)
        ) if valid_comparisons else 0.0

        avg_structural_similarity = (
                sum(c.similarity.structural_similarity for c in valid_comparisons) /
                len(valid_comparisons)
        ) if valid_comparisons else 0.0

        details = {
            "common_files": len(file_comparisons),
            "unique_to_archive1": unique_count1,
            "unique_to_archive2": unique_count2,
            "files_with_errors": error_count,
            "valid_comparisons": len(valid_comparisons)
        }

        return SimilarityScore(
            overall_score=overall_score,
            text_similarity=avg_text_similarity,
            structural_similarity=avg_structural_similarity,
            method_used="weighted_average",
            details=details
        )