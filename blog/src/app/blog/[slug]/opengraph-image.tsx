import { sanityFetch, PUBLISHED, hasImageAsset, type SanityImage } from "@/lib/sanity"
import { jpegUrl } from "@/lib/image"
import { renderOgCard, OG_SIZE } from "../../_og/card"

export const alt = "Article cover"
export const size = OG_SIZE
export const contentType = "image/png"

interface OgPost {
  title: string
  category?: string
  image?: SanityImage
  ogImage?: SanityImage
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await sanityFetch<OgPost | null>(
    `*[_type == "blog" && slug.current == $slug && ${PUBLISHED}][0] {
      title,
      "category": category->title,
      image,
      "ogImage": seo.ogImage
    }`,
    { slug }
  )

  if (!post) return renderOgCard({ title: "Pratik Gond's Blog" })

  // A studio SEO image wins, then the cover. Both are shown as-is: covers already carry
  // their own title art, so text on top would clash. Posts without either get a text card.
  const shareImage = hasImageAsset(post.ogImage) ? post.ogImage : hasImageAsset(post.image) ? post.image : null
  if (shareImage) {
    return renderOgCard({ title: post.title, imageOnly: true, backgroundUrl: jpegUrl(shareImage, OG_SIZE.width, OG_SIZE.height) })
  }

  return renderOgCard({ title: post.title, eyebrow: post.category })
}
