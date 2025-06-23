"""
Simple bridge script for Node.js integration.
This script can be called directly from Node.js with command line arguments.
"""

import argparse
import json
import sys
from pathlib import Path

from archive_analyzer import ArchiveComparator, ReportGeneratorFactory
from archive_analyzer.config import AnalyzerConfig


def main():
    """Main entry point for Node.js integration."""
    parser = argparse.ArgumentParser(description="Archive Analyzer Node.js Bridge")

    parser.add_argument("command", choices=["compare", "batch", "config"],
                        help="Command to execute")
    parser.add_argument("--archive1", help="First archive path")
    parser.add_argument("--archive2", help="Second archive path")
    parser.add_argument("--directory", help="Directory for batch analysis")
    parser.add_argument("--output", help="Output path for report")
    parser.add_argument("--format", default="json", choices=["json", "csv"],
                        help="Report format")
    parser.add_argument("--timeout", type=float, default=30.0,
                        help="Timeout per file in seconds")
    parser.add_argument("--workers", type=int, default=4,
                        help="Number of parallel workers")
    parser.add_argument("--threshold", type=float, default=0.8,
                        help="Similarity threshold for flagging")
    parser.add_argument("--config", help="Path to configuration file")

    args = parser.parse_args()

    try:
        # Load configuration
        if args.config:
            config = AnalyzerConfig.from_yaml(Path(args.config))
        else:
            config = AnalyzerConfig(
                timeout_per_file=args.timeout,
                max_workers=args.workers
            )

        if args.command == "compare":
            # Single comparison
            if not args.archive1 or not args.archive2:
                raise ValueError("Both --archive1 and --archive2 are required for compare")

            comparator = ArchiveComparator(
                timeout_per_file=config.timeout_per_file,
                max_workers=config.max_workers
            )

            comparison = comparator.compare_archives(
                Path(args.archive1),
                Path(args.archive2)
            )

            # Generate report if output specified
            report_path = None
            if args.output:
                report_path = Path(args.output)
                generator = ReportGeneratorFactory.create_generator(args.format)
                generator.generate(comparison, report_path)

            # Output JSON result
            result = {
                "success": True,
                "global_similarity": comparison.global_similarity.overall_score,
                "summary": {
                    "common_files": len(comparison.common_files),
                    "unique_to_archive1": len(comparison.unique_to_archive1),
                    "unique_to_archive2": len(comparison.unique_to_archive2),
                    "errors": len(comparison.errors)
                },
                "report_path": str(report_path) if report_path else None,
                "is_suspicious": comparison.global_similarity.overall_score >= args.threshold
            }

            print(json.dumps(result))

        elif args.command == "config":
            # Generate example configuration
            if args.output:
                config.to_yaml(Path(args.output))
                result = {
                    "success": True,
                    "message": f"Configuration saved to {args.output}"
                }
            else:
                result = {
                    "success": True,
                    "config": {
                        "timeout_per_file": config.timeout_per_file,
                        "max_workers": config.max_workers,
                        "thresholds": {
                            "critical": config.critical_similarity_threshold,
                            "high": config.high_similarity_threshold,
                            "medium": config.medium_similarity_threshold
                        }
                    }
                }

            print(json.dumps(result))

    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__
        }
        print(json.dumps(error_result))
        sys.exit(1)


if __name__ == "__main__":
    main()

