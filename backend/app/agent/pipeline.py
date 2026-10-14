import datetime
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from ..models import Topic, Paper, PaperAnalysis, MonitoringRun, TrendSnapshot
from ..retrieval.arxiv_client import ArxivClient
from ..retrieval.secondary_client import SecondarySourceClient
from .dedup_engine import DeduplicationEngine
from .change_detection import ChangeDetectionEngine
from .significance_ranker import SignificanceRanker
from .llm_client import LLMClient
from .trend_analyzer import TrendAnalyzer

logger = logging.getLogger("pipeline")

class MonitoringPipeline:
    def __init__(self, db: Session):
        self.db = db
        self.arxiv_client = ArxivClient()
        self.secondary_client = SecondarySourceClient()
        self.dedup_engine = DeduplicationEngine(db)
        self.llm_client = LLMClient()
        self.trend_analyzer = TrendAnalyzer(db)

    async def run_for_topic(self, topic: Topic) -> MonitoringRun:
        """
        Executes a complete autonomous monitoring run for a specific topic.
        """
        run = MonitoringRun(
            topic_id=topic.id,
            started_at=datetime.datetime.utcnow(),
            status="running",
            papers_found_count=0,
            new_papers_count=0,
            duplicates_skipped_count=0,
            log_details=[]
        )
        self.db.add(run)
        self.db.commit()
        self.db.refresh(run)

        logs = []

        def log_step(step_name: str, message: str, level: str = "info", extra: Optional[Dict] = None):
            entry = {
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "step": step_name,
                "message": message,
                "level": level,
                **(extra or {})
            }
            logs.append(entry)
            logger.info(f"[{topic.name}] {step_name}: {message}")

        log_step("INIT", f"Triggered autonomous monitoring run for topic '{topic.name}'.")

        try:
            # Step 1: Retrieval
            log_step("RETRIEVAL", f"Querying arXiv public Atom API for keywords: {topic.keywords}")
            arxiv_res = await self.arxiv_client.fetch_papers(topic.keywords, max_results=10)

            retrieval_status = arxiv_res["status"]
            retrieved_papers = arxiv_res.get("papers", [])
            log_step(
                "RETRIEVAL_RESULT",
                f"arXiv query returned {len(retrieved_papers)} candidate publications. Status: {retrieval_status}.",
                level="info" if retrieval_status == "success" else "warning",
                extra={"error": arxiv_res.get("error")}
            )

            # Secondary retrieval for convergence demo if applicable
            secondary_res = await self.secondary_client.fetch_secondary_reports(topic.keywords, max_results=2)
            retrieved_papers.extend(secondary_res.get("papers", []))

            run.papers_found_count = len(retrieved_papers)

            # Step 2: Fetch existing papers & historical analyses
            existing_papers = self.db.query(Paper).all()
            historical_analyses = (
                self.db.query(PaperAnalysis, Paper)
                .join(Paper, PaperAnalysis.paper_id == Paper.id)
                .filter(PaperAnalysis.topic_id == topic.id)
                .order_by(PaperAnalysis.analyzed_at.desc())
                .all()
            )
            historical_titles = [p.title for _, p in historical_analyses]

            log_step(
                "HISTORY_LOAD",
                f"Loaded {len(existing_papers)} stored papers and {len(historical_analyses)} historical analyses for comparison."
            )

            new_papers_saved = 0
            duplicates_skipped = 0

            # Step 3: Process each candidate paper
            for cand in retrieved_papers:
                is_duplicate, matched_paper, cluster_id = self.dedup_engine.check_and_cluster(cand, existing_papers)

                if is_duplicate:
                    duplicates_skipped += 1
                    log_step("DEDUP_SKIP", f"Skipped duplicate paper: '{cand['title'][:60]}...' (matched ID/Title)")
                    continue

                # Not a duplicate -> Analyze and Store
                log_step("ANALYSIS_START", f"Starting agentic analysis for '{cand['title'][:70]}...'")

                # Change Detection & Historical Comparison
                delta_info = ChangeDetectionEngine.detect_historical_delta(
                    title=cand["title"],
                    abstract=cand["abstract"],
                    historical_analyses=historical_analyses
                )

                # Significance & Reliability Ranking
                ranking_info = SignificanceRanker.assess_paper(
                    title=cand["title"],
                    abstract=cand["abstract"],
                    source_type=cand.get("source_type", "primary_preprint"),
                    delta_info=delta_info
                )

                # LLM Extraction & Grounded Synthesis
                analysis_data = await self.llm_client.analyze_paper(
                    title=cand["title"],
                    abstract=cand["abstract"],
                    source_type=cand.get("source_type", "primary_preprint"),
                    topic_name=topic.name,
                    topic_keywords=topic.keywords,
                    delta_info=delta_info,
                    ranking_info=ranking_info,
                    historical_titles=historical_titles
                )

                # Persist Paper
                new_paper = Paper(
                    external_id=cand["external_id"],
                    title=cand["title"],
                    authors=cand.get("authors", []),
                    abstract=cand["abstract"],
                    published_date=cand.get("published_date", datetime.datetime.utcnow()),
                    source_url=cand.get("source_url", ""),
                    source_type=cand.get("source_type", "primary_preprint"),
                    cluster_id=cluster_id or cand.get("cluster_id")
                )
                self.db.add(new_paper)
                self.db.flush()

                # Persist Analysis
                new_analysis = PaperAnalysis(
                    paper_id=new_paper.id,
                    topic_id=topic.id,
                    summary=analysis_data["summary"],
                    research_question=analysis_data.get("research_question"),
                    approach=analysis_data.get("approach"),
                    key_findings=analysis_data.get("key_findings", []),
                    relevance_score=analysis_data.get("relevance_score", 0.85),
                    significance_level=analysis_data.get("significance_level", "Incremental Progress"),
                    confidence_score=analysis_data.get("confidence_score", 0.88),
                    source_reliability_score=analysis_data.get("source_reliability_score", 0.90),
                    delta_notes=analysis_data.get("delta_notes"),
                    has_contradiction=analysis_data.get("has_contradiction", False),
                    contradiction_target_title=analysis_data.get("contradiction_target_title"),
                    contradiction_detail=analysis_data.get("contradiction_detail"),
                    value_metric_shifts=analysis_data.get("value_metric_shifts", []),
                    weakly_supported_warning=analysis_data.get("weakly_supported_warning", False),
                    caution_notes=analysis_data.get("caution_notes"),
                    evidence_snippets=analysis_data.get("evidence_snippets", []),
                    analyzed_at=datetime.datetime.utcnow()
                )
                self.db.add(new_analysis)
                self.db.flush()

                # Add to in-memory existing list for intra-batch deduplication
                existing_papers.append(new_paper)
                historical_analyses.insert(0, (new_analysis, new_paper))
                historical_titles.insert(0, new_paper.title)
                new_papers_saved += 1

                log_step(
                    "ANALYSIS_SAVED",
                    f"Saved '{new_paper.title[:50]}' [Significance: {new_analysis.significance_level}] "
                    f"(Contradiction: {new_analysis.has_contradiction}, Caution: {new_analysis.weakly_supported_warning})"
                )

            # Step 4: Update Trends
            if new_papers_saved > 0 or not topic.trends:
                log_step("TRENDS", "Recalculating trend snapshots and emerging themes...")
                self.trend_analyzer.generate_snapshot_for_topic(topic)

            # Finalize run
            run.new_papers_count = new_papers_saved
            run.duplicates_skipped_count = duplicates_skipped
            run.completed_at = datetime.datetime.utcnow()

            if retrieval_status == "partial":
                run.status = "partial"
                run.error_message = arxiv_res.get("error")
            elif retrieval_status == "failed" and new_papers_saved == 0:
                run.status = "failed"
                run.error_message = arxiv_res.get("error")
            else:
                run.status = "success"

            topic.last_run_at = datetime.datetime.utcnow()
            log_step(
                "COMPLETE",
                f"Monitoring run finished with status: {run.status}. "
                f"New papers: {new_papers_saved}, Duplicates skipped: {duplicates_skipped}."
            )

        except Exception as e:
            logger.error(f"Fatal error during monitoring run for {topic.name}: {e}", exc_info=True)
            run.status = "failed"
            run.completed_at = datetime.datetime.utcnow()
            run.error_message = str(e)
            log_step("FATAL_ERROR", f"Run failed with exception: {str(e)}", level="error")

        run.log_details = logs
        self.db.commit()
        self.db.refresh(run)
        return run
