import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Download, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { StatsCards } from '@/components/leads/StatsCards';
import { FiltersBar } from '@/components/leads/FiltersBar';
import { LeadRow } from '@/components/leads/LeadRow';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadDetail } from '@/components/leads/LeadDetail';
import { Pagination } from '@/components/leads/Pagination';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, TableSkeleton } from '@/components/ui/States';
import { Lead, LeadFilters } from '@/types';
import { useLeads } from '@/hooks/useLeads';
import { useDebounce } from '@/hooks/useDebounce';
import { leadsService } from '@/services/leadsService';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [rawSearch, setRawSearch] = useState('');
  const debouncedSearch = useDebounce(rawSearch, 400);

  const [filters, setFilters] = useState<LeadFilters>({
    status: '',
    source: '',
    sort: 'latest',
    page: 1,
    limit: 10,
  });

  // Sync debounced search into filters
  useEffect(() => {
    setFilters((f) => ({ ...f, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const { leads, meta, isLoading, error, refetch } = useLeads(filters);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleFilterChange = useCallback((updates: Partial<LeadFilters>) => {
    setFilters((f) => ({ ...f, ...updates }));
  }, []);

  const handleEdit = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  }, []);

  const handleView = useCallback((lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  }, []);

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedLead(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await leadsService.exportCSV();
      toast.success('Leads exported successfully!');
    } catch {
      toast.error('Failed to export leads.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-display">
              Leads Dashboard
            </h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              {user?.role === 'admin'
                ? 'Manage all leads across your team'
                : 'Track and manage your assigned leads'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExport}
              isLoading={isExporting}
            >
              Export CSV
            </Button>
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => { setSelectedLead(null); setIsFormOpen(true); }}
            >
              Add Lead
            </Button>
          </div>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Table card */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800 shadow-card overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-surface-100 dark:border-surface-800">
            <FiltersBar
              filters={filters}
              onChange={handleFilterChange}
              searchValue={rawSearch}
              onSearchChange={setRawSearch}
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : leads.length === 0 ? (
            <EmptyState
              title="No leads found"
              description={
                filters.search || filters.status || filters.source
                  ? 'No leads match your current filters. Try adjusting them.'
                  : 'Add your first lead to get started.'
              }
              action={
                !filters.search && !filters.status && !filters.source ? (
                  <Button
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => setIsFormOpen(true)}
                  >
                    Add Lead
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100 dark:border-surface-800">
                    {['Name / Email', 'Status', 'Source', 'Created', ''].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50 dark:divide-surface-800/50">
                  {leads.map((lead) => (
                    <LeadRow
                      key={lead._id}
                      lead={lead}
                      onEdit={handleEdit}
                      onView={handleView}
                      onDeleted={refetch}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {meta && !isLoading && !error && (
            <Pagination
              meta={meta}
              onChange={(page) => handleFilterChange({ page })}
            />
          )}
        </div>

        {/* Refresh hint */}
        {!isLoading && leads.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={refetch}
              className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <LeadForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={refetch}
        lead={selectedLead}
      />

      <LeadDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        lead={selectedLead}
        onEdit={() => handleEdit(selectedLead!)}
      />
    </div>
  );
};
