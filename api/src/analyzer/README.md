# Archive Analyzer

A comprehensive Python solution for analyzing and comparing archives (ZIP, RAR, 7Z) to detect similarities and potential plagiarism in student submissions.

## Features

- **Multi-format Support**: Handles ZIP, RAR, and 7Z archives
- **Comprehensive Text Extraction**: Analyzes various file formats including:
  - Source code files (Python, JavaScript, Java, C++, etc.)
  - Documents (PDF, DOCX, Markdown, plain text)
  - Data files (JSON, XML, CSV)
  - Jupyter notebooks
- **Advanced Similarity Detection**:
  - Multiple similarity algorithms (difflib, fuzzy matching, token-based)
  - Structural comparison for JSON/XML files
  - Weighted scoring system
- **Performance Optimized**:
  - Parallel file processing
  - Configurable timeout for large files
  - Hash-based quick comparison for identical files
- **Detailed Reporting**:
  - JSON and CSV report formats
  - File-by-file similarity scores
  - Global archive similarity score
  - Error tracking and recommendations

## Installation

```bash
# Clone the repository
git clone https://github.com/Rydeckk/Projet_annuel_myges_like.git
cd api
cd src
cd analyzer

# Install dependencies
pip install -r requirements.txt

# Or install as a package
pip install -e .
```

## Usage

### Command Line Interface

```bash
# Basic usage - compare two archives and generate JSON report
archive-analyzer archive1.zip archive2.zip -o report.json

# Compare with CSV output
archive-analyzer submission1.rar submission2.rar -o report.csv -f csv

# Adjust timeout for large files (60 seconds)
archive-analyzer project1.7z project2.7z -o analysis.json -t 60

# Use fewer workers for resource-constrained environments
archive-analyzer file1.zip file2.zip -o result.json -w 2

# Verbose mode for debugging
archive-analyzer archive1.zip archive2.zip -o report.json -v
```

### Python API

```python
from archive_analyzer import ArchiveComparator, ReportGeneratorFactory
from pathlib import Path

# Initialize comparator
comparator = ArchiveComparator(
    timeout_per_file=30.0,  # 30 seconds timeout per file
    max_workers=4           # 4 parallel workers
)

# Compare archives
archive1 = Path("student1_submission.zip")
archive2 = Path("student2_submission.zip")
comparison = comparator.compare_archives(archive1, archive2)

# Generate report
generator = ReportGeneratorFactory.create_generator("json")
report_path = generator.generate(comparison, Path("comparison_report.json"))

# Access results programmatically
print(f"Global similarity: {comparison.global_similarity.overall_score:.2%}")
print(f"Common files: {len(comparison.common_files)}")
print(f"Identical files: {sum(1 for c in comparison.file_comparisons if c.similarity.overall_score == 1.0)}")
```

### Node.js Integration

```python
# example_nodejs_integration.py
import sys
import json
from archive_analyzer.api import ArchiveAnalyzerAPI

# Initialize API
api = ArchiveAnalyzerAPI(timeout_per_file=30.0, max_workers=4)

# Read parameters from Node.js
params = json.loads(sys.argv[1])

# Perform comparison
result = api.compare_json(params)

# Output result for Node.js
print(result)
```

Usage from Node.js:

```javascript
const { spawn } = require('child_process');

const params = {
    archive1: '/path/to/archive1.zip',
    archive2: '/path/to/archive2.zip',
    report_path: '/path/to/report.json',
    report_format: 'json'
};

const python = spawn('python', [
    'example_nodejs_integration.py',
    JSON.stringify(params)
]);

python.stdout.on('data', (data) => {
    const result = JSON.parse(data);
    console.log('Similarity:', result.global_similarity);
});
```

### Direct API Usage

```python
from archive_analyzer.api import ArchiveAnalyzerAPI

# Initialize API
api = ArchiveAnalyzerAPI()

# Compare archives
result = api.compare(
    archive1_path="submission1.zip",
    archive2_path="submission2.zip",
    report_path="analysis_report.json",
    report_format="json"
)

# Check results
if result["success"]:
    similarity = result["global_similarity"]
    if similarity > 0.9:
        print("ALERT: Very high similarity detected!")
    elif similarity > 0.7:
        print("WARNING: High similarity detected")
    else:
        print("Submissions appear to be different")
else:
    print(f"Error: {result['error']}")
```

