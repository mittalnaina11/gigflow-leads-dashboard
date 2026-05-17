import api from './api';
import { ApiResponse, Lead, LeadFilters, LeadFormData, LeadStats } from '@/types';

export const leadsService = {
  getLeads: async (filters: LeadFilters = {}): Promise<ApiResponse<{ leads: Lead[] }>> => {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const response = await api.get<ApiResponse<{ leads: Lead[] }>>(`/leads?${params}`);
    return response.data;
  },

  getLead: async (id: string): Promise<ApiResponse<{ lead: Lead }>> => {
    const response = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: LeadFormData): Promise<ApiResponse<{ lead: Lead }>> => {
    const response = await api.post<ApiResponse<{ lead: Lead }>>('/leads', data);
    return response.data;
  },

  updateLead: async (id: string, data: Partial<LeadFormData>): Promise<ApiResponse<{ lead: Lead }>> => {
    const response = await api.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return response.data;
  },

  exportCSV: async (): Promise<void> => {
    const response = await api.get('/leads/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  getStats: async (): Promise<ApiResponse<LeadStats>> => {
    const response = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    return response.data;
  },
};
