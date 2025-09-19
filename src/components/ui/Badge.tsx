import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
  animated?: boolean;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  icon,
  className,
  animated = false,
  onClick,
}) => {
  // Variantes de color
  const variants: Record<BadgeVariant, string> = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'bg-blue-100 text-blue-800',
  };

  // Tamaños
  const sizes: Record<BadgeSize, string> = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  // Tamaño de icono
  const iconSizes: Record<BadgeSize, string> = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Clases del badge
  const badgeClasses = clsx(
    'badge-base',
    variants[variant],
    sizes[size],
    {
      'cursor-pointer hover:opacity-80 transition-opacity': onClick,
    },
    className
  );

  const content = (
    <span className={badgeClasses} onClick={onClick}>
      {icon && (
        <span className={clsx('inline-flex', iconSizes[size], 'mr-1')}>
          {icon}
        </span>
      )}
      {children}
    </span>
  );

  if (animated && !onClick) {
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.span>
    );
  }

  if (animated && onClick) {
    return (
      <motion.span
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.span>
    );
  }

  return content;
};

// Badges de conveniencia para estados de tareas
export const StatusBadge: React.FC<{ status: 'pending' | 'completed'; animated?: boolean }> = ({ 
  status, 
  animated = false 
}) => (
  <Badge
    variant={status === 'completed' ? 'success' : 'secondary'}
    animated={animated}
    icon={status === 'completed' ? (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    )}
  >
    {status === 'completed' ? 'Completada' : 'Pendiente'}
  </Badge>
);

export const PriorityBadge: React.FC<{ priority: 'low' | 'medium' | 'high'; animated?: boolean }> = ({ 
  priority, 
  animated = false 
}) => {
  const priorityConfig = {
    low: { variant: 'success' as const, icon: '🟢', label: 'Baja' },
    medium: { variant: 'warning' as const, icon: '🟡', label: 'Media' },
    high: { variant: 'error' as const, icon: '🔴', label: 'Alta' },
  };

  const config = priorityConfig[priority];

  return (
    <Badge
      variant={config.variant}
      animated={animated}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};

export default Badge;