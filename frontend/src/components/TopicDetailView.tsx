import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  Filter, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  Terminal
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
      <div className="pulse-card p-6 border-dark-border bg-gradient-to-br from-dark-card to-dark-surface">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-mono text-primary-cyan hover:text-primary-blue mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Command Dashboard</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-primary-cyan animate-pulse"></span>
              <span className="text-xs font-mono text-primary-cyan uppercase tracking-widest">
                ACTIVE MONITORING TOPIC #{topic.id}
              </span>
              <span className="text-dark-border">&bull;</span>
              <span className="text-xs font-mono text-text-muted">
                Interval: Every {topic.schedule_interval_hours} Hours
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight leading-tight">
              {topic.name}
            </h1>

            {topic.description && (
              <p className="mt-1.5 text-xs sm:text-sm text-text-secondary max-w-3xl leading-relaxed">
                {topic.description}
              </p>
            )}

            <div className="flex flex-wrap gap-1.5 mt-3">
              {topic.keywords.map((kw, i) => (
                <span 
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-dark-bg border border-dark-border text-[11px] font-mono text-primary-cyan"
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
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl gradient-btn-active text-white font-semibold transition-all text-xs sm:text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isTriggering ? 'animate-spin' : ''}`} />
              <span>{isTriggering ? 'Running Analysis...' : 'Trigger Monitoring Check'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-dark-borderSubtle">
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'stream'
                ? 'gradient-btn-active text-white shadow-glow-blue'
                : 'text-text-secondary hover:text-text-primary hover:bg-dark-surface'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligence Stream ({papers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'trends'
                ? 'gradient-btn-active text-white shadow-glow-blue'
                : 'text-text-secondary hover:text-text-primary hover:bg-dark-surface'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trend Matrix & Themes</span>
          </button>

          <button
            onClick={() => setActiveTab('runs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'runs'
                ? 'gradient-btn-active text-white shadow-glow-blue'
                : 'text-text-secondary hover:text-text-primary hover:bg-dark-surface'
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
          <div className="pulse-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSetSearchQuery(e.target.value)}
                placeholder="Search publications by title, abstract, or author..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-dark-bg border border-dark-border text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-cyan"
              />
            </div>

            {/* Significance Level Chips Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => onSetSignificanceFilter('')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  significanceFilter === ''
                    ? 'bg-text-primary text-dark-bg font-semibold'
                    : 'bg-dark-bg text-text-secondary hover:text-text-primary border border-dark-border'
                }`}
              >
                All Papers
              </button>
              <button
                onClick={() => onSetSignificanceFilter('High Impact')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  significanceFilter === 'High Impact'
                    ? 'bg-accent-success text-dark-bg font-semibold'
                    : 'bg-dark-bg text-accent-success hover:bg-dark-surface border border-accent-success/40'
                }`}
              >
                High Impact
              </button>
              <button
                onClick={() => onSetSignificanceFilter('Contradiction Warning')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  significanceFilter === 'Contradiction Warning'
                    ? 'bg-accent-warning text-dark-bg font-semibold'
                    : 'bg-dark-bg text-accent-warning hover:bg-dark-surface border border-accent-warning/40'
                }`}
              >
                Contradictions
              </button>
              <button
                onClick={() => onSetSignificanceFilter('Incremental Progress')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  significanceFilter === 'Incremental Progress'
                    ? 'bg-primary-cyan text-dark-bg font-semibold'
                    : 'bg-dark-bg text-primary-cyan hover:bg-dark-surface border border-primary-cyan/40'
                }`}
              >
                Incremental
              </button>
              <button
                onClick={() => onSetSignificanceFilter('Minor Update')}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  significanceFilter === 'Minor Update'
                    ? 'bg-dark-surface text-text-primary font-semibold border border-dark-border'
                    : 'bg-dark-bg text-text-muted hover:bg-dark-surface border border-dark-borderSubtle'
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
                  ? 'bg-primary-violet/20 text-primary-violet border-primary-violet/40'
                  : 'bg-dark-bg text-text-secondary border-dark-border hover:text-text-primary'
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
              <div className="p-8 text-center pulse-card rounded-2xl">
                <Filter className="w-8 h-8 text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-secondary">No publications match your current filter.</p>
                <button
                  onClick={() => {
                    onSetSignificanceFilter('');
                    onSetSearchQuery('');
                  }}
                  className="mt-3 text-xs text-primary-cyan hover:underline"
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
          <div className="pulse-card p-5">
            <h3 className="font-display font-bold text-base text-text-primary mb-3 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-primary-cyan" />
              <span>Topic Execution History</span>
            </h3>

            <div className="space-y-3">
              {runs.map(run => (
                <div key={run.id} className="p-3.5 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      run.status === 'success' ? 'bg-emerald-500/15 text-accent-success border border-emerald-500/40' :
                      run.status === 'partial' ? 'bg-amber-500/15 text-accent-warning border border-amber-500/40' :
                      'bg-rose-500/15 text-rose-400 border border-rose-500/40'
                    }`}>
                      {run.status}
                    </span>
                    <span className="text-text-secondary">{new Date(run.started_at).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-text-muted">
                    <span>Found: <strong className="text-text-primary">{run.papers_found_count}</strong></span>
                    <span>New: <strong className="text-accent-success">{run.new_papers_count}</strong></span>
                    <span>Duplicates: <strong className="text-primary-violet">{run.duplicates_skipped_count}</strong></span>
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
