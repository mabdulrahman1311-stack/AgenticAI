import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import engine, Base, SessionLocal
from .models import Topic
from .routers import topics, papers, runs, trends, system
from .scheduler.jobs import start_scheduler, stop_scheduler, schedule_topic
from .seed.scenarios_seed import seed_hackathon_scenarios

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("researchpulse")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    # Seed initial test data if empty
    db = SessionLocal()
    try:
        topic_count = db.query(Topic).count()
        if topic_count == 0:
            logger.info("Database is empty; automatically seeding DejaVu Hackathon evaluation scenarios...")
            seed_hackathon_scenarios(db)

        # Register existing active topics with scheduler
        active_topics = db.query(Topic).filter(Topic.is_active == True).all()
        for t in active_topics:
            schedule_topic(t)
    finally:
        db.close()

    # Start background scheduler
    start_scheduler()
    logger.info("ResearchPulse Agentic Backend initialized successfully.")

    yield

    # Shutdown
    logger.info("Shutting down ResearchPulse Agentic Backend...")
    stop_scheduler()

app = FastAPI(
    title="ResearchPulse API",
    version="1.0.0",
    description="Autonomous Research-Monitoring Agent: Change Detection, Multi-Source Deduplication, and Significance Ranking.",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(topics.router)
app.include_router(papers.router)
app.include_router(runs.router)
app.include_router(trends.router)
app.include_router(system.router)

@app.get("/")
def root():
    return {
        "name": "ResearchPulse API",
        "status": "online",
        "docs_url": "/docs",
        "description": "Autonomous Research-Monitoring Agent with Meaningful Change Detection and Traceable Summaries"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
