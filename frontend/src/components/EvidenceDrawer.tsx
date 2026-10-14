import React, { useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Quote, 
  CheckCircle2, 
  GitCommit, 
  Calendar, 
  Users, 
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { EnrichedPaperItem } from '../types';

interface EvidenceDrawerProps {
  paper: EnrichedPaperItem | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ paper, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!paper) return null;

  // Format date
  const formattedDate = new Date(paper.published_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-2xl w-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10 transition-transform">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                paper.significance_level === 'Contradiction Warning'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : paper.significance_level === 'High Impact'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                {paper.significance_level}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {paper.external_id}
              </span>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-slate-100 leading-snug tracking-tight font-display">
            {paper.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>{paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ' et al.' : ''}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formattedDate}</span>
            </div>
            <a 
              href={paper.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium ml-auto"
            >
              <span>Original Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Source Reliability Assessment */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                  Source Reliability & Confidence
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {(paper.source_reliability_score * 100).toFixed(0)}% Reliability
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Repository Type</span>
                <span className="text-slate-200 font-medium capitalize">
                  {paper.source_type.replace('_', ' ')}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">AI Extraction Confidence</span>
                <span className="text-emerald-400 font-medium">
                  {(paper.confidence_score * 100).toFixed(0)}% Verified
                </span>
              </div>
            </div>

            {/* Caution Warning if weakly supported */}
            {paper.weakly_supported_warning && (
              <div className="mt-3 p-3 rounded-lg bg-rose-950/20 border border-rose-800/40 text-xs text-rose-300 flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-rose-200 mb-0.5">
                    Caution: Weakly Supported Claims
                  </span>
                  <p className="text-[11px] text-rose-300/90 leading-relaxed">
                    {paper.caution_notes || "Source contains sensational assertions lacking empirical benchmarks, error bounds, or formal evaluation baselines."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Core Findings & Approach */}
          <div className="space-y-4">
            {paper.research_question && (
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-1">
                  Primary Research Question
                </h4>
                <p className="text-sm text-slate-200 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  {paper.research_question}
                </p>
              </div>
            )}

            {paper.approach && (
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-1">
                  Proposed Approach & Architecture
                </h4>
                <p className="text-sm text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                  {paper.approach}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                Key Empirical Findings
              </h4>
              <ul className="space-y-2">
                {paper.key_findings.map((f, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Historical Delta & Contradiction Details */}
          {(paper.has_contradiction || paper.delta_notes || paper.value_metric_shifts.length > 0) && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <h4 className="text-xs font-mono uppercase text-cyan-400 font-semibold mb-2 flex items-center space-x-1.5">
                <GitCommit className="w-4 h-4" />
                <span>Historical Delta Analysis</span>
              </h4>

              {paper.has_contradiction && (
                <div className="mb-3 p-3 rounded-lg bg-amber-950/30 border border-amber-800/50 text-xs">
                  <span className="font-bold text-amber-300 block mb-1">
                    Contradiction Warning Details:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
                    {paper.contradiction_detail}
                  </p>
                  {paper.contradiction_target_title && (
                    <div className="text-[10px] font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                      <span className="text-amber-400">Target Paper:</span> {paper.contradiction_target_title}
                    </div>
                  )}
                </div>
              )}

              {paper.value_metric_shifts.length > 0 && (
                <div className="mb-3 space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                    Metric Deltas vs Baseline:
                  </span>
                  {paper.value_metric_shifts.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-300 font-medium">{m.metric}</span>
                        <div className="text-[10px] font-mono text-slate-500">
                          {m.previous} &rarr; <span className="text-slate-300">{m.current}</span>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold text-xs bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {m.delta}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {paper.delta_notes && (
                <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
                  {paper.delta_notes}
                </p>
              )}
            </div>
          )}

          {/* Traceable Evidence Quotes */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center space-x-1.5">
              <Quote className="w-4 h-4 text-cyan-400" />
              <span>Traceable Source Evidence Snippets</span>
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Verbatim excerpts extracted directly from the publication's primary text to guarantee zero hallucination:
            </p>

            <div className="space-y-2.5">
              {paper.evidence_snippets.map((snip, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950/60 border-l-2 border-cyan-500 border-r border-t border-b border-slate-800/60 text-xs text-slate-300 italic font-sans leading-relaxed"
                >
                  "{snip}"
                </div>
              ))}
            </div>
          </div>

          {/* Full Abstract */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Original Publication Abstract</span>
            </h4>
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-56 overflow-y-auto">
              {paper.abstract}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
