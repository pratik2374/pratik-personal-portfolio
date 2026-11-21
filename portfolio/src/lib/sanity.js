import { createImageUrlBuilder } from '@sanity/image-url'

/**
 * The portfolio only ever reads published content, so a tiny GET wrapper
 * over Sanity's CDN-backed query API replaces @sanity/client (~130 KB).
 */
export const SANITY_CONFIG = {
  projectId: '8j6w8ohu',
  dataset: 'production',
  apiVersion: '2024-01-01',
}

const QUERY_ENDPOINT = `https://${SANITY_CONFIG.projectId}.apicdn.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`

export function buildQueryUrl(query, params = {}) {
  const url = new URL(QUERY_ENDPOINT)
  url.searchParams.set('query', query)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value))
  }
  return url.toString()
}

export const sanityClient = {
  async fetch(query, params) {
    const res = await fetch(buildQueryUrl(query, params))
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`Sanity query failed (${res.status}): ${detail.slice(0, 200)}`)
    }
    const body = await res.json()
    return body.result
  },
}

const builder = createImageUrlBuilder({ projectId: SANITY_CONFIG.projectId, dataset: SANITY_CONFIG.dataset })

/** Image URL builder pre-configured with auto format (WebP/AVIF) and quality 80. */
export function urlFor(source) {
  if (!source) return { url: () => '' }
  return builder.image(source).auto('format').quality(80)
}

/** Optimized CDN image URL with width, height, auto-format and quality. */
export function getOptimizedImageUrl(source, { width, height, quality = 80, fit = 'crop' } = {}) {
  if (!source?.asset) return ''
  try {
    let img = builder.image(source).auto('format').quality(quality)
    if (width) img = img.width(width)
    if (height) img = img.height(height)
    if (fit) img = img.fit(fit)
    return img.url()
  } catch (e) {
    console.error('Error generating image URL:', e)
    return ''
  }
}
