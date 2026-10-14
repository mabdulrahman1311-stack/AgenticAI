import json
import logging
import re
from typing import Dict, Any, List, Optional
from ..config import settings

logger = logging.getLogger("llm_client")

ANALYSIS_SYSTEM_PROMPT = """You are ResearchPulse AI, an elite autonomous research monitoring and synthesis agent.
Your objective is to analyze a newly retrieved research publication against a user's monitored research topic and historical findings.

You must output a valid JSON object matching the following structure:
{
  "summary": "Concise 2-3 sentence technical summary grounded strictly in source facts.",
  "research_question": "Primary scientific/engineering question addressed.",
  "approach": "Proposed methodology, architectural innovations, or algorithm.",
  "key_findings": ["Finding 1 with concrete metrics if present", "Finding 2", "Finding 3"],
  "delta_notes": "Explicit explanation of how this finding compares to or changes previous results.",
  "has_contradiction": false,
  "contradiction_target_title": null,
  "contradiction_detail": null,
  "value_metric_shifts": [
    {"metric": "Name of metric", "previous": "Prior baseline", "current": "New value", "delta": "+/- % or shift description"}
  ],
  "significance_level": "High Impact | Minor Update | Contradiction Warning | Incremental Progress",
  "weakly_supported_warning": false,
  "caution_notes": null,
  "evidence_snippets": ["Exact verbatim excerpt from source text supporting the summary 1", "Excerpt 2"]
}
"""

