from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models import MonitoringRun, Topic
from ..schemas import MonitoringRunResponse

router = APIRouter(prefix="/api", tags=["Monitoring Runs & Diagnostics"])

@router.get("/topics/{topic_id}/runs", response_model=List[MonitoringRunResponse])
def get_topic_monitoring_runs(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    runs = (
        db.query(MonitoringRun)
        .filter(MonitoringRun.topic_id == topic_id)
        .order_by(desc(MonitoringRun.started_at))
        .all()
    )

    results = []
    for r in runs:
        item = MonitoringRunResponse.from_orm(r)
        item.topic_name = topic.name
        results.append(item)
    return results

@router.get("/runs", response_model=List[MonitoringRunResponse])
def get_all_monitoring_runs(limit: int = 20, db: Session = Depends(get_db)):
    runs = (
        db.query(MonitoringRun)
        .order_by(desc(MonitoringRun.started_at))
        .limit(limit)
        .all()
    )
    results = []
    for r in runs:
        item = MonitoringRunResponse.from_orm(r)
        topic = db.query(Topic).filter(Topic.id == r.topic_id).first()
        item.topic_name = topic.name if topic else f"Topic #{r.topic_id}"
        results.append(item)
    return results
