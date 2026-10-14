import datetime
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

# --- Topic Schemas ---
class TopicBase(BaseModel):
    name: str = Field(..., example="Autonomous Agentic Reasoning & Tool-Use")
    description: Optional[str] = Field(None, example="Tracking long-horizon agent planning, tool-calling benchmarks, and self-correction.")
    keywords: List[str] = Field(default_factory=list, example=["agentic workflows", "tool use", "reasoning models", "multi-agent"])
    schedule_interval_hours: int = Field(default=6, ge=1, le=168)
    is_active: bool = True

class TopicCreate(TopicBase):
    pass

class TopicUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[List[str]] = None
    schedule_interval_hours: Optional[int] = None
    is_active: Optional[bool] = None

class TopicResponse(TopicBase):
    id: int
    last_run_at: Optional[datetime.datetime] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime
    papers_count: Optional[int] = 0
    high_impact_count: Optional[int] = 0
    contradiction_count: Optional[int] = 0
    last_run_status: Optional[str] = None

    class Config:
        from_attributes = True

# --- Paper & Analysis Schemas ---
class MetricShift(BaseModel):
    metric: str
    previous: str
    current: str
    delta: str

class PaperBase(BaseModel):
    external_id: str
    title: str
    authors: List[str]
    abstract: str
    published_date: datetime.datetime
    source_url: str
    source_type: str = "primary_preprint"
    cluster_id: Optional[str] = None

class PaperAnalysisBase(BaseModel):
    summary: str
    research_question: Optional[str] = None
    approach: Optional[str] = None
    key_findings: List[str] = Field(default_factory=list)
    relevance_score: float = 0.0
    significance_level: str = "Incremental Progress"
    confidence_score: float = 0.85
    source_reliability_score: float = 0.90
    delta_notes: Optional[str] = None
    has_contradiction: bool = False
    contradiction_target_title: Optional[str] = None
    contradiction_detail: Optional[str] = None
    value_metric_shifts: List[Dict[str, Any]] = Field(default_factory=list)
    weakly_supported_warning: bool = False
    caution_notes: Optional[str] = None
    evidence_snippets: List[str] = Field(default_factory=list)

class EnrichedPaperItem(BaseModel):
    id: int
    paper_id: int
    topic_id: int
    external_id: str
    title: str
    authors: List[str]
    abstract: str
    published_date: datetime.datetime
    source_url: str
    source_type: str
    cluster_id: Optional[str] = None
    cluster_siblings_count: int = 0
    cluster_siblings: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Analysis fields
    summary: str
    research_question: Optional[str] = None
    approach: Optional[str] = None
    key_findings: List[str] = Field(default_factory=list)
    relevance_score: float = 0.0
    significance_level: str
    confidence_score: float = 0.85
    source_reliability_score: float = 0.90
    delta_notes: Optional[str] = None
    has_contradiction: bool = False
    contradiction_target_title: Optional[str] = None
    contradiction_detail: Optional[str] = None
    value_metric_shifts: List[Dict[str, Any]] = Field(default_factory=list)
    weakly_supported_warning: bool = False
    caution_notes: Optional[str] = None
    evidence_snippets: List[str] = Field(default_factory=list)
    analyzed_at: datetime.datetime

# --- Monitoring Run Schemas ---
class MonitoringRunResponse(BaseModel):
    id: int
    topic_id: int
    topic_name: Optional[str] = None
    started_at: datetime.datetime
    completed_at: Optional[datetime.datetime] = None
    status: str
    papers_found_count: int
    new_papers_count: int
    duplicates_skipped_count: int
    error_message: Optional[str] = None
    log_details: List[Dict[str, Any]] = Field(default_factory=list)

    class Config:
        from_attributes = True

# --- Trend Schemas ---
class EmergingTheme(BaseModel):
    theme: str
    frequency: int
    velocity: str
    confidence: float
    description: Optional[str] = None

class TrendSnapshotResponse(BaseModel):
    id: int
    topic_id: int
    period_label: str
    emerging_themes: List[Dict[str, Any]] = Field(default_factory=list)
    summary_narrative: str
    metrics: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- System & Trigger Schemas ---
class TriggerRunResponse(BaseModel):
    message: str
    run_id: int
    topic_id: int
    status: str
    new_papers_count: int
    duplicates_skipped_count: int

class SystemStatsResponse(BaseModel):
    active_topics_count: int
    total_papers_tracked: int
    pending_significance_alerts: int
    contradiction_warnings_count: int
    system_health_status: str
    scheduler_running: bool
    last_heartbeat: datetime.datetime
    ai_provider: str
