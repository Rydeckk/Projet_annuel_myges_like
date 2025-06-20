"""Configuration management for the archive analyzer."""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional

import yaml

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass


@dataclass
class AnalyzerConfig:
    """Configuration for the archive analyzer."""

    # Performance settings
    timeout_per_file: float = 30.0
    max_workers: int = 4
    max_file_size: int = 100 * 1024 * 1024  # 100MB

    # Similarity thresholds
    critical_similarity_threshold: float = 0.9
    high_similarity_threshold: float = 0.7
    medium_similarity_threshold: float = 0.5

    # Similarity weights
    similarity_weights: Dict[str, float] = None

    # File type settings
    skip_file_types: List[str] = None
    text_file_extensions: List[str] = None

    # Report settings
    default_report_format: str = "json"
    include_details_in_report: bool = True
    report_directory: Path = Path("reports")

    # API settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: List[str] = None

    # Redis settings
    redis_url: Optional[str] = None
    cache_ttl: int = 3600  # 1 hour

    # Logging
    log_level: str = "INFO"
    log_format: str = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"

    def __post_init__(self):
        """Initialize default values."""
        if self.similarity_weights is None:
            self.similarity_weights = {
                "difflib": 0.4,
                "fuzzy": 0.3,
                "token_overlap": 0.3
            }

        if self.skip_file_types is None:
            self.skip_file_types = [
                ".exe", ".dll", ".so", ".dylib",
                ".jpg", ".jpeg", ".png", ".gif", ".bmp",
                ".mp3", ".mp4", ".avi", ".mov",
                ".zip", ".rar", ".7z", ".tar", ".gz"
            ]

        if self.text_file_extensions is None:
            self.text_file_extensions = [
                ".txt", ".md", ".rst", ".tex",
                ".py", ".js", ".java", ".cpp", ".c", ".h",
                ".cs", ".rb", ".go", ".rs", ".php", ".swift",
                ".kt", ".ts", ".tsx", ".jsx", ".vue",
                ".html", ".css", ".scss", ".less",
                ".json", ".xml", ".yaml", ".yml", ".toml",
                ".sql", ".sh", ".bash", ".zsh",
                ".r", ".m", ".scala", ".clj"
            ]

        if self.cors_origins is None:
            self.cors_origins = ["*"]

        # Override with environment variables
        self._load_from_env()

    def _load_from_env(self):
        """Load configuration from environment variables."""
        # Performance
        if val := os.getenv("ANALYZER_TIMEOUT_PER_FILE"):
            self.timeout_per_file = float(val)
        if val := os.getenv("ANALYZER_MAX_WORKERS"):
            self.max_workers = int(val)
        if val := os.getenv("ANALYZER_MAX_FILE_SIZE"):
            self.max_file_size = int(val)

        # Thresholds
        if val := os.getenv("ANALYZER_CRITICAL_THRESHOLD"):
            self.critical_similarity_threshold = float(val)
        if val := os.getenv("ANALYZER_HIGH_THRESHOLD"):
            self.high_similarity_threshold = float(val)
        if val := os.getenv("ANALYZER_MEDIUM_THRESHOLD"):
            self.medium_similarity_threshold = float(val)

        # API
        if val := os.getenv("ANALYZER_API_HOST"):
            self.api_host = val
        if val := os.getenv("ANALYZER_API_PORT"):
            self.api_port = int(val)

        # Redis
        if val := os.getenv("REDIS_URL"):
            self.redis_url = val

        # Logging
        if val := os.getenv("ANALYZER_LOG_LEVEL"):
            self.log_level = val

    @classmethod
    def from_yaml(cls, path: Path) -> "AnalyzerConfig":
        """Load configuration from YAML file."""
        with open(path, "r") as f:
            data = yaml.safe_load(f)
        return cls(**data)

    def to_yaml(self, path: Path):
        """Save configuration to the YAML file."""
        data = {
            "timeout_per_file": self.timeout_per_file,
            "max_workers": self.max_workers,
            "max_file_size": self.max_file_size,
            "critical_similarity_threshold": self.critical_similarity_threshold,
            "high_similarity_threshold": self.high_similarity_threshold,
            "medium_similarity_threshold": self.medium_similarity_threshold,
            "similarity_weights": self.similarity_weights,
            "skip_file_types": self.skip_file_types,
            "text_file_extensions": self.text_file_extensions,
            "default_report_format": self.default_report_format,
            "include_details_in_report": self.include_details_in_report,
            "report_directory": str(self.report_directory),
            "api_host": self.api_host,
            "api_port": self.api_port,
            "cors_origins": self.cors_origins,
            "redis_url": self.redis_url,
            "cache_ttl": self.cache_ttl,
            "log_level": self.log_level
        }

        with open(path, "w") as f:
            yaml.dump(data, f, default_flow_style=False)


# Global configuration instance
config = AnalyzerConfig()