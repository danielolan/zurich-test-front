import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';
import type { NotificationType } from '../../types';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  // Configuración de iconos y estilos para cada tipo
  const notificationConfig: Record<NotificationType, {
    icon: React.ComponentType<any>;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    textColor: string;
  }> = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      iconColor: 'text-success-600',
      textColor: 'text-success-800',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200',
      iconColor: 'text-error-600',
      textColor: 'text-error-800',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      iconColor: 'text-warning-600',
      textColor: 'text-warning-800',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
    },
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => {
          const config = notificationConfig[notification.type];
          const IconComponent = config.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className={clsx(
                'relative p-4 rounded-lg shadow-strong border backdrop-blur-sm',
                config.bgColor,
                config.borderColor,
                'max-w-sm w-full'
              )}
            >
              {/* Contenido principal */}
              <div className="flex items-start gap-3">
                {/* Icono */}
                <div className="flex-shrink-0">
                  <IconComponent className={clsx('w-5 h-5', config.iconColor)} />
                </div>

                {/* Mensaje */}
                <div className="flex-1 min-w-0">
                  <p className={clsx('text-sm font-medium', config.textColor)}>
                    {notification.message}
                  </p>
                  
                  {/* Timestamp */}
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {/* Botón de cerrar */}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X className="w-4 h-4" />}
                  onClick={() => removeNotification(notification.id)}
                  className={clsx(
                    'flex-shrink-0 p-1 hover:bg-white/50',
                    config.textColor
                  )}
                />
              </div>

              {/* Barra de progreso para notificaciones con duración */}
              {!notification.persistent && notification.duration && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: notification.duration / 1000, ease: 'linear' }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;