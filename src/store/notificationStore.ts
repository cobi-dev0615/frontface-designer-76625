import { create } from 'zustand';
import type { Notification } from '@/services/notificationService';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  setUnreadCount: (count: number) => void;
  decrementUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1
  })),

  markAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),

  removeNotification: (notificationId) => set((state) => {
    const notification = state.notifications.find(n => n.id === notificationId);
    return {
      notifications: state.notifications.filter(n => n.id !== notificationId),
      unreadCount: notification && !notification.read 
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount
    };
  }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  decrementUnreadCount: () => set((state) => ({
    unreadCount: Math.max(0, state.unreadCount - 1)
  }))
}));

