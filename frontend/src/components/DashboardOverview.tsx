import React from 'react';
import { Topic, SystemStats, EnrichedPaperItem } from '../types';
import { HeroBanner } from './HeroBanner';
import { MetricCardsRow } from './MetricCardsRow';
import { ActivityChartCard } from './ActivityChartCard';
import { TopTopicsCard } from './TopTopicsCard';
import { LatestInsightsCard } from './LatestInsightsCard';
import { QuickActionsCard } from './QuickActionsCard';
import { RightAssistantPanel } from './RightAssistantPanel';

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
  onExploreTrends: () => void;
  onViewActivityLogs: () => void;
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
  onSelectPaper,
  onExploreTrends,
  onViewActivityLogs
}) => {
  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. Hero Banner */}
      <HeroBanner 
        stats={stats}
        onExploreTrends={onExploreTrends}
        onAnalyzeAI={() => {
          const firstPaper = recentBreakthroughs[0];
          if (firstPaper) onSelectPaper(firstPaper);
        }}
        onTrackUpdates={onTriggerAll}
      />

      {/* 2. Row of 4 KPI Metric Cards */}
      <MetricCardsRow 
        stats={stats}
        onSelectCard={(type) => {
          if (type === 'contradictions') {
            const contradictionTopic = topics.find(t => (t.contradiction_count ?? 0) > 0) || topics[1] || topics[0];
            if (contradictionTopic) onSelectTopic(contradictionTopic);
          } else if (type === 'shifts') {
            const highImpactTopic = topics.find(t => (t.high_impact_count ?? 0) > 0) || topics[0];
            if (highImpactTopic) onSelectTopic(highImpactTopic);
          } else {
            if (topics.length > 0) onSelectTopic(topics[0]);
          }
        }}
      />

      {/* 3. Multi-Column Content: Main Content (Left) + Right Intelligence Panel (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column (8 of 12 cols on XL screens) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Middle Grid: Activity Overview Chart (2/3) + Top Research Topics (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <ActivityChartCard />
            </div>
            <div className="lg:col-span-5">
              <TopTopicsCard 
                topics={topics}
                onSelectTopic={onSelectTopic}
                onViewAll={() => {
                  if (topics[0]) onSelectTopic(topics[0]);
                }}
              />
            </div>
          </div>

          {/* Bottom Grid: Latest Insights + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <LatestInsightsCard 
                papers={recentBreakthroughs}
                onSelectPaper={onSelectPaper}
                onViewAll={() => {
                  if (topics[0]) onSelectTopic(topics[0]);
                }}
              />
            </div>
            <div className="lg:col-span-5">
              <QuickActionsCard 
                onCreateTopic={onOpenCreateTopic}
                onRunScan={onTriggerAll}
                isScanning={isTriggering}
                onViewReports={onExploreTrends}
                onManageTopics={() => {
                  if (topics[0]) onSelectTopic(topics[0]);
                }}
              />
            </div>
          </div>

        </div>

        {/* Right Column (4 of 12 cols on XL screens) */}
        <div className="xl:col-span-4">
          <RightAssistantPanel 
            papers={recentBreakthroughs}
            onSelectPaper={onSelectPaper}
            onExploreTrends={onExploreTrends}
            onViewActivityLogs={onViewActivityLogs}
          />
        </div>

      </div>

    </div>
  );
};
