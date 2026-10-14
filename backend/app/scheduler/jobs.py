import logging
import asyncio
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Topic
from ..agent.pipeline import MonitoringPipeline

logger = logging.getLogger("scheduler")

scheduler = BackgroundScheduler()

def run_topic_job(topic_id: int):
    """Executes a monitoring run for a given topic in a scheduled job."""
    db: Session = SessionLocal()
    try:
        topic = db.query(Topic).filter(Topic.id == topic_id, Topic.is_active == True).first()
        if not topic:
            logger.info(f"Topic {topic_id} not found or inactive. Skipping scheduled run.")
            return

        logger.info(f"Starting scheduled monitoring run for topic {topic_id} ({topic.name})")
        pipeline = MonitoringPipeline(db)
        # Run async pipeline in sync thread
        asyncio.run(pipeline.run_for_topic(topic))
    except Exception as e:
        logger.error(f"Error in scheduled job for topic {topic_id}: {e}", exc_info=True)
    finally:
        db.close()

def schedule_topic(topic: Topic):
    """Registers or updates a recurring scheduled job for a topic."""
    job_id = f"topic_job_{topic.id}"
    hours = max(1, topic.schedule_interval_hours)
    
    if scheduler.get_job(job_id):
        scheduler.remove_job(job_id)

    if topic.is_active:
        scheduler.add_job(
            run_topic_job,
            trigger=IntervalTrigger(hours=hours),
            args=[topic.id],
            id=job_id,
            name=f"Monitor: {topic.name}",
            replace_existing=True
        )
        logger.info(f"Scheduled monitoring for topic {topic.id} every {hours} hours.")

def remove_topic_schedule(topic_id: int):
    job_id = f"topic_job_{topic_id}"
    if scheduler.get_job(job_id):
        scheduler.remove_job(job_id)
        logger.info(f"Removed schedule for topic {topic_id}.")

def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        logger.info("APScheduler background scheduler started.")

def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("APScheduler stopped.")
