import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: '8j6w8ohu',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-01-01', // use current date (YYYY-MM-DD) to target the latest API version
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source) {
  return builder.image(source)
}
