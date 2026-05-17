import React from 'react';
import { Users, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No leads found',
  description = 'Get started by adding your first lead.',
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
      <Users className="w-8 h-8 text-surface-400" />
    </div>
    <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">{title}</h3>
    <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs mb-4">{description}</p>
    {action}
  </div>
);

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Error</h3>
    <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-sm text-brand-600 hover:text-brand-700 font-medium"
      >
        Try again
      </button>
    )}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 8 }) => (
  <div className="animate-pulse space-y-3 p-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 py-3">
        <div className="w-9 h-9 rounded-full bg-surface-100 dark:bg-surface-800" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-surface-100 dark:bg-surface-800 rounded w-1/4" />
          <div className="h-3 bg-surface-100 dark:bg-surface-800 rounded w-1/3" />
        </div>
        <div className="h-6 w-20 bg-surface-100 dark:bg-surface-800 rounded-full" />
        <div className="h-6 w-16 bg-surface-100 dark:bg-surface-800 rounded" />
        <div className="h-3 w-24 bg-surface-100 dark:bg-surface-800 rounded" />
        <div className="w-8 h-8 bg-surface-100 dark:bg-surface-800 rounded-lg" />
      </div>
    ))}
  </div>
);

export const StatSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-surface-900 rounded-xl p-5 border border-surface-100 dark:border-surface-800">
        <div className="h-3 w-16 bg-surface-100 dark:bg-surface-800 rounded mb-3" />
        <div className="h-7 w-12 bg-surface-100 dark:bg-surface-800 rounded" />
      </div>
    ))}
  </div>
);
