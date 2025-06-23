"""Report generation for archive comparison results."""

import csv
import json
import logging
from pathlib import Path
from typing import Any, Dict, List

from .core import ArchiveComparison, ReportGenerator

logger = logging.getLogger(__name__)


class JSONReportGenerator(ReportGenerator):
    """Generate JSON reports from comparison results."""

    def __init__(self, pretty_print: bool = True, include_details: bool = True):
        """
        Initialize JSON report generator.

        Args:
            pretty_print: Whether to format JSON with indentation
            include_details: Whether to include detailed similarity metrics
        """
        self.pretty_print = pretty_print
        self.include_details = include_details

    def generate(self, comparison: ArchiveComparison, output_path: Path) -> Path:
        """Generate a JSON report from comparison results."""
        logger.info(f"Generating JSON report: {output_path}")

        report_data = self._create_report_data(comparison)

        # Write JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            if self.pretty_print:
                json.dump(report_data, f, indent=2, ensure_ascii=False)
            else:
                json.dump(report_data, f, ensure_ascii=False)

        logger.info(f"JSON report generated: {output_path}")
        return output_path

    def _create_report_data(self, comparison: ArchiveComparison) -> Dict[str, Any]:
        """Create the report data structure."""
        report = {
            "metadata": {
                "timestamp": comparison.timestamp.isoformat(),
                "archive1": comparison.archive1_path,
                "archive2": comparison.archive2_path,
                "total_comparison_time": round(comparison.total_comparison_time, 2),
                "report_version": "1.0"
            },
            "summary": {
                "global_similarity": round(comparison.global_similarity.overall_score, 4),
                "common_files_count": len(comparison.common_files),
                "unique_to_archive1_count": len(comparison.unique_to_archive1),
                "unique_to_archive2_count": len(comparison.unique_to_archive2),
                "total_files_compared": len(comparison.file_comparisons),
                "errors_count": len(comparison.errors)
            },
            "file_analysis": {
                "common_files": comparison.common_files,
                "unique_to_archive1": comparison.unique_to_archive1,
                "unique_to_archive2": comparison.unique_to_archive2
            }
        }

        # Add detailed file comparisons
        if self.include_details:
            report["detailed_comparisons"] = []
            for file_comp in comparison.file_comparisons:
                comp_data = {
                    "file_path": file_comp.file1_path,
                    "similarity_score": round(file_comp.similarity.overall_score, 4),
                    "comparison_time": round(file_comp.comparison_time, 3),
                    "method": file_comp.similarity.method_used
                }

                if file_comp.error:
                    comp_data["error"] = file_comp.error

                if file_comp.similarity.details:
                    comp_data["similarity_details"] = {
                        k: round(v, 4) if isinstance(v, float) else v
                        for k, v in file_comp.similarity.details.items()
                    }

                report["detailed_comparisons"].append(comp_data)

        # Add similarity distribution
        report["similarity_distribution"] = self._calculate_distribution(comparison)

        # Add errors if any
        if comparison.errors:
            report["errors"] = comparison.errors

        # Add recommendations
        report["recommendations"] = self._generate_recommendations(comparison)

        return report

    def _calculate_distribution(self, comparison: ArchiveComparison) -> Dict[str, Any]:
        """Calculate similarity score distribution."""
        valid_scores = [
            c.similarity.overall_score
            for c in comparison.file_comparisons
            if not c.error
        ]

        if not valid_scores:
            return {
                "mean": 0.0,
                "min": 0.0,
                "max": 0.0,
                "ranges": {}
            }

        # Calculate statistics
        mean_score = sum(valid_scores) / len(valid_scores)

        # Count scores in ranges
        ranges = {
            "identical (1.0)": sum(1 for s in valid_scores if s == 1.0),
            "very_high (0.9-0.99)": sum(1 for s in valid_scores if 0.9 <= s < 1.0),
            "high (0.7-0.89)": sum(1 for s in valid_scores if 0.7 <= s < 0.9),
            "medium (0.5-0.69)": sum(1 for s in valid_scores if 0.5 <= s < 0.7),
            "low (0.3-0.49)": sum(1 for s in valid_scores if 0.3 <= s < 0.5),
            "very_low (0.0-0.29)": sum(1 for s in valid_scores if s < 0.3)
        }

        return {
            "mean": round(mean_score, 4),
            "min": round(min(valid_scores), 4),
            "max": round(max(valid_scores), 4),
            "ranges": ranges
        }

    def _generate_recommendations(self, comparison: ArchiveComparison) -> List[str]:
        """Generate recommendations based on analysis results."""
        recommendations = []

        similarity = comparison.global_similarity.overall_score

        if similarity > 0.9:
            recommendations.append(
                "CRITICAL: Very high similarity detected (>90%). "
                "This indicates potential plagiarism and requires immediate review."
            )
        elif similarity > 0.7:
            recommendations.append(
                "WARNING: High similarity detected (70-90%). "
                "Manual review recommended to verify if content sharing is justified."
            )
        elif similarity > 0.5:
            recommendations.append(
                "NOTICE: Moderate similarity detected (50-70%). "
                "Some common elements found, which may be acceptable depending on context."
            )
        else:
            recommendations.append(
                "Low similarity detected (<50%). "
                "Archives appear to be substantially different."
            )

        # Check for identical files
        identical_files = [
            c.file1_path for c in comparison.file_comparisons
            if c.similarity.overall_score == 1.0 and not c.error
        ]

        if identical_files:
            recommendations.append(
                f"Found {len(identical_files)} identical files. "
                f"Review these files: {', '.join(identical_files[:5])}"
                + (" and others..." if len(identical_files) > 5 else "")
            )

        # Check for unique files
        if len(comparison.unique_to_archive1) > len(comparison.common_files):
            recommendations.append(
                "Archive 1 contains significantly more unique content. "
                "This may indicate different project scope or additional features."
            )

        if len(comparison.unique_to_archive2) > len(comparison.common_files):
            recommendations.append(
                "Archive 2 contains significantly more unique content. "
                "This may indicate different project scope or additional features."
            )

        # Check for errors
        if comparison.errors:
            recommendations.append(
                f"Encountered {len(comparison.errors)} errors during analysis. "
                "Review error log for files that couldn't be properly analyzed."
            )

        return recommendations


