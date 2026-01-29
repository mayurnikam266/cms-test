import api from './api';
import { Category, ApiResponse } from '@/types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/api/categories');
    return response.data.data;
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/api/categories/${id}`);
    return response.data.data;
  },

  async create(data: Partial<Category>): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>('/api/categories', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const response = await api.put<ApiResponse<Category>>(`/api/categories/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/categories/${id}`);
  },

  async toggle(id: string): Promise<Category> {
    const response = await api.put<ApiResponse<Category>>(`/api/categories/${id}/toggle`);
    return response.data.data;
  },
};
