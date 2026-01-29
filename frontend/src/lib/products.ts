import api from './api';
import { Product, ApiResponse } from '@/types';

export const productService = {
  async getAll(categoryId?: string): Promise<Product[]> {
    const params = categoryId ? { categoryId } : {};
    const response = await api.get<ApiResponse<Product[]>>('/api/products', { params });
    return response.data.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
    return response.data.data;
  },

  async create(data: Partial<Product>): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>('/api/products', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/api/products/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/products/${id}`);
  },

  async updateStatus(id: string, status: string): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/api/products/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  async getStats(): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/api/products/stats');
    return response.data.data;
  },

  async addImage(productId: string, imageUrl: string): Promise<void> {
    await api.post(`/api/products/${productId}/images`, {
      url: imageUrl,
      key: imageUrl.split('/').pop() || '', // Extract filename as key
      isFeatured: true, // First image is featured
    });
  },
};
