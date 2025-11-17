import api from './api';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  status: string;
  source: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  gym: {
    id: string;
    name: string;
  };
}

export interface LeadFilters {
  search?: string;
  status?: string;
  gymId?: string;
  source?: string;
  assignedToId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface LeadStats {
  all: number;
  new: number;
  contacted: number;
  qualified: number;
  negotiating: number;
  closed: number;
  lost: number;
}

export interface LeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  stats: LeadStats;
}

export interface CreateLeadData {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  address?: string;
  zipCode?: string;
  gymId: string;
  source: string;
  status?: string;
  assignedToId?: string;
  notes?: string;
  tags?: string[];
}

/**
 * Get all leads with filtering
 */
export const getAllLeads = async (filters?: LeadFilters): Promise<LeadsResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters?.gymId) params.append('gymId', filters.gymId);
  if (filters?.source) params.append('source', filters.source);
  if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.append('dateTo', filters.dateTo);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const response = await api.get(`/leads?${params.toString()}`);
  return response.data;
};

/**
 * Get lead by ID
 */
export const getLeadById = async (id: string) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

/**
 * Create new lead
 */
export const createLead = async (leadData: CreateLeadData) => {
  const response = await api.post('/leads', leadData);
  return response.data;
};

/**
 * Update lead
 */
export const updateLead = async (id: string, leadData: Partial<CreateLeadData>) => {
  const response = await api.put(`/leads/${id}`, leadData);
  return response.data;
};

/**
 * Delete lead
 */
export const deleteLead = async (id: string) => {
  const response = await api.delete(`/leads/${id}`, {
    skipAuthRedirect: true
  });
  return response.data;
};

/**
 * Bulk update lead status
 */
export const bulkUpdateStatus = async (leadIds: string[], status: string) => {
  const response = await api.patch('/leads/bulk/status', { leadIds, status });
  return response.data;
};

/**
 * Bulk delete leads
 */
export const bulkDeleteLeads = async (leadIds: string[]) => {
  const response = await api.delete('/leads/bulk', {
    data: { leadIds },
    skipAuthRedirect: true
  });
  return response.data;
};

/**
 * Get lead statistics
 */
export const getStatistics = async (gymId?: string) => {
  const params = gymId ? `?gymId=${gymId}` : '';
  const response = await api.get(`/leads/statistics${params}`);
  return response.data;
};

/**
 * Export leads to CSV
 */
export const exportLeads = async (filters?: LeadFilters) => {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters?.gymId) params.append('gymId', filters.gymId);
  if (filters?.source) params.append('source', filters.source);
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.append('dateTo', filters.dateTo);

  const response = await api.get(`/leads/export?${params.toString()}`, {
    responseType: 'blob'
  });
  
  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `leads-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  
  return { success: true };
};

export default {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  bulkUpdateStatus,
  bulkDeleteLeads,
  getStatistics,
  exportLeads
};

