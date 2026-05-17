import api from './api';
import { ApiResponse, AuthFormData, User } from '@/types';

interface AuthData {
  token: string;
  user: User;
}

export const authService = {
  register: async (data: AuthFormData): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>('/auth/register', data);
    return response.data;
  },

  login: async (data: Pick<AuthFormData, 'email' | 'password'>): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },
};
