import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  size?: InputSize;
  fullWidth?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  size = 'md',
  fullWidth = true,
  className,
  required,
  ...props
}, ref) => {
  // Tamaños
  const sizes: Record<InputSize, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  // Clases del input
  const inputClasses = clsx(
    'input-base',
    sizes[size],
    {
      'input-error': error,
      'w-full': fullWidth,
      'pl-10': icon && iconPosition === 'left',
      'pr-10': icon && iconPosition === 'right',
    },
    className
  );

  // Clases del icono
  const iconClasses = clsx(
    'absolute top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none',
    {
      'left-3': iconPosition === 'left',
      'right-3': iconPosition === 'right',
    },
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
  );

  return (
    <div className={clsx('space-y-1', { 'w-full': fullWidth })}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        <input
          ref={ref}
          className={inputClasses}
          required={required}
          {...props}
        />
        
        {/* Icon */}
        {icon && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-error-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;