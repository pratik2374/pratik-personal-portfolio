import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8j6w8ohu',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2024-01-01',
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source).auto('format')
}

export interface Category {
  _id: string
  title: string
  slug: string
  description?: string
  color?: string
  order?: number
}

export interface BlogPost {
  _id: string
  title: string
  slug: string
  summary?: string
  date?: string
  readTime?: string
  isFeatured?: boolean
  tags?: string[]
  category?: Category | null
  image?: any
  content?: any
}
