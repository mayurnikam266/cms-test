import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

// Sanity Client Configuration
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 's9692oke',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-02-01',
  useCdn: true, // Use CDN for faster reads in production
  perspective: 'published', // Only fetch published documents
  // Token removed - using public dataset access
})

// Image URL Builder
const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

// Helper function for fetching with error handling
export async function sanityFetch<T = any>(query: string, params = {}): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params)
  } catch (error) {
    console.error('Sanity fetch error:', error)
    throw error
  }
}
