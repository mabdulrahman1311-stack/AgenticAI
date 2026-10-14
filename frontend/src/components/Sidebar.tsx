import React from 'react';
import { 
  Home, 
  Search, 
  Radio, 
  FileText, 
  Sparkles, 
  BarChart3, 
  Bot, 
  Bookmark, 
  Settings, 
  Crown, 
  ArrowUpRight,
  Atom,
  X
} from 'lucide-react';

export type NavItem = 
  | 'home' 
  | 'topics' 
  | 'monitoring' 
  | 'publications' 
  | 'insights' 
  | 'analytics' 
  | 'assistant' 
  | 'saved' 
  | 'settings';

interface SidebarProps {
  activeNav: NavItem;
  onNavigate: (item: NavItem) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenUpgradeModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  onOpenUpgradeModal
}) => {
  const navItems = [
    { id: 'home' as NavItem, label: 'Home', icon: Home },
    { id: 'topics' as NavItem, label: 'Research Topics', icon: Search },
    { id: 'monitoring' as NavItem, label: 'Monitoring', icon: Radio },
    { id: 'publications' as NavItem, label: 'Publications', icon: FileText },
    { id: 'insights' as NavItem, label: 'Insights', icon: Sparkles },
    { id: 'analytics' as NavItem, label: 'Analytics', icon: BarChart3 },
    { id: 'assistant' as NavItem, label: 'AI Assistant', icon: Bot },
    { id: 'saved' as NavItem, label: 'Saved', icon: Bookmark },
    { id: 'settings' as NavItem, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-dark-sidebar border-r border-dark-border flex flex-col justify-between transition-transform duration-300 ease-in-out font-sans
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Logo & Nav */}
        <div className="p-4 flex-1 flex flex-col overflow-y-auto">
          
          {/* Logo Header */}
          <div className="flex items-center justify-between pb-6 pt-1 px-2 border-b border-dark-borderSubtle mb-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-blue via-primary-violet to-primary-magenta p-0.5 shadow-glow-blue">
                <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                  <Atom className="w-5 h-5 text-primary-cyan animate-spin-slow group-hover:rotate-180 transition-transform duration-700" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-cyan"></span>
                </span>
              </div>
              <div>
                <span className="font-display font-bold text-lg text-text-primary tracking-tight">
                  Research<span className="text-primary-cyan">Pulse</span>
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-text-muted uppercase">
                  Agentic Intelligence
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                    ${isActive 
                      ? 'gradient-btn-active text-white font-semibold' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-dark-surface/80'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-cyan shadow-glow-cyan" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Pro Plan Card & Quote */}
        <div className="p-4 border-t border-dark-borderSubtle bg-dark-sidebar/50">
          
          {/* Pro Plan Card */}
          <div className="pulse-card p-3.5 mb-3.5 bg-gradient-to-b from-dark-surface to-dark-card relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Crown className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-text-primary block leading-tight">
                    Pro Plan
                  </span>
                  <span className="text-[10px] text-text-muted block">
                    ResearchPulse Intelligence
                  </span>
                </div>
              </div>
            </div>

            {/* Credit Progress */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-text-secondary">3,200 / 5,000 credits</span>
                <span className="text-primary-cyan font-bold">64%</span>
              </div>
              <div className="w-full h-1.5 bg-dark-bg rounded-full overflow-hidden border border-dark-borderSubtle">
                <div 
                  className="h-full bg-gradient-to-r from-primary-cyan via-primary-blue to-primary-violet rounded-full"
                  style={{ width: '64%' }}
                />
              </div>
            </div>

            {/* Upgrade Button */}
            <button
              onClick={onOpenUpgradeModal}
              className="w-full mt-3 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg gradient-btn-purple text-white text-xs font-semibold hover:opacity-95 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          {/* Subtitle / Quote */}
          <div className="px-2 pt-1 text-center">
            <p className="text-[10px] text-text-muted italic leading-relaxed">
              "Better questions. Deeper research. Greater discoveries."
            </p>
          </div>

        </div>
      </aside>
    </>
  );
};
