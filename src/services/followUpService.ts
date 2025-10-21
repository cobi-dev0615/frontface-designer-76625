import api from './api';

export interface FollowUp {
  id: string;
  leadId: string;
  type: 'CALL' | 'WHATSAPP' | 'EMAIL' | 'VISIT';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
  scheduledAt: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lead: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    status: string;
    assignedToId?: string;
    gym: {
      id: string;
      name: string;
    };
  };
}

export interface FollowUpFilters {
  leadId?: string;
  status?: string;
  type?: string;
  assignedToId?: string;
  gymId?: string;
  dateFrom?: string;
  dateTo?: string;
  showCompleted?: boolean;
  limit?: number;
  offset?: number;
}

export interface FollowUpStats {
  pending: number;
  completed: number;
  overdue: number;
  today: number;
}

export interface FollowUpsResponse {
  success: boolean;
  data: FollowUp[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  stats: FollowUpStats;
}

/**
 * Get all follow-ups with filtering and pagination
 */
export const getAllFollowUps = async (filters: FollowUpFilters = {}): Promise<FollowUpsResponse> => {
  const response = await api.get('/followups', { params: filters });
  return response.data;
};

/**
 * Get follow-up by ID
 */
export const getFollowUpById = async (followUpId: string): Promise<{ success: boolean; data: FollowUp }> => {
  const response = await api.get(`/followups/${followUpId}`);
  return response.data;
};

/**
 * Create new follow-up
 */
export const createFollowUp = async (followUpData: {
  leadId: string;
  type: 'CALL' | 'WHATSAPP' | 'EMAIL' | 'VISIT';
  scheduledAt: string;
  notes?: string;
}): Promise<{ success: boolean; data: FollowUp; message: string }> => {
  const response = await api.post('/followups', followUpData);
  return response.data;
};

/**
 * Update follow-up
 */
export const updateFollowUp = async (followUpId: string, updateData: {
  type?: 'CALL' | 'WHATSAPP' | 'EMAIL' | 'VISIT';
  scheduledAt?: string;
  notes?: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
}): Promise<{ success: boolean; data: FollowUp; message: string }> => {
  const response = await api.put(`/followups/${followUpId}`, updateData);
  return response.data;
};

/**
 * Complete follow-up
 */
export const completeFollowUp = async (followUpId: string, notes?: string): Promise<{ success: boolean; data: FollowUp; message: string }> => {
  const response = await api.patch(`/followups/${followUpId}/complete`, { notes });
  return response.data;
};

/**
 * Cancel follow-up
 */
export const cancelFollowUp = async (followUpId: string, reason?: string): Promise<{ success: boolean; data: FollowUp; message: string }> => {
  const response = await api.patch(`/followups/${followUpId}/cancel`, { reason });
  return response.data;
};

/**
 * Delete follow-up
 */
export const deleteFollowUp = async (followUpId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/followups/${followUpId}`);
  return response.data;
};

/**
 * Get follow-up statistics
 */
export const getFollowUpStatistics = async (filters: {
  assignedToId?: string;
  gymId?: string;
  dateFrom?: string;
  dateTo?: string;
} = {}): Promise<{ success: boolean; data: FollowUpStats }> => {
  const response = await api.get('/followups/statistics', { params: filters });
  return response.data;
};

/**
 * Mark overdue follow-ups
 */
export const markOverdueFollowUps = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/followups/mark-overdue');
  return response.data;
};
