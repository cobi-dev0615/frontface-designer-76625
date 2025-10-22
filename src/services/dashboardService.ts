import api from './api';

export interface KPIMetric {
  value: number | string;
  trend: {
    value: number;
    isPositive: boolean;
  };
}

export interface DashboardKPIs {
  totalLeads: KPIMetric;
  qualifiedLeads: KPIMetric;
  closedThisMonth: KPIMetric;
  conversionRate: KPIMetric;
}

export interface Activity {
  id: string;
  userId: string | null;
  leadId: string | null;
  gymId: string | null;
  type: string;
  description: string;
  metadata: any;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  lead: {
    id: string;
    name: string;
  } | null;
}

export interface QuickStat {
  value: number | string;
  detail: string;
}

export interface QuickStats {
  activeConversations: QuickStat;
  newLeadsToday: QuickStat;
  responseTime: QuickStat;
}

export interface LeadsOverTimeData {
  date: string;
  count: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  activities: Activity[];
  quickStats: QuickStats;
  leadsOverTime: LeadsOverTimeData[];
}

export interface DashboardFilters {
  gymId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Get all dashboard data in one call
 */
export const getDashboardData = async (filters: DashboardFilters = {}): Promise<{ success: boolean; data: DashboardData }> => {
  const response = await api.get('/dashboard', { params: filters });
  return response.data;
};

/**
 * Get dashboard KPIs only
 */
export const getDashboardKPIs = async (filters: DashboardFilters = {}): Promise<{ success: boolean; data: DashboardKPIs }> => {
  const response = await api.get('/dashboard/kpis', { params: filters });
  return response.data;
};

/**
 * Get recent activities only
 */
export const getRecentActivities = async (filters: DashboardFilters = {}): Promise<{ success: boolean; data: Activity[] }> => {
  const response = await api.get('/dashboard/activities', { params: filters });
  return response.data;
};

/**
 * Get quick stats only
 */
export const getQuickStats = async (filters: DashboardFilters = {}): Promise<{ success: boolean; data: QuickStats }> => {
  const response = await api.get('/dashboard/quick-stats', { params: filters });
  return response.data;
};

/**
 * Get leads over time data
 */
export const getLeadsOverTime = async (filters: DashboardFilters = {}): Promise<{ success: boolean; data: LeadsOverTimeData[] }> => {
  const response = await api.get('/dashboard/leads-over-time', { params: filters });
  return response.data;
};

