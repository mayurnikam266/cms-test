import { Injectable } from '@nestjs/common';
import { createClient, SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

@Injectable()
export class SanityService {
  private client: SanityClient;
  private builder;

  constructor() {
    this.client = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
      useCdn: process.env.NODE_ENV === 'production',
      token: process.env.SANITY_TOKEN, // Required for write operations
    });

    this.builder = imageUrlBuilder(this.client);
  }

  getClient(): SanityClient {
    return this.client;
  }

  // Helper to get image URL from Sanity
  urlFor(source: any) {
    return this.builder.image(source);
  }

  // Fetch products
  async getProducts(filters?: any) {
    let query = '*[_type == "product"';
    
    if (filters?.category) {
      query += ` && category._ref == "${filters.category}"`;
    }
    if (filters?.featured !== undefined) {
      query += ` && featured == ${filters.featured}`;
    }
    if (filters?.inStock !== undefined) {
      query += ` && inStock == ${filters.inStock}`;
    }
    
    query += '] | order(displayOrder asc, _createdAt desc) {';
    query += `
      _id,
      _createdAt,
      _updatedAt,
      name,
      "slug": slug.current,
      description,
      price,
      "category": category->{_id, name, "slug": slug.current},
      "featuredImage": featuredImage.asset->url,
      "gallery": gallery[]{
        "url": asset->url,
        alt,
        displayOrder
      },
      specifications,
      inStock,
      featured,
      displayOrder
    }`;

    return await this.client.fetch(query);
  }

  // Fetch single product
  async getProduct(id: string) {
    const query = `*[_type == "product" && _id == $id][0] {
      _id,
      _createdAt,
      _updatedAt,
      name,
      "slug": slug.current,
      description,
      price,
      "category": category->{_id, name, "slug": slug.current},
      "featuredImage": featuredImage.asset->url,
      "gallery": gallery[]{
        "url": asset->url,
        alt,
        displayOrder
      },
      specifications,
      inStock,
      featured,
      displayOrder
    }`;

    return await this.client.fetch(query, { id });
  }

  // Fetch categories
  async getCategories() {
    const query = `*[_type == "category"] | order(displayOrder asc, name asc) {
      _id,
      _createdAt,
      _updatedAt,
      name,
      "slug": slug.current,
      description,
      displayOrder
    }`;

    return await this.client.fetch(query);
  }

  // Fetch announcements
  async getAnnouncements(activeOnly = false) {
    let query = '*[_type == "announcement"';
    
    if (activeOnly) {
      query += ' && status == "active" && isActive == true';
    }
    
    query += '] | order(displayOrder asc, _createdAt desc) {';
    query += `
      _id,
      _createdAt,
      _updatedAt,
      title,
      description,
      "imageUrl": image.asset->url,
      status,
      displayOrder,
      isActive
    }`;

    return await this.client.fetch(query);
  }

  // Create contact submission
  async createContact(data: any) {
    return await this.client.create({
      _type: 'contact',
      ...data,
      submittedAt: new Date().toISOString(),
    });
  }

  // Create quote request
  async createQuote(data: any) {
    return await this.client.create({
      _type: 'quote',
      ...data,
      submittedAt: new Date().toISOString(),
    });
  }

  // Fetch contacts
  async getContacts(filters?: any) {
    let query = '*[_type == "contact"';
    
    if (filters?.status) {
      query += ` && status == "${filters.status}"`;
    }
    
    query += '] | order(_createdAt desc) {';
    query += `
      _id,
      _createdAt,
      name,
      email,
      phone,
      message,
      status,
      submittedAt
    }`;

    return await this.client.fetch(query);
  }

  // Fetch quotes
  async getQuotes(filters?: any) {
    let query = '*[_type == "quote"';
    
    if (filters?.status) {
      query += ` && status == "${filters.status}"`;
    }
    
    query += '] | order(_createdAt desc) {';
    query += `
      _id,
      _createdAt,
      customerName,
      customerEmail,
      customerPhone,
      "product": product->{_id, name, price},
      quantity,
      message,
      status,
      quotedPrice,
      notes,
      submittedAt
    }`;

    return await this.client.fetch(query);
  }

  // Update document
  async updateDocument(id: string, updates: any) {
    return await this.client
      .patch(id)
      .set(updates)
      .commit();
  }

  // Delete document
  async deleteDocument(id: string) {
    return await this.client.delete(id);
  }
}
