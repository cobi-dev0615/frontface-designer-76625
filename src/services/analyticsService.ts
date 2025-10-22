import api from './api';

export interface SummaryMetric {
  value: number | string;
  trend: string;
  trendValue?: number;
  isPositive?: boolean;
  breakdown?: any;
}

export interface AnalyticsSummary {
  totalConversations: SummaryMetric;
  avgResponseTime: SummaryMetric;
  messagesSent: SummaryMetric;
  peakHours: SummaryMetric;
}

export interface LeadsAcquisitionData {
  date: string;
  total: number;
  qualified: number;
  closed: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface ConversionFunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface LeadSource {
  source: string;
  count: number;
  percentage: number;
}

export interface LeadSourcesData {
  sources: LeadSource[];
  total: number;
}

export interface PeakHour {
  time: string;
  messages: number;
  conversion: string;
}

export interface AgentPerformance {
  name: string;
  email: string;
  conversations: number;
  avgResponse: string;
  conversions: number;
  rate: string;
}

export interface ConversionMetrics {
  totalLeads: number;
  closedLeads: number;
  lostLeads: number;
  conversionRate: string;
  winRate: string;
}

export interface EngagementMetrics {
  totalMessages: number;
  totalConversations: number;
  activeConversations: number;
  avgMessagesPerConversation: string;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  acquisitionTrend: LeadsAcquisitionData[];
  statusDistribution: StatusDistribution[];
  conversionFunnel: ConversionFunnelStage[];
  leadSources: LeadSourcesData;
  peakHours: PeakHour[];
  agentPerformance: AgentPerformance[];
}

export interface AnalyticsFilters {
  gymId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Get all analytics data
 */
export const getAnalyticsData = async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: AnalyticsData }> => {
  const response = await api.get('/analytics', { params: filters });
  return response.data;
};

/**
 * Get analytics summary
 */
export const getAnalyticsSummary = async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: AnalyticsSummary }> => {
  const response = await api.get('/analytics/summary', { params: filters });
  return response.data;
};

/**
 * Get leads acquisition trend
 */
export const getLeadsAcquisitionTrend = async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: LeadsAcquisitionData[] }> => {
  const response = await api.get('/analytics/leads-acquisition-trend', { params: filters });
  return response.data;
};

/**
 * Get lead status distribution
 */
export const getLeadStatusDistribution = async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: StatusDistribution[] }> => {
  const response = await api.get('/analytics/status-distribution', { params: filters });
  return response.data;
};

/**
 * Get conversion funnel
 */
export const getConversionFunnel = async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: ConversionFunnelStage[] }> => {
  const response = await api.get('/analytics/conversion-funnel', { params: filters });
  return response.data;
};

/**
 * Get lead sources
 */
export const getLeadSources = async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: LeadSourcesData }> => {
  const response = await api.get('/analytics/lead-sources', { params: filters });
  return response.data;
};

/**
 * Get peak performance hours
 */
export const getPeakPerformanceHours = async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: PeakHour[] }> => {
  const response = await api.get('/analytics/peak-hours', { params: filters });
  return response.data;
};

/**
 * Get agent performance
 */
export const getAgentPerformance = async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: AgentPerformance[] }> => {
  const response = await api.get('/analytics/agent-performance', { params: filters });
  return response.data;
};

/**
 * Get conversion metrics
 */
export const getConversionMetrics = async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: ConversionMetrics }> => {
  const response = await api.get('/analytics/conversion-metrics', { params: filters });
  return response.data;
};

/**
 * Get engagement metrics
 */
export const getEngagementMetrics = async (filters: AnalyticsFilters = {}): Promise<{ success: boolean; data: EngagementMetrics }> => {
  const response = await api.get('/analytics/engagement-metrics', { params: filters });
  return response.data;
};

