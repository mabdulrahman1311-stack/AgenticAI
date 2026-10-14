import React from 'react';
import { 
  Compass, 
  ArrowRight, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  Bot
} from 'lucide-react';
import { Topic } from '../types';

interface TopTopicsCardProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onViewAll?: () => void;
}

export const TopTopicsCard: React.FC<TopTopicsCardProps> = ({
  topics,
  onSelectTopic,
  onViewAll
}) => {
  // Map or merge real topics with default showcase topics
  const showcaseList = [
    {
      rank: 1,
      name: topics[0]?.name || "Autonomous Agentic AI & Tool-Use Reasoning",
      meta: "2.4K publications • 12h ago",
      tag: "HOT",
      tagColor: "bg-emerald-500/15 border-emerald-500/40 text-accent-success",
      icon: Bot,
      iconBg: "bg-primary-blue/20 text-primary-cyan",
      realTopic: topics.find(t => t.name.includes("Agentic")) || topics[0]
    },
    {
      rank: 2,
      name: topics[1]?.name || "Efficient LLM Inference & Architectures",
      meta: "1.8K publications • 1d ago",
      tag: "TRENDING",
      tagColor: "bg-primary-violet/15 border-primary-violet/40 text-primary-violet",
      icon: Cpu,
      iconBg: "bg-primary-violet/20 text-primary-violet",
      realTopic: topics.find(t => t.name.includes("Inference")) || topics[1]
    },
    {
      rank: 3,
      name: "Multimodal Learning & Fusion",
      meta: "1.2K publications • 2d ago",
      tag: "GROWING",
      tagColor: "bg-primary-cyan/15 border-primary-cyan/40 text-primary-cyan",
      icon: Layers,
      iconBg: "bg-primary-blue/20 text-primary-blue",
      realTopic: topics[2] || topics[0]
    },
    {
      rank: 4,
      name: "AI Safety & Alignment",
      meta: "980 publications • 2d ago",
      tag: "STABLE",
      tagColor: "bg-dark-surface border-dark-border text-text-muted",
      icon: ShieldCheck,
      iconBg: "bg-emerald-500/20 text-accent-success",
      realTopic: topics[0]
    },
    {
      rank: 5,
      name: "Scientific Discovery Acceleration",
      meta: "760 publications • 3d ago",
      tag: "STABLE",
      tagColor: "bg-dark-surface border-dark-border text-text-muted",
      icon: Sparkles,
      iconBg: "bg-amber-500/20 text-accent-warning",
      realTopic: topics[1] || topics[0]
    }
  ];

  return (
    <div className="pulse-card p-5 lg:p-6 flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-dark-borderSubtle">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-primary-cyan/15 text-primary-cyan">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-sm sm:text-base text-text-primary">
            Top Research Topics
          </h3>
        </div>

        <button 
          onClick={onViewAll}
          className="text-xs text-primary-cyan hover:text-primary-blue transition-colors flex items-center space-x-1 font-medium font-sans"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ranked List */}
      <div className="space-y-2.5">
        {showcaseList.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.rank}
              onClick={() => item.realTopic && onSelectTopic(item.realTopic)}
              className="p-2.5 rounded-xl bg-dark-bg/60 hover:bg-dark-surface border border-dark-borderSubtle hover:border-dark-border cursor-pointer transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <span className="font-mono text-xs font-bold text-text-muted w-3.5 text-center">
                  {item.rank}
                </span>

                <div className={`p-1.5 rounded-lg ${item.iconBg} flex-shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0">
                  <h4 className="font-semibold text-xs text-text-primary group-hover:text-primary-cyan transition-colors truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-text-muted font-sans truncate">
                    {item.meta}
                  </p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border tracking-wider flex-shrink-0 ${item.tagColor}`}>
                {item.tag}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
