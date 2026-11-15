import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: '8j6w8ohu',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-01-01', // use current date (YYYY-MM-DD) to target the latest API version
})

const builder = imageUrlBuilder(sanityClient)

/**
 * Returns a Sanity image url builder pre-configured with auto format (WebP/AVIF) and quality 80.
 */
export function urlFor(source) {
  if (!source) return { url: () => '' }
  return builder.image(source).auto('format').quality(80)
}

/**
 * Helper to get an optimized CDN image URL with width, height, auto-format and quality.
 * This guarantees images are never served oversized or uncompressed.
 */
export function getOptimizedImageUrl(source, { width, height, quality = 80, fit = 'crop' } = {}) {
  if (!source) return ''
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
