import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react';
import { LeadStats } from '@/types';
import { leadsService } from '@/services/leadsService';
import { StatSkeleton } from '@/components/ui/States';
import { cn } from '@/utils';

const STAT_CARDS = [
  {
    key: 'total',
    label: 'Total Leads',
    icon: Users,
    color: 'text-brand-500',
    bg: 'bg-brand-50 dark:bg-brand-950/40',
  },
  {
    key: 'New',
    label: 'New',
    icon: TrendingUp,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  {
    key: 'Qualified',
    label: 'Qualified',
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    key: 'Lost',
    label: 'Lost',
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/40',
  },
] as const;

export const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    leadsService.getStats().then((res) => {
      setStats(res.data || null);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <StatSkeleton />;
  if (!stats) return null;

  const getValue = (key: string): number => {
    if (key === 'total') return stats.total;
    return stats.byStatus[key as keyof typeof stats.byStatus] || 0;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
        <div
          key={key}
          className="bg-white dark:bg-surface-900 rounded-xl p-5 border border-surface-100 dark:border-surface-800 shadow-card hover:shadow-card-hover transition-shadow animate-fade-in"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">
              {label}
            </p>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', bg)}>
              <Icon className={cn('w-4 h-4', color)} />
            </div>
          </div>
          <p className="text-2xl font-bold text-surface-900 dark:text-white font-display">
            {getValue(key)}
          </p>
        </div>
      ))}
    </div>
  );
};
