"""Core interfaces and abstract classes for the archive analyzer system."""

import hashlib
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional, Protocol


class FileType(Enum):
    """Enumeration of supported file types for analysis."""
    TEXT = "text"
    CODE = "code"
    DOCUMENT = "document"
    DATA = "data"
    BINARY = "binary"
    UNKNOWN = "unknown"


@dataclass
class FileContent:
    """Represents the content of a file extracted from an archive."""
    path: str
    content: str
    raw_content: bytes
    file_type: FileType
    size: int
    hash: str
    extraction_time: float
    error: Optional[str] = None

    @property
    def is_valid(self) -> bool:
        """Check if the file content was successfully extracted."""
        return self.error is None and self.content is not None


@dataclass
class SimilarityScore:
    """Represents similarity metrics between two files or archives."""
    overall_score: float
    text_similarity: float = 0.0
    structural_similarity: float = 0.0
    fuzzy_similarity: float = 0.0
    method_used: str = "combined"
    details: Dict[str, float] = field(default_factory=dict)

    def __post_init__(self):
        """Ensure score is between 0 and 1."""
        self.overall_score = max(0.0, min(1.0, self.overall_score))


@dataclass
class FileComparison:
    """Results of comparing two files."""
    file1_path: str
    file2_path: str
    similarity: SimilarityScore
    comparison_time: float
    error: Optional[str] = None


@dataclass
class ArchiveComparison:
    """Complete comparison results between two archives."""
    archive1_path: str
    archive2_path: str
    global_similarity: SimilarityScore
    file_comparisons: List[FileComparison]
    common_files: List[str]
    unique_to_archive1: List[str]
    unique_to_archive2: List[str]
    total_comparison_time: float
    timestamp: datetime = field(default_factory=datetime.now)
    errors: List[str] = field(default_factory=list)


class ArchiveExtractor(ABC):
    """Abstract base class for archive extraction."""

    @abstractmethod
    def can_handle(self, file_path: Path) -> bool:
        """Check if this extractor can handle the given file."""
        pass

    @abstractmethod
    def extract(self, file_path: Path) -> Dict[str, FileContent]:
        """
        Extract all files from the archive.

        Args:
            file_path: Path to the archive file

        Returns:
            Dictionary mapping file paths to FileContent objects
        """
        pass

    def calculate_hash(self, content: bytes) -> str:
        """Calculate SHA256 hash of file content."""
        return hashlib.sha256(content).hexdigest()


class ContentAnalyzer(Protocol):
    """Protocol for content analysis strategies."""

    def can_analyze(self, file_content: FileContent) -> bool:
        """Check if this analyzer can process the given file."""
        ...

    def extract_text(self, file_content: FileContent) -> str:
        """Extract analyzable text from the file content."""
        ...


class SimilarityCalculator(ABC):
    """Abstract base class for similarity calculation strategies."""

    @abstractmethod
    def calculate(self, content1: str, content2: str) -> float:
        """
        Calculate similarity between two text contents.

        Returns:
            Similarity score between 0 and 1
        """
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        """Name of the similarity calculation method."""
        pass


class ReportGenerator(ABC):
    """Abstract base class for report generation."""

    @abstractmethod
    def generate(self, comparison: ArchiveComparison, output_path: Path) -> Path:
        """
        Generate a report from comparison results.

        Args:
            comparison: The comparison results
            output_path: Path where the report should be saved

        Returns:
            Path to the generated report
        """
        pass