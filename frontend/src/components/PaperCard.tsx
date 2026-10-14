import React, { useState } from 'react';
import { 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Flame, 
  ShieldCheck, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { EnrichedPaperItem } from '../types';

interface PaperCardProps {
  paper: EnrichedPaperItem;
  onSelect: (paper: EnrichedPaperItem) => void;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper, onSelect }) => {
  const [showClusterAccordion, setShowClusterAccordion] = useState(false);

  // Badge color mapping
  const getSignificanceBadge = () => {
    switch (paper.significance_level) {
      case 'Contradiction Warning':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 badge-glow-amber animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Contradiction Warning</span>
          </span>
        );
      case 'High Impact':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 badge-glow-emerald">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>High Impact Breakthrough</span>
          </span>
        );
      case 'Minor Update':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-800 border border-slate-700 text-slate-400">
            <span>Minor Update</span>
            <span className="text-[10px] text-slate-400">(Suppressed)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
            <TrendingUp className="w-3 h-3 text-cyan-400" />
            <span>Incremental Progress</span>
          </span>
        );
    }
  };

  const formattedDate = new Date(paper.published_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-200">
      
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {getSignificanceBadge()}

          {/* Caution Badge */}
          {paper.weakly_supported_warning && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-medium rounded-full bg-rose-950/60 border border-rose-800 text-rose-300">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Caution: Unverified Claim</span>
            </span>
          )}

          {/* Convergence Count Badge */}
          {paper.cluster_siblings_count > 0 && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>{paper.cluster_siblings_count + 1} Multi-Source Reports</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            {paper.external_id}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Title */}
      <h3 
        onClick={() => onSelect(paper)}
        className="font-display font-bold text-base sm:text-lg text-slate-100 hover:text-cyan-300 cursor-pointer transition-colors leading-snug mb-2"
      >
        {paper.title}
      </h3>

      {/* Authors */}
      <p className="text-xs text-slate-400 mb-3 font-sans">
        {paper.authors.slice(0, 4).join(', ')}{paper.authors.length > 4 ? ' et al.' : ''}
      </p>

      {/* Metric Shift Chips */}
      {paper.value_metric_shifts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {paper.value_metric_shifts.map((m, idx) => (
            <div key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs">
              <span className="text-slate-300 font-medium">{m.metric}:</span>
              <span className="text-emerald-400 font-bold font-mono">{m.delta}</span>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
        {paper.summary}
      </p>

      {/* Key Findings Bullet Excerpts */}
      {paper.key_findings.length > 0 && (
        <div className="mb-4 space-y-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
          {paper.key_findings.slice(0, 2).map((finding, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{finding}</span>
            </div>
          ))}
        </div>
      )}

      {/* Multi-Article Convergence Accordion */}
      {paper.cluster_siblings_count > 0 && (
        <div className="mb-4 rounded-xl border border-indigo-900/40 bg-indigo-950/20 overflow-hidden">
          <button
            onClick={() => setShowClusterAccordion(!showClusterAccordion)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-indigo-300 hover:bg-indigo-900/20 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>
                Multi-Article Convergence ({paper.cluster_siblings_count} Convergent Secondary Source{paper.cluster_siblings_count > 1 ? 's' : ''})
              </span>
            </div>
            {showClusterAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showClusterAccordion && (
            <div className="p-3 pt-0 space-y-2 border-t border-indigo-900/30">
              {paper.cluster_siblings.map((sib, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-200 truncate">{sib.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono bg-indigo-950 border border-indigo-800 text-indigo-300">
                      {sib.source_type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                    {sib.summary}
                  </p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">
                      Reliability: {(sib.reliability_score * 100).toFixed(0)}%
                    </span>
                    <a 
                      href={sib.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                    >
                      <span>Read Report</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Card Actions Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Source Reliability: {(paper.source_reliability_score * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={paper.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors"
            title="Open original arXiv / repository page"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => onSelect(paper)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Traceable Evidence</span>
          </button>
        </div>
      </div>

    </div>
  );
};
