import React, { useState } from 'react';
import { X, Plus, Sparkles, Clock, Tag } from 'lucide-react';

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string; keywords: string[]; schedule_interval_hours: number }) => Promise<void>;
}

export const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [keywordsStr, setKeywordsStr] = useState('');
  const [scheduleHours, setScheduleHours] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Topic name is required');
      return;
    }

    const keywords = keywordsStr
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (keywords.length === 0) {
      setError('At least one keyword is required for automated retrieval');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        keywords,
        schedule_interval_hours: scheduleHours
      });
      // Reset form
      setName('');
      setDescription('');
      setKeywordsStr('');
      setScheduleHours(6);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-10">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-100">
                Create Monitored Research Topic
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Topic Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Long-Horizon Tool-Use & Multi-Agent Planning"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Research Scope / Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what specific methodologies, benchmarks, or developments to track..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs resize-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Keywords for arXiv & Source Retrieval (comma-separated) <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={keywordsStr}
                  onChange={e => setKeywordsStr(e.target.value)}
                  placeholder="e.g. agentic reasoning, tool use, self-correction, webarena"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                The agent parses Atom XML feeds from arXiv using these exact boolean query terms.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-300">
                  Monitoring Interval (Hours)
                </label>
                <span className="font-mono font-bold text-cyan-400">{scheduleHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                value={scheduleHours}
                onChange={e => setScheduleHours(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Every 1h</span>
                <span>Every 6h</span>
                <span>Every 12h</span>
                <span>Every 24h</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold disabled:opacity-50 transition-all font-sans"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Initializing Topic...' : 'Start Monitoring'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
