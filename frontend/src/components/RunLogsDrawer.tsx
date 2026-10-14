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
  Filter, 
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { MonitoringRun, DiagnosticLog } from '../types';

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
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Success</span>
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
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
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Running</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-3xl w-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">
                Agent Execution Diagnostics & Run Logs
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Real-time job execution traces, deduplication metrics, and partial failure recovery
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh logs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Runs List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans">
          {runs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
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
                  className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden"
                >
                  {/* Run Summary Bar */}
                  <div 
                    onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(run.status)}
                      <div>
                        <span className="font-semibold text-sm text-slate-200">
                          {run.topic_name || `Topic #${run.topic_id}`}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
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
                      <div className="hidden sm:flex items-center space-x-3 text-xs font-mono text-slate-300">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          Found: <strong className="text-cyan-400">{run.papers_found_count}</strong>
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          New: <strong className="text-emerald-400">{run.new_papers_count}</strong>
                        </span>
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          Deduped: <strong className="text-indigo-400">{run.duplicates_skipped_count}</strong>
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Partial Error Banner if present */}
                  {run.error_message && (
                    <div className="px-4 py-2 bg-amber-950/30 border-t border-b border-amber-800/40 text-xs text-amber-300 flex items-center space-x-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{run.error_message}</span>
                    </div>
                  )}

                  {/* Expanded Diagnostic Log Steps */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Agent Execution Trace</span>
                        <span>{run.log_details?.length || 0} Log Events</span>
                      </div>

                      {run.log_details && run.log_details.length > 0 ? (
                        <div className="font-mono text-[11px] space-y-1.5 bg-slate-900/90 p-3 rounded-lg border border-slate-800 max-h-72 overflow-y-auto">
                          {run.log_details.map((log, idx) => (
                            <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                              <span className="text-slate-500 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold whitespace-nowrap ${
                                log.level === 'error'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : log.level === 'warning'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              }`}>
                                {log.step}
                              </span>
                              <span className={log.level === 'error' ? 'text-rose-300' : log.level === 'warning' ? 'text-amber-200' : 'text-slate-300'}>
                                {log.message}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 font-mono">No detailed steps recorded.</p>
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
