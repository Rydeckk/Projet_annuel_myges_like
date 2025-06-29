"""Archive Analyzer - A comprehensive solution for archive comparison and plagiarism detection."""

from .comparator import ArchiveComparator
from .core import ArchiveComparison, FileComparison, SimilarityScore
from .reports import ReportGeneratorFactory

__version__ = "1.0.0"
__all__ = [
    "ArchiveComparator",
    "ArchiveComparison",
    "FileComparison",
    "SimilarityScore",
    "ReportGeneratorFactory"
]