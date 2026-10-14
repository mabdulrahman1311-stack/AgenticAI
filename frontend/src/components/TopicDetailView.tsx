import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  Filter, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  Flame, 
  Calendar, 
  TrendingUp, 
  Terminal,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Topic, EnrichedPaperItem, TrendSnapshot, MonitoringRun } from '../types';
import { PaperCard } from './PaperCard';
import { DeltaPanel } from './DeltaPanel';
import { TrendMatrixView } from './TrendMatrixView';

interface TopicDetailViewProps {
  topic: Topic;
  papers: EnrichedPaperItem[];
  trends: TrendSnapshot[];
  runs: MonitoringRun[];
  onBack: () => void;
  onTriggerTopic: (topicId: number) => void;
  isTriggering: boolean;
  onSelectPaper: (paper: EnrichedPaperItem) => void;
  groupByCluster: boolean;
  onToggleGroupByCluster: () => void;
  significanceFilter: string;
  onSetSignificanceFilter: (filter: string) => void;
  searchQuery: string;
  onSetSearchQuery: (query: string) => void;
  onRegenerateTrends: () => void;
  isRegeneratingTrends: boolean;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  papers,
  trends,
  runs,
  onBack,
  onTriggerTopic,
  isTriggering,
  onSelectPaper,
  groupByCluster,
  onToggleGroupByCluster,
  significanceFilter,
  onSetSignificanceFilter,
  searchQuery,
  onSetSearchQuery,
  onRegenerateTrends,
  isRegeneratingTrends
}) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'trends' | 'runs'>('stream');

  // Filter papers locally by significance and search
  const filteredPapers = papers.filter(p => {
    if (significanceFilter && p.significance_level !== significanceFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSummary = p.summary.toLowerCase().includes(q);
      const matchAuthors = p.authors.some(a => a.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchAuthors) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Top Header & Breadcrumb */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Command Dashboard</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                ACTIVE MONITORING TOPIC #{topic.id}
              </span>
              <span className="text-slate-700">&bull;</span>
              <span className="text-xs font-mono text-slate-400">
                Interval: Every {topic.schedule_interval_hours} Hours
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 tracking-tight leading-tight">
              {topic.name}
            </h1>

            {topic.description && (
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                {topic.description}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5 mt-3">
              {topic.keywords.map((kw, i) => (
                <span 
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <button
              onClick={() => onTriggerTopic(topic.id)}
              disabled={isTriggering}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-glow-cyan transition-all text-xs sm:text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isTriggering ? 'animate-spin' : ''}`} />
              <span>{isTriggering ? 'Running Analysis...' : 'Trigger Monitoring Check'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'stream'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligence Stream ({papers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'trends'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trend Matrix & Themes</span>
          </button>

          <button
            onClick={() => setActiveTab('runs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'runs'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Execution Runs ({runs.length})</span>
          </button>
        </div>

      </div>

      {/* Tab 1: Intelligence Stream View */}
      {activeTab === 'stream' && (
        <div className="space-y-6">
          
          {/* Dedicated "What's New" Delta Matrix */}
          <DeltaPanel papers={papers} topicName={topic.name} />

          {/* Feed Filter & Search Controls */}
          <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSetSearchQuery(e.target.value)}
                placeholder="Search publications by title, abstract, or author..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Significance Level Chips Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => onSetSignificanceFilter('')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  significanceFilter === ''
                    ? 'bg-slate-200 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All Papers
              </button>
              <button
                onClick={() => onSetSignificanceFilter('High Impact')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  significanceFilter === 'High Impact'
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-emerald-400 hover:bg-slate-850 border border-emerald-900/60'
                }`}
              >
                High Impact
              </button>
              <button
                onClick={() => onSetSignificanceFilter('Contradiction Warning')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  significanceFilter === 'Contradiction Warning'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-amber-400 hover:bg-slate-850 border border-amber-900/60'
                }`}
              >
                Contradictions
              </button>
              <button
                onClick={() => onSetSignificanceFilter('Incremental Progress')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  significanceFilter === 'Incremental Progress'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-cyan-400 hover:bg-slate-850 border border-cyan-900/60'
                }`}
              >
                Incremental
              </button>
              <button
                onClick={() => onSetSignificanceFilter('Minor Update')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  significanceFilter === 'Minor Update'
                    ? 'bg-slate-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-850 border border-slate-800'
                }`}
              >
                Minor
              </button>
            </div>

            {/* Multi-Source Convergence Grouping Toggle */}
            <button
              onClick={onToggleGroupByCluster}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                groupByCluster
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Group multiple publications reporting the same breakthrough under 1 parent card"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Source Grouping: {groupByCluster ? 'ON' : 'OFF'}</span>
            </button>

          </div>

          {/* Papers Feed Stream */}
          <div className="space-y-4">
            {filteredPapers.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl">
                <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-300">No publications match your current filter.</p>
                <button
                  onClick={() => {
                    onSetSignificanceFilter('');
                    onSetSearchQuery('');
                  }}
                  className="mt-3 text-xs text-cyan-400 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredPapers.map(paper => (
                <PaperCard 
                  key={paper.id} 
                  paper={paper} 
                  onSelect={onSelectPaper} 
                />
              ))
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Trend Matrix View */}
      {activeTab === 'trends' && (
        <TrendMatrixView 
          trends={trends} 
          onRegenerate={onRegenerateTrends}
          isRegenerating={isRegeneratingTrends}
        />
      )}

      {/* Tab 3: Execution Runs Tab */}
      {activeTab === 'runs' && (
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="font-display font-bold text-base text-slate-100 mb-3 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Topic Execution History</span>
            </h3>

            <div className="space-y-3">
              {runs.map(run => (
                <div key={run.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      run.status === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      run.status === 'partial' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {run.status}
                    </span>
                    <span className="text-slate-300">{new Date(run.started_at).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-400">
                    <span>Found: <strong className="text-slate-200">{run.papers_found_count}</strong></span>
                    <span>New: <strong className="text-emerald-400">{run.new_papers_count}</strong></span>
                    <span>Duplicates: <strong className="text-indigo-400">{run.duplicates_skipped_count}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
