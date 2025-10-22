import api from './api';

export interface Notification {
  id: string;
  userId: string;
  type: 'NEW_LEAD' | 'NEW_MESSAGE' | 'FOLLOW_UP_DUE' | 'SYSTEM_ALERT' | 'LEAD_STATUS_CHANGE';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface NotificationFilters {
  read?: boolean;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Get all notifications for the authenticated user
 */
export const getUserNotifications = async (filters: NotificationFilters = {}): Promise<NotificationsResponse> => {
  const response = await api.get('/notifications', { params: filters });
  return response.data;
};

/**
 * Get notification by ID
 */
export const getNotificationById = async (notificationId: string): Promise<{ success: boolean; data: Notification }> => {
  const response = await api.get(`/notifications/${notificationId}`);
  return response.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<{ success: boolean; data: { count: number } }> => {
  const response = await api.get('/notifications/unread/count');
  return response.data;
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId: string): Promise<{ success: boolean; data: Notification; message: string }> => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<{ success: boolean; data: { count: number }; message: string }> => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

/**
 * Delete all read notifications
 */
export const deleteReadNotifications = async (): Promise<{ success: boolean; data: { count: number }; message: string }> => {
  const response = await api.delete('/notifications/read/all');
  return response.data;
};

/**
 * Create notification (Admin only)
 */
export const createNotification = async (notificationData: {
  userId: string;
  type: 'NEW_LEAD' | 'NEW_MESSAGE' | 'FOLLOW_UP_DUE' | 'SYSTEM_ALERT' | 'LEAD_STATUS_CHANGE';
  title: string;
  message: string;
  data?: any;
}): Promise<{ success: boolean; data: Notification; message: string }> => {
  const response = await api.post('/notifications', notificationData);
  return response.data;
};

