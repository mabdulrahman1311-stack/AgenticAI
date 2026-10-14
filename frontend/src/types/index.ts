export type SignificanceLevel = 
  | 'High Impact' 
  | 'Minor Update' 
  | 'Contradiction Warning' 
  | 'Incremental Progress';

export interface MetricShift {
  metric: string;
  previous: string;
  current: string;
  delta: string;
}

export interface ClusterSibling {
  id: number;
  paper_id: number;
  title: string;
  source_type: string;
  source_url: string;
  authors: string[];
  summary: string;
  reliability_score: number;
  published_date: string;
}

export interface EnrichedPaperItem {
  id: number;
  paper_id: number;
  topic_id: number;
  external_id: string;
  title: string;
  authors: string[];
  abstract: string;
  published_date: string;
  source_url: string;
  source_type: string;
  cluster_id?: string;
  cluster_siblings_count: number;
  cluster_siblings: ClusterSibling[];
  
  // Analysis fields
  summary: string;
  research_question?: string;
  approach?: string;
  key_findings: string[];
  relevance_score: number;
  significance_level: SignificanceLevel;
  confidence_score: number;
  source_reliability_score: number;
  delta_notes?: string;
  has_contradiction: boolean;
  contradiction_target_title?: string;
  contradiction_detail?: string;
  value_metric_shifts: MetricShift[];
  weakly_supported_warning: boolean;
  caution_notes?: string;
  evidence_snippets: string[];
  analyzed_at: string;
}

export interface Topic {
  id: number;
  name: string;
  description?: string;
  keywords: string[];
  schedule_interval_hours: number;
  is_active: boolean;
  last_run_at?: string;
  created_at: string;
  updated_at: string;
  papers_count?: number;
  high_impact_count?: number;
  contradiction_count?: number;
  last_run_status?: string;
}

export interface DiagnosticLog {
  timestamp: string;
  step: string;
  message: string;
  level: 'info' | 'warning' | 'error';
  [key: string]: any;
}

export interface MonitoringRun {
  id: number;
  topic_id: number;
  topic_name?: string;
  started_at: string;
  completed_at?: string;
  status: 'success' | 'partial' | 'failed' | 'running';
  papers_found_count: number;
  new_papers_count: number;
  duplicates_skipped_count: number;
  error_message?: string;
  log_details: DiagnosticLog[];
}

export interface EmergingTheme {
  theme: string;
  frequency: number;
  velocity: string;
  confidence: number;
  description?: string;
}

export interface TrendSnapshot {
  id: number;
  topic_id: number;
  period_label: string;
  emerging_themes: EmergingTheme[];
  summary_narrative: string;
  metrics: {
    total_analyzed?: number;
    high_impact_count?: number;
    contradiction_count?: number;
    avg_confidence?: number;
    timeline_data?: Array<{
      period: string;
      papers: number;
      high_impact: number;
      velocity?: number;
    }>;
  };
  created_at: string;
}

export interface SystemStats {
  active_topics_count: number;
  total_papers_tracked: number;
  pending_significance_alerts: number;
  contradiction_warnings_count: number;
  system_health_status: string;
  scheduler_running: boolean;
  last_heartbeat: string;
  ai_provider: string;
}
