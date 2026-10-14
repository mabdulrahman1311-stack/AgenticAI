import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models import Topic, Paper, PaperAnalysis, MonitoringRun, TrendSnapshot
from ..schemas import TopicCreate, TopicUpdate, TopicResponse, TriggerRunResponse
from ..scheduler.jobs import schedule_topic, remove_topic_schedule
from ..agent.pipeline import MonitoringPipeline

router = APIRouter(prefix="/api/topics", tags=["Topics"])

@router.post("", response_model=TopicResponse, status_code=201)
def create_topic(topic_in: TopicCreate, db: Session = Depends(get_db)):
    topic = Topic(
        name=topic_in.name,
        description=topic_in.description,
        keywords=topic_in.keywords,
        schedule_interval_hours=topic_in.schedule_interval_hours,
        is_active=topic_in.is_active,
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow()
    )
    db.add(topic)
    db.commit()
    db.refresh(topic)

    # Schedule periodic job
    if topic.is_active:
        schedule_topic(topic)

    res = TopicResponse.from_orm(topic)
    res.papers_count = 0
    res.high_impact_count = 0
    res.contradiction_count = 0
    return res

@router.get("", response_model=List[TopicResponse])
def list_topics(db: Session = Depends(get_db)):
    topics = db.query(Topic).order_by(Topic.created_at.desc()).all()
    results = []

    for t in topics:
        res = TopicResponse.from_orm(t)
        # Calculate counts
        analyses = db.query(PaperAnalysis).filter(PaperAnalysis.topic_id == t.id).all()
        res.papers_count = len(analyses)
        res.high_impact_count = sum(1 for a in analyses if a.significance_level == "High Impact")
        res.contradiction_count = sum(1 for a in analyses if a.has_contradiction)

        # Get latest run status
        last_run = (
            db.query(MonitoringRun)
            .filter(MonitoringRun.topic_id == t.id)
            .order_by(MonitoringRun.started_at.desc())
            .first()
        )
        res.last_run_status = last_run.status if last_run else "idle"
        results.append(res)

    return results

@router.get("/{topic_id}", response_model=TopicResponse)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    res = TopicResponse.from_orm(topic)
    analyses = db.query(PaperAnalysis).filter(PaperAnalysis.topic_id == topic.id).all()
    res.papers_count = len(analyses)
    res.high_impact_count = sum(1 for a in analyses if a.significance_level == "High Impact")
    res.contradiction_count = sum(1 for a in analyses if a.has_contradiction)

    last_run = (
        db.query(MonitoringRun)
        .filter(MonitoringRun.topic_id == topic.id)
        .order_by(MonitoringRun.started_at.desc())
        .first()
    )
    res.last_run_status = last_run.status if last_run else "idle"
    return res

@router.put("/{topic_id}", response_model=TopicResponse)
def update_topic(topic_id: int, update_in: TopicUpdate, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    if update_in.name is not None:
        topic.name = update_in.name
    if update_in.description is not None:
        topic.description = update_in.description
    if update_in.keywords is not None:
        topic.keywords = update_in.keywords
    if update_in.schedule_interval_hours is not None:
        topic.schedule_interval_hours = update_in.schedule_interval_hours
    if update_in.is_active is not None:
        topic.is_active = update_in.is_active

    topic.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(topic)

    # Update scheduler
    if topic.is_active:
        schedule_topic(topic)
    else:
        remove_topic_schedule(topic.id)

    return get_topic(topic_id, db)

@router.delete("/{topic_id}")
def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    remove_topic_schedule(topic.id)
    db.delete(topic)
    db.commit()
    return {"message": f"Topic '{topic.name}' successfully deleted."}

@router.post("/{topic_id}/trigger", response_model=TriggerRunResponse)
async def trigger_monitoring_run(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    pipeline = MonitoringPipeline(db)
    run = await pipeline.run_for_topic(topic)

    return TriggerRunResponse(
        message=f"Monitoring run executed for '{topic.name}'.",
        run_id=run.id,
        topic_id=topic.id,
        status=run.status,
        new_papers_count=run.new_papers_count,
        duplicates_skipped_count=run.duplicates_skipped_count
    )
