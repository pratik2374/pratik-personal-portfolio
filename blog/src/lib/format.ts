// Pure helpers, safe to import from client components (no Sanity API client).
import { stegaClean } from '@sanity/client/stega'
import type { SanityImage } from './sanity'

// ─── Helpers ─────────────────────────────────────────────────────────────

const WORDS_PER_MINUTE = 220

/** Prefer the editor's override, otherwise estimate from the body's word count. */
export function readTimeOf(post: { readTime?: string; wordCount?: number }): string {
  if (post.readTime) return stegaClean(post.readTime)
  const minutes = Math.max(1, Math.ceil((post.wordCount || 0) / WORDS_PER_MINUTE))
  return `${minutes} min read`
}

export function formatDate(date?: string): string {
  if (!date) return ''
  date = stegaClean(date)
  // Sanity `date` fields are plain YYYY-MM-DD; pin to UTC so the day never shifts by timezone.
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function hasImageAsset(image?: SanityImage | null): image is SanityImage {
  return Boolean(image?.asset?._ref || image?.asset?._id)
}
