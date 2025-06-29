"""Similarity calculation strategies for text comparison."""

import difflib
import json
import logging
import re
from typing import Any, Dict, List, Optional, Tuple

try:
    from fuzzywuzzy import fuzz
except ImportError:
    fuzz = None

try:
    from deepdiff import DeepDiff
except ImportError:
    DeepDiff = None

import nltk

try:
    from nltk.tokenize import word_tokenize
    from nltk.corpus import stopwords

    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
except ImportError:
    nltk = None

from .core import SimilarityCalculator, SimilarityScore

logger = logging.getLogger(__name__)


class DifflibCalculator(SimilarityCalculator):
    """Similarity calculator using Python's difflib."""

    def calculate(self, content1: str, content2: str) -> float:
        """Calculate similarity using SequenceMatcher."""
        if not content1 or not content2:
            return 0.0

        return difflib.SequenceMatcher(None, content1, content2).ratio()

    @property
    def name(self) -> str:
        """Name of this calculator."""
        return "difflib"


class FuzzyCalculator(SimilarityCalculator):
    """Similarity calculator using FuzzyWuzzy."""

    def __init__(self):
        """Initialize the fuzzy calculator."""
        if fuzz is None:
            raise ImportError("fuzzywuzzy is required. Install with: pip install fuzzywuzzy[speedup]")

    def calculate(self, content1: str, content2: str) -> float:
        """Calculate similarity using fuzzy string matching."""
        if not content1 or not content2:
            return 0.0

        # Use token sort ratio for better handling of word order differences
        return fuzz.token_sort_ratio(content1, content2) / 100.0

    @property
    def name(self) -> str:
        """Name of this calculator."""
        return "fuzzy"


class TokenBasedCalculator(SimilarityCalculator):
    """Similarity calculator based on token overlap."""

    def __init__(self, use_stopwords: bool = True):
        """Initialize the token-based calculator."""
        self.use_stopwords = use_stopwords
        self._stopwords = set()

        if use_stopwords and nltk:
            try:
                self._stopwords = set(stopwords.words('english'))
            except Exception:
                logger.warning("Failed to load NLTK stopwords")

    def calculate(self, content1: str, content2: str) -> float:
        """Calculate similarity based on token overlap."""
        if not content1 or not content2:
            return 0.0

        tokens1 = self._tokenize(content1)
        tokens2 = self._tokenize(content2)

        if not tokens1 or not tokens2:
            return 0.0

        # Calculate Jaccard similarity
        intersection = tokens1.intersection(tokens2)
        union = tokens1.union(tokens2)

        return len(intersection) / len(union) if union else 0.0

    def _tokenize(self, text: str) -> set:
        """Tokenize text into a set of words."""
        # Simple word tokenization
        words = re.findall(r'\b\w+\b', text.lower())

        # Remove stopwords if configured
        if self.use_stopwords and self._stopwords:
            words = [w for w in words if w not in self._stopwords]

        return set(words)

    @property
    def name(self) -> str:
        """Name of this calculator."""
        return "token_overlap"


class StructuralCalculator(SimilarityCalculator):
    """Similarity calculator for structured data (JSON, etc.)."""

    def __init__(self):
        """Initialize the structural calculator."""
        if DeepDiff is None:
            raise ImportError("deepdiff is required. Install with: pip install deepdiff")

    def calculate(self, content1: str, content2: str) -> float:
        """Calculate structural similarity for JSON-like content."""
        try:
            obj1 = json.loads(content1)
            obj2 = json.loads(content2)
            return self._calculate_structural_similarity(obj1, obj2)
        except json.JSONDecodeError:
            # Fallback to text comparison
            return DifflibCalculator().calculate(content1, content2)

    def _calculate_structural_similarity(self, obj1: Any, obj2: Any) -> float:
        """Calculate similarity between two objects."""
        diff = DeepDiff(obj1, obj2, ignore_order=True)

        # Count different types of changes
        changes = 0
        changes += len(diff.get('values_changed', {}))
        changes += len(diff.get('type_changes', {}))
        changes += len(diff.get('dictionary_item_added', []))
        changes += len(diff.get('dictionary_item_removed', []))
        changes += len(diff.get('iterable_item_added', {}))
        changes += len(diff.get('iterable_item_removed', {}))

        # Estimate total elements
        total = self._count_elements(obj1) + self._count_elements(obj2)

        if total == 0:
            return 1.0

        # Calculate similarity as inverse of change ratio
        change_ratio = changes / (total / 2)
        return max(0.0, 1.0 - change_ratio)

    def _count_elements(self, obj: Any) -> int:
        """Count total elements in an object."""
        if isinstance(obj, dict):
            return len(obj) + sum(self._count_elements(v) for v in obj.values())
        elif isinstance(obj, list):
            return len(obj) + sum(self._count_elements(v) for v in obj)
        else:
            return 1

    @property
    def name(self) -> str:
        """Name of this calculator."""
        return "structural"


