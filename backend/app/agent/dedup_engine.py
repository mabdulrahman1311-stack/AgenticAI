import re
import string
from typing import List, Dict, Any, Tuple, Optional, Set
from difflib import SequenceMatcher
from sqlalchemy.orm import Session
from ..models import Paper

def normalize_title(title: str) -> str:
    """Normalizes title for robust fuzzy and exact comparison."""
    if not title:
        return ""
    # Lowercase
    t = title.lower()
    # Strip common prefixes/suffixes like [v1], [pdf], arXiv:, etc.
    t = re.sub(r'\[v\d+\]', '', t)
    t = re.sub(r'\(.*?\)', '', t)
    t = re.sub(r'^(industry analysis|tech dispatch|breakdown|summary):\s*', '', t)
    # Remove punctuation
    t = t.translate(str.maketrans('', '', string.punctuation))
    # Normalize whitespaces
    return " ".join(t.split())

def string_similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()

def token_jaccard_similarity(a: str, b: str) -> float:
    stopwords = {"a", "an", "the", "in", "on", "of", "for", "with", "and", "or", "to", "via", "using", "from", "by", "as"}
    tokens_a = set(w for w in a.split() if w not in stopwords)
    tokens_b = set(w for w in b.split() if w not in stopwords)
    if not tokens_a or not tokens_b:
        return 0.0
    intersection = tokens_a.intersection(tokens_b)
    union = tokens_a.union(tokens_b)
    return len(intersection) / len(union)

class DeduplicationEngine:
    """
    Intelligent Deduplication & Multi-Source Convergence Engine:
    1. Checks stable external_id.
    2. Checks exact normalized title match.
    3. Checks fuzzy title similarity (SequenceMatcher > 0.88 or Jaccard > 0.75).
    4. Detects multi-source convergence: groups related secondary reports with their primary paper into a cluster_id.
    """
    def __init__(self, db: Session):
        self.db = db

    def check_and_cluster(self, candidate: Dict[str, Any], existing_papers: List[Paper]) -> Tuple[bool, Optional[Paper], Optional[str]]:
        """
        Returns:
            is_exact_duplicate: bool (if True, should not store as new standalone paper)
            matched_paper: Optional[Paper]
            cluster_id: Optional[str] (grouping ID for multi-source convergence)
        """
        cand_ext_id = candidate.get("external_id", "").strip()
        cand_title_norm = normalize_title(candidate.get("title", ""))

        for stored in existing_papers:
            # 1. Exact External ID Match
            if cand_ext_id and stored.external_id == cand_ext_id:
                return True, stored, stored.cluster_id

            # 2. Normalized Title Exact Match
            stored_title_norm = normalize_title(stored.title)
            if cand_title_norm and stored_title_norm and cand_title_norm == stored_title_norm:
                return True, stored, stored.cluster_id

            # 3. High Fuzzy Match (same paper updated or re-uploaded)
            fuzzy_sim = string_similarity(cand_title_norm, stored_title_norm)
            jaccard_sim = token_jaccard_similarity(cand_title_norm, stored_title_norm)

            if fuzzy_sim >= 0.88 or jaccard_sim >= 0.80:
                return True, stored, stored.cluster_id

            # 4. Multi-Source Convergence (Different source covering identical breakthrough)
            # E.g. primary paper and secondary tech breakdown
            if jaccard_sim >= 0.55 or (candidate.get("convergence_hint") and normalize_title(candidate.get("convergence_hint", "")) in stored_title_norm):
                # Different source types covering the same breakthrough -> Group them into a cluster!
                shared_cluster_id = stored.cluster_id or f"cluster_{stored.id}"
                if not stored.cluster_id:
                    stored.cluster_id = shared_cluster_id
                    self.db.add(stored)
                    self.db.commit()
                # If candidate is a secondary report or variant, we treat it as a cluster child rather than standalone duplicate
                return False, stored, shared_cluster_id

        # No duplicate and no cluster match
        return False, None, None
