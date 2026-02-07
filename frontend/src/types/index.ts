export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface Category {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  displayOrder?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  price: number;
  category?: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
  };
  featuredImage?: any;
  gallery?: any[];
  specifications?: {
    label: string;
    value: string;
  }[];
  inStock: boolean;
  featured?: boolean;
  displayOrder?: number;
}

export interface Announcement {
  _id: string;
  title: string;
  description?: string;
  image?: any;
  displayOrder?: number;
  isActive: boolean;
}

export interface Gallery {
  _id: string;
  title: string;
  image: any;
  category: 'installation' | 'products' | 'projects' | 'events' | 'team' | 'other';
  description?: string;
  featured?: boolean;
  order?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
