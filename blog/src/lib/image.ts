import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

// Kept free of the Sanity API client so client components can import it cheaply.
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8j6w8ohu',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
})

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format')
}

/** Plain JPEG URL (no format negotiation) for consumers like OG image rendering that can't decode WebP/AVIF. */
export function jpegUrl(source: SanityImageSource, width: number, height: number) {
  return builder.image(source).width(width).height(height).fit('crop').format('jpg').quality(85).url()
}
