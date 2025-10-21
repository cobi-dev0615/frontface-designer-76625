import api from './api';

export interface Gym {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  phone?: string | null;
  email?: string | null;
  logo?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'TRIAL';
  settings?: any;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Plan {
  id: string;
  gymId: string;
  name: string;
  description?: string | null;
  price: number;
  duration: number;
  features?: any;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGymData {
  name: string;
  slug: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  settings?: any;
}

export interface UpdateGymData {
  name?: string;
  slug?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  logo?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'TRIAL';
  settings?: any;
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

/**
 * Get all gyms
 */
export const getAllGyms = async () => {
  const response = await api.get('/gyms');
  return response.data.data;
};

/**
 * Get gym by ID
 */
export const getGymById = async (gymId: string) => {
  const response = await api.get(`/gyms/${gymId}`);
  return response.data.data;
};

/**
 * Get gym by slug
 */
export const getGymBySlug = async (slug: string) => {
  const response = await api.get(`/gyms/slug/${slug}`);
  return response.data.data;
};

/**
 * Create gym
 */
export const createGym = async (gymData: CreateGymData) => {
  const response = await api.post('/gyms', gymData);
  return response.data.data;
};

/**
 * Update gym
 */
export const updateGym = async (gymId: string, gymData: UpdateGymData) => {
  const response = await api.put(`/gyms/${gymId}`, gymData);
  return response.data.data;
};

/**
 * Delete gym
 */
export const deleteGym = async (gymId: string) => {
  await api.delete(`/gyms/${gymId}`);
};

/**
 * Update gym settings
 */
export const updateGymSettings = async (gymId: string, settings: any) => {
  const response = await api.patch(`/gyms/${gymId}/settings`, { settings });
  return response.data.data;
};

/**
 * Get gym plans
 */
export const getGymPlans = async (gymId: string, activeOnly: boolean = false) => {
  const response = await api.get(`/gyms/${gymId}/plans`, { params: { activeOnly } });
  return response.data.data;
};

/**
 * Create plan
 */
export const createPlan = async (gymId: string, planData: CreatePlanData) => {
  const response = await api.post(`/gyms/${gymId}/plans`, planData);
  return response.data.data;
};

/**
 * Update plan
 */
export const updatePlan = async (gymId: string, planId: string, planData: UpdatePlanData) => {
  const response = await api.put(`/gyms/${gymId}/plans/${planId}`, planData);
  return response.data.data;
};

/**
 * Delete plan
 */
export const deletePlan = async (gymId: string, planId: string) => {
  await api.delete(`/gyms/${gymId}/plans/${planId}`);
};
