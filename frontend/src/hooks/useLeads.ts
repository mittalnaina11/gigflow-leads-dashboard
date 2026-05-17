import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadFilters, PaginationMeta } from '@/types';
import { leadsService } from '@/services/leadsService';
import toast from 'react-hot-toast';

interface UseLeadsReturn {
  leads: Lead[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLeads(filters: LeadFilters): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    const fetchLeads = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await leadsService.getLeads(filters);
        if (!cancelled) {
          setLeads(response.data?.leads || []);
          setMeta(response.meta || null);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to fetch leads';
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchLeads();

    return () => {
      cancelled = true;
    };
  }, [filters, refreshKey]);

  return { leads, meta, isLoading, error, refetch };
}
