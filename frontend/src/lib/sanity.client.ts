import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Sanity Client Configuration
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 's9692oke',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-02-01',
  useCdn: true, // Use CDN for faster reads in production
  token: process.env.SANITY_API_TOKEN, // Optional: Only needed for write operations
})

// Image URL Builder
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
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
