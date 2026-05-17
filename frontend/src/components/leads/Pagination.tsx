import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types';
import { cn } from '@/utils';

interface PaginationProps {
  meta: PaginationMeta;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onChange }) => {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = meta;

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-surface-100 dark:border-surface-800">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        Showing <span className="font-medium text-surface-700 dark:text-surface-300">{start}–{end}</span> of{' '}
        <span className="font-medium text-surface-700 dark:text-surface-300">{total}</span> leads
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={!hasPrevPage}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            hasPrevPage
              ? 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300'
              : 'opacity-40 cursor-not-allowed text-surface-400'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-surface-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                'min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors',
                p === page
                  ? 'bg-brand-500 text-white'
                  : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={!hasNextPage}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            hasNextPage
              ? 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300'
              : 'opacity-40 cursor-not-allowed text-surface-400'
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
