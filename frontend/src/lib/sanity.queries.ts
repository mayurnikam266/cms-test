import { sanityFetch, urlFor } from './sanity.client'

// Types
export interface Product {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  price: number
  category?: Category
  featuredImage?: any
  gallery?: any[]
  specifications?: Array<{ label: string; value: string }>
  inStock: boolean
  featured: boolean
  displayOrder?: number
}

export interface Category {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  displayOrder?: number
}

export interface Announcement {
  _id: string
  title: string
  description?: string
  image: any
  displayOrder?: number
  isActive: boolean
}

export interface SiteSettings {
  _id: string;
  siteName: string;
  logo?: any;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'in_progress' | 'completed'
  submittedAt: string
}

export interface Quote {
  _id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  product?: Product
  quantity: number
  message?: string
  status: 'pending' | 'quoted' | 'accepted' | 'declined'
  quotedPrice?: number
  notes?: string
  submittedAt: string
}

// GROQ Queries
const PRODUCT_FIELDS = `
  _id,
  name,
  slug,
  description,
  price,
  category->{
    _id,
    name,
    slug
  },
  featuredImage,
  gallery,
  specifications,
  inStock,
  featured,
  displayOrder
`

const CATEGORY_FIELDS = `
  _id,
  name,
  slug,
  description,
  displayOrder
`

const ANNOUNCEMENT_FIELDS = `
  _id,
  title,
  description,
  image,
  displayOrder,
  isActive
`

// Products API
export async function getAllProducts(): Promise<Product[]> {
  const query = `*[_type == "product"] | order(displayOrder asc, _createdAt desc) {
    ${PRODUCT_FIELDS}
  }`
  return sanityFetch<Product[]>(query)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && featured == true] | order(displayOrder asc) [0...8] {
    ${PRODUCT_FIELDS}
  }`
  return sanityFetch<Product[]>(query)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    ${PRODUCT_FIELDS}
  }`
  return sanityFetch<Product | null>(query, { slug })
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const query = `*[_type == "product" && category->slug.current == $categorySlug] | order(displayOrder asc) {
    ${PRODUCT_FIELDS}
  }`
  return sanityFetch<Product[]>(query, { categorySlug })
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const query = `*[_type == "product" && (
    name match $searchTerm + "*" ||
    description match $searchTerm + "*"
  )] | order(displayOrder asc) {
    ${PRODUCT_FIELDS}
  }`
  return sanityFetch<Product[]>(query, { searchTerm })
}

// Categories API
export async function getAllCategories(): Promise<Category[]> {
  const query = `*[_type == "category"] | order(displayOrder asc, name asc) {
    ${CATEGORY_FIELDS}
  }`
  return sanityFetch<Category[]>(query)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const query = `*[_type == "category" && slug.current == $slug][0] {
    ${CATEGORY_FIELDS}
  }`
  return sanityFetch<Category | null>(query, { slug })
}

// Announcements API
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const query = `*[_type == "announcement" && isActive == true] | order(displayOrder asc, _createdAt desc) {
    ${ANNOUNCEMENT_FIELDS}
  }`
  return sanityFetch<Announcement[]>(query)
}

export async function hasActiveAnnouncements(): Promise<boolean> {
  const query = `count(*[_type == "announcement" && isActive == true]) > 0`
  return sanityFetch<boolean>(query)
}

// Site Settings API
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const query = `*[_type == "siteSettings"][0] {
    _id,
    siteName,
    logo,
    tagline,
    contactEmail,
    contactPhone,
    mobileNumber,
    whatsappNumber,
    address,
    city,
    state,
    pincode,
    country
  }`
  return sanityFetch<SiteSettings | null>(query)
}

// Contact Form Submission
// DEPRECATED: Using WhatsApp integration instead
/*
export async function submitContactForm(data: {
  name: string
  email: string
  phone?: string
  message: string
}): Promise<Contact> {
  const { sanityClient } = await import('./sanity.client')
  
  const doc = {
    _type: 'contact',
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    status: 'new',
    submittedAt: new Date().toISOString(),
  }

  return sanityClient.create(doc)
}

// Quote Request Submission
export async function submitQuoteRequest(data: {
  customerName: string
  customerEmail: string
  customerPhone?: string
  productId?: string
  quantity: number
  message?: string
}): Promise<Quote> {
  const { sanityClient } = await import('./sanity.client')
  
  const doc: any = {
    _type: 'quote',
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    quantity: data.quantity,
    message: data.message,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }

  // Add product reference if provided
  if (data.productId) {
    doc.product = {
      _type: 'reference',
      _ref: data.productId,
    }
  }

  return sanityClient.create(doc)
}
*/

// Image URL Helper
export function getImageUrl(source: any, width?: number): string {
  if (!source) return '/images/placeholder.jpg'
  
  const builder = urlFor(source)
  
  if (width) {
    return builder.width(width).url()
  }
  
  return builder.url()
}

// Responsive Image URLs
export function getResponsiveImageUrls(source: any) {
  if (!source) {
    return {
      thumbnail: '/images/placeholder.jpg',
      small: '/images/placeholder.jpg',
      medium: '/images/placeholder.jpg',
      large: '/images/placeholder.jpg',
    }
  }

  return {
    thumbnail: urlFor(source).width(200).url(),
    small: urlFor(source).width(400).url(),
    medium: urlFor(source).width(800).url(),
    large: urlFor(source).width(1200).url(),
  }
}
