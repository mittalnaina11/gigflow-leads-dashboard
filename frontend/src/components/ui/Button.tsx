import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-brand-500 hover:bg-brand-600 text-white shadow-sm active:scale-[0.98]',
  secondary:
    'bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-900 dark:text-white',
  ghost:
    'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300',
  danger:
    'bg-red-500 hover:bg-red-600 text-white shadow-sm active:scale-[0.98]',
  outline:
    'border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
