import re
from typing import Dict, Any, List

WEAK_CLAIM_KEYWORDS = [
    "revolutionary breakthrough", "solves agi", "agi achieved", "unprecedented leap",
    "flawless reasoning", "100% accuracy on all tasks", "zero errors", "cure for all",
    "solves p vs np", "infinite context at zero cost", "superhuman without training"
]

HIGH_IMPACT_KEYWORDS = [
    "state-of-the-art", "sota", "breakthrough", "novel architecture", "fundamental limit",
    "paradigm shift", "10x speedup", "linear scaling", "outperforms gpt-4", "outperforms gemini",
    "new benchmark", "provably optimal", "first demonstration"
]

class SignificanceRanker:
    """
    Ranks significance, assesses source reliability, and guards against weakly supported claims.
    """

    @staticmethod
    def assess_paper(
        title: str,
        abstract: str,
        source_type: str,
        delta_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        title_lower = title.lower()
        abstract_lower = abstract.lower()

        # 1. Source Reliability Scoring
        if source_type in ["primary_preprint", "journal", "conference"]:
            reliability_score = 0.92
        elif source_type in ["secondary_report", "digest", "blog"]:
            reliability_score = 0.70
        else:
            reliability_score = 0.80

        # 2. Weakly Supported Claims Check
        weakly_supported = False
        caution_notes = None

        for kw in WEAK_CLAIM_KEYWORDS:
            if kw in abstract_lower or kw in title_lower:
                weakly_supported = True
                caution_notes = (
                    f"Caution: Text contains potentially unsubstantiated claims ('{kw}'). "
                    "Abstract lacks documented empirical methodology or comparative ablation baselines. "
                    "Requires careful peer verification."
                )
                reliability_score = min(reliability_score, 0.55)
                break

        # Check if abstract lacks empirical validation numbers (percentages, metrics, datasets)
        has_empirical_evidence = bool(re.search(r'\b(\d+(\.\d+)?%|\d+x|dataset|benchmark|evaluated on|experiments show)\b', abstract_lower))
        if not has_empirical_evidence and not weakly_supported:
            if len(abstract.split()) < 40 or "will be presented" in abstract_lower:
                weakly_supported = True
                caution_notes = "Caution: Preliminary statement without empirical benchmarks or evaluation metrics."
                reliability_score = min(reliability_score, 0.65)

        # 3. Significance Level Determination
        if delta_info.get("has_contradiction"):
            significance_level = "Contradiction Warning"
            relevance_score = 0.95
        elif delta_info.get("is_minor_incremental"):
            significance_level = "Minor Update"
            relevance_score = 0.60
        else:
            # Check for high impact
            is_high_impact = any(k in abstract_lower or k in title_lower for k in HIGH_IMPACT_KEYWORDS)
            if is_high_impact or len(delta_info.get("value_metric_shifts", [])) > 0:
                significance_level = "High Impact"
                relevance_score = 0.90
            else:
                significance_level = "Incremental Progress"
                relevance_score = 0.75

        # Extract Evidence Snippets (exact verbatim quotes from abstract for traceability drawer)
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', abstract) if len(s.strip()) > 20]
        evidence_snippets = sentences[:3] if sentences else [abstract[:200]]

        return {
            "significance_level": significance_level,
            "relevance_score": relevance_score,
            "confidence_score": 0.88 if not weakly_supported else 0.50,
            "source_reliability_score": reliability_score,
            "weakly_supported_warning": weakly_supported,
            "caution_notes": caution_notes,
            "evidence_snippets": evidence_snippets
        }
