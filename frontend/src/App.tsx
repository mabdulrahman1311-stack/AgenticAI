import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { Topic, EnrichedPaperItem, TrendSnapshot, MonitoringRun, SystemStats } from './types';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { TopicDetailView } from './components/TopicDetailView';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { RunLogsDrawer } from './components/RunLogsDrawer';
import { CreateTopicModal } from './components/CreateTopicModal';
import { ScenarioTesterModal } from './components/ScenarioTesterModal';

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  // Data states
  const [topics, setTopics] = useState<Topic[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [allRuns, setAllRuns] = useState<MonitoringRun[]>([]);
  const [recentBreakthroughs, setRecentBreakthroughs] = useState<EnrichedPaperItem[]>([]);
  
  // Selected topic & details
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicPapers, setTopicPapers] = useState<EnrichedPaperItem[]>([]);
  const [topicTrends, setTopicTrends] = useState<TrendSnapshot[]>([]);
  const [topicRuns, setTopicRuns] = useState<MonitoringRun[]>([]);

  // Feed filtering states
  const [groupByCluster, setGroupByCluster] = useState<boolean>(true);
  const [significanceFilter, setSignificanceFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isCreateTopicOpen, setIsCreateTopicOpen] = useState<boolean>(false);
  const [isScenarioTesterOpen, setIsScenarioTesterOpen] = useState<boolean>(false);
  const [isRunLogsOpen, setIsRunLogsOpen] = useState<boolean>(false);
  const [selectedPaperForDrawer, setSelectedPaperForDrawer] = useState<EnrichedPaperItem | null>(null);

  // Loading & Action states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTriggering, setIsTriggering] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [isRegeneratingTrends, setIsRegeneratingTrends] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Toggle dark/light mode
  const handleToggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    if (next) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  // Load initial dashboard data
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedTopics, fetchedStats, fetchedRuns] = await Promise.all([
        api.getTopics(),
        api.getSystemStats(),
        api.getAllRuns(20)
      ]);
      setTopics(fetchedTopics);
      setStats(fetchedStats);
      setAllRuns(fetchedRuns);

      // Fetch sample breakthroughs from first topic if available
      if (fetchedTopics.length > 0) {
        const samplePapers = await api.getTopicPapers(fetchedTopics[0].id, { group_by_cluster: true });
        setRecentBreakthroughs(samplePapers);
      }
    } catch (err: any) {
      console.error('Error loading initial dashboard data:', err);
      showToast('Could not reach backend API. Checking connection...');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load topic detail data when a topic is selected
  const loadTopicData = useCallback(async (topicId: number) => {
    try {
      const [papers, trends, runs] = await Promise.all([
        api.getTopicPapers(topicId, { group_by_cluster: groupByCluster }),
        api.getTopicTrends(topicId),
        api.getTopicRuns(topicId)
      ]);
      setTopicPapers(papers);
      setTopicTrends(trends);
      setTopicRuns(runs);
    } catch (err: any) {
      console.error('Error loading topic detail data:', err);
    }
  }, [groupByCluster]);

  useEffect(() => {
    if (selectedTopic) {
      loadTopicData(selectedTopic.id);
    }
  }, [selectedTopic, groupByCluster, loadTopicData]);

  // Trigger individual topic run
  const handleTriggerTopic = async (topicId: number) => {
    setIsTriggering(true);
    showToast('Executing autonomous research monitoring cycle...');
    try {
      const res = await api.triggerTopicRun(topicId);
      showToast(`Run complete! Status: ${res.status}. Found updates.`);
      // Reload topics and topic detail
      await loadInitialData();
      if (selectedTopic && selectedTopic.id === topicId) {
        await loadTopicData(topicId);
      }
    } catch (err: any) {
      showToast(`Monitoring run failed: ${err.message}`);
    } finally {
      setIsTriggering(false);
    }
  };

  // Trigger all topics
  const handleTriggerAll = async () => {
    setIsTriggering(true);
    showToast('Triggering monitoring checks across all active topics...');
    try {
      const res = await api.triggerAllTopics();
      showToast(res.message || 'All monitoring cycles complete.');
      await loadInitialData();
      if (selectedTopic) {
        await loadTopicData(selectedTopic.id);
      }
    } catch (err: any) {
      showToast(`Error triggering checks: ${err.message}`);
    } finally {
      setIsTriggering(false);
    }
  };

  // Create new topic
  const handleCreateTopic = async (data: { name: string; description?: string; keywords: string[]; schedule_interval_hours: number }) => {
    const created = await api.createTopic(data);
    showToast(`Topic '${created.name}' created and scheduled!`);
    await loadInitialData();
    setSelectedTopic(created);
  };

  // Reset & Seed Scenarios
  const handleResetSeed = async () => {
    setIsSeeding(true);
    showToast('Seeding 6 Hackathon Rubric Evaluation Scenarios...');
    try {
      const res = await api.seedScenarios();
      showToast(res.message);
      await loadInitialData();
      if (selectedTopic) {
        await loadTopicData(selectedTopic.id);
      }
    } catch (err: any) {
      showToast(`Seeding failed: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Regenerate trends
  const handleRegenerateTrends = async () => {
    if (!selectedTopic) return;
    setIsRegeneratingTrends(true);
    showToast('Agent is synthesizing latest research trajectory & themes...');
    try {
      const snapshot = await api.regenerateTopicTrends(selectedTopic.id);
      setTopicTrends([snapshot]);
      showToast('Trend snapshot successfully updated!');
    } catch (err: any) {
      showToast(`Failed to update trends: ${err.message}`);
    } finally {
      setIsRegeneratingTrends(false);
    }
  };

  // Quick navigation for the 6 Hackathon Scenarios
  const handleSelectScenario = async (scenarioIndex: number) => {
    const currentTopics = await api.getTopics();
    setTopics(currentTopics);

    if (scenarioIndex === 1) {
      // Multi-Article Convergence (Topic 2: Efficient LLM Inference)
      const t = currentTopics.find(t => t.name.includes("Inference")) || currentTopics[1] || currentTopics[0];
      if (t) {
        setSelectedTopic(t);
        setGroupByCluster(true);
        setSignificanceFilter('');
        showToast('Scenario 1: Inspecting 3 Convergent Sources grouped under Dynamic MoE');
      }
    } else if (scenarioIndex === 2) {
      // Contradiction Detection (Topic 2: Vance et al. vs Al-Mansoor)
      const t = currentTopics.find(t => t.name.includes("Inference")) || currentTopics[1] || currentTopics[0];
      if (t) {
        setSelectedTopic(t);
        setSignificanceFilter('Contradiction Warning');
        const papers = await api.getTopicPapers(t.id, { has_contradiction: true });
        if (papers.length > 0) {
          setSelectedPaperForDrawer(papers[0]);
        }
        showToast('Scenario 2: Contradiction Warning flagged against Vance et al. 32k baseline');
      }
    } else if (scenarioIndex === 3) {
      // Alert Fatigue Prevention (Topic 1: Prompt variations suppressed)
      const t = currentTopics.find(t => t.name.includes("Agentic")) || currentTopics[0];
      if (t) {
        setSelectedTopic(t);
        setSignificanceFilter('Minor Update');
        showToast('Scenario 3: Alert Fatigue filter suppresses routine prompt variation noise');
      }
    } else if (scenarioIndex === 4) {
      // Trend Emergence (Topic 2: Speculative decoding velocity)
      const t = currentTopics.find(t => t.name.includes("Inference")) || currentTopics[1] || currentTopics[0];
      if (t) {
        setSelectedTopic(t);
        showToast('Scenario 4: Speculative decoding themes accelerated +195% over 4 weeks');
      }
    } else if (scenarioIndex === 5) {
      // Weakly Supported Claim (Topic 1: Quantum AGI caution label)
      const t = currentTopics.find(t => t.name.includes("Agentic")) || currentTopics[0];
      if (t) {
        setSelectedTopic(t);
        setSignificanceFilter('');
        const papers = await api.getTopicPapers(t.id, { weakly_supported: true });
        if (papers.length > 0) {
          setSelectedPaperForDrawer(papers[0]);
        }
        showToast('Scenario 5: Caution Label applied to unverified AGI claim (reliability 42%)');
      }
    } else if (scenarioIndex === 6) {
      // Value / Conclusion Shifts (Topic 1: WebArena SOTA jump)
      const t = currentTopics.find(t => t.name.includes("Agentic")) || currentTopics[0];
      if (t) {
        setSelectedTopic(t);
        setSignificanceFilter('High Impact');
        const papers = await api.getTopicPapers(t.id);
        const sota = papers.find(p => p.value_metric_shifts.length > 0);
        if (sota) {
          setSelectedPaperForDrawer(sota);
        }
        showToast('Scenario 6: WebArena SOTA shift diff (+17.6% success, 4x faster)');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono shadow-2xl flex items-center space-x-2 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        stats={stats}
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
        onOpenCreateTopic={() => setIsCreateTopicOpen(true)}
        onOpenScenarioModal={() => setIsScenarioTesterOpen(true)}
        onOpenLogsModal={() => setIsRunLogsOpen(true)}
        onTriggerAll={handleTriggerAll}
        isTriggering={isTriggering}
        activeView={selectedTopic ? 'topic-detail' : 'dashboard'}
        onNavigateHome={() => setSelectedTopic(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {selectedTopic ? (
          <TopicDetailView
            topic={selectedTopic}
            papers={topicPapers}
            trends={topicTrends}
            runs={topicRuns}
            onBack={() => {
              setSelectedTopic(null);
              loadInitialData();
            }}
            onTriggerTopic={handleTriggerTopic}
            isTriggering={isTriggering}
            onSelectPaper={paper => setSelectedPaperForDrawer(paper)}
            groupByCluster={groupByCluster}
            onToggleGroupByCluster={() => setGroupByCluster(!groupByCluster)}
            significanceFilter={significanceFilter}
            onSetSignificanceFilter={setSignificanceFilter}
            searchQuery={searchQuery}
            onSetSearchQuery={setSearchQuery}
            onRegenerateTrends={handleRegenerateTrends}
            isRegeneratingTrends={isRegeneratingTrends}
          />
        ) : (
          <DashboardOverview
            topics={topics}
            stats={stats}
            onSelectTopic={topic => setSelectedTopic(topic)}
            onOpenCreateTopic={() => setIsCreateTopicOpen(true)}
            onTriggerAll={handleTriggerAll}
            onTriggerTopic={handleTriggerTopic}
            isTriggering={isTriggering}
            recentBreakthroughs={recentBreakthroughs}
            onSelectPaper={paper => setSelectedPaperForDrawer(paper)}
          />
        )}
      </main>

      {/* Traceable Evidence Drawer */}
      <EvidenceDrawer
        paper={selectedPaperForDrawer}
        onClose={() => setSelectedPaperForDrawer(null)}
      />

      {/* Diagnostics & Run Logs Drawer */}
      <RunLogsDrawer
        runs={selectedTopic ? topicRuns : allRuns}
        isOpen={isRunLogsOpen}
        onClose={() => setIsRunLogsOpen(false)}
        onRefresh={() => {
          loadInitialData();
          if (selectedTopic) loadTopicData(selectedTopic.id);
        }}
        isLoading={isLoading}
      />

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={isCreateTopicOpen}
        onClose={() => setIsCreateTopicOpen(false)}
        onSubmit={handleCreateTopic}
      />

      {/* Scenario Tester Modal */}
      <ScenarioTesterModal
        isOpen={isScenarioTesterOpen}
        onClose={() => setIsScenarioTesterOpen(false)}
        onSelectScenario={handleSelectScenario}
        onResetSeed={handleResetSeed}
        isSeeding={isSeeding}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 mt-auto text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ResearchPulse &bull; DejaVu Hackathon Advanced Agentic AI Track</span>
          <span className="text-slate-400">Meaningful Change Detection &bull; Cross-Source Deduplication &bull; Traceable Evidence</span>
        </div>
      </footer>

    </div>
  );
};

export default App;
