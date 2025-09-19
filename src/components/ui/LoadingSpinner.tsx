import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'default' | 'dots' | 'pulse' | 'bars';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  color = 'text-primary-500',
  text,
}) => {
  // Tamaños
  const sizes: Record<SpinnerSize, string> = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Spinner por defecto (circular)
  const DefaultSpinner = () => (
    <svg 
      className={clsx('animate-spin', sizes[size], color)} 
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

  // Spinner de puntos
  const DotsSpinner = () => {
    const dotSize = size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
    
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={clsx('rounded-full bg-current', dotSize, color)}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  };

  // Spinner de pulso
  const PulseSpinner = () => (
    <motion.div
      className={clsx('rounded-full bg-current', sizes[size], color)}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );

  // Spinner de barras
  const BarsSpinner = () => {
    const barWidth = size === 'xs' ? 'w-0.5' : size === 'sm' ? 'w-1' : 'w-1.5';
    const barHeight = sizes[size].replace('w-', 'h-').replace('h-', '');
    
    return (
      <div className="flex space-x-1 items-end">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={clsx('bg-current', barWidth, color)}
            style={{ height: '100%' }}
            animate={{
              scaleY: [1, 0.4, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  };

  // Seleccionar el spinner según la variante
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner />;
      case 'pulse':
        return <PulseSpinner />;
      case 'bars':
        return <BarsSpinner />;
      default:
        return <DefaultSpinner />;
    }
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      <div className="flex items-center justify-center">
        {renderSpinner()}
      </div>
      
      {text && (
        <motion.p
          className="mt-3 text-sm text-slate-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Componente de overlay de carga para toda la pantalla
interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  variant?: SpinnerVariant;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Cargando...',
  variant = 'default',
}) => {
  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-lg shadow-medium p-8 flex flex-col items-center">
        <LoadingSpinner size="lg" variant={variant} />
        <p className="mt-4 text-slate-600 font-medium">{text}</p>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;