from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models import Topic, TrendSnapshot
from ..schemas import TrendSnapshotResponse
from ..agent.trend_analyzer import TrendAnalyzer

router = APIRouter(prefix="/api", tags=["Trend Matrix & Analytics"])

@router.get("/topics/{topic_id}/trends", response_model=List[TrendSnapshotResponse])
def get_topic_trends(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    snapshots = (
        db.query(TrendSnapshot)
        .filter(TrendSnapshot.topic_id == topic_id)
        .order_by(desc(TrendSnapshot.created_at))
        .all()
    )

    if not snapshots:
        # Generate initial snapshot on-demand if none exists yet
        analyzer = TrendAnalyzer(db)
        snapshot = analyzer.generate_snapshot_for_topic(topic)
        snapshots = [snapshot]

    return snapshots

@router.post("/topics/{topic_id}/trends/regenerate", response_model=TrendSnapshotResponse)
def regenerate_topic_trends(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    analyzer = TrendAnalyzer(db)
    snapshot = analyzer.generate_snapshot_for_topic(topic)
    return snapshot
