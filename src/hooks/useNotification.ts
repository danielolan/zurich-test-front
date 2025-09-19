import { useState, useCallback, useRef } from 'react';
import type { Notification, NotificationType, NotificationOptions } from '@/types';

let notificationId = 0;

interface UseNotificationReturn {
  notifications: Notification[];
  showNotification: (message: string, type?: NotificationType, options?: NotificationOptions) => number;
  removeNotification: (id: number) => void;
  clearAllNotifications: () => void;
  showSuccess: (message: string, options?: NotificationOptions) => number;
  showError: (message: string, options?: NotificationOptions) => number;
  showWarning: (message: string, options?: NotificationOptions) => number;
  showInfo: (message: string, options?: NotificationOptions) => number;
}

export const useNotification = (): UseNotificationReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutRefs = useRef<Record<number, NodeJS.Timeout>>({});

  const showNotification = useCallback((
    message: string, 
    type: NotificationType = 'info', 
    options: NotificationOptions = {}
  ): number => {
    const id = ++notificationId;
    const duration = options.duration || (type === 'error' ? 5000 : 3000);
    const persistent = options.persistent || false;

    const notification: Notification = {
      id,
      message,
      type,
      timestamp: Date.now(),
      duration,
      persistent,
      ...options,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove después del duration especificado
    if (!persistent) {
      timeoutRefs.current[id] = setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // Limpiar timeout si existe
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  }, []);

  const clearAllNotifications = useCallback(() => {
    // Limpiar todos los timeouts
    Object.values(timeoutRefs.current).forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    timeoutRefs.current = {};
    
    setNotifications([]);
  }, []);

  // Métodos de conveniencia
  const showSuccess = useCallback((message: string, options?: NotificationOptions): number => 
    showNotification(message, 'success', options), [showNotification]);
  
  const showError = useCallback((message: string, options?: NotificationOptions): number => 
    showNotification(message, 'error', options), [showNotification]);
  
  const showWarning = useCallback((message: string, options?: NotificationOptions): number => 
    showNotification(message, 'warning', options), [showNotification]);
  
  const showInfo = useCallback((message: string, options?: NotificationOptions): number => 
    showNotification(message, 'info', options), [showNotification]);

  return {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};