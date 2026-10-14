import { Topic, EnrichedPaperItem, MonitoringRun, TrendSnapshot, SystemStats } from '../types';

const API_BASE = '/api';

export const api = {
  // Topics
  async getTopics(): Promise<Topic[]> {
    const res = await fetch(`${API_BASE}/topics`);
    if (!res.ok) throw new Error('Failed to fetch topics');
    return res.json();
  },

  async getTopic(id: number): Promise<Topic> {
    const res = await fetch(`${API_BASE}/topics/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch topic ${id}`);
    return res.json();
  },

  async createTopic(data: { name: string; description?: string; keywords: string[]; schedule_interval_hours: number }): Promise<Topic> {
    const res = await fetch(`${API_BASE}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create topic');
    return res.json();
  },

  async deleteTopic(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/topics/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete topic');
  },

  async triggerTopicRun(id: number): Promise<{ message: string; run_id: number; status: string }> {
    const res = await fetch(`${API_BASE}/topics/${id}/trigger`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to trigger monitoring run');
    return res.json();
  },

  // Papers & Stream
  async getTopicPapers(
    topicId: number, 
    filters?: {
      significance?: string;
      group_by_cluster?: boolean;
      search?: string;
      has_contradiction?: boolean;
      weakly_supported?: boolean;
    }
  ): Promise<EnrichedPaperItem[]> {
    const params = new URLSearchParams();
    if (filters?.significance) params.append('significance', filters.significance);
    if (filters?.group_by_cluster !== undefined) params.append('group_by_cluster', String(filters.group_by_cluster));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.has_contradiction !== undefined) params.append('has_contradiction', String(filters.has_contradiction));
    if (filters?.weakly_supported !== undefined) params.append('weakly_supported', String(filters.weakly_supported));

    const res = await fetch(`${API_BASE}/topics/${topicId}/papers?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch topic papers');
    return res.json();
  },

  // Runs & Diagnostics
  async getTopicRuns(topicId: number): Promise<MonitoringRun[]> {
    const res = await fetch(`${API_BASE}/topics/${topicId}/runs`);
    if (!res.ok) throw new Error('Failed to fetch topic runs');
    return res.json();
  },

  async getAllRuns(limit: number = 20): Promise<MonitoringRun[]> {
    const res = await fetch(`${API_BASE}/runs?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch recent runs');
    return res.json();
  },

  // Trends
  async getTopicTrends(topicId: number): Promise<TrendSnapshot[]> {
    const res = await fetch(`${API_BASE}/topics/${topicId}/trends`);
    if (!res.ok) throw new Error('Failed to fetch topic trends');
    return res.json();
  },

  async regenerateTopicTrends(topicId: number): Promise<TrendSnapshot> {
    const res = await fetch(`${API_BASE}/topics/${topicId}/trends/regenerate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to regenerate trends');
    return res.json();
  },

  // System
  async getSystemStats(): Promise<SystemStats> {
    const res = await fetch(`${API_BASE}/system/stats`);
    if (!res.ok) throw new Error('Failed to fetch system stats');
    return res.json();
  },

  async seedScenarios(): Promise<{ message: string; scenarios: string[] }> {
    const res = await fetch(`${API_BASE}/system/seed-scenarios`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed scenarios');
    return res.json();
  },

  async triggerAllTopics(): Promise<any> {
    const res = await fetch(`${API_BASE}/system/trigger-all`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to trigger all topics');
    return res.json();
  }
};
