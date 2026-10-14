import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Send, 
  HelpCircle, 
  FileSearch, 
  TrendingUp, 
  FileText,
  Shield, 
  BookOpen, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Atom,
  Bot
} from 'lucide-react';
import { EnrichedPaperItem } from '../types';

interface RightAssistantPanelProps {
  papers: EnrichedPaperItem[];
  onSelectPaper: (paper: EnrichedPaperItem) => void;
  onExploreTrends: () => void;
  onViewActivityLogs: () => void;
}

export const RightAssistantPanel: React.FC<RightAssistantPanelProps> = ({
  papers,
  onSelectPaper,
  onExploreTrends,
  onViewActivityLogs
}) => {
  const [question, setQuestion] = useState('');
  const [assistantResponse, setAssistantResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleAsk = (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setIsThinking(true);
    setAssistantResponse(null);

    setTimeout(() => {
      setIsThinking(false);
      const lower = q.toLowerCase();
      if (lower.includes('trend') || lower.includes('emerging')) {
        setAssistantResponse(
          "Latest trends show Speculative Decoding accelerating by +195% and Sparse MoE architectures reducing memory by 58%. Over 14 papers observed in the last 30 days."
        );
      } else if (lower.includes('contradiction') || lower.includes('conflict')) {
        setAssistantResponse(
          "Critical Contradiction Detected: Al-Mansoor et al. (arXiv:2404.11290) refutes Vance et al., demonstrating 1M-token needle retrieval with linear SSMs."
        );
      } else if (lower.includes('summarize') || lower.includes('recent')) {
        setAssistantResponse(
          "Synthesizing latest runs: Self-Reflective Tree-Search raised WebArena SOTA to 92.1% (+17.6%). Dynamic MoE eliminated token dropping across 3 convergent sources."
        );
      } else {
        setAssistantResponse(
          `Analysis on "${q}": Tracked across 10 monitored papers. Consensus shows significant acceleration in sub-quadratic attention and agentic verification.`
        );
      }
    }, 600);
  };

  const suggestedPrompts = [
    { label: "Summarize recent findings", icon: Sparkles },
    { label: "Find similar research", icon: FileSearch },
    { label: "What are the emerging trends?", icon: TrendingUp },
    { label: "Generate research report", icon: FileText },
  ];

  const activityList = [
    {
      title: "New research topic detected",
      detail: "LLM inference optimization",
      time: "12m ago",
      icon: Shield,
      iconColor: "text-accent-success bg-accent-success/15"
    },
    {
      title: "Publication indexed",
      detail: "arXiv:2403.09871 (Dynamic MoE)",
      time: "24m ago",
      icon: BookOpen,
      iconColor: "text-primary-blue bg-primary-blue/15"
    },
    {
      title: "Change detected",
      detail: "Significant shift in methodology",
      time: "41m ago",
      icon: TrendingUp,
      iconColor: "text-primary-violet bg-primary-violet/15"
    },
    {
      title: "Contradiction flagged",
      detail: "Results conflict with baseline",
      time: "1h ago",
      icon: AlertTriangle,
      iconColor: "text-accent-warning bg-accent-warning/15"
    },
    {
      title: "Topic updated",
      detail: "Agentic AI in scientific workflows",
      time: "2h ago",
      icon: RefreshCw,
      iconColor: "text-primary-cyan bg-primary-cyan/15"
    }
  ];

  return (
    <div className="space-y-4 font-sans">
      
      {/* 1. AI Research Assistant Card */}
      <div className="pulse-card p-5 bg-gradient-to-b from-dark-surface via-dark-card to-dark-card relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-primary-violet to-primary-magenta text-white shadow-glow-violet">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-sm text-text-primary">
              AI Research Assistant
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary-violet/15 border border-primary-violet/40 text-primary-violet">
            Beta
          </span>
        </div>

        <p className="text-[11px] text-text-secondary leading-relaxed mb-3.5">
          Ask anything about your research or get insights from latest papers.
        </p>

        {/* Input Field */}
        <div className="relative mb-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask a question..."
            className="w-full pl-3 pr-10 py-2 rounded-xl bg-dark-bg border border-dark-border text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-violet/60 focus:ring-1 focus:ring-primary-violet/40 font-sans"
          />
          <button
            onClick={() => handleAsk()}
            disabled={isThinking}
            className="absolute inset-y-1 right-1 w-8 rounded-lg gradient-btn-purple text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Assistant Response Bubble */}
        {(isThinking || assistantResponse) && (
          <div className="mb-3 p-3 rounded-xl bg-dark-bg/90 border border-primary-violet/30 text-xs text-text-primary animate-fade-in">
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-primary-violet font-semibold mb-1">
              <Bot className="w-3.5 h-3.5" />
              <span>{isThinking ? 'AGENT IS SYNTHESIZING...' : 'GROUNDED RESEARCH SYNTHESIS'}</span>
            </div>
            {isThinking ? (
              <div className="flex items-center space-x-2 text-text-muted py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-violet animate-ping" />
                <span>Searching active papers & historical findings...</span>
              </div>
            ) : (
              <p className="text-[11px] text-text-secondary leading-relaxed">
                {assistantResponse}
              </p>
            )}
          </div>
        )}

        {/* Suggested Prompt Chips */}
        <div className="space-y-1.5">
          {suggestedPrompts.map((prompt, i) => {
            const Icon = prompt.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  setQuestion(prompt.label);
                  handleAsk(prompt.label);
                }}
                className="w-full p-2 rounded-xl bg-dark-bg/60 hover:bg-dark-surface border border-dark-borderSubtle hover:border-dark-border text-left text-[11px] text-text-secondary hover:text-text-primary transition-all flex items-center space-x-2 group"
              >
                <div className="p-1 rounded-md bg-dark-surface text-primary-cyan group-hover:scale-105 transition-transform">
                  <Icon className="w-3 h-3" />
                </div>
                <span className="truncate">{prompt.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 2. Recent Activity Card */}
      <div className="pulse-card p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-dark-borderSubtle">
          <h3 className="font-display font-bold text-sm text-text-primary">
            Recent Activity
          </h3>
          <button 
            onClick={onViewActivityLogs}
            className="text-xs text-primary-cyan hover:text-primary-blue transition-colors flex items-center space-x-1 font-medium font-sans"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Activity Items */}
        <div className="space-y-3">
          {activityList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start space-x-3 text-xs">
                <div className={`p-1.5 rounded-lg ${item.iconColor} flex-shrink-0 mt-0.5`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-text-primary block truncate leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-text-muted truncate block">
                    {item.detail}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-muted flex-shrink-0">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. System Status Card */}
      <div className="pulse-card p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-dark-borderSubtle">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-accent-success" />
            <h3 className="font-display font-bold text-sm text-text-primary">
              System Status
            </h3>
          </div>
          <span className="flex items-center space-x-1.5 text-[10px] text-accent-success font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-success animate-pulse" />
            <span>All systems operational</span>
          </span>
        </div>

        {/* 4 Meter Progress Bars */}
        <div className="space-y-2.5 text-xs font-sans">
          
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-text-secondary">Research Agents</span>
              <span className="font-mono font-bold text-primary-cyan">100%</span>
            </div>
            <div className="w-full h-1 bg-dark-bg rounded-full overflow-hidden">
              <div className="h-full bg-primary-cyan rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-text-secondary">NLP Engine</span>
              <span className="font-mono font-bold text-primary-cyan">98%</span>
            </div>
            <div className="w-full h-1 bg-dark-bg rounded-full overflow-hidden">
              <div className="h-full bg-primary-cyan rounded-full" style={{ width: '98%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-text-secondary">Source Monitoring</span>
              <span className="font-mono font-bold text-primary-cyan">100%</span>
            </div>
            <div className="w-full h-1 bg-dark-bg rounded-full overflow-hidden">
              <div className="h-full bg-primary-cyan rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-text-secondary">Deduplication</span>
              <span className="font-mono font-bold text-primary-cyan">99%</span>
            </div>
            <div className="w-full h-1 bg-dark-bg rounded-full overflow-hidden">
              <div className="h-full bg-primary-cyan rounded-full" style={{ width: '99%' }} />
            </div>
          </div>

        </div>

      </div>

      {/* 4. Bottom Quote & Graphic Banner */}
      <div className="p-4 rounded-xl border border-dark-borderSubtle bg-gradient-to-r from-dark-surface to-dark-card flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-primary-blue/20 text-primary-cyan flex-shrink-0 shadow-glow-blue">
          <Atom className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <span className="font-semibold text-xs text-text-primary block leading-tight">
            Better Research.
          </span>
          <span className="text-[11px] text-primary-cyan block font-medium">
            Bigger Discoveries.
          </span>
        </div>
      </div>

    </div>
  );
};
