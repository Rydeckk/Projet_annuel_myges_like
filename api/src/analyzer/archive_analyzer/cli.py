"""Command-line interface for the archive analyzer."""

import argparse
import logging
import sys
from pathlib import Path

from .comparator import ArchiveComparator
from .reports import ReportGeneratorFactory


def setup_logging(verbose: bool = False):
    """Configure logging for the CLI."""
    level = logging.DEBUG if verbose else logging.INFO
    format_str = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"

    logging.basicConfig(
        level=level,
        format=format_str,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ]
    )


def main():
    """Main entry point for the CLI."""
    parser = argparse.ArgumentParser(
        description="Compare archives for similarity and potential plagiarism detection",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Compare two ZIP files and generate JSON report
  python -m archive_analyzer archive1.zip archive2.zip -o report.json

  # Compare with CSV output and custom timeout
  python -m archive_analyzer archive1.rar archive2.rar -o report.csv -f csv -t 60

  # Verbose mode with detailed logging
  python -m archive_analyzer archive1.7z archive2.7z -o report.json -v

  # Use fewer workers for resource-constrained environments
  python -m archive_analyzer archive1.zip archive2.zip -o report.json -w 2
        """
    )

    # Required arguments
    parser.add_argument(
        "archive1",
        type=Path,
        help="Path to the first archive file"
    )
    parser.add_argument(
        "archive2",
        type=Path,
        help="Path to the second archive file"
    )

    # Output options
    parser.add_argument(
        "-o", "--output",
        type=Path,
        required=True,
        help="Output path for the report file"
    )
    parser.add_argument(
        "-f", "--format",
        choices=["json", "csv"],
        default="json",
        help="Report format (default: json)"
    )

    # Analysis options
    parser.add_argument(
        "-t", "--timeout",
        type=float,
        default=30.0,
        help="Timeout in seconds for analyzing each file (default: 30)"
    )
    parser.add_argument(
        "-w", "--workers",
        type=int,
        default=4,
        help="Number of parallel workers (default: 4)"
    )

    # Report options
    parser.add_argument(
        "--no-details",
        action="store_true",
        help="Exclude detailed file comparisons from report"
    )
    parser.add_argument(
        "--compact",
        action="store_true",
        help="Generate compact JSON without formatting"
    )

    # Other options
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose logging"
    )

    args = parser.parse_args()

    # Setup logging
    setup_logging(args.verbose)
    logger = logging.getLogger(__name__)

    # Validate inputs
    if not args.archive1.exists():
        logger.error(f"Archive not found: {args.archive1}")
        sys.exit(1)

    if not args.archive2.exists():
        logger.error(f"Archive not found: {args.archive2}")
        sys.exit(1)

    # Create output directory if needed
    args.output.parent.mkdir(parents=True, exist_ok=True)

    try:
        # Initialize comparator
        comparator = ArchiveComparator(
            timeout_per_file=args.timeout,
            max_workers=args.workers
        )

        # Perform comparison
        logger.info("Starting archive comparison...")
        comparison = comparator.compare_archives(args.archive1, args.archive2)

        # Generate report
        generator_kwargs = {}
        if args.format == "json":
            generator_kwargs["pretty_print"] = not args.compact
            generator_kwargs["include_details"] = not args.no_details

        generator = ReportGeneratorFactory.create_generator(
            args.format,
            **generator_kwargs
        )

        report_path = generator.generate(comparison, args.output)

        # Print summary to console
        print(f"\n{'=' * 60}")
        print("COMPARISON SUMMARY")
        print(f"{'=' * 60}")
        print(f"Archive 1: {args.archive1.name}")
        print(f"Archive 2: {args.archive2.name}")
        print(f"Global Similarity: {comparison.global_similarity.overall_score:.2%}")
        print(f"Common Files: {len(comparison.common_files)}")
        print(f"Unique to Archive 1: {len(comparison.unique_to_archive1)}")
        print(f"Unique to Archive 2: {len(comparison.unique_to_archive2)}")
        print(f"Analysis Time: {comparison.total_comparison_time:.2f} seconds")

        if comparison.errors:
            print(f"\nWarning: {len(comparison.errors)} errors occurred during analysis")

        print(f"\nReport saved to: {report_path}")
        print(f"{'=' * 60}\n")

        # Exit with appropriate code
        if comparison.global_similarity.overall_score > 0.9:
            sys.exit(2)  # High similarity detected
        else:
            sys.exit(0)  # Normal exit

    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)
