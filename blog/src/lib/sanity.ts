import { createClient, type QueryParams } from 'next-sanity'
import { draftMode } from 'next/headers'
import type { PortableTextBlock } from '@portabletext/react'

export { urlFor } from './image'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.pratikgond.tech').replace(/\/$/, '')

/** Where "edit" overlays in live preview jump to. */
export const STUDIO_URL = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8j6w8ohu',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  // Next.js caches every response and the Sanity webhook invalidates it on publish,
  // so read straight from the API: the CDN could hand a just-published change back stale.
  useCdn: false,
  apiVersion: '2024-01-01',
  stega: { studioUrl: STUDIO_URL },
})

/** Every Sanity response carries this tag; `/api/revalidate` clears it when content changes. */
export const SANITY_CACHE_TAG = 'sanity'

/** Server-only token with read access to drafts (Viewer role). Never exposed to the browser. */
const previewToken = process.env.SANITY_API_READ_TOKEN

async function isDraftMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // Outside a request (build time, generateStaticParams): always published content.
    return false
  }
}

export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  if (previewToken && (await isDraftMode())) {
    // Live preview from the studio: unpublished drafts, never cached, with invisible
    // edit markers (stega) so clicking any text opens that field in the studio.
    return client.fetch<T>(query, params, {
      perspective: 'drafts',
      token: previewToken,
      stega: true,
      useCdn: false,
      cache: 'no-store',
    })
  }
  return client.fetch<T>(query, params, {
    perspective: 'published',
    stega: false,
    next: { tags: [SANITY_CACHE_TAG], revalidate: 3600 },
  })
}

// ─── Types ───────────────────────────────────────────────────────────────

export interface SanityImage {
  _type?: 'image'
  _key?: string
  asset?: {
    _id?: string
    _ref?: string
    metadata?: {
      lqip?: string
      dimensions?: { width: number; height: number; aspectRatio: number }
    }
  }
  alt?: string
  caption?: string
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export interface CodeValue {
  _type: 'code'
  _key: string
  language?: string
  code?: string
  filename?: string
}

export type ContentItem = PortableTextBlock | CodeValue | (SanityImage & { _type: 'image'; _key: string })

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
  updatedAt?: string
  _updatedAt?: string
  readTime?: string
  wordCount?: number
  isFeatured?: boolean
  tags?: string[]
  category?: Category | null
  image?: SanityImage
  content?: ContentItem[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: SanityImage
    /** Keep this post out of search results and the sitemap (drafts-in-public, test posts). */
    noIndex?: boolean
  }
}

// ─── Shared GROQ fragments ──────────────────────────────────────────────

export const PUBLISHED = `!(_id in path("drafts.**"))`

/** Image with the metadata needed for blur placeholders and layout-stable sizing. */
export const IMAGE_FIELDS = `{
  ...,
  asset->{ _id, metadata { lqip, dimensions { width, height, aspectRatio } } }
}`

export const CATEGORY_FIELDS = `{ _id, title, "slug": slug.current, color, description }`

/** Fields every post card needs. */
export const POST_CARD_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  summary,
  date,
  readTime,
  isFeatured,
  tags,
  "wordCount": length(string::split(pt::text(content), " ")),
  "seo": { "noIndex": seo.noIndex },
  category->${CATEGORY_FIELDS},
  image${IMAGE_FIELDS}
`

export { readTimeOf, formatDate, hasImageAsset } from './format'
