import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: '8j6w8ohu', // from your portfolio
  dataset: 'production',
  useCdn: true, // `false` if you want to ensure fresh data
  apiVersion: '2024-01-01',
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
