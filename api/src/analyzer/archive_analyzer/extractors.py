"""Concrete implementations of archive extractors for ZIP, RAR, and 7Z formats."""

import io
import logging
import time
import zipfile
from pathlib import Path
from typing import Dict, Optional, List

try:
    import rarfile
except ImportError:
    rarfile = None

try:
    import py7zr
except ImportError:
    py7zr = None

from .core import ArchiveExtractor, FileContent, FileType

logger = logging.getLogger(__name__)


class ZipExtractor(ArchiveExtractor):
    """Extractor for ZIP archives."""

    def can_handle(self, file_path: Path) -> bool:
        """Check if the file is a valid ZIP archive."""
        try:
            with zipfile.ZipFile(file_path, 'r') as z:
                z.testzip()
            return True
        except (zipfile.BadZipFile, OSError):
            return False

    def extract(self, file_path: Path) -> Dict[str, FileContent]:
        """Extract all files from a ZIP archive."""
        logger.info(f"Extracting ZIP archive: {file_path}")
        files = {}

        try:
            with zipfile.ZipFile(file_path, 'r') as z:
                for info in z.infolist():
                    if info.is_dir():
                        continue

                    start_time = time.time()
                    file_path_in_zip = info.filename

                    try:
                        raw_content = z.read(file_path_in_zip)
                        file_hash = self.calculate_hash(raw_content)

                        # Try to decode as text
                        try:
                            content = raw_content.decode('utf-8')
                            file_type = self._guess_file_type(file_path_in_zip, content)
                        except UnicodeDecodeError:
                            content = ""
                            file_type = FileType.BINARY

                        extraction_time = time.time() - start_time

                        files[file_path_in_zip] = FileContent(
                            path=file_path_in_zip,
                            content=content,
                            raw_content=raw_content,
                            file_type=file_type,
                            size=info.file_size,
                            hash=file_hash,
                            extraction_time=extraction_time
                        )

                        logger.debug(f"Extracted: {file_path_in_zip} ({info.file_size} bytes)")

                    except Exception as e:
                        logger.error(f"Error extracting {file_path_in_zip}: {e}")
                        files[file_path_in_zip] = FileContent(
                            path=file_path_in_zip,
                            content="",
                            raw_content=b"",
                            file_type=FileType.UNKNOWN,
                            size=info.file_size,
                            hash="",
                            extraction_time=time.time() - start_time,
                            error=str(e)
                        )

        except Exception as e:
            logger.error(f"Failed to open ZIP archive {file_path}: {e}")
            raise

        logger.info(f"Extracted {len(files)} files from ZIP archive")
        return files

    def _guess_file_type(self, file_path: str, content: str) -> FileType:
        """Guess the file type based on extension and content."""
        ext = Path(file_path).suffix.lower()

        # Code files
        if ext in {'.py', '.js', '.java', '.cpp', '.c', '.h', '.cs', '.rb', '.go', '.rs',
                   '.php', '.swift', '.kt', '.ts', '.tsx', '.jsx', '.vue', '.sql'}:
            return FileType.CODE

        # Document files
        elif ext in {'.md', '.txt', '.rst', '.tex', '.docx', '.pdf', '.odt'}:
            return FileType.DOCUMENT

        # Data files
        elif ext in {'.json', '.xml', '.csv', '.yaml', '.yml', '.toml', '.ini', '.cfg'}:
            return FileType.DATA

        # Text-based by content inspection
        elif content and all(c.isprintable() or c.isspace() for c in content[:1000]):
            return FileType.TEXT

        return FileType.UNKNOWN


