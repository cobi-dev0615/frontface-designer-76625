import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  avatar?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string | null;
  isDeleted: boolean;
  gyms?: Array<{
    gymId: string;
    gym: {
      id: string;
      name: string;
    };
  }>;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  phone?: string;
  gymIds?: string[]; // Array of gym IDs to assign user to
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'ADMIN' | 'MANAGER' | 'AGENT';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  phone?: string;
  gymIds?: string[]; // Array of gym IDs to assign user to (replaces existing assignments)
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  showDeleted?: boolean;
  limit?: number;
  offset?: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  hasMore: boolean;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  adminUsers: number;
  managerUsers: number;
  agentUsers: number;
  activePercentage: number;
}

/**
 * Get all users with filtering and pagination
 */
export const getAllUsers = async (filters: UserFilters = {}): Promise<UserListResponse> => {
  const response = await api.get('/user-management', { params: filters });
  return response.data.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  const response = await api.get(`/user-management/${userId}`);
  return response.data.data;
};

/**
 * Create a new user
 */
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const response = await api.post('/user-management', userData);
  return response.data.data;
};

/**
 * Update user
 */
export const updateUser = async (userId: string, userData: UpdateUserData): Promise<User> => {
  const response = await api.put(`/user-management/${userId}`, userData);
  return response.data.data;
};

/**
 * Delete user (soft delete)
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`/user-management/${userId}`);
};

/**
 * Bulk update user status
 */
export const bulkUpdateUserStatus = async (userIds: string[], status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Promise<void> => {
  await api.patch('/user-management/bulk/status', { userIds, status });
};

/**
 * Bulk delete users (soft delete)
 */
export const bulkDeleteUsers = async (userIds: string[]): Promise<void> => {
  await api.delete('/user-management/bulk', { data: { userIds } });
};

/**
 * Get user statistics
 */
export const getUserStatistics = async (): Promise<UserStatistics> => {
  const response = await api.get('/user-management/statistics');
  return response.data.data;
};