class CombinedCalculator(SimilarityCalculator):
    """Combined calculator using multiple strategies with weights."""

    def __init__(self, weights: Optional[Dict[str, float]] = None):
        """
        Initialize the combined calculator.

        Args:
            weights: Dictionary mapping calculator names to weights.
                    If None, equal weights are used.
        """
        self.calculators: List[Tuple[SimilarityCalculator, float]] = []

        # Default weights
        default_weights = {
            "difflib": 0.4,
            "fuzzy": 0.3,
            "token_overlap": 0.3
        }

        weights = weights or default_weights

        # Initialize available calculators
        self.calculators.append((DifflibCalculator(), weights.get("difflib", 0.33)))

        try:
            self.calculators.append((FuzzyCalculator(), weights.get("fuzzy", 0.33)))
        except ImportError:
            logger.warning("FuzzyWuzzy not available, adjusting weights")
            # Redistribute weight
            for calc, weight in self.calculators:
                self.calculators.remove((calc, weight))
                self.calculators.append((calc, weight + weights.get("fuzzy", 0.33)))

        self.calculators.append((TokenBasedCalculator(), weights.get("token_overlap", 0.34)))

        # Normalize weights
        total_weight = sum(w for _, w in self.calculators)
        self.calculators = [(calc, w / total_weight) for calc, w in self.calculators]

    def calculate(self, content1: str, content2: str) -> float:
        """Calculate combined similarity score."""
        if not content1 or not content2:
            return 0.0

        total_score = 0.0

        for calculator, weight in self.calculators:
            try:
                score = calculator.calculate(content1, content2)
                total_score += score * weight
            except Exception as e:
                logger.error(f"Calculator {calculator.name} failed: {e}")

        return total_score

    @property
    def name(self) -> str:
        """Name of this calculator."""
        return "combined"


class SimilarityEngine:
    """Main engine for calculating similarity between files."""

    def __init__(self, calculator: Optional[SimilarityCalculator] = None):
        """
        Initialize the similarity engine.

        Args:
            calculator: The similarity calculator to use.
                       If None, CombinedCalculator is used.
        """
        self.calculator = calculator or CombinedCalculator()
        self.structural_calculator = None

        try:
            self.structural_calculator = StructuralCalculator()
        except ImportError:
            logger.warning("Structural comparison not available")

    def calculate_similarity(self, content1: str, content2: str,
                             file_path: Optional[str] = None) -> SimilarityScore:
        """
        Calculate comprehensive similarity between two contents.

        Args:
            content1: First content to compare
            content2: Second content to compare
            file_path: Optional file path to determine if structural comparison is needed

        Returns:
            SimilarityScore with detailed metrics
        """
        details = {}

        # Check if structural comparison is appropriate
        if (file_path and file_path.lower().endswith(('.json', '.xml', '.yaml', '.yml'))
                and self.structural_calculator):
            try:
                structural_score = self.structural_calculator.calculate(content1, content2)
                details['structural'] = structural_score

                # For structured files, give more weight to structural similarity
                text_score = self.calculator.calculate(content1, content2)
                overall_score = 0.7 * structural_score + 0.3 * text_score

                return SimilarityScore(
                    overall_score=overall_score,
                    text_similarity=text_score,
                    structural_similarity=structural_score,
                    method_used="structural_weighted",
                    details=details
                )
            except Exception as e:
                logger.debug(f"Structural comparison failed, falling back to text: {e}")

        # Regular text comparison
        if isinstance(self.calculator, CombinedCalculator):
            # Get individual scores for detailed reporting
            for calc, weight in self.calculator.calculators:
                try:
                    score = calc.calculate(content1, content2)
                    details[calc.name] = score
                except Exception:
                    pass

        overall_score = self.calculator.calculate(content1, content2)

        return SimilarityScore(
            overall_score=overall_score,
            text_similarity=overall_score,
            method_used=self.calculator.name,
            details=details
        )