class RarExtractor(ArchiveExtractor):
    """Extractor for RAR archives."""

    def __init__(self):
        """Initialize the RAR extractor."""
        if rarfile is None:
            raise ImportError("rarfile package is required for RAR support. Install with: pip install rarfile")

    def can_handle(self, file_path: Path) -> bool:
        """Check if the file is a valid RAR archive."""
        try:
            with rarfile.RarFile(file_path, 'r') as r:
                r.testrar()
            return True
        except (rarfile.Error, OSError):
            return False

    def extract(self, file_path: Path) -> Dict[str, FileContent]:
        """Extract all files from a RAR archive."""
        logger.info(f"Extracting RAR archive: {file_path}")
        files = {}

        try:
            with rarfile.RarFile(file_path, 'r') as r:
                for info in r.infolist():
                    if info.is_dir():
                        continue

                    start_time = time.time()
                    file_path_in_rar = info.filename

                    try:
                        raw_content = r.read(file_path_in_rar)
                        file_hash = self.calculate_hash(raw_content)

                        # Try to decode as text
                        try:
                            content = raw_content.decode('utf-8')
                            file_type = ZipExtractor()._guess_file_type(file_path_in_rar, content)
                        except UnicodeDecodeError:
                            content = ""
                            file_type = FileType.BINARY

                        extraction_time = time.time() - start_time

                        files[file_path_in_rar] = FileContent(
                            path=file_path_in_rar,
                            content=content,
                            raw_content=raw_content,
                            file_type=file_type,
                            size=info.file_size,
                            hash=file_hash,
                            extraction_time=extraction_time
                        )

                        logger.debug(f"Extracted: {file_path_in_rar} ({info.file_size} bytes)")

                    except Exception as e:
                        logger.error(f"Error extracting {file_path_in_rar}: {e}")
                        files[file_path_in_rar] = FileContent(
                            path=file_path_in_rar,
                            content="",
                            raw_content=b"",
                            file_type=FileType.UNKNOWN,
                            size=info.file_size,
                            hash="",
                            extraction_time=time.time() - start_time,
                            error=str(e)
                        )

        except Exception as e:
            logger.error(f"Failed to open RAR archive {file_path}: {e}")
            raise

        logger.info(f"Extracted {len(files)} files from RAR archive")
        return files


class SevenZipExtractor(ArchiveExtractor):
    """Extractor for 7Z archives."""

    def __init__(self):
        """Initialize the 7Z extractor."""
        if py7zr is None:
            raise ImportError("py7zr package is required for 7Z support. Install with: pip install py7zr")

    def can_handle(self, file_path: Path) -> bool:
        """Check if the file is a valid 7Z archive."""
        try:
            with py7zr.SevenZipFile(file_path, 'r') as z:
                z.test()
            return True
        except (py7zr.Bad7zFile, OSError):
            return False

    def extract(self, file_path: Path) -> Dict[str, FileContent]:
        """Extract all files from a 7Z archive."""
        logger.info(f"Extracting 7Z archive: {file_path}")
        files = {}

        try:
            with py7zr.SevenZipFile(file_path, 'r') as z:
                # Extract all files to memory
                contents = z.readall()

                for file_path_in_7z, bio in contents.items():
                    if isinstance(bio, io.BytesIO):
                        start_time = time.time()

                        try:
                            raw_content = bio.read()
                            file_hash = self.calculate_hash(raw_content)

                            # Try to decode as text
                            try:
                                content = raw_content.decode('utf-8')
                                file_type = ZipExtractor()._guess_file_type(file_path_in_7z, content)
                            except UnicodeDecodeError:
                                content = ""
                                file_type = FileType.BINARY

                            extraction_time = time.time() - start_time

                            files[file_path_in_7z] = FileContent(
                                path=file_path_in_7z,
                                content=content,
                                raw_content=raw_content,
                                file_type=file_type,
                                size=len(raw_content),
                                hash=file_hash,
                                extraction_time=extraction_time
                            )

                            logger.debug(f"Extracted: {file_path_in_7z} ({len(raw_content)} bytes)")

                        except Exception as e:
                            logger.error(f"Error processing {file_path_in_7z}: {e}")
                            files[file_path_in_7z] = FileContent(
                                path=file_path_in_7z,
                                content="",
                                raw_content=b"",
                                file_type=FileType.UNKNOWN,
                                size=0,
                                hash="",
                                extraction_time=time.time() - start_time,
                                error=str(e)
                            )

        except Exception as e:
            logger.error(f"Failed to open 7Z archive {file_path}: {e}")
            raise

        logger.info(f"Extracted {len(files)} files from 7Z archive")
        return files


class ExtractorFactory:
    """Factory for creating appropriate archive extractors."""

    def __init__(self):
        """Initialize the factory with available extractors."""
        self._extractors: List[ArchiveExtractor] = []

        # Register available extractors
        self._extractors.append(ZipExtractor())

        try:
            self._extractors.append(RarExtractor())
        except ImportError:
            logger.warning("RAR support not available. Install rarfile package.")

        try:
            self._extractors.append(SevenZipExtractor())
        except ImportError:
            logger.warning("7Z support not available. Install py7zr package.")

    def get_extractor(self, file_path: Path) -> Optional[ArchiveExtractor]:
        """Get the appropriate extractor for the given file."""
        for extractor in self._extractors:
            if extractor.can_handle(file_path):
                return extractor
        return None

    def supported_formats(self) -> List[str]:
        """Get a list of supported archive formats."""
        formats = ["zip"]
        if any(isinstance(e, RarExtractor) for e in self._extractors):
            formats.append("rar")
        if any(isinstance(e, SevenZipExtractor) for e in self._extractors):
            formats.append("7z")
        return formats