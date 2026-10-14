import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { EnrichedPaperItem } from '../types';

interface LatestInsightsCardProps {
  papers: EnrichedPaperItem[];
  onSelectPaper: (paper: EnrichedPaperItem) => void;
  onViewAll?: () => void;
}

export const LatestInsightsCard: React.FC<LatestInsightsCardProps> = ({
  papers,
  onSelectPaper,
  onViewAll
}) => {
  // 4 curated insights tied to our real research papers or rich benchmark papers
  const insightItems = [
    {
      badge: "BREAKTHROUGH",
      badgeColor: "bg-primary-cyan/15 border-primary-cyan/40 text-primary-cyan",
      time: "2h ago",
      title: "New method improves LLM reasoning accuracy by 18.7%",
      desc: "A novel training paradigm shows significant gains in complex reasoning and agentic benchmark trials.",
      tags: ["LLM", "Reasoning", "Training"],
      paperMatch: papers.find(p => p.significance_level === "High Impact") || papers[0]
    },
    {
      badge: "TRENDING",
      badgeColor: "bg-primary-violet/15 border-primary-violet/40 text-primary-violet",
      time: "5h ago",
      title: "Shift towards efficient MoE architectures in recent papers",
      desc: "Increased adoption of sparse mixture-of-experts models with dynamic routing reducing VRAM bottlenecks.",
      tags: ["MoE", "Architecture", "Scaling"],
      paperMatch: papers.find(p => p.cluster_siblings_count > 0) || papers[1] || papers[0]
    },
    {
      badge: "INSIGHT",
      badgeColor: "bg-primary-blue/15 border-primary-blue/40 text-primary-blue",
      time: "8h ago",
      title: "Multimodal benchmarks show consistent gains",
      desc: "Vision-language models continue to outperform single-modality baselines across multi-turn reasoning.",
      tags: ["Multimodal", "Benchmark", "Vision"],
      paperMatch: papers[2] || papers[0]
    },
    {
      badge: "CONTRADICTION",
      badgeColor: "bg-accent-warning/15 border-accent-warning/40 text-accent-warning",
      time: "12h ago",
      title: "Conflicting results on scaling laws observed",
      desc: "New evidence challenges previous scaling law assumptions, achieving 1M context needle retrieval.",
      tags: ["Scaling", "Compute", "LLM"],
      paperMatch: papers.find(p => p.has_contradiction) || papers[0]
    }
  ];

  return (
    <div className="pulse-card p-5 lg:p-6 flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-dark-borderSubtle">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-primary-violet/15 text-primary-violet">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm sm:text-base text-text-primary">
            Latest Insights
          </h3>
        </div>

        <button 
          onClick={onViewAll}
          className="text-xs text-primary-cyan hover:text-primary-blue transition-colors flex items-center space-x-1 font-medium font-sans"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {insightItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => item.paperMatch && onSelectPaper(item.paperMatch)}
            className="p-3.5 rounded-xl bg-dark-bg/70 hover:bg-dark-surface border border-dark-borderSubtle hover:border-dark-border cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2 text-[10px] font-mono">
                <span className={`px-2 py-0.5 rounded font-bold border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-text-muted">{item.time}</span>
              </div>

              <h4 className="font-semibold text-xs text-text-primary group-hover:text-primary-cyan transition-colors leading-snug mb-1.5">
                {item.title}
              </h4>
              <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2 mb-3">
                {item.desc}
              </p>
            </div>

            <div className="flex flex-wrap gap-1 pt-2 border-t border-dark-borderSubtle">
              {item.tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] font-mono text-text-muted bg-dark-surface/80 px-1.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
