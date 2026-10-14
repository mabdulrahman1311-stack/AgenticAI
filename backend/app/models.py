import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from .database import Base

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    keywords = Column(JSON, nullable=False, default=list)  # list of strings
    schedule_interval_hours = Column(Integer, default=6)
    is_active = Column(Boolean, default=True)
    last_run_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    analyses = relationship("PaperAnalysis", back_populates="topic", cascade="all, delete-orphan")
    runs = relationship("MonitoringRun", back_populates="topic", cascade="all, delete-orphan")
    trends = relationship("TrendSnapshot", back_populates="topic", cascade="all, delete-orphan")

class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(512), nullable=False, index=True)
    authors = Column(JSON, default=list)  # list of author name strings
    abstract = Column(Text, nullable=False)
    published_date = Column(DateTime, nullable=False)
    source_url = Column(String(1024), nullable=False)
    source_type = Column(String(64), default="primary_preprint")  # primary_preprint, secondary_report, conference
    cluster_id = Column(String(128), index=True, nullable=True)  # for multi-source convergence grouping
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    analyses = relationship("PaperAnalysis", back_populates="paper", cascade="all, delete-orphan")

class PaperAnalysis(Base):
    __tablename__ = "paper_analyses"

    id = Column(Integer, primary_key=True, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id", ondelete="CASCADE"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    
    # Core Extraction
    summary = Column(Text, nullable=False)
    research_question = Column(Text, nullable=True)
    approach = Column(Text, nullable=True)
    key_findings = Column(JSON, default=list)  # list of strings
    
    # Ranking & Significance
    relevance_score = Column(Float, default=0.0)  # 0.0 - 1.0
    significance_level = Column(String(64), default="Incremental Progress")  # High Impact, Minor Update, Contradiction Warning, Incremental Progress
    confidence_score = Column(Float, default=0.85)
    source_reliability_score = Column(Float, default=0.9)  # 0.0 - 1.0
    
    # Historical Comparison & Delta
    delta_notes = Column(Text, nullable=True)
    has_contradiction = Column(Boolean, default=False)
    contradiction_target_title = Column(String(512), nullable=True)
    contradiction_detail = Column(Text, nullable=True)
    value_metric_shifts = Column(JSON, default=list)  # e.g. [{"metric": "Context Size", "previous": "32k", "current": "1M", "delta": "+3100%"}]
    
    # Traceability & Quality Safeguards
    weakly_supported_warning = Column(Boolean, default=False)
    caution_notes = Column(Text, nullable=True)
    evidence_snippets = Column(JSON, default=list)  # list of verbatim quote snippets from paper
    
    analyzed_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    paper = relationship("Paper", back_populates="analyses")
    topic = relationship("Topic", back_populates="analyses")

class MonitoringRun(Base):
    __tablename__ = "monitoring_runs"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(32), default="running")  # success, partial, failed, running
    papers_found_count = Column(Integer, default=0)
    new_papers_count = Column(Integer, default=0)
    duplicates_skipped_count = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    log_details = Column(JSON, default=list)  # list of diagnostic events/logs

    # Relationships
    topic = relationship("Topic", back_populates="runs")

class TrendSnapshot(Base):
    __tablename__ = "trend_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    period_label = Column(String(128), nullable=False)
    emerging_themes = Column(JSON, default=list)  # list of dicts with theme, count, velocity
    summary_narrative = Column(Text, nullable=False)
    metrics = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    topic = relationship("Topic", back_populates="trends")
