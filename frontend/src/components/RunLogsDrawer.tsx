import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw
} from 'lucide-react';
import { MonitoringRun } from '../types';

interface RunLogsDrawerProps {
  runs: MonitoringRun[];
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const RunLogsDrawer: React.FC<RunLogsDrawerProps> = ({
  runs,
  isOpen,
  onClose,
  onRefresh,
  isLoading
}) => {
  const [expandedRunId, setExpandedRunId] = useState<number | null>(null);

  useEffect(() => {
    if (runs.length > 0 && expandedRunId === null) {
      setExpandedRunId(runs[0].id);
    }
  }, [runs, expandedRunId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-success/15 border border-accent-success/40 text-accent-success">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-success" />
            <span>Success</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-warning/15 border border-accent-warning/40 text-accent-warning">
            <AlertTriangle className="w-3.5 h-3.5 text-accent-warning" />
            <span>Partial Recovery</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 border border-rose-500/40 text-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-cyan/15 border border-primary-cyan/40 text-primary-cyan animate-pulse">
            <Clock className="w-3.5 h-3.5 text-primary-cyan" />
            <span>Running</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-3xl w-full bg-dark-sidebar border-l border-dark-border shadow-2xl flex flex-col z-10">
        
        {/* Header */}
        <div className="p-5 border-b border-dark-borderSubtle bg-dark-header/90 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-primary-cyan/15 border border-primary-cyan/30 text-primary-cyan">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-text-primary">
                Agent Execution Diagnostics & Run Logs
              </h3>
              <p className="text-xs text-text-muted font-sans">
                Real-time job execution traces, deduplication metrics, and partial failure recovery
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 text-text-muted hover:text-primary-cyan hover:bg-dark-surface rounded-lg transition-colors"
              title="Refresh logs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-surface rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Runs List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans">
          {runs.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted">
              No monitoring runs recorded yet.
            </div>
          ) : (
            runs.map(run => {
              const isExpanded = expandedRunId === run.id;
              const startedDate = new Date(run.started_at).toLocaleString();
              const durationMs = run.completed_at 
                ? new Date(run.completed_at).getTime() - new Date(run.started_at).getTime() 
                : null;

              return (
                <div 
                  key={run.id}
                  className="rounded-xl border border-dark-border bg-dark-card overflow-hidden"
                >
                  {/* Run Summary Bar */}
                  <div 
                    onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-dark-surface transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(run.status)}
                      <div>
                        <span className="font-semibold text-sm text-text-primary">
                          {run.topic_name || `Topic #${run.topic_id}`}
                        </span>
                        <div className="text-[11px] text-text-muted font-mono flex items-center space-x-2 mt-0.5">
                          <span>{startedDate}</span>
                          {durationMs !== null && (
                            <>
                              <span>&bull;</span>
                              <span>{(durationMs / 1000).toFixed(1)}s execution</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="hidden sm:flex items-center space-x-3 text-xs font-mono text-text-secondary">
                        <span className="bg-dark-bg px-2 py-0.5 rounded border border-dark-borderSubtle">
                          Found: <strong className="text-primary-cyan">{run.papers_found_count}</strong>
                        </span>
                        <span className="bg-dark-bg px-2 py-0.5 rounded border border-dark-borderSubtle">
                          New: <strong className="text-accent-success">{run.new_papers_count}</strong>
                        </span>
                        <span className="bg-dark-bg px-2 py-0.5 rounded border border-dark-borderSubtle">
                          Deduped: <strong className="text-primary-violet">{run.duplicates_skipped_count}</strong>
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                    </div>
                  </div>

                  {/* Partial Error Banner if present */}
                  {run.error_message && (
                    <div className="px-4 py-2 bg-accent-warning/10 border-t border-b border-accent-warning/30 text-xs text-accent-warning flex items-center space-x-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-accent-warning flex-shrink-0" />
                      <span>{run.error_message}</span>
                    </div>
                  )}

                  {/* Expanded Diagnostic Log Steps */}
                  {isExpanded && (
                    <div className="p-4 bg-dark-bg border-t border-dark-borderSubtle space-y-2">
                      <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Agent Execution Trace</span>
                        <span>{run.log_details?.length || 0} Log Events</span>
                      </div>

                      {run.log_details && run.log_details.length > 0 ? (
                        <div className="font-mono text-[11px] space-y-1.5 bg-dark-surface p-3 rounded-lg border border-dark-borderSubtle max-h-72 overflow-y-auto">
                          {run.log_details.map((log, idx) => (
                            <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                              <span className="text-text-muted whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold whitespace-nowrap ${
                                log.level === 'error'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : log.level === 'warning'
                                  ? 'bg-accent-warning/20 text-accent-warning border border-accent-warning/40'
                                  : 'bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/40'
                              }`}>
                                {log.step}
                              </span>
                              <span className={log.level === 'error' ? 'text-rose-300' : log.level === 'warning' ? 'text-accent-warning' : 'text-text-secondary'}>
                                {log.message}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-text-muted font-mono">No detailed steps recorded.</p>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
