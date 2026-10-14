import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Topic, Paper, PaperAnalysis, MonitoringRun, TrendSnapshot
from ..schemas import SystemStatsResponse
from ..scheduler.jobs import scheduler
from ..config import settings
from ..seed.scenarios_seed import seed_hackathon_scenarios
from ..agent.pipeline import MonitoringPipeline

router = APIRouter(prefix="/api/system", tags=["System & Diagnostics"])

@router.get("/stats", response_model=SystemStatsResponse)
def get_system_stats(db: Session = Depends(get_db)):
    active_topics_count = db.query(Topic).filter(Topic.is_active == True).count()
    total_papers_tracked = db.query(Paper).count()
    
    # High impact & Contradiction alerts
    pending_significance_alerts = db.query(PaperAnalysis).filter(PaperAnalysis.significance_level == "High Impact").count()
    contradiction_warnings_count = db.query(PaperAnalysis).filter(PaperAnalysis.has_contradiction == True).count()

    ai_provider = "OpenAI (GPT-4o-mini)" if settings.OPENAI_API_KEY and not settings.OPENAI_API_KEY.startswith("mock") else "Agentic Heuristic NLP Engine"

    return SystemStatsResponse(
        active_topics_count=active_topics_count,
        total_papers_tracked=total_papers_tracked,
        pending_significance_alerts=pending_significance_alerts,
        contradiction_warnings_count=contradiction_warnings_count,
        system_health_status="Operational (Autonomous Monitoring Active)",
        scheduler_running=scheduler.running,
        last_heartbeat=datetime.datetime.utcnow(),
        ai_provider=ai_provider
    )

@router.post("/seed-scenarios")
def trigger_seed_scenarios(db: Session = Depends(get_db)):
    result = seed_hackathon_scenarios(db)
    return result

@router.post("/trigger-all")
async def trigger_all_topics(db: Session = Depends(get_db)):
    active_topics = db.query(Topic).filter(Topic.is_active == True).all()
    pipeline = MonitoringPipeline(db)
    results = []
    for t in active_topics:
        run = await pipeline.run_for_topic(t)
        results.append({
            "topic_id": t.id,
            "topic_name": t.name,
            "status": run.status,
            "new_papers": run.new_papers_count,
            "duplicates_skipped": run.duplicates_skipped_count
        })
    return {"message": f"Triggered monitoring cycles across {len(active_topics)} active topics.", "runs": results}
