"""Python API for integration with Node.js backend."""

import json
import logging
from pathlib import Path
from typing import Dict, Optional, Union

from .comparator import ArchiveComparator
from .reports import ReportGeneratorFactory


class ArchiveAnalyzerAPI:
    """
    High-level API for archive analysis.

    This class provides a simple interface for Node.js integration.
    """

    def __init__(self,
                 timeout_per_file: float = 30.0,
                 max_workers: int = 4,
                 log_level: str = "INFO"):
        """
        Initialize the analyzer API.

        Args:
            timeout_per_file: Maximum seconds to analyze each file
            max_workers: Maximum parallel workers
            log_level: Logging level (DEBUG, INFO, WARNING, ERROR)
        """
        self.comparator = ArchiveComparator(
            timeout_per_file=timeout_per_file,
            max_workers=max_workers
        )

        # Configure logging
        logging.basicConfig(
            level=getattr(logging, log_level.upper()),
            format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        )
        self.logger = logging.getLogger(__name__)

    def compare(self,
                archive1_path: Union[str, Path],
                archive2_path: Union[str, Path],
                report_path: Optional[Union[str, Path]] = None,
                report_format: str = "json") -> Dict:
        """
        Compare two archives and optionally generate a report.

        Args:
            archive1_path: Path to first archive
            archive2_path: Path to second archive
            report_path: Optional path to save report
            report_format: Report format ('json' or 'csv')

        Returns:
            Dictionary with comparison results

        Raises:
            FileNotFoundError: If archives don't exist
            ValueError: If a format is unsupported
        """
        # Convert to Path objects
        archive1_path = Path(archive1_path)
        archive2_path = Path(archive2_path)

        # Perform comparison
        self.logger.info(f"Comparing {archive1_path.name} vs {archive2_path.name}")
        comparison = self.comparator.compare_archives(archive1_path, archive2_path)

        # Generate a report if requested
        if report_path:
            report_path = Path(report_path)
            report_path.parent.mkdir(parents=True, exist_ok=True)

            generator = ReportGeneratorFactory.create_generator(report_format)
            generator.generate(comparison, report_path)
            self.logger.info(f"Report saved to {report_path}")

        # Return summary as dictionary
        return {
            "success": True,
            "archive1": str(archive1_path),
            "archive2": str(archive2_path),
            "global_similarity": comparison.global_similarity.overall_score,
            "summary": {
                "common_files": len(comparison.common_files),
                "unique_to_archive1": len(comparison.unique_to_archive1),
                "unique_to_archive2": len(comparison.unique_to_archive2),
                "errors": len(comparison.errors)
            },
            "report_path": str(report_path) if report_path else None,
            "analysis_time": comparison.total_comparison_time
        }

    def compare_json(self, params: Union[str, Dict]) -> str:
        """
        Compare archives using JSON input/output for easy Node.js integration.

        Args:
            params: JSON string or dictionary with parameters:
                - archive1: Path to first archive
                - archive2: Path to second archive
                - report_path: Optional report path
                - report_format: Optional format (default: json)

        Returns:
            JSON string with results
        """
        # Parse input if string
        if isinstance(params, str):
            params = json.loads(params)

        try:
            result = self.compare(
                archive1_path=params["archive1"],
                archive2_path=params["archive2"],
                report_path=params.get("report_path"),
                report_format=params.get("report_format", "json")
            )
            return json.dumps(result)

        except Exception as e:
            error_result = {
                "success": False,
                "error": str(e),
                "error_type": type(e).__name__
            }
            return json.dumps(error_result)


# For direct execution as module
if __name__ == "__main__":
    from .cli import main

    main()