import React, { useState } from 'react';
import { 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Flame, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
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
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-accent-warning/15 border border-accent-warning/40 text-accent-warning shadow-glow-amber animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-accent-warning" />
            <span>Contradiction Warning</span>
          </span>
        );
      case 'High Impact':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-accent-success/15 border border-accent-success/40 text-accent-success shadow-glow-cyan">
            <Flame className="w-3.5 h-3.5 text-accent-success" />
            <span>High Impact Breakthrough</span>
          </span>
        );
      case 'Minor Update':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-full bg-dark-surface border border-dark-border text-text-muted">
            <span>Minor Update</span>
            <span className="text-[10px] text-text-muted">(Suppressed)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-full bg-primary-cyan/15 border border-primary-cyan/40 text-primary-cyan">
            <TrendingUp className="w-3 h-3 text-primary-cyan" />
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
    <div className="pulse-card p-5 relative overflow-hidden font-sans">
      
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {getSignificanceBadge()}

          {/* Caution Badge */}
          {paper.weakly_supported_warning && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-medium rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Caution: Unverified Claim</span>
            </span>
          )}

          {/* Convergence Count Badge */}
          {paper.cluster_siblings_count > 0 && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-primary-violet/15 border border-primary-violet/40 text-primary-violet">
              <Layers className="w-3 h-3 text-primary-violet" />
              <span>{paper.cluster_siblings_count + 1} Multi-Source Reports</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-text-muted">
          <span className="bg-dark-bg px-2 py-0.5 rounded border border-dark-border">
            {paper.external_id}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Title */}
      <h3 
        onClick={() => onSelect(paper)}
        className="font-display font-bold text-base sm:text-lg text-text-primary hover:text-primary-cyan cursor-pointer transition-colors leading-snug mb-2"
      >
        {paper.title}
      </h3>

      {/* Authors */}
      <p className="text-xs text-text-muted mb-3 font-sans">
        {paper.authors.slice(0, 4).join(', ')}{paper.authors.length > 4 ? ' et al.' : ''}
      </p>

      {/* Metric Shift Chips */}
      {paper.value_metric_shifts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {paper.value_metric_shifts.map((m, idx) => (
            <div key={idx} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-accent-success/10 border border-accent-success/30 text-xs">
              <span className="text-text-secondary font-medium">{m.metric}:</span>
              <span className="text-accent-success font-bold font-mono">{m.delta}</span>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-3">
        {paper.summary}
      </p>

      {/* Key Findings Bullet Excerpts */}
      {paper.key_findings.length > 0 && (
        <div className="mb-4 space-y-1.5 bg-dark-bg/60 p-3 rounded-xl border border-dark-borderSubtle">
          {paper.key_findings.slice(0, 2).map((finding, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-text-secondary">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-cyan flex-shrink-0 mt-0.5" />
              <span>{finding}</span>
            </div>
          ))}
        </div>
      )}

      {/* Multi-Article Convergence Accordion */}
      {paper.cluster_siblings_count > 0 && (
        <div className="mb-4 rounded-xl border border-primary-violet/30 bg-primary-violet/5 overflow-hidden">
          <button
            onClick={() => setShowClusterAccordion(!showClusterAccordion)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-primary-violet hover:bg-primary-violet/10 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-primary-violet" />
              <span>
                Multi-Article Convergence ({paper.cluster_siblings_count} Convergent Secondary Source{paper.cluster_siblings_count > 1 ? 's' : ''})
              </span>
            </div>
            {showClusterAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showClusterAccordion && (
            <div className="p-3 pt-0 space-y-2 border-t border-primary-violet/20">
              {paper.cluster_siblings.map((sib, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-dark-bg border border-dark-borderSubtle text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-text-primary truncate">{sib.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono bg-dark-surface border border-dark-border text-primary-violet">
                      {sib.source_type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mb-2 leading-relaxed">
                    {sib.summary}
                  </p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-muted font-mono">
                      Reliability: {(sib.reliability_score * 100).toFixed(0)}%
                    </span>
                    <a 
                      href={sib.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-cyan hover:text-primary-blue flex items-center space-x-1"
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
      <div className="flex items-center justify-between pt-3 border-t border-dark-borderSubtle">
        <div className="flex items-center space-x-2 text-xs text-text-muted font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-cyan" />
          <span>Source Reliability: {(paper.source_reliability_score * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={paper.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-text-muted hover:text-primary-cyan hover:bg-dark-surface rounded-lg transition-colors"
            title="Open original arXiv / repository page"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => onSelect(paper)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-blue/15 hover:bg-primary-blue/25 text-primary-cyan border border-primary-blue/30 transition-all"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Traceable Evidence</span>
          </button>
        </div>
      </div>

    </div>
  );
};
