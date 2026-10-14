import re
from typing import List, Dict, Any, Optional, Tuple
from ..models import PaperAnalysis, Paper

CONTRADICTION_CUES = [
    "contrary to prior", "challenges earlier", "challenges previous", "disproves",
    "contradicts", "refutes", "fails to replicate", "counter to", "invalidates",
    "proves otherwise", "revises previous consensus", "overturns"
]

INCREMENTAL_CUES = [
    "minor adjustment", "incremental improvement", "slight variation", "prompt tuning",
    "hyperparameter tuning", "modest gain", "ablation variation", "re-evaluation on",
    "further evaluation", "preliminary notes"
]

METRIC_PATTERNS = [
    r'(\d+(?:\.\d+)?%)\s*(?:accuracy|improvement|gain|speedup)',
    r'(?:latency|delay)\s*(?:reduced|decreased)\s*by\s*(\d+(?:\.\d+)?%)',
    r'(?:context(?:\s*window)?)\s*(?:extended|scaled|increased)\s*to\s*(\d+[kKmMbB]?)',
    r'(\d+x)\s*(?:faster|speedup|throughput)'
]

class ChangeDetectionEngine:
    """
    Compares candidate paper against historical topic analyses to detect:
    - Scientific contradictions
    - Meaningful value/conclusion shifts
    - Alert fatigue reduction (filtering minor incremental updates)
    """

    @staticmethod
    def detect_historical_delta(
        title: str,
        abstract: str,
        historical_analyses: List[Tuple[PaperAnalysis, Paper]]
    ) -> Dict[str, Any]:
        """
        Analyzes relationship between candidate paper and prior tracked papers in the topic.
        """
        has_contradiction = False
        contradiction_target_title = None
        contradiction_detail = None
        is_minor_incremental = False
        value_metric_shifts = []
        delta_notes_list = []

        abstract_lower = abstract.lower()
        title_lower = title.lower()

        # 1. Contradiction Detection
        for cue in CONTRADICTION_CUES:
            if cue in abstract_lower or cue in title_lower:
                has_contradiction = True
                # Match against historical papers
                if historical_analyses:
                    target_analysis, target_paper = historical_analyses[0]
                    contradiction_target_title = target_paper.title
                    contradiction_detail = (
                        f"This work presents claims that challenge or refute findings in '{target_paper.title}'. "
                        f"Specifically, it reports findings contrary to previous assumptions."
                    )
                else:
                    contradiction_detail = f"Claims in this paper explicitly contradict established baseline assumptions ({cue})."
                break

        # 2. Value / Conclusion Shifts
        extracted_metrics = []
        for pat in METRIC_PATTERNS:
            matches = re.findall(pat, abstract, re.IGNORECASE)
            for m in matches:
                extracted_metrics.append(m)

        if extracted_metrics:
            for m in extracted_metrics[:3]:
                value_metric_shifts.append({
                    "metric": "Reported Benchmark Shift",
                    "previous": "Baseline / Prior Work",
                    "current": m,
                    "delta": f"Significant quantitative advance ({m})"
                })
            delta_notes_list.append(f"Advances prior baseline metrics: {', '.join(extracted_metrics[:3])}.")

        # 3. Alert Fatigue Prevention / Incremental Check
        for cue in INCREMENTAL_CUES:
            if cue in abstract_lower:
                is_minor_incremental = True
                delta_notes_list.append(f"Classified as incremental progression ({cue}); high-priority alert suppressed.")
                break

        # If no specific cues found, summarize relationship to history
        if not delta_notes_list:
            if historical_analyses:
                delta_notes_list.append(f"Builds incrementally upon {len(historical_analyses)} previously tracked findings in this topic.")
            else:
                delta_notes_list.append("Establishes initial baseline for this monitoring topic.")

        return {
            "has_contradiction": has_contradiction,
            "contradiction_target_title": contradiction_target_title,
            "contradiction_detail": contradiction_detail,
            "is_minor_incremental": is_minor_incremental,
            "value_metric_shifts": value_metric_shifts,
            "delta_notes": " ".join(delta_notes_list)
        }