## Report Format

### JSON Report Structure

```json
{
    "metadata": {
        "timestamp": "2024-01-20T10:30:00",
        "archive1": "student1_project.zip",
        "archive2": "student2_project.zip",
        "total_comparison_time": 15.23,
        "report_version": "1.0"
    },
    "summary": {
        "global_similarity": 0.7823,
        "common_files_count": 25,
        "unique_to_archive1_count": 5,
        "unique_to_archive2_count": 3,
        "total_files_compared": 25,
        "errors_count": 2
    },
    "file_analysis": {
        "common_files": ["main.py", "utils.py", "README.md"],
        "unique_to_archive1": ["config.json", "test_main.py"],
        "unique_to_archive2": ["requirements.txt"]
    },
    "detailed_comparisons": [
        {
            "file_path": "main.py",
            "similarity_score": 0.9234,
            "comparison_time": 0.123,
            "method": "combined",
            "similarity_details": {
                "difflib": 0.9123,
                "fuzzy": 0.9456,
                "token_overlap": 0.9123
            }
        }
    ],
    "similarity_distribution": {
        "mean": 0.7823,
        "min": 0.2341,
        "max": 1.0000,
        "ranges": {
            "identical (1.0)": 5,
            "very_high (0.9-0.99)": 8,
            "high (0.7-0.89)": 7,
            "medium (0.5-0.69)": 3,
            "low (0.3-0.49)": 2,
            "very_low (0.0-0.29)": 0
        }
    },
    "recommendations": [
        "WARNING: High similarity detected (70-90%). Manual review recommended.",
        "Found 5 identical files. Review these files: main.py, utils.py..."
    ],
    "errors": [
        "Timeout comparing large_dataset.csv after 30.0s",
        "Failed to extract corrupted_file.bin: Bad CRC-32"
    ]
}
```

## Configuration

### Timeout Settings

The timeout parameter controls how long the analyzer will spend on each file:

```python
# Quick analysis (10 seconds per file)
comparator = ArchiveComparator(timeout_per_file=10.0)

# Thorough analysis (60 seconds per file)
comparator = ArchiveComparator(timeout_per_file=60.0)
```

### Worker Configuration

Adjust the number of parallel workers based on your system:

```python
# Low-resource system
comparator = ArchiveComparator(max_workers=2)

# High-performance system
comparator = ArchiveComparator(max_workers=8)
```

### Custom Similarity Weights

```python
from archive_analyzer.similarity import CombinedCalculator, SimilarityEngine

# Custom weights for similarity calculation
calculator = CombinedCalculator(weights={
    "difflib": 0.5,      # Give more weight to exact matching
    "fuzzy": 0.3,        # Less weight to fuzzy matching
    "token_overlap": 0.2  # Least weight to token overlap
})

engine = SimilarityEngine(calculator)
comparator = ArchiveComparator(similarity_engine=engine)
```

## Error Handling

The analyzer handles various error conditions gracefully:

- **Corrupted files**: Logged and skipped
- **Unsupported formats**: Reported in errors
- **Timeout**: Files taking too long are skipped with timeout error
- **Encoding issues**: Automatic encoding detection with fallback

## Performance Considerations

- **Large Archives**: Use appropriate timeout and worker settings
- **Memory Usage**: Files are processed one at a time to minimize memory usage
- **Network Drives**: Consider copying archives locally for better performance

## Extending the Analyzer

### Adding New Archive Formats

```python
from archive_analyzer.core import ArchiveExtractor, FileContent

class TarExtractor(ArchiveExtractor):
    def can_handle(self, file_path: Path) -> bool:
        return file_path.suffix.lower() in {'.tar', '.tar.gz', '.tgz'}
    
    def extract(self, file_path: Path) -> Dict[str, FileContent]:
        # Implementation for TAR extraction
        pass
```

### Adding New Content Analyzers

```python
from archive_analyzer.core import ContentAnalyzer

class XMLAnalyzer:
    def can_analyze(self, file_content: FileContent) -> bool:
        return file_content.path.lower().endswith('.xml')
    
    def extract_text(self, file_content: FileContent) -> str:
        # Implementation for XML text extraction
        pass
```
