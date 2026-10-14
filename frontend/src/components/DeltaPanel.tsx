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
    <div className="mb-8 rounded-2xl border border-cyan-900/40 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/20 p-5 backdrop-blur-xl shadow-lg relative overflow-hidden">
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display font-bold text-base text-slate-100 tracking-tight">
                The "What's New" Delta Matrix
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                HISTORICAL COMPARISON
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active change detection comparing new publications against tracked history in {topicName}
            </p>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center space-x-2 text-xs">
          {contradictions.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{contradictions.length} Contradiction Detected</span>
            </span>
          )}
          {allMetricShifts.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{allMetricShifts.length} Value/Metric Shifts</span>
            </span>
          )}
          {minorUpdates.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 font-medium flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>{minorUpdates.length} Minor Updates Filtered</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        
        {/* Metric Shifts Card */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Quantified Metric Shifts</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Benchmark Delta</span>
            </div>

            {allMetricShifts.length > 0 ? (
              <div className="space-y-2.5 mt-2">
                {allMetricShifts.slice(0, 2).map((shift, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                    <div className="font-semibold text-slate-200 mb-1 flex items-center justify-between">
                      <span>{shift.metric}</span>
                      <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                        {shift.delta}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                      <span className="line-through text-slate-500">{shift.previous}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                      <span className="text-slate-100 font-bold">{shift.current}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-2">No metric shifts recorded yet in recent runs.</p>
            )}
          </div>
        </div>

        {/* Contradiction & Consensus Shift */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-amber-400 uppercase tracking-wider flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Contradiction Warnings</span>
              </span>
              <span className="text-[10px] text-amber-300/80 font-mono">Consensus Shift</span>
            </div>

            {contradictions.length > 0 ? (
              <div className="mt-2 space-y-2">
                {contradictions.slice(0, 1).map((c, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs">
                    <p className="text-amber-200 font-semibold mb-1">
                      Direct Challenge to Established Baseline
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                      {c.contradiction_detail || "New empirical results refute conclusions published in earlier tracked papers."}
                    </p>
                    {c.contradiction_target_title && (
                      <div className="text-[10px] font-mono text-slate-400 bg-slate-900/90 p-1.5 rounded border border-slate-800">
                        <span className="text-amber-400 font-medium">Refuting:</span> {c.contradiction_target_title}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero scientific contradictions detected. Latest research aligns with consensus.</span>
              </div>
            )}
          </div>
        </div>

        {/* Alert Fatigue Prevention Status */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Alert Fatigue Filter</span>
              </span>
              <span className="text-[10px] text-indigo-300/80 font-mono">Noise Reduction</span>
            </div>

            <div className="mt-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Minor Updates Suppressed:</span>
                <span className="font-mono font-bold text-slate-100">{minorUpdates.length}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>High-Impact Breakthroughs:</span>
                <span className="font-mono font-bold text-emerald-400">{highImpact.length}</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 leading-relaxed">
                Agent automatically isolates routine parameter runs and prompt tweaks, ensuring only actionable developments generate alerts.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
