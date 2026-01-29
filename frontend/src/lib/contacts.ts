import api from './api';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'reviewed' | 'responded';
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  expectedDeliveryDate: string;
  message?: string;
  productId: string;
  productName: string;
  productPrice: number;
  product?: any;
  status: 'pending' | 'reviewed' | 'quoted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export const contactService = {
  async create(data: Partial<Contact>): Promise<ApiResponse<Contact>> {
    const response = await api.post<ApiResponse<Contact>>('/api/contacts', data);
    return response.data;
  },

  async getAll(status?: string): Promise<Contact[]> {
    const params = status ? { status } : {};
    const response = await api.get<ApiResponse<Contact[]>>('/api/contacts', { params });
    return response.data.data;
  },

  async getById(id: string): Promise<Contact> {
    const response = await api.get<ApiResponse<Contact>>(`/api/contacts/${id}`);
    return response.data.data;
  },

  async updateStatus(id: string, status: string): Promise<Contact> {
    const response = await api.put<ApiResponse<Contact>>(`/api/contacts/${id}`, { status });
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/contacts/${id}`);
  },
};

export const quoteService = {
  async create(data: Partial<Quote>): Promise<ApiResponse<Quote>> {
    const response = await api.post<ApiResponse<Quote>>('/api/quotes', data);
    return response.data;
  },

  async getAll(status?: string): Promise<Quote[]> {
    const params = status ? { status } : {};
    const response = await api.get<ApiResponse<Quote[]>>('/api/quotes', { params });
    return response.data.data;
  },

  async getById(id: string): Promise<Quote> {
    const response = await api.get<ApiResponse<Quote>>(`/api/quotes/${id}`);
    return response.data.data;
  },

  async updateStatus(id: string, status: string): Promise<Quote> {
    const response = await api.put<ApiResponse<Quote>>(`/api/quotes/${id}`, { status });
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/quotes/${id}`);
  },
};
