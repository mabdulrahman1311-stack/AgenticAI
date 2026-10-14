import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  RefreshCw, 
  Flame, 
  Activity,
  Layers
} from 'lucide-react';
import { TrendSnapshot } from '../types';

interface TrendMatrixViewProps {
  trends: TrendSnapshot[];
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const TrendMatrixView: React.FC<TrendMatrixViewProps> = ({
  trends,
  onRegenerate,
  isRegenerating
}) => {
  const latestSnapshot = trends[0];

  if (!latestSnapshot) {
    return (
      <div className="p-8 text-center pulse-card rounded-2xl">
        <TrendingUp className="w-8 h-8 text-primary-cyan mx-auto mb-2 animate-bounce" />
        <p className="text-sm text-text-secondary">No trend snapshots generated yet.</p>
        <button
          onClick={onRegenerate}
          className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg gradient-btn-active text-white font-sans transition-all"
        >
          Synthesize Trends Now
        </button>
      </div>
    );
  }

  // Format theme bar chart data
  const themeChartData = latestSnapshot.emerging_themes.map(t => ({
    name: t.theme.length > 25 ? t.theme.substring(0, 22) + '...' : t.theme,
    frequency: t.frequency,
    velocity: parseInt(t.velocity.replace(/[^0-9]/g, '')) || 50,
  }));

  // Timeline progression data
  const timelineData = latestSnapshot.metrics?.timeline_data || [
    { period: 'Week 1', papers: 2, high_impact: 1, velocity: 15 },
    { period: 'Week 2', papers: 4, high_impact: 1, velocity: 35 },
    { period: 'Week 3', papers: 7, high_impact: 3, velocity: 65 },
    { period: 'Week 4', papers: 10, high_impact: 5, velocity: 110 }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner & Narrative Card */}
      <div className="pulse-card p-6 relative overflow-hidden bg-gradient-to-br from-dark-card to-dark-surface">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-dark-borderSubtle">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-primary-cyan to-primary-violet text-white shadow-glow-cyan">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-bold text-lg text-text-primary">
                  Trend Matrix & Horizon Synthesis
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-primary-cyan/15 border border-primary-cyan/30 text-primary-cyan">
                  {latestSnapshot.period_label}
                </span>
              </div>
              <p className="text-xs text-text-muted font-sans">
                Algorithmic synthesis of acceleration, consensus pivots, and architectural themes
              </p>
            </div>
          </div>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-dark-bg hover:bg-dark-surface text-text-secondary border border-dark-border disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary-cyan ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Re-Synthesize</span>
          </button>
        </div>

        {/* Narrative Box */}
        <div className="mt-4 p-4 rounded-xl bg-dark-bg/80 border border-dark-borderSubtle">
          <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-primary-cyan mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AGENTIC SYNTHESIS NARRATIVE</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed font-sans">
            {latestSnapshot.summary_narrative}
          </p>
        </div>

        {/* Quick Snapshot Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-dark-surface/70 border border-dark-borderSubtle">
            <span className="text-[11px] font-mono text-text-muted block">Total Publications</span>
            <span className="text-xl font-bold font-mono text-text-primary">
              {latestSnapshot.metrics?.total_analyzed ?? 8}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-dark-surface/70 border border-dark-borderSubtle">
            <span className="text-[11px] font-mono text-text-muted block">High-Impact Shifts</span>
            <span className="text-xl font-bold font-mono text-accent-success">
              {latestSnapshot.metrics?.high_impact_count ?? 4}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-dark-surface/70 border border-dark-borderSubtle">
            <span className="text-[11px] font-mono text-text-muted block">Contradictions Flagged</span>
            <span className="text-xl font-bold font-mono text-accent-warning">
              {latestSnapshot.metrics?.contradiction_count ?? 1}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-dark-surface/70 border border-dark-borderSubtle">
            <span className="text-[11px] font-mono text-text-muted block">Mean Model Confidence</span>
            <span className="text-xl font-bold font-mono text-primary-cyan">
              {((latestSnapshot.metrics?.avg_confidence ?? 0.91) * 100).toFixed(0)}%
            </span>
          </div>
        </div>

      </div>

      {/* Visual Timeline and Frequency Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Research Velocity & Publication Volume Over Time */}
        <div className="pulse-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-display font-bold text-sm text-text-primary">
                Research Velocity Timeline
              </h4>
              <p className="text-xs text-text-muted">
                Cumulative analyzed papers and high-impact breakthroughs over time
              </p>
            </div>
            <span className="text-xs font-mono text-primary-cyan flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Acceleration</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorPapers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5B0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00E5B0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(58, 130, 246, 0.1)" />
                <XAxis dataKey="period" stroke="#617795" tick={{ fontSize: 11 }} />
                <YAxis stroke="#617795" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#050D1C', 
                    borderColor: 'rgba(58, 130, 246, 0.3)', 
                    borderRadius: '0.75rem', 
                    fontSize: '12px',
                    color: '#F1F5FF'
                  }} 
                />
                <Area type="monotone" dataKey="papers" name="Total Papers" stroke="#00D9FF" strokeWidth={2} fillOpacity={1} fill="url(#colorPapers)" />
                <Area type="monotone" dataKey="high_impact" name="High Impact" stroke="#00E5B0" strokeWidth={2} fillOpacity={1} fill="url(#colorImpact)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Emerging Theme Frequency & Velocity */}
        <div className="pulse-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-display font-bold text-sm text-text-primary">
                Emerging Themes Frequency
              </h4>
              <p className="text-xs text-text-muted">
                Keyword co-occurrence across tracked publications
              </p>
            </div>
            <span className="text-xs font-mono text-accent-success flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Theme Heat</span>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={themeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(58, 130, 246, 0.1)" />
                <XAxis dataKey="name" stroke="#617795" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="#617795" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#050D1C', 
                    borderColor: 'rgba(58, 130, 246, 0.3)', 
                    borderRadius: '0.75rem', 
                    fontSize: '12px',
                    color: '#F1F5FF'
                  }} 
                />
                <Bar dataKey="frequency" name="Occurrences" fill="#168BFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Emerging Themes Detailed Cards */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-sm text-text-primary flex items-center space-x-2">
          <Layers className="w-4 h-4 text-primary-cyan" />
          <span>Detailed Theme Clusters & Velocity Breakdown</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestSnapshot.emerging_themes.map((theme, idx) => (
            <div key={idx} className="pulse-card p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-accent-success font-mono font-bold text-xs bg-accent-success/15 px-2 py-0.5 rounded-md border border-accent-success/30">
                    {theme.velocity} Velocity
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    {theme.frequency} papers
                  </span>
                </div>
                <h5 className="font-semibold text-sm text-text-primary mb-1 leading-snug">
                  {theme.theme}
                </h5>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {theme.description || "Active acceleration identified across multiple independent research labs."}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-dark-borderSubtle flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-primary-cyan" />
                  <span>Agent Confidence:</span>
                </span>
                <span className="text-text-primary font-bold">{(theme.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
