import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSocket } from '@/hooks/useSocket';
import { useNotificationStore } from '@/store/notificationStore';
import type { Notification } from '@/services/notificationService';
import { Bell, MessageSquare, UserPlus, Calendar, AlertCircle } from 'lucide-react';

export default function NotificationListener() {
  const { socket, isConnected } = useSocket();
  const { addNotification, markAsRead, markAllAsRead, setUnreadCount } = useNotificationStore();

  useEffect(() => {
    if (!socket) return;

    // Listen for new notifications
    socket.on('notification', (notification: Notification) => {
      console.log('New notification received:', notification);
      
      // Add to store
      addNotification(notification);

      // Show toast notification
      const icon = getNotificationIcon(notification.type);
      toast(notification.title, {
        description: notification.message,
        icon,
        action: {
          label: 'View',
          onClick: () => window.location.href = '/notifications'
        }
      });
    });

    // Listen for notification read event from other devices
    socket.on('notification:read', (data: { notificationId: string }) => {
      markAsRead(data.notificationId);
    });

    // Listen for mark all as read event from other devices
    socket.on('notifications:read-all', () => {
      markAllAsRead();
    });

    // Cleanup
    return () => {
      socket.off('notification');
      socket.off('notification:read');
      socket.off('notifications:read-all');
    };
  }, [socket, addNotification, markAsRead, markAllAsRead]);

  // Log connection status
  useEffect(() => {
    if (isConnected) {
      console.log('✅ Real-time notifications connected');
    } else {
      console.log('❌ Real-time notifications disconnected');
    }
  }, [isConnected]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_MESSAGE':
        return <MessageSquare className="h-4 w-4" />;
      case 'NEW_LEAD':
        return <UserPlus className="h-4 w-4" />;
      case 'FOLLOW_UP_DUE':
        return <Calendar className="h-4 w-4" />;
      case 'SYSTEM_ALERT':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return null; // This component doesn't render anything
}

