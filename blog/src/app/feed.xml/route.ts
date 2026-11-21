import { sanityFetch, PUBLISHED, SITE_URL } from "@/lib/sanity"

export const revalidate = 3600

interface FeedPost {
  title: string
  slug: string
  summary?: string
  date?: string
  _updatedAt: string
  category?: { title?: string }
}

/** CDATA cannot contain "]]>", so split it across two sections. */
function cdata(text = ""): string {
  return `<![CDATA[${text.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`
}

export async function GET() {
  const posts = await sanityFetch<FeedPost[]>(
    `*[_type == "blog" && ${PUBLISHED} && defined(slug.current)] | order(date desc) {
      title,
      "slug": slug.current,
      summary,
      date,
      _updatedAt,
      category->{ title }
    }`
  )

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${SITE_URL}/blog/${post.slug}`
      const pubDate = new Date(post.date || post._updatedAt).toUTCString()
      const categoryTag = post.category?.title ? `<category>${cdata(post.category.title)}</category>` : ""

      return `
    <item>
      <title>${cdata(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${cdata(post.summary)}</description>
      <pubDate>${pubDate}</pubDate>
      ${categoryTag}
    </item>`
    })
    .join("")

  const lastBuild = posts[0] ? new Date(posts[0].date || posts[0]._updatedAt) : new Date()

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pratik Gond | Engineering, AI &amp; Architecture Journal</title>
    <link>${SITE_URL}</link>
    <description>Technical deep dives into Artificial Intelligence, LLM systems, full-stack architecture, and production engineering lessons by Pratik Gond.</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
