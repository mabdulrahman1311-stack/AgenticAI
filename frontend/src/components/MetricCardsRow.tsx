import React from 'react';
import { 
  Layers, 
  FileText, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { SystemStats } from '../types';

interface MetricCardsRowProps {
  stats: SystemStats | null;
  onSelectCard?: (metricType: string) => void;
}

export const MetricCardsRow: React.FC<MetricCardsRowProps> = ({ stats, onSelectCard }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Monitored Topics */}
      <div 
        onClick={() => onSelectCard && onSelectCard('topics')}
        className="pulse-card p-5 cursor-pointer hover:border-accent-success/50 hover:shadow-glow-cyan flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="font-semibold text-xs text-text-primary block leading-tight">
                Monitored Topics
              </span>
              <span className="text-[11px] text-text-muted block">
                Active research areas
              </span>
            </div>
            <div className="p-2 rounded-xl bg-accent-success/10 text-accent-success border border-accent-success/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2.5">
            <span className="font-mono font-bold text-3xl text-text-primary">
              {stats?.active_topics_count ?? 10}
            </span>
            <span className="text-[11px] text-accent-success font-medium">
              ↑ 33% <span className="text-text-muted">vs last 7 days</span>
            </span>
          </div>
        </div>

        {/* Mini SVG Sparkline */}
        <div className="mt-3 pt-2">
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path 
              d="M0,20 Q15,8 30,15 T60,5 T90,12 L100,2" 
              fill="none" 
              stroke="#00E5B0" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M0,20 Q15,8 30,15 T60,5 T90,12 L100,2 L100,25 L0,25 Z" 
              fill="url(#sparkGrad1)" 
              opacity="0.15" 
            />
            <defs>
              <linearGradient id="sparkGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5B0" />
                <stop offset="100%" stopColor="#00E5B0" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Card 2: Total Publications */}
      <div 
        onClick={() => onSelectCard && onSelectCard('publications')}
        className="pulse-card p-5 cursor-pointer hover:border-primary-cyan/50 hover:shadow-glow-blue flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="font-semibold text-xs text-text-primary block leading-tight">
                Total Publications
              </span>
              <span className="text-[11px] text-text-muted block">
                Verified sources
              </span>
            </div>
            <div className="p-2 rounded-xl bg-primary-blue/10 text-primary-cyan border border-primary-blue/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2.5">
            <span className="font-mono font-bold text-3xl text-text-primary">
              {stats ? `${(stats.total_papers_tracked / 1000).toFixed(1)}K` : '2.4K'}
            </span>
            <span className="text-[11px] text-primary-cyan font-medium">
              ↑ 21% <span className="text-text-muted">vs last 7 days</span>
            </span>
          </div>
        </div>

        {/* Mini SVG Sparkline */}
        <div className="mt-3 pt-2">
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path 
              d="M0,22 Q20,18 40,10 T70,12 T100,3" 
              fill="none" 
              stroke="#00D9FF" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M0,22 Q20,18 40,10 T70,12 T100,3 L100,25 L0,25 Z" 
              fill="url(#sparkGrad2)" 
              opacity="0.15" 
            />
            <defs>
              <linearGradient id="sparkGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D9FF" />
                <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Card 3: High Impact Shifts */}
      <div 
        onClick={() => onSelectCard && onSelectCard('shifts')}
        className="pulse-card p-5 cursor-pointer hover:border-primary-violet/50 hover:shadow-glow-violet flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="font-semibold text-xs text-text-primary block leading-tight">
                High Impact Shifts
              </span>
              <span className="text-[11px] text-text-muted block">
                Significant breakthroughs
              </span>
            </div>
            <div className="p-2 rounded-xl bg-primary-violet/10 text-primary-violet border border-primary-violet/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2.5">
            <span className="font-mono font-bold text-3xl text-primary-violet">
              {stats?.pending_significance_alerts ?? 6}
            </span>
            <span className="text-[11px] text-primary-violet font-medium">
              ↑ 18.5% <span className="text-text-muted">vs last 7 days</span>
            </span>
          </div>
        </div>

        {/* Mini SVG Sparkline */}
        <div className="mt-3 pt-2">
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path 
              d="M0,18 Q20,24 45,12 T80,14 T100,4" 
              fill="none" 
              stroke="#8B5CF6" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M0,18 Q20,24 45,12 T80,14 T100,4 L100,25 L0,25 Z" 
              fill="url(#sparkGrad3)" 
              opacity="0.15" 
            />
            <defs>
              <linearGradient id="sparkGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Card 4: Contradiction Flags */}
      <div 
        onClick={() => onSelectCard && onSelectCard('contradictions')}
        className="pulse-card p-5 cursor-pointer hover:border-accent-warning/50 hover:shadow-glow-amber flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="font-semibold text-xs text-text-primary block leading-tight">
                Contradiction Flags
              </span>
              <span className="text-[11px] text-text-muted block">
                Needs verification
              </span>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 text-accent-warning border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2.5">
            <span className="font-mono font-bold text-3xl text-accent-warning">
              {stats?.contradiction_warnings_count ?? 1}
            </span>
            <span className="text-[11px] text-accent-warning font-medium">
              Refuting Baselines
            </span>
          </div>
        </div>

        {/* Mini SVG Sparkline */}
        <div className="mt-3 pt-2">
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 25" preserveAspectRatio="none">
            <path 
              d="M0,21 Q30,12 55,20 T85,8 T100,16" 
              fill="none" 
              stroke="#FFB020" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M0,21 Q30,12 55,20 T85,8 T100,16 L100,25 L0,25 Z" 
              fill="url(#sparkGrad4)" 
              opacity="0.15" 
            />
            <defs>
              <linearGradient id="sparkGrad4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFB020" />
                <stop offset="100%" stopColor="#FFB020" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

    </div>
  );
};
