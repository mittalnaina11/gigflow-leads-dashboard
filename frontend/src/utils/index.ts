import { LeadStatus, LeadSource } from '@/types';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  New: {
    label: 'New',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    dot: 'bg-blue-500',
  },
  Contacted: {
    label: 'Contacted',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    dot: 'bg-amber-500',
  },
  Qualified: {
    label: 'Qualified',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    dot: 'bg-emerald-500',
  },
  Lost: {
    label: 'Lost',
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-50 dark:bg-red-950/50',
    dot: 'bg-red-500',
  },
};

export const SOURCE_CONFIG: Record<
  LeadSource,
  { label: string; icon: string; color: string }
> = {
  Website: { label: 'Website', icon: '🌐', color: 'text-violet-600' },
  Instagram: { label: 'Instagram', icon: '📸', color: 'text-pink-600' },
  Referral: { label: 'Referral', icon: '🤝', color: 'text-teal-600' },
};

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}
