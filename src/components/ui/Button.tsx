import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconPosition = 'left' | 'right';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  fullWidth?: boolean;
  animated?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  animated = true,
  className,
  onClick,
  ...props
}) => {
  // Variantes de estilo
  const variants: Record<ButtonVariant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'gradient-error text-white shadow-md hover:shadow-lg focus:ring-error-500',
    success: 'gradient-success text-white shadow-md hover:shadow-lg focus:ring-success-500',
    warning: 'gradient-warning text-white shadow-md hover:shadow-lg focus:ring-warning-500',
  };

  // Tamaños
  const sizes: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  // Clases combinadas
  const buttonClasses = clsx(
    'btn-base',
    variants[variant],
    sizes[size],
    {
      'w-full': fullWidth,
      'opacity-50 cursor-not-allowed': disabled || loading,
      'cursor-wait': loading,
    },
    className
  );

  // Tamaño de icono según el tamaño del botón
  const getIconSize = (): string => {
    switch (size) {
      case 'xs': return 'w-3 h-3';
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-6 h-6';
      case 'xl': return 'w-7 h-7';
      default: return 'w-5 h-5';
    }
  };

  // Contenido del botón
  const renderContent = (): ReactNode => {
    const iconElement = icon && (
      <span className={clsx('inline-flex', getIconSize())}>
        {icon}
      </span>
    );

    const loadingSpinner = loading && (
      <svg 
        className={clsx('animate-spin', getIconSize())} 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    if (loading) {
      return (
        <>
          {loadingSpinner}
          <span>Cargando...</span>
        </>
      );
    }

    if (iconPosition === 'left') {
      return (
        <>
          {iconElement}
          <span>{children}</span>
        </>
      );
    }

    return (
      <>
        <span>{children}</span>
        {iconElement}
      </>
    );
  };

  // Componente base sin animación
  const BaseButton = (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {renderContent()}
    </button>
  );

  // Retornar con o sin animación
  if (!animated) {
    return BaseButton;
  }

  return (
    <motion.div
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {BaseButton}
    </motion.div>
  );
};

export default Button;