class CSVReportGenerator(ReportGenerator):
    """Generate CSV reports from comparison results."""

    def generate(self, comparison: ArchiveComparison, output_path: Path) -> Path:
        """Generate a CSV report from comparison results."""
        logger.info(f"Generating CSV report: {output_path}")

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)

            # Write metadata section
            writer.writerow(["Archive Comparison Report"])
            writer.writerow(["Generated", comparison.timestamp.isoformat()])
            writer.writerow(["Archive 1", comparison.archive1_path])
            writer.writerow(["Archive 2", comparison.archive2_path])
            writer.writerow(["Global Similarity", f"{comparison.global_similarity.overall_score:.4f}"])
            writer.writerow(["Total Comparison Time", f"{comparison.total_comparison_time:.2f} seconds"])
            writer.writerow([])  # Empty row

            # Write summary statistics
            writer.writerow(["Summary Statistics"])
            writer.writerow(["Metric", "Value"])
            writer.writerow(["Common Files", len(comparison.common_files)])
            writer.writerow(["Unique to Archive 1", len(comparison.unique_to_archive1)])
            writer.writerow(["Unique to Archive 2", len(comparison.unique_to_archive2)])
            writer.writerow(["Total Files Compared", len(comparison.file_comparisons)])
            writer.writerow(["Errors Encountered", len(comparison.errors)])
            writer.writerow([])  # Empty row

            # Write file comparison details
            writer.writerow(["File Comparison Details"])
            writer.writerow([
                "File Path",
                "Similarity Score",
                "Method Used",
                "Comparison Time (s)",
                "Status",
                "Error Message"
            ])

            for file_comp in comparison.file_comparisons:
                status = "Error" if file_comp.error else "Success"
                writer.writerow([
                    file_comp.file1_path,
                    f"{file_comp.similarity.overall_score:.4f}",
                    file_comp.similarity.method_used,
                    f"{file_comp.comparison_time:.3f}",
                    status,
                    file_comp.error or ""
                ])

            writer.writerow([])  # Empty row

            # Write unique files lists
            if comparison.unique_to_archive1:
                writer.writerow(["Files Unique to Archive 1"])
                for file_path in comparison.unique_to_archive1:
                    writer.writerow([file_path])
                writer.writerow([])

            if comparison.unique_to_archive2:
                writer.writerow(["Files Unique to Archive 2"])
                for file_path in comparison.unique_to_archive2:
                    writer.writerow([file_path])
                writer.writerow([])

            # Write errors if any
            if comparison.errors:
                writer.writerow(["Errors Encountered"])
                for error in comparison.errors:
                    writer.writerow([error])

        logger.info(f"CSV report generated: {output_path}")
        return output_path


class ReportGeneratorFactory:
    """Factory for creating report generators."""

    @staticmethod
    def create_generator(format: str, **kwargs) -> ReportGenerator:
        """
        Create a report generator for the specified format.

        Args:
            format: Report format ('json' or 'csv')
            **kwargs: Additional arguments for the generator

        Returns:
            ReportGenerator instance

        Raises:
            ValueError: If format is not supported
        """
        format = format.lower()

        if format == 'json':
            return JSONReportGenerator(**kwargs)
        elif format == 'csv':
            return CSVReportGenerator(**kwargs)
        else:
            raise ValueError(f"Unsupported report format: {format}")

    @staticmethod
    def supported_formats() -> List[str]:
        """Get list of supported report formats."""
        return ['json', 'csv']