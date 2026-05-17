import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '@/types';
import { Input, Select } from '@/components/ui/Input';
import { cn } from '@/utils';

interface FiltersBarProps {
  filters: LeadFilters;
  onChange: (filters: Partial<LeadFilters>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const STATUS_OPTS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTS = [
  { value: 'Website', label: '🌐 Website' },
  { value: 'Instagram', label: '📸 Instagram' },
  { value: 'Referral', label: '🤝 Referral' },
];

const SORT_OPTS = [
  { value: 'latest', label: '↓ Latest first' },
  { value: 'oldest', label: '↑ Oldest first' },
];

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onChange,
  searchValue,
  onSearchChange,
}) => {
  const hasActiveFilters =
    filters.status || filters.source || filters.sort !== 'latest' || filters.search;

  const clearFilters = () => {
    onSearchChange('');
    onChange({ status: '', source: '', sort: 'latest', search: '' });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Input
          placeholder="Search by name or email..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          rightIcon={
            searchValue ? (
              <button
                onClick={() => onSearchChange('')}
                className="pointer-events-auto text-surface-400 hover:text-surface-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null
          }
          className="pr-8"
        />
      </div>

      {/* Filter row */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4 text-surface-400 flex-shrink-0" />
        </div>

        <Select
          value={filters.status || ''}
          onChange={(e) => onChange({ status: e.target.value as LeadStatus | '', page: 1 })}
          options={STATUS_OPTS}
          placeholder="All Status"
          className="min-w-[130px]"
        />

        <Select
          value={filters.source || ''}
          onChange={(e) => onChange({ source: e.target.value as LeadSource | '', page: 1 })}
          options={SOURCE_OPTS}
          placeholder="All Sources"
          className="min-w-[140px]"
        />

        <Select
          value={filters.sort || 'latest'}
          onChange={(e) => onChange({ sort: e.target.value as SortOrder, page: 1 })}
          options={SORT_OPTS}
          className="min-w-[140px]"
        />

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg',
              'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400',
              'hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors'
            )}
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
