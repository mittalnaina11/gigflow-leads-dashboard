import React from 'react';
import { LeadStatus, LeadSource } from '@/types';
import { STATUS_CONFIG, SOURCE_CONFIG, cn } from '@/utils';

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        config.bg,
        config.color,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
};

interface SourceBadgeProps {
  source: LeadSource;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, className }) => {
  const config = SOURCE_CONFIG[source];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
        'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400',
        className
      )}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};
