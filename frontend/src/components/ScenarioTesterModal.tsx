import React from 'react';
import { 
  X, 
  FlaskConical, 
  Layers, 
  AlertTriangle, 
  Filter, 
  TrendingUp, 
  ShieldAlert, 
  Zap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ScenarioTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenarioIndex: number) => void;
  onResetSeed: () => void;
  isSeeding: boolean;
}

const SCENARIOS = [
  {
    index: 1,
    title: "1. Multi-Article Convergence",
    icon: Layers,
    color: "text-primary-violet bg-primary-violet/10 border-primary-violet/30",
    summary: "Collapses 3 distinct publications (arXiv primary + NeurIPS brief + HuggingFace digest) into a single unified parent card with expandable source links.",
    topicName: "Efficient LLM Inference & High-Throughput Architectures",
    evidence: "Dynamic Capacity Routing (DCR) eliminates token dropping and cuts VRAM by 58%."
  },
  {
    index: 2,
    title: "2. Scientific Contradiction Detection",
    icon: AlertTriangle,
    color: "text-accent-warning bg-accent-warning/10 border-accent-warning/30",
    summary: "Flags when a new incoming paper directly contradicts an earlier stored baseline finding with high-priority alert and target refutation link.",
    topicName: "Efficient LLM Inference & High-Throughput Architectures",
    evidence: "Vance et al. claimed linear attention fails past 32k. Al-Mansoor et al. proves 1M needle retrieval, refuting prior consensus."
  },
  {
    index: 3,
    title: "3. Alert Fatigue Prevention",
    icon: Filter,
    color: "text-text-muted bg-dark-surface border-dark-borderSubtle",
    summary: "Automatically identifies minor incremental updates (prompt variations, hyperparameter tuning) and suppresses high-priority push notifications.",
    topicName: "Autonomous Agentic AI & Tool-Use Reasoning",
    evidence: "Prompt engineering variations paper (+0.4% noise) categorized as Minor Update with alerts suppressed."
  },
  {
    index: 4,
    title: "4. Trend Emergence & Horizon Synthesis",
    icon: TrendingUp,
    color: "text-primary-cyan bg-primary-cyan/10 border-primary-cyan/30",
    summary: "Aggregates multi-week paper updates into velocity trends (+195% in Speculative Decoding) and AI-generated narrative reports.",
    topicName: "Efficient LLM Inference & High-Throughput Architectures",
    evidence: "Recharts timeline showing speculative decoding and sub-quadratic attention accelerating over 4 weeks."
  },
  {
    index: 5,
    title: "5. Weakly Supported Claim Handling",
    icon: ShieldAlert,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    summary: "Detects sensational claims without empirical backing and applies caution warning tags with source reliability score reduction.",
    topicName: "Autonomous Agentic AI & Tool-Use Reasoning",
    evidence: "Sensational '3-parameter loop solves AGI' tagged with Caution: Insufficient Empirical Support and reliability reduced to 42%."
  },
  {
    index: 6,
    title: "6. Value / Conclusion Shifts",
    icon: Zap,
    color: "text-accent-success bg-accent-success/10 border-accent-success/30",
    summary: "Extracts quantified benchmark shifts and presents a dedicated Before vs After diff card comparing baseline metrics.",
    topicName: "Autonomous Agentic AI & Tool-Use Reasoning",
    evidence: "WebArena task success shifts from 74.5% to 92.1% (+17.6%) and latency drops from 45.2s to 11.4s."
  }
];

export const ScenarioTesterModal: React.FC<ScenarioTesterModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
  onResetSeed,
  isSeeding
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      <div 
        className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative max-w-3xl w-full bg-dark-sidebar border border-dark-border rounded-2xl p-6 shadow-2xl z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-dark-borderSubtle">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-primary-violet/15 border border-primary-violet/30 text-primary-violet">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-text-primary">
                  DejaVu Hackathon Rubric Evaluation Suite
                </h3>
                <p className="text-xs text-text-muted font-sans">
                  Interactive validation of the 6 required Agentic AI scenarios
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-dark-surface rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reset / Reseed Bar */}
          <div className="mt-4 p-3 rounded-xl bg-dark-bg border border-dark-borderSubtle flex items-center justify-between text-xs">
            <span className="text-text-secondary">
              Need to restore benchmark seed states?
            </span>
            <button
              onClick={onResetSeed}
              disabled={isSeeding}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg gradient-btn-purple text-white font-medium disabled:opacity-50 transition-all shadow-glow-violet"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSeeding ? 'Seeding...' : 'Reset & Seed Scenarios'}</span>
            </button>
          </div>

          {/* Scenario Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
            {SCENARIOS.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.index}
                  onClick={() => {
                    onSelectScenario(s.index);
                    onClose();
                  }}
                  className="pulse-card p-4 cursor-pointer hover:border-primary-cyan/40 hover:bg-dark-surface transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border flex items-center space-x-1.5 ${s.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>Scenario {s.index}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary-cyan group-hover:translate-x-1 transition-all" />
                    </div>

                    <h4 className="font-semibold text-sm text-text-primary mb-1.5 group-hover:text-primary-cyan transition-colors">
                      {s.title}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed mb-2.5">
                      {s.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-dark-borderSubtle text-[11px] text-text-muted font-mono">
                    <span className="text-primary-cyan font-semibold">Test Case:</span> {s.evidence}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
