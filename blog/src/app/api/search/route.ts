import { NextResponse } from "next/server"
import { sanityFetch, PUBLISHED } from "@/lib/sanity"

export const revalidate = 3600

export interface SearchIndex {
  posts: {
    title: string
    slug: string
    summary?: string
    tags?: string[]
    date?: string
    category?: { title: string; slug: string } | null
  }[]
  categories: { title: string; slug: string; description?: string }[]
}

/** Small JSON index for the ⌘K palette: titles, summaries, tags and topics only. */
export async function GET() {
  const index = await sanityFetch<SearchIndex>(
    `{
      "posts": *[_type == "blog" && ${PUBLISHED} && defined(slug.current)] | order(date desc) {
        title,
        "slug": slug.current,
        summary,
        tags,
        date,
        "category": category->{ title, "slug": slug.current }
      },
      "categories": *[_type == "category" && ${PUBLISHED} && defined(slug.current)] | order(order asc) {
        title,
        "slug": slug.current,
        description
      }
    }`
  )

  return NextResponse.json(index, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  })
}
