import React from 'react';
import { Plus, RefreshCw, FileText, Settings, Zap } from 'lucide-react';

interface QuickActionsCardProps {
  onCreateTopic: () => void;
  onRunScan: () => void;
  isScanning: boolean;
  onViewReports: () => void;
  onManageTopics: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onCreateTopic,
  onRunScan,
  isScanning,
  onViewReports,
  onManageTopics
}) => {
  return (
    <div className="pulse-card p-5 lg:p-6 flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-dark-borderSubtle">
        <div className="p-1.5 rounded-lg bg-primary-blue/15 text-primary-cyan">
          <Zap className="w-4 h-4" />
        </div>
        <h3 className="font-display font-bold text-sm sm:text-base text-text-primary">
          Quick Actions
        </h3>
      </div>

      {/* 2x2 Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Action 1: Create New Topic */}
        <button
          onClick={onCreateTopic}
          className="p-3 rounded-xl bg-dark-bg/80 hover:bg-dark-surface border border-dark-borderSubtle hover:border-primary-cyan/40 text-left transition-all flex items-start space-x-3 group"
        >
          <div className="p-2 rounded-lg bg-primary-blue/20 text-primary-cyan group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-xs text-text-primary block leading-tight group-hover:text-primary-cyan transition-colors">
              Create New Topic
            </span>
            <span className="text-[10px] text-text-muted block mt-0.5 font-sans">
              Start monitoring a new area
            </span>
          </div>
        </button>

        {/* Action 2: Run System Scan */}
        <button
          onClick={onRunScan}
          disabled={isScanning}
          className="p-3 rounded-xl bg-dark-bg/80 hover:bg-dark-surface border border-dark-borderSubtle hover:border-primary-cyan/40 text-left transition-all flex items-start space-x-3 group disabled:opacity-50"
        >
          <div className="p-2 rounded-lg bg-emerald-500/20 text-accent-success group-hover:scale-105 transition-transform">
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <span className="font-semibold text-xs text-text-primary block leading-tight group-hover:text-accent-success transition-colors">
              Run System Scan
            </span>
            <span className="text-[10px] text-text-muted block mt-0.5 font-sans">
              Check for latest research
            </span>
          </div>
        </button>

        {/* Action 3: View Reports */}
        <button
          onClick={onViewReports}
          className="p-3 rounded-xl bg-dark-bg/80 hover:bg-dark-surface border border-dark-borderSubtle hover:border-primary-cyan/40 text-left transition-all flex items-start space-x-3 group"
        >
          <div className="p-2 rounded-lg bg-primary-violet/20 text-primary-violet group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-xs text-text-primary block leading-tight group-hover:text-primary-violet transition-colors">
              View Reports
            </span>
            <span className="text-[10px] text-text-muted block mt-0.5 font-sans">
              Generate detailed insights
            </span>
          </div>
        </button>

        {/* Action 4: Manage Topics */}
        <button
          onClick={onManageTopics}
          className="p-3 rounded-xl bg-dark-bg/80 hover:bg-dark-surface border border-dark-borderSubtle hover:border-primary-cyan/40 text-left transition-all flex items-start space-x-3 group"
        >
          <div className="p-2 rounded-lg bg-primary-blue/20 text-primary-blue group-hover:scale-105 transition-transform">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-xs text-text-primary block leading-tight group-hover:text-primary-cyan transition-colors">
              Manage Topics
            </span>
            <span className="text-[10px] text-text-muted block mt-0.5 font-sans">
              Edit / organize your topics
            </span>
          </div>
        </button>

      </div>

    </div>
  );
};
