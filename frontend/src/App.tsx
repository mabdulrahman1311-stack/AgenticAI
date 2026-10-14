import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { Topic, EnrichedPaperItem, TrendSnapshot, MonitoringRun, SystemStats } from './types';
import { Sidebar, NavItem } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardOverview } from './components/DashboardOverview';
import { TopicDetailView } from './components/TopicDetailView';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { RunLogsDrawer } from './components/RunLogsDrawer';
import { CreateTopicModal } from './components/CreateTopicModal';
import { ScenarioTesterModal } from './components/ScenarioTesterModal';
import { Sparkles, Crown, Check, X } from 'lucide-react';

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  // Navigation state
  const [activeNav, setActiveNav] = useState<NavItem>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
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

      // Fetch sample breakthroughs across topics
      if (fetchedTopics.length > 0) {
        const samplePapers = await api.getTopicPapers(fetchedTopics[0].id, { group_by_cluster: true });
        if (fetchedTopics.length > 1) {
          const samplePapers2 = await api.getTopicPapers(fetchedTopics[1].id, { group_by_cluster: true });
          setRecentBreakthroughs([...samplePapers, ...samplePapers2]);
        } else {
          setRecentBreakthroughs(samplePapers);
        }
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

  // Handle Sidebar Navigation
  const handleNavigate = (item: NavItem) => {
    setActiveNav(item);
    if (item === 'home') {
      setSelectedTopic(null);
    } else if (item === 'topics') {
      if (topics.length > 0) setSelectedTopic(topics[0]);
    } else if (item === 'monitoring') {
      setIsRunLogsOpen(true);
    } else if (item === 'insights') {
      if (topics.length > 0) {
        setSelectedTopic(topics[0]);
        setSignificanceFilter('High Impact');
      }
    } else if (item === 'analytics') {
      const t = topics[1] || topics[0];
      if (t) setSelectedTopic(t);
    } else if (item === 'assistant') {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } else if (item === 'saved' || item === 'settings') {
      showToast(`Navigated to ${item} section`);
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
    <div className="min-h-screen bg-dark-bg text-text-primary flex font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-dark-card border border-primary-cyan text-primary-cyan text-xs font-mono shadow-2xl flex items-center space-x-2 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-primary-cyan animate-ping" />
          <span>{notification}</span>
        </div>
      )}

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNavigate={handleNavigate}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
      />

      {/* Main App Container (offset by sidebar width on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Navigation Bar */}
        <Topbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          darkMode={darkMode}
          onToggleTheme={handleToggleTheme}
          onOpenScenarioModal={() => setIsScenarioTesterOpen(true)}
          onOpenLogsModal={() => setIsRunLogsOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={() => {
            if (searchQuery.trim() && topics.length > 0) {
              setSelectedTopic(topics[0]);
            }
          }}
        />

        {/* Dynamic Content: Dashboard Overview or Topic Detail */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto">
          {selectedTopic ? (
            <TopicDetailView
              topic={selectedTopic}
              papers={topicPapers}
              trends={topicTrends}
              runs={topicRuns}
              onBack={() => {
                setSelectedTopic(null);
                setActiveNav('home');
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
              onSelectTopic={topic => {
                setSelectedTopic(topic);
                setActiveNav('topics');
              }}
              onOpenCreateTopic={() => setIsCreateTopicOpen(true)}
              onTriggerAll={handleTriggerAll}
              onTriggerTopic={handleTriggerTopic}
              isTriggering={isTriggering}
              recentBreakthroughs={recentBreakthroughs}
              onSelectPaper={paper => setSelectedPaperForDrawer(paper)}
              onExploreTrends={() => {
                const t = topics[1] || topics[0];
                if (t) {
                  setSelectedTopic(t);
                  setActiveNav('analytics');
                }
              }}
              onViewActivityLogs={() => setIsRunLogsOpen(true)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-dark-borderSubtle py-4 px-6 text-xs text-text-muted font-mono bg-dark-sidebar/40">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>ResearchPulse &bull; DejaVu Hackathon Advanced Agentic AI Track</span>
            <span className="text-text-muted">From Research to Real Intelligence</span>
          </div>
        </footer>

      </div>

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

      {/* Pro Plan Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
          <div 
            className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsUpgradeModalOpen(false)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative max-w-md w-full bg-dark-sidebar border border-dark-border rounded-2xl p-6 shadow-2xl z-10">
              <div className="flex items-center justify-between pb-3 border-b border-dark-borderSubtle">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Crown className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-base text-text-primary">
                    ResearchPulse Pro
                  </h3>
                </div>
                <button 
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-text-secondary">
                <p>Unlock high-frequency autonomous agent sweeps, multi-model consensus, and unlimited research topics:</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-text-primary">
                    <Check className="w-4 h-4 text-accent-success" />
                    <span>Continuous sub-hour arXiv & conference polling</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-primary">
                    <Check className="w-4 h-4 text-accent-success" />
                    <span>Real-time contradiction and consensus shift alerts</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-primary">
                    <Check className="w-4 h-4 text-accent-success" />
                    <span>Dedicated vector memory and automated weekly synthesis</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Pro Plan simulation activated with 25,000 credits!');
                  setIsUpgradeModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl gradient-btn-purple text-white font-semibold text-xs transition-opacity hover:opacity-90 shadow-glow-violet"
              >
                Upgrade to Pro (Active Track)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
