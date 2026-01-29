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
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  specifications?: string;
  status: 'active' | 'inactive' | 'draft';
  stock: number;
  sku?: string;
  featured?: boolean;
  categoryId?: string;
  category: Category;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  key: string;
  url: string;
  altText?: string;
  isFeatured: boolean;
  createdAt: string;
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
