import api from './api';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageKey: string;
  status: 'active' | 'inactive';
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementDto {
  title: string;
  description?: string;
  imageUrl: string;
  imageKey: string;
  status?: 'active' | 'inactive';
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateAnnouncementDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageKey?: string;
  status?: 'active' | 'inactive';
  displayOrder?: number;
  isActive?: boolean;
}

export const announcementService = {
  async getAll(onlyActive = false): Promise<Announcement[]> {
    const params = onlyActive ? { active: 'true' } : {};
    const response = await api.get('/api/announcements', { params });
    return response.data;
  },

  async getById(id: string): Promise<Announcement> {
    const response = await api.get(`/api/announcements/${id}`);
    return response.data;
  },

  async hasAnnouncements(): Promise<boolean> {
    const response = await api.get('/api/announcements/has-announcements');
    return response.data.hasAnnouncements;
  },

  async create(data: CreateAnnouncementDto): Promise<Announcement> {
    const response = await api.post('/api/announcements', data);
    return response.data;
  },

  async update(id: string, data: UpdateAnnouncementDto): Promise<Announcement> {
    const response = await api.put(`/api/announcements/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/announcements/${id}`);
  },
};
