import React from 'react';
import { 
  Shield, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Compass, 
  Cpu, 
  Activity, 
  ChevronRight,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { SystemStats } from '../types';

interface HeroBannerProps {
  stats: SystemStats | null;
  onExploreTrends: () => void;
  onAnalyzeAI: () => void;
  onTrackUpdates: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  stats,
  onExploreTrends,
  onAnalyzeAI,
  onTrackUpdates,
}) => {
  return (
    <div className="relative rounded-2xl border border-dark-border bg-gradient-to-br from-dark-card via-dark-surface to-dark-card p-6 lg:p-7 overflow-hidden hero-glow-bg shadow-card">
      
      {/* Background radial ambient lights */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary-violet/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-primary-cyan/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Headlines & Stat Badges */}
        <div className="max-w-xl flex-1">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-cyan/10 border border-primary-cyan/30 text-accent-success text-[11px] font-mono tracking-wide mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-success animate-ping" />
            <span className="font-semibold text-primary-cyan">AI POWERED RESEARCH PLATFORM</span>
            <ChevronRight className="w-3 h-3 text-primary-cyan/70" />
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[2.2rem] text-text-primary tracking-tight leading-[1.18] mb-3">
            Command Your Research <br />
            with <span className="gradient-text-intelligence">Intelligence</span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6 font-sans">
            Monitor scientific frontiers, detect emerging trends, track publications and get AI-powered insights — all in one place.
          </p>

          {/* 4 Quick Stat Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            
            {/* Pill 1: Active Topics */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-dark-bg/80 border border-dark-border text-xs">
              <div className="p-1 rounded-lg bg-emerald-500/15 text-accent-success">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="font-mono font-bold text-text-primary">
                  {stats?.active_topics_count ?? 10}
                </span>
                <span className="text-[11px] text-text-muted">Active Topics</span>
              </div>
            </div>

            {/* Pill 2: Papers Tracked */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-dark-bg/80 border border-dark-border text-xs">
              <div className="p-1 rounded-lg bg-primary-blue/15 text-primary-cyan">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="font-mono font-bold text-text-primary">
                  {stats ? `${(stats.total_papers_tracked / 1000).toFixed(1)}K` : '2.4K'}
                </span>
                <span className="text-[11px] text-text-muted">Papers Tracked</span>
              </div>
            </div>

            {/* Pill 3: High Impact */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-dark-bg/80 border border-dark-border text-xs">
              <div className="p-1 rounded-lg bg-primary-violet/15 text-primary-violet">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="font-mono font-bold text-primary-violet">
                  {stats?.pending_significance_alerts ?? 6}
                </span>
                <span className="text-[11px] text-text-muted">High Impact Shifts</span>
              </div>
            </div>

            {/* Pill 4: Alerts / Contradictions */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-dark-bg/80 border border-dark-border text-xs">
              <div className="p-1 rounded-lg bg-amber-500/15 text-accent-warning">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="font-mono font-bold text-accent-warning">
                  {stats?.contradiction_warnings_count ?? 1}
                </span>
                <span className="text-[11px] text-text-muted">Alerts</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: 3D Holographic Brain & Orbit Visualization */}
        <div className="relative w-full lg:w-[420px] h-64 sm:h-72 flex items-center justify-center">
          
          {/* Glowing Neural Sphere Canvas / SVG */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            
            {/* Center Glowing Core */}
            <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-primary-cyan via-primary-violet to-primary-magenta blur-xl opacity-60 animate-pulse" />
            <div className="absolute w-36 h-36 rounded-full border border-primary-cyan/20 animate-spin-slow" />
            <div className="absolute w-48 h-48 rounded-full border border-primary-violet/25 border-dashed animate-reverse-spin" />

            {/* Abstract Neural Nodes & Filaments SVG */}
            <svg className="w-52 h-52 relative z-10 animate-float" viewBox="0 0 200 200" fill="none">
              <defs>
                <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#D946EF" stopOpacity="0.8" />
                </linearGradient>
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00D9FF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Orbital Rings */}
              <ellipse cx="100" cy="100" rx="85" ry="32" stroke="url(#orbitGrad1)" strokeWidth="1.5" transform="rotate(-28 100 100)" strokeDasharray="3 4" opacity="0.8" />
              <ellipse cx="100" cy="100" rx="85" ry="32" stroke="url(#orbitGrad1)" strokeWidth="1.5" transform="rotate(35 100 100)" opacity="0.6" />
              <ellipse cx="100" cy="100" rx="70" ry="24" stroke="#00D9FF" strokeWidth="1.2" transform="rotate(-65 100 100)" strokeDasharray="4 2" opacity="0.5" />

              {/* Connected Network Mesh */}
              <path d="M60,80 L100,50 L140,80 L150,120 L100,150 L50,120 Z" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" fill="none" />
              <path d="M100,50 L100,150 M60,80 L150,120 M140,80 L50,120" stroke="rgba(0, 217, 255, 0.35)" strokeWidth="0.8" />

              {/* Neural Nodes */}
              <circle cx="100" cy="50" r="4.5" fill="#00D9FF" filter="drop-shadow(0 0 6px #00D9FF)" />
              <circle cx="140" cy="80" r="4" fill="#8B5CF6" filter="drop-shadow(0 0 5px #8B5CF6)" />
              <circle cx="150" cy="120" r="3.5" fill="#D946EF" filter="drop-shadow(0 0 5px #D946EF)" />
              <circle cx="100" cy="150" r="4.5" fill="#00D9FF" filter="drop-shadow(0 0 6px #00D9FF)" />
              <circle cx="50" cy="120" r="4" fill="#8B5CF6" filter="drop-shadow(0 0 5px #8B5CF6)" />
              <circle cx="60" cy="80" r="3.5" fill="#00D9FF" filter="drop-shadow(0 0 5px #00D9FF)" />

              {/* Inner Synapse Core */}
              <circle cx="100" cy="100" r="14" fill="#030817" stroke="#00D9FF" strokeWidth="2" filter="drop-shadow(0 0 10px #00D9FF)" />
              <circle cx="100" cy="100" r="6" fill="#8B5CF6" />
            </svg>

            {/* Mini Floating Hologram Chart Overlay */}
            <div className="absolute -bottom-2 -right-4 p-2.5 rounded-xl bg-dark-card/90 border border-primary-cyan/40 backdrop-blur-md shadow-glow-cyan hidden sm:block">
              <div className="flex items-center space-x-1.5 mb-1 text-[9px] font-mono text-primary-cyan">
                <BarChart2 className="w-3 h-3" />
                <span>AI SOTA DELTA</span>
              </div>
              <div className="flex items-end space-x-1 h-6 w-16">
                <div className="w-2.5 h-3 bg-primary-blue/60 rounded-t" />
                <div className="w-2.5 h-4 bg-primary-violet/80 rounded-t" />
                <div className="w-2.5 h-6 bg-primary-cyan rounded-t animate-pulse" />
                <div className="w-2.5 h-5 bg-primary-magenta/90 rounded-t" />
              </div>
            </div>

          </div>

          {/* Floating Callout Chip 1: Discover Emerging Trends */}
          <button
            onClick={onExploreTrends}
            className="absolute top-2 left-0 sm:-left-4 px-3 py-1.5 rounded-xl bg-dark-card/90 hover:bg-dark-surface border border-primary-blue/40 shadow-glow-blue flex items-center space-x-2 text-left group transition-all"
          >
            <div className="p-1 rounded-lg bg-primary-blue/20 text-primary-cyan">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-text-primary block leading-tight group-hover:text-primary-cyan transition-colors">
                Discover
              </span>
              <span className="text-[9px] text-text-muted font-sans">
                Emerging Trends
              </span>
            </div>
          </button>

          {/* Floating Callout Chip 2: Analyze with AI */}
          <button
            onClick={onAnalyzeAI}
            className="absolute bottom-12 left-2 sm:-left-2 px-3 py-1.5 rounded-xl bg-dark-card/90 hover:bg-dark-surface border border-primary-violet/40 shadow-glow-violet flex items-center space-x-2 text-left group transition-all"
          >
            <div className="p-1 rounded-lg bg-primary-violet/20 text-primary-violet">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-text-primary block leading-tight group-hover:text-primary-violet transition-colors">
                Analyze
              </span>
              <span className="text-[9px] text-text-muted font-sans">
                with AI
              </span>
            </div>
          </button>

          {/* Floating Callout Chip 3: Track Real-time Updates */}
          <button
            onClick={onTrackUpdates}
            className="absolute top-8 right-0 sm:-right-4 px-3 py-1.5 rounded-xl bg-dark-card/90 hover:bg-dark-surface border border-primary-cyan/40 shadow-glow-cyan flex items-center space-x-2 text-left group transition-all"
          >
            <div className="p-1 rounded-lg bg-primary-cyan/20 text-primary-cyan">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-text-primary block leading-tight group-hover:text-primary-cyan transition-colors">
                Track
              </span>
              <span className="text-[9px] text-text-muted font-sans">
                Real-time Updates
              </span>
            </div>
          </button>

        </div>

      </div>

    </div>
  );
};
