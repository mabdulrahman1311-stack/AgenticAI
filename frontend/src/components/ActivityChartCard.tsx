import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, ChevronDown } from 'lucide-react';

const SAMPLE_CHART_DATA = [
  { date: 'Apr 1', publications: 35, topicShifts: 15, newFindings: 25 },
  { date: 'Apr 4', publications: 58, topicShifts: 28, newFindings: 42 },
  { date: 'Apr 7', publications: 92, topicShifts: 45, newFindings: 68 },
  { date: 'Apr 10', publications: 135, topicShifts: 65, newFindings: 85 },
  { date: 'Apr 13', publications: 110, topicShifts: 85, newFindings: 72 },
  { date: 'Apr 16', publications: 145, topicShifts: 92, newFindings: 105 },
  { date: 'Apr 19', publications: 130, topicShifts: 115, newFindings: 95 },
  { date: 'Apr 22', publications: 165, topicShifts: 98, newFindings: 135 },
  { date: 'Apr 25', publications: 150, topicShifts: 130, newFindings: 110 },
  { date: 'Apr 28', publications: 185, topicShifts: 140, newFindings: 145 },
  { date: 'Apr 30', publications: 198, topicShifts: 160, newFindings: 155 },
];

export const ActivityChartCard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Last 30 days');

  return (
    <div className="pulse-card p-5 lg:p-6 flex flex-col justify-between">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-primary-violet/15 text-primary-violet">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-text-primary">
              Research Activity Overview
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Publications, topic shifts and new findings over time
          </p>
        </div>

        {/* Legend & Filter */}
        <div className="flex flex-wrap items-center gap-3.5 text-xs">
          <div className="flex items-center space-x-3 text-[11px] font-sans">
            <span className="flex items-center space-x-1.5 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-primary-cyan shadow-glow-cyan" />
              <span>Publications</span>
            </span>
            <span className="flex items-center space-x-1.5 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-primary-violet shadow-glow-violet" />
              <span>Topic Shifts</span>
            </span>
            <span className="flex items-center space-x-1.5 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-accent-success" />
              <span>New Findings</span>
            </span>
          </div>

          <div className="relative">
            <button className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-dark-bg border border-dark-border text-xs text-text-secondary hover:text-text-primary">
              <span>{timeRange}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Area Chart */}
      <div className="h-60 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SAMPLE_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradPubs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradShifts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradFindings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E5B0" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00E5B0" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(58, 130, 246, 0.1)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#617795" 
              tick={{ fontSize: 10, fill: '#617795' }} 
              axisLine={{ stroke: 'rgba(58, 130, 246, 0.15)' }}
              tickLine={false}
            />
            <YAxis 
              stroke="#617795" 
              tick={{ fontSize: 10, fill: '#617795' }} 
              axisLine={false}
              tickLine={false}
              ticks={[0, 50, 100, 150, 200]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#050D1C',
                borderColor: 'rgba(58, 130, 246, 0.3)',
                borderRadius: '0.75rem',
                fontSize: '11px',
                color: '#F1F5FF',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="publications" 
              name="Publications" 
              stroke="#00D9FF" 
              strokeWidth={2.2} 
              fillOpacity={1} 
              fill="url(#gradPubs)" 
            />
            <Area 
              type="monotone" 
              dataKey="topicShifts" 
              name="Topic Shifts" 
              stroke="#8B5CF6" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#gradShifts)" 
            />
            <Area 
              type="monotone" 
              dataKey="newFindings" 
              name="New Findings" 
              stroke="#00E5B0" 
              strokeWidth={1.8} 
              fillOpacity={1} 
              fill="url(#gradFindings)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
