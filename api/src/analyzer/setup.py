"""Setup script for the Archive Analyzer package."""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="archive-analyzer",
    version="1.0.0",
    author="Antsch",
    author_email="antoine@schwager.fr",
    description="A comprehensive archive comparison tool for plagiarism detection",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Rydeckk/Projet_annuel_myges_like",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 1 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[
        # Core dependencies
        "fuzzywuzzy[speedup]>=0.18.0",
        "deepdiff>=6.0.0",

        # Archive format support
        "rarfile>=4.0",
        "py7zr>=0.20.0",

        # Document analysis
        "PyPDF2>=3.0.0",
        "python-docx>=0.8.11",
        "chardet>=5.0.0",

        # Optional but recommended
        "markdown>=3.4.0",
        "beautifulsoup4>=4.11.0",
        "nltk>=3.8.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "black>=22.0.0",
            "flake8>=5.0.0",
            "mypy>=0.990",
        ],
    },
    entry_points={
        "console_scripts": [
            "archive-analyzer=archive_analyzer.cli:main",
        ],
    },
)