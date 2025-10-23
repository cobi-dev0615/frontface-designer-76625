import api from './api';

export interface Plan {
  id: string;
  gymId: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  features?: any;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  gym?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreatePlanData {
  name: string;
  description?: string;
  price: number;
  duration: number;
  features?: any;
}

export interface UpdatePlanData {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  features?: any;
  active?: boolean;
}

export interface PlanFilters {
  gymId?: string;
  active?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

export interface PlanStatistics {
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
  averagePrice: number;
  cheapestPlan: Plan | null;
  mostExpensivePlan: Plan | null;
  totalRevenue: number;
}

/**
 * Get all plans for a gym
 */
export const getGymPlans = async (gymId: string, activeOnly: boolean = false): Promise<{
  success: boolean;
  data: Plan[];
}> => {
  const response = await api.get(`/gyms/${gymId}/plans`, {
    params: { activeOnly }
  });
  return response.data;
};

/**
 * Get all plans across all gyms (for admin)
 */
export const getAllPlans = async (filters: PlanFilters = {}): Promise<{
  success: boolean;
  data: Plan[];
  pagination: { total: number; limit: number; offset: number; hasMore: boolean };
}> => {
  const response = await api.get('/plans', { params: filters });
  return response.data;
};

/**
 * Get plan by ID
 */
export const getPlanById = async (planId: string): Promise<{
  success: boolean;
  data: Plan;
}> => {
  const response = await api.get(`/plans/${planId}`);
  return response.data;
};

/**
 * Create new plan
 */
export const createPlan = async (
  gymId: string,
  planData: CreatePlanData
): Promise<{ success: boolean; data: Plan; message: string }> => {
  const response = await api.post(`/gyms/${gymId}/plans`, planData);
  return response.data;
};

/**
 * Update plan
 */
export const updatePlan = async (
  gymId: string,
  planId: string,
  planData: UpdatePlanData
): Promise<{ success: boolean; data: Plan; message: string }> => {
  const response = await api.put(`/gyms/${gymId}/plans/${planId}`, planData);
  return response.data;
};

/**
 * Delete plan
 */
export const deletePlan = async (
  gymId: string,
  planId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/gyms/${gymId}/plans/${planId}`);
  return response.data;
};

/**
 * Get plan statistics
 */
export const getPlanStatistics = async (gymId?: string): Promise<{
  success: boolean;
  data: PlanStatistics;
}> => {
  const response = await api.get('/plans/statistics', {
    params: gymId ? { gymId } : {}
  });
  return response.data;
};

/**
 * Toggle plan active status
 */
export const togglePlanStatus = async (
  gymId: string,
  planId: string,
  active: boolean
): Promise<{ success: boolean; data: Plan; message: string }> => {
  const response = await api.patch(`/gyms/${gymId}/plans/${planId}/toggle`, { active });
  return response.data;
};

/**
 * Duplicate plan
 */
export const duplicatePlan = async (
  gymId: string,
  planId: string,
  newName: string
): Promise<{ success: boolean; data: Plan; message: string }> => {
  const response = await api.post(`/gyms/${gymId}/plans/${planId}/duplicate`, { newName });
  return response.data;
};

/**
 * Get plan performance metrics
 */
export const getPlanPerformance = async (planId: string, period: string = '30d'): Promise<{
  success: boolean;
  data: {
    views: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    averageRevenue: number;
  };
}> => {
  const response = await api.get(`/plans/${planId}/performance`, {
    params: { period }
  });
  return response.data;
};
