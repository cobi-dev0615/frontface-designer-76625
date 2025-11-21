import api from './api';

export interface GymAdvantage {
  id: string;
  gymId: string;
  title: string;
  description?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGymAdvantageData {
  title: string;
  description?: string;
  order?: number;
}

export interface UpdateGymAdvantageData {
  title?: string;
  description?: string;
  order?: number;
}

export const getGymAdvantages = async (gymId: string): Promise<GymAdvantage[]> => {
  const response = await api.get(`/gyms/${gymId}/advantages`);
  return response.data.data;
};

export const createGymAdvantage = async (
  gymId: string,
  data: CreateGymAdvantageData
): Promise<GymAdvantage> => {
  const response = await api.post(`/gyms/${gymId}/advantages`, data);
  return response.data.data;
};

export const updateGymAdvantage = async (
  gymId: string,
  advantageId: string,
  data: UpdateGymAdvantageData
): Promise<GymAdvantage> => {
  const response = await api.put(`/gyms/${gymId}/advantages/${advantageId}`, data);
  return response.data.data;
};

export const deleteGymAdvantage = async (gymId: string, advantageId: string): Promise<void> => {
  await api.delete(`/gyms/${gymId}/advantages/${advantageId}`);
};

