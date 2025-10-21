/**
 * User Service
 * Frontend service for user profile operations
 */

import api from './api';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  avatar: string | null;
  phone: string | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  gyms: Array<{
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    status: string;
    role: string;
    joinedAt: string;
  }>;
}

export interface UserStats {
  leads: {
    total: number;
    active: number;
    closed: number;
    conversionRate: string;
  };
  followUps: {
    pending: number;
    overdue: number;
  };
  conversations: {
    active: number;
  };
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  metadata: any;
  createdAt: string;
  lead?: {
    id: string;
    name: string;
    phone: string;
  };
}

/**
 * Get current user profile
 */
export async function getMyProfile(): Promise<UserProfile> {
  const response = await api.get('/users/me');
  return response.data.data;
}

/**
 * Update user profile
 */
export async function updateProfile(data: {
  name?: string;
  phone?: string;
  avatar?: string;
}): Promise<UserProfile> {
  const response = await api.put('/users/me', data);
  return response.data.data;
}

/**
 * Change password
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await api.put('/users/me/password', data);
  return response.data;
}

/**
 * Get user activity log
 */
export async function getMyActivity(params?: {
  limit?: number;
  offset?: number;
}): Promise<{
  activities: Activity[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}> {
  const response = await api.get('/users/me/activity', { params });
  return {
    activities: response.data.data,
    pagination: response.data.pagination
  };
}

/**
 * Get user statistics
 */
export async function getMyStats(gymId?: string): Promise<UserStats> {
  const response = await api.get('/users/me/stats', {
    params: gymId ? { gymId } : undefined
  });
  return response.data.data;
}

/**
 * Upload avatar (URL)
 */
export async function uploadAvatar(avatarUrl: string): Promise<UserProfile> {
  const response = await api.post('/users/me/avatar', { avatarUrl });
  return response.data.data;
}

/**
 * Upload avatar (File)
 */
export async function uploadAvatarFile(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post('/users/me/avatar/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
}

/**
 * Delete avatar
 */
export async function deleteAvatar(): Promise<UserProfile> {
  const response = await api.delete('/users/me/avatar');
  return response.data.data;
}

