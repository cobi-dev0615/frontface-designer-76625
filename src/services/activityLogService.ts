import api from './api';

export interface ActivityLogFilters {
  gymId?: string;
  userId?: string;
  leadId?: string;
  type?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface ActivityLog {
  id: string;
  type: string;
  description: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  leadId?: string;
  lead?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
  gymId?: string;
  gym?: {
    id: string;
    name: string;
  };
  metadata?: any;
  createdAt: string;
}

export interface ActivityLogResponse {
  success: boolean;
  data: ActivityLog[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  stats: {
    totalActivities: number;
    leadActivities: number;
    followUpActivities: number;
    messageActivities: number;
    userActivities: number;
  };
}

export interface ActivityLogStats {
  success: boolean;
  data: {
    totalActivities: number;
    leadActivities: number;
    followUpActivities: number;
    messageActivities: number;
    userActivities: number;
  };
}

/**
 * Get activity logs with filtering and pagination
 */
export const getActivityLogs = async (filters: ActivityLogFilters = {}): Promise<ActivityLogResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/activity-logs?${params.toString()}`);
  return response.data;
};

/**
 * Get activity log by ID
 */
export const getActivityLogById = async (id: string): Promise<{ success: boolean; data: ActivityLog }> => {
  const response = await api.get(`/activity-logs/${id}`);
  return response.data;
};

/**
 * Get activity log statistics
 */
export const getActivityLogStats = async (filters: { gymId?: string; startDate?: string; endDate?: string } = {}): Promise<ActivityLogStats> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/activity-logs/stats?${params.toString()}`);
  return response.data;
};

/**
 * Export activity logs to CSV
 */
export const exportActivityLogs = async (filters: ActivityLogFilters = {}): Promise<Blob> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/activity-logs/export?${params.toString()}`, {
    responseType: 'blob'
  });
  
  return response.data;
};

export default {
  getActivityLogs,
  getActivityLogById,
  getActivityLogStats,
  exportActivityLogs
};
