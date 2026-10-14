import React from 'react';
import { 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  Menu, 
  FlaskConical,
  Atom,
  Terminal
} from 'lucide-react';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenScenarioModal: () => void;
  onOpenLogsModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  darkMode,
  onToggleTheme,
  onOpenScenarioModal,
  onOpenLogsModal,
  searchQuery,
  onSearchChange,
  onSearchSubmit
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 w-full glass-header flex items-center justify-between px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Left: Hamburger & Tagline */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-dark-surface lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="hidden sm:flex items-center space-x-2 text-xs text-text-muted font-sans border-l border-dark-border pl-3">
            <span className="text-text-secondary font-medium tracking-tight">From Research to Real Intelligence</span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Search className="w-4 h-4 text-primary-cyan/80" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit && onSearchSubmit()}
            placeholder="Search topics, papers, keywords, authors, or ask AI..."
            className="w-full pl-9 pr-12 py-2 rounded-xl bg-dark-card/90 border border-dark-border text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-cyan/60 focus:ring-1 focus:ring-primary-cyan/40 transition-all font-sans"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-md bg-dark-surface border border-dark-border text-text-muted">
              ⌘ K
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Theme, Scenarios & Profile */}
      <div className="flex items-center space-x-3">
        
        {/* Rubric Scenarios Button */}
        <button
          onClick={onOpenScenarioModal}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-primary-violet/10 hover:bg-primary-violet/20 border border-primary-violet/30 text-primary-violet text-xs font-semibold transition-all shadow-sm"
          title="Test 6 Hackathon Rubric Evaluation Scenarios"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Rubric Scenarios</span>
        </button>

        {/* Diagnostics / Run Logs */}
        <button
          onClick={onOpenLogsModal}
          className="p-2 rounded-xl text-text-secondary hover:text-primary-cyan hover:bg-dark-surface border border-dark-borderSubtle transition-colors"
          title="View Agent Execution Logs"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-text-secondary hover:text-amber-400 hover:bg-dark-surface border border-dark-borderSubtle transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Moon className="w-4 h-4 text-primary-cyan" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>

        {/* Notification Bell with alert dot */}
        <div className="relative">
          <button 
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-dark-surface border border-dark-borderSubtle transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-magenta ring-2 ring-dark-header animate-pulse" />
        </div>

        {/* User Profile Menu */}
        <div className="flex items-center space-x-2 pl-2 border-l border-dark-borderSubtle">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-blue to-primary-violet flex items-center justify-center text-white font-bold text-xs shadow-glow-blue cursor-pointer">
            DK
          </div>
          <div className="hidden xl:block text-left">
            <span className="block text-xs font-semibold text-text-primary leading-tight">
              Dhanesh K
            </span>
            <span className="flex items-center text-[10px] text-accent-success font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-success mr-1 animate-pulse" />
              Active
            </span>
          </div>
        </div>

      </div>

    </header>
  );
};
