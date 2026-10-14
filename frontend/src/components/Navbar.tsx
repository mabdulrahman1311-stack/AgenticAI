import React from 'react';
import { 
  Radar, 
  Plus, 
  RefreshCw, 
  Activity, 
  Terminal, 
  FlaskConical, 
  Sun, 
  Moon, 
  AlertTriangle, 
  Flame, 
  BookOpen,
  Layers
} from 'lucide-react';
import { SystemStats } from '../types';

interface NavbarProps {
  stats: SystemStats | null;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenCreateTopic: () => void;
  onOpenScenarioModal: () => void;
  onOpenLogsModal: () => void;
  onTriggerAll: () => void;
  isTriggering: boolean;
  activeView: 'dashboard' | 'topic-detail';
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  darkMode,
  onToggleTheme,
  onOpenCreateTopic,
  onOpenScenarioModal,
  onOpenLogsModal,
  onTriggerAll,
  isTriggering,
  activeView,
  onNavigateHome
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-950/80 light:border-slate-200 light:bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateHome}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Radar className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  ResearchPulse
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-md bg-cyan-950/80 border border-cyan-800 text-cyan-300 tracking-wider">
                  AGENTIC AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-tight hidden sm:block">
                Continuous Research-Monitoring & Change Intelligence
              </p>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          {stats && (
            <div className="hidden lg:flex items-center space-x-4 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-300 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>{stats.total_papers_tracked} Papers Tracked</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                <span>{stats.pending_significance_alerts} High-Impact</span>
              </div>
              {stats.contradiction_warnings_count > 0 && (
                <>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center space-x-1.5 text-amber-400 font-semibold animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{stats.contradiction_warnings_count} Contradiction Warning</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Hackathon Scenarios Launcher */}
            <button
              onClick={onOpenScenarioModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all shadow-sm"
              title="Test the 6 Hackathon Rubric Evaluation Scenarios"
            >
              <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Rubric Scenarios</span>
            </button>

            {/* Run Logs / Diagnostics */}
            <button
              onClick={onOpenLogsModal}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg border border-slate-800 transition-all"
              title="View Run Diagnostics & Agent Execution Logs"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* Trigger All Run */}
            <button
              onClick={onTriggerAll}
              disabled={isTriggering}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 disabled:opacity-50 transition-all"
              title="Trigger immediate monitoring run across all active topics"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isTriggering ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Check Now</span>
            </button>

            {/* Create Topic Button */}
            <button
              onClick={onOpenCreateTopic}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-glow-cyan transition-all font-sans"
            >
              <Plus className="w-4 h-4" />
              <span>New Topic</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 rounded-lg border border-slate-800 transition-all"
              title="Toggle Light / Dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
