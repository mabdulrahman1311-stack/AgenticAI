import React from 'react';
import { 
  GitCompare, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Filter
} from 'lucide-react';
import { EnrichedPaperItem } from '../types';

interface DeltaPanelProps {
  papers: EnrichedPaperItem[];
  topicName: string;
}

export const DeltaPanel: React.FC<DeltaPanelProps> = ({ papers, topicName }) => {
  // Extract all metric shifts
  const allMetricShifts = papers.flatMap(p => 
    p.value_metric_shifts.map(m => ({ ...m, paperTitle: p.title }))
  );

  // Extract contradiction warnings
  const contradictions = papers.filter(p => p.has_contradiction);

  // Extract suppressed minor updates
  const minorUpdates = papers.filter(p => p.significance_level === 'Minor Update');

  // Extract latest high impact breakthrough
  const highImpact = papers.filter(p => p.significance_level === 'High Impact');

  return (
    <div className="mb-8 rounded-2xl border border-dark-border bg-gradient-to-br from-dark-card via-dark-surface to-dark-card p-5 shadow-card relative overflow-hidden font-sans">
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-primary-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-dark-borderSubtle">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-primary-cyan/15 border border-primary-cyan/30 text-primary-cyan">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display font-bold text-base text-text-primary tracking-tight">
                The "What's New" Delta Matrix
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-primary-cyan/15 text-primary-cyan border border-primary-cyan/30">
                HISTORICAL COMPARISON
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Active change detection comparing new publications against tracked history in {topicName}
            </p>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center space-x-2 text-xs">
          {contradictions.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-accent-warning/15 border border-accent-warning/30 text-accent-warning font-semibold flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-accent-warning" />
              <span>{contradictions.length} Contradiction Detected</span>
            </span>
          )}
          {allMetricShifts.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-accent-success/15 border border-accent-success/30 text-accent-success font-medium flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-accent-success" />
              <span>{allMetricShifts.length} Value/Metric Shifts</span>
            </span>
          )}
          {minorUpdates.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-dark-surface border border-dark-border text-text-muted font-medium flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-text-muted" />
              <span>{minorUpdates.length} Minor Updates Filtered</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        
        {/* Metric Shifts Card */}
        <div className="p-4 rounded-xl bg-dark-bg/80 border border-dark-borderSubtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-primary-cyan uppercase tracking-wider flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Quantified Metric Shifts</span>
              </span>
              <span className="text-[10px] text-text-muted font-mono">Benchmark Delta</span>
            </div>

            {allMetricShifts.length > 0 ? (
              <div className="space-y-2.5 mt-2">
                {allMetricShifts.slice(0, 2).map((shift, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-dark-surface border border-dark-borderSubtle text-xs">
                    <div className="font-semibold text-text-primary mb-1 flex items-center justify-between">
                      <span>{shift.metric}</span>
                      <span className="text-accent-success font-mono font-bold text-[11px] bg-accent-success/10 px-1.5 py-0.5 rounded border border-accent-success/30">
                        {shift.delta}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-text-muted">
                      <span className="line-through text-text-muted">{shift.previous}</span>
                      <ArrowRight className="w-3 h-3 text-primary-cyan" />
                      <span className="text-text-primary font-bold">{shift.current}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted mt-2">No metric shifts recorded yet in recent runs.</p>
            )}
          </div>
        </div>

        {/* Contradiction & Consensus Shift */}
        <div className="p-4 rounded-xl bg-dark-bg/80 border border-dark-borderSubtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-accent-warning uppercase tracking-wider flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Contradiction Warnings</span>
              </span>
              <span className="text-[10px] text-accent-warning/80 font-mono">Consensus Shift</span>
            </div>

            {contradictions.length > 0 ? (
              <div className="mt-2 space-y-2">
                {contradictions.slice(0, 1).map((c, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-accent-warning/10 border border-accent-warning/30 text-xs">
                    <p className="text-accent-warning font-semibold mb-1">
                      Direct Challenge to Established Baseline
                    </p>
                    <p className="text-[11px] text-text-secondary leading-relaxed mb-2">
                      {c.contradiction_detail || "New empirical results refute conclusions published in earlier tracked papers."}
                    </p>
                    {c.contradiction_target_title && (
                      <div className="text-[10px] font-mono text-text-muted bg-dark-surface p-1.5 rounded border border-dark-borderSubtle">
                        <span className="text-accent-warning font-medium">Refuting:</span> {c.contradiction_target_title}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 p-3 rounded-lg bg-dark-surface border border-dark-borderSubtle text-xs text-text-muted flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-accent-success" />
                <span>Zero scientific contradictions detected. Latest research aligns with consensus.</span>
              </div>
            )}
          </div>
        </div>

        {/* Alert Fatigue Prevention Status */}
        <div className="p-4 rounded-xl bg-dark-bg/80 border border-dark-borderSubtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-primary-violet uppercase tracking-wider flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Alert Fatigue Filter</span>
              </span>
              <span className="text-[10px] text-primary-violet/80 font-mono">Noise Reduction</span>
            </div>

            <div className="mt-2 p-2.5 rounded-lg bg-dark-surface border border-dark-borderSubtle text-xs space-y-2">
              <div className="flex items-center justify-between text-text-secondary">
                <span>Minor Updates Suppressed:</span>
                <span className="font-mono font-bold text-text-primary">{minorUpdates.length}</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>High-Impact Breakthroughs:</span>
                <span className="font-mono font-bold text-accent-success">{highImpact.length}</span>
              </div>
              <p className="text-[11px] text-text-muted pt-1 border-t border-dark-borderSubtle leading-relaxed">
                Agent automatically isolates routine parameter runs and prompt tweaks, ensuring only actionable developments generate alerts.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
