import api from './api';

export interface Plan {
  id: string;
  gymId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // Duration in days
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
  gymId: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  features?: any;
  active?: boolean;
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
  limit?: number;
  offset?: number;
}

export interface PlansResponse {
  success: boolean;
  data: Plan[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface PlanResponse {
  success: boolean;
  data: Plan;
  message?: string;
}

/**
 * Get all plans with filtering
 */
export async function getAllPlans(filters: PlanFilters = {}): Promise<PlansResponse> {
  const params = new URLSearchParams();
  
  if (filters.gymId) params.append('gymId', filters.gymId);
  if (filters.active !== undefined) params.append('active', filters.active.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.offset) params.append('offset', filters.offset.toString());

  const response = await api.get<PlansResponse>(`/plans?${params.toString()}`);
  return response.data;
}

/**
 * Get plan by ID
 */
export async function getPlanById(id: string): Promise<Plan> {
  const response = await api.get<PlanResponse>(`/plans/${id}`);
  return response.data.data;
}

/**
 * Get plans by gym ID
 */
export async function getPlansByGymId(gymId: string): Promise<Plan[]> {
  const response = await api.get<PlansResponse>(`/plans/gym/${gymId}`);
  return response.data.data;
}

/**
 * Create new plan
 */
export async function createPlan(data: CreatePlanData): Promise<Plan> {
  const response = await api.post<PlanResponse>('/plans', data);
  return response.data.data;
}

/**
 * Update plan
 */
export async function updatePlan(id: string, data: UpdatePlanData): Promise<Plan> {
  const response = await api.put<PlanResponse>(`/plans/${id}`, data);
  return response.data.data;
}

/**
 * Delete plan
 */
export async function deletePlan(id: string): Promise<void> {
  await api.delete(`/plans/${id}`);
}

