export type UserRole = 'admin' | 'sales';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';

export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export type SortOrder = 'latest' | 'oldest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: User;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
  errors?: { field: string; message: string }[];
}

export interface LeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}

export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
}