class LLMClient:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self._openai_client = None

        if self.api_key and self.api_key.strip() and not self.api_key.startswith("mock"):
            try:
                from openai import AsyncOpenAI
                self._openai_client = AsyncOpenAI(api_key=self.api_key)
                logger.info("Initialized OpenAI client with specified API key.")
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI client: {e}")

    async def analyze_paper(
        self,
        title: str,
        abstract: str,
        source_type: str,
        topic_name: str,
        topic_keywords: List[str],
        delta_info: Dict[str, Any],
        ranking_info: Dict[str, Any],
        historical_titles: List[str]
    ) -> Dict[str, Any]:
        """
        Analyzes paper using OpenAI API if available, with robust fallback to heuristic engine.
        """
        if self._openai_client:
            try:
                user_prompt = f"""Topic: {topic_name}
Keywords: {', '.join(topic_keywords)}

Historical Prior Papers in this Topic:
{json.dumps(historical_titles[:5], indent=2)}

Candidate Paper:
Title: {title}
Source Type: {source_type}
Abstract:
{abstract}

Context Analysis Pre-checks:
- Contradiction detected: {delta_info.get('has_contradiction')}
- Suggested contradiction target: {delta_info.get('contradiction_target_title')}
- Metric shifts noted: {json.dumps(delta_info.get('value_metric_shifts', []))}
- Caution flag: {ranking_info.get('weakly_supported_warning')}
"""
                response = await self._openai_client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": ANALYSIS_SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.1,
                    max_tokens=1000
                )

                content = response.choices[0].message.content
                if content:
                    parsed = json.loads(content)
                    # Merge with guaranteed fields
                    return self._sanitize_analysis_output(parsed, delta_info, ranking_info, abstract)
            except Exception as e:
                logger.warning(f"OpenAI API call failed or timed out: {e}. Falling back to heuristic agent engine.")

        # Fallback Heuristic Engine
        return self._generate_heuristic_analysis(
            title=title,
            abstract=abstract,
            source_type=source_type,
            topic_name=topic_name,
            delta_info=delta_info,
            ranking_info=ranking_info
        )

    def _generate_heuristic_analysis(
        self,
        title: str,
        abstract: str,
        source_type: str,
        topic_name: str,
        delta_info: Dict[str, Any],
        ranking_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """High-fidelity grounded extraction when LLM API is unavailable."""
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', abstract) if len(s.strip()) > 15]

        # Extract research question
        rq_matches = [s for s in sentences if any(w in s.lower() for w in ["how to", "whether", "investigate", "address the problem", "aims to", "we study", "we explore"])]
        research_question = rq_matches[0] if rq_matches else f"Investigating advances and empirical performance in {topic_name}."

        # Extract approach
        app_matches = [s for s in sentences if any(w in s.lower() for w in ["we propose", "we introduce", "our method", "architecture", "framework", "we develop"])]
        approach = app_matches[0] if app_matches else f"Introduces a novel approach focused on {title.split(':')[0]}."

        # Extract key findings
        findings_matches = [s for s in sentences if any(w in s.lower() for w in ["show that", "demonstrates", "results indicate", "achieves", "outperforms", "improves", "surpasses"])]
        if not findings_matches:
            findings_matches = sentences[-2:] if len(sentences) >= 2 else sentences

        # Summary
        summary = " ".join(sentences[:2]) if len(sentences) >= 2 else abstract[:300]

        return {
            "summary": summary,
            "research_question": research_question,
            "approach": approach,
            "key_findings": findings_matches[:3],
            "delta_notes": delta_info.get("delta_notes", "Advances research baseline for monitored topic."),
            "has_contradiction": delta_info.get("has_contradiction", False),
            "contradiction_target_title": delta_info.get("contradiction_target_title"),
            "contradiction_detail": delta_info.get("contradiction_detail"),
            "value_metric_shifts": delta_info.get("value_metric_shifts", []),
            "significance_level": ranking_info.get("significance_level", "Incremental Progress"),
            "relevance_score": ranking_info.get("relevance_score", 0.80),
            "confidence_score": ranking_info.get("confidence_score", 0.85),
            "source_reliability_score": ranking_info.get("source_reliability_score", 0.90),
            "weakly_supported_warning": ranking_info.get("weakly_supported_warning", False),
            "caution_notes": ranking_info.get("caution_notes"),
            "evidence_snippets": ranking_info.get("evidence_snippets", sentences[:2])
        }

    def _sanitize_analysis_output(
        self,
        parsed: Dict[str, Any],
        delta_info: Dict[str, Any],
        ranking_info: Dict[str, Any],
        abstract: str
    ) -> Dict[str, Any]:
        """Ensures all expected keys exist and values conform to model schema."""
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', abstract) if len(s.strip()) > 15]
        return {
            "summary": parsed.get("summary", abstract[:250]),
            "research_question": parsed.get("research_question", "Core research inquiry addressed in this work."),
            "approach": parsed.get("approach", "Methodology and experimental design presented in paper."),
            "key_findings": parsed.get("key_findings", sentences[:2]),
            "delta_notes": parsed.get("delta_notes") or delta_info.get("delta_notes", "Builds upon previous research in topic."),
            "has_contradiction": parsed.get("has_contradiction", delta_info.get("has_contradiction", False)),
            "contradiction_target_title": parsed.get("contradiction_target_title", delta_info.get("contradiction_target_title")),
            "contradiction_detail": parsed.get("contradiction_detail", delta_info.get("contradiction_detail")),
            "value_metric_shifts": parsed.get("value_metric_shifts", delta_info.get("value_metric_shifts", [])),
            "significance_level": parsed.get("significance_level", ranking_info.get("significance_level", "Incremental Progress")),
            "relevance_score": ranking_info.get("relevance_score", 0.85),
            "confidence_score": ranking_info.get("confidence_score", 0.88),
            "source_reliability_score": ranking_info.get("source_reliability_score", 0.90),
            "weakly_supported_warning": parsed.get("weakly_supported_warning", ranking_info.get("weakly_supported_warning", False)),
            "caution_notes": parsed.get("caution_notes", ranking_info.get("caution_notes")),
            "evidence_snippets": parsed.get("evidence_snippets") or ranking_info.get("evidence_snippets", sentences[:2])
        }
