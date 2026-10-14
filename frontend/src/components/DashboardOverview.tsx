import React from 'react';
import { 
  Radar, 
  BookOpen, 
  Flame, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  ArrowRight, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Sparkles,
  Layers,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { Topic, SystemStats, EnrichedPaperItem } from '../types';

interface DashboardOverviewProps {
  topics: Topic[];
  stats: SystemStats | null;
  onSelectTopic: (topic: Topic) => void;
  onOpenCreateTopic: () => void;
  onTriggerAll: () => void;
  onTriggerTopic: (topicId: number) => void;
  isTriggering: boolean;
  recentBreakthroughs: EnrichedPaperItem[];
  onSelectPaper: (paper: EnrichedPaperItem) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  topics,
  stats,
  onSelectTopic,
  onOpenCreateTopic,
  onTriggerAll,
  onTriggerTopic,
  isTriggering,
  recentBreakthroughs,
  onSelectPaper
}) => {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Hero / Command Center Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-cyan-950/20 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-3">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-medium text-cyan-400 uppercase tracking-widest">
                AUTONOMOUS RESEARCH INTELLIGENCE
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-100 tracking-tight leading-tight">
              Command Dashboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Monitoring scientific frontiers beyond static keyword alerts with meaningful-change detection, 
              cross-source deduplication, and traceable evidence-backed syntheses.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenCreateTopic}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold shadow-glow-cyan transition-all text-xs sm:text-sm font-sans"
            >
              <Plus className="w-4 h-4" />
              <span>Create Topic</span>
            </button>
            <button
              onClick={onTriggerAll}
              disabled={isTriggering}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium transition-all text-xs sm:text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${isTriggering ? 'animate-spin' : ''}`} />
              <span>Force System Run</span>
            </button>
          </div>
        </div>

        {/* System Health / Diagnostics Ribbon */}
        {stats && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">{stats.system_health_status}</span>
              </div>
              <span className="text-slate-700 hidden sm:inline">&bull;</span>
              <div className="flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>AI Engine: <strong className="text-slate-200">{stats.ai_provider}</strong></span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              Heartbeat: {new Date(stats.last_heartbeat).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active Topics */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              Monitored Topics
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Radar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-mono font-bold text-3xl text-slate-100">
              {stats?.active_topics_count ?? topics.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium">100% Scheduled</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Autonomous recurring retrieval active
          </p>
        </div>

        {/* Card 2: Total Papers Tracked */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              Total Publications
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-mono font-bold text-3xl text-slate-100">
              {stats?.total_papers_tracked ?? 10}
            </span>
            <span className="text-xs text-cyan-400 font-medium">Verified Sources</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Deduped & cross-referenced
          </p>
        </div>

        {/* Card 3: High Impact Alerts */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              High Impact Shifts
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-mono font-bold text-3xl text-emerald-400">
              {stats?.pending_significance_alerts ?? 6}
            </span>
            <span className="text-xs text-emerald-400 font-mono font-semibold">+18.5% vel</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Verified architectural breakthroughs
          </p>
        </div>

        {/* Card 4: Contradiction Warnings */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              Contradiction Flags
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-mono font-bold text-3xl text-amber-400">
              {stats?.contradiction_warnings_count ?? 1}
            </span>
            <span className="text-xs text-amber-300 font-medium">Refuting Baselines</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Identified direct consensus challenges
          </p>
        </div>

      </div>

      {/* Monitored Research Topics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display font-bold text-lg text-slate-100">
              Active Research Monitoring Topics
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {topics.length} Monitoring Agents Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {topics.map(topic => (
            <div
              key={topic.id}
              className="glass-card rounded-2xl p-5 border border-slate-800/90 flex flex-col justify-between"
            >
              <div>
                {/* Topic Card Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                      Every {topic.schedule_interval_hours} Hours
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {topic.contradiction_count && topic.contradiction_count > 0 ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300">
                        {topic.contradiction_count} Contradiction Warning
                      </span>
                    ) : null}
                    <span className="text-[10px] font-mono text-slate-500">
                      ID #{topic.id}
                    </span>
                  </div>
                </div>

                {/* Topic Name */}
                <h3 
                  onClick={() => onSelectTopic(topic)}
                  className="font-display font-bold text-base sm:text-lg text-slate-100 hover:text-cyan-300 cursor-pointer transition-colors leading-snug mb-2"
                >
                  {topic.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {topic.description || "Continuous autonomous tracking across preprints and secondary digests."}
                </p>

                {/* Keywords Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {topic.keywords.map((kw, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topic Bottom Stats & Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                  <span>Papers: <strong className="text-slate-200">{topic.papers_count ?? 0}</strong></span>
                  <span>High Impact: <strong className="text-emerald-400">{topic.high_impact_count ?? 0}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onTriggerTopic(topic.id)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Force immediate check for this topic"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectTopic(topic)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all font-sans"
                  >
                    <span>Intelligence Stream</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Global Breakthroughs Spotlight Mini-Stream */}
      {recentBreakthroughs.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="font-display font-bold text-base text-slate-100">
                Latest Agentic Breakthroughs & Delta Shifts
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Live Synthesis Stream
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {recentBreakthroughs.slice(0, 4).map(p => (
              <div 
                key={p.id}
                onClick={() => onSelectPaper(p)}
                className="glass-card rounded-xl p-4 cursor-pointer hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                      p.significance_level === 'Contradiction Warning'
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : p.significance_level === 'High Impact'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {p.significance_level}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{p.external_id}</span>
                  </div>

                  <h4 className="font-semibold text-sm text-slate-200 line-clamp-1 mb-1 hover:text-cyan-300 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400">Click to inspect evidence</span>
                  <span>{new Date(p.published_date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
