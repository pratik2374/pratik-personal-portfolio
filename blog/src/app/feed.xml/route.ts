import { client } from "@/lib/sanity"

export const revalidate = 3600

export async function GET() {
  const query = `*[_type == "blog" && !(_id in path("drafts.**"))] | order(date desc) {
    title,
    "slug": slug.current,
    summary,
    date,
    category->{ title }
  }`

  const posts = await client.fetch(query)

  const siteUrl = "https://blog.pratikgond.tech"

  const itemsXml = posts
    .map((post: any) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`
      const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()
      const categoryTag = post.category?.title ? `<category><![CDATA[${post.category.title}]]></category>` : ""

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.summary || ""}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${categoryTag}
    </item>`
    })
    .join("")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pratik Gond | Engineering, AI &amp; Architecture Journal</title>
    <link>${siteUrl}</link>
    <description>Technical deep dives into Artificial Intelligence, LLM systems, full-stack architecture, and production engineering lessons by Pratik Gond.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
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
