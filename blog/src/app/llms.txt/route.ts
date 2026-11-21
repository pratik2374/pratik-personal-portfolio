import { sanityFetch, PUBLISHED, SITE_URL, type BlogPost, type Category } from "@/lib/sanity"
import { getProfile } from "@/lib/profile"

export const revalidate = 3600

/**
 * /llms.txt: a plain-Markdown map of the site for AI assistants and answer engines
 * (https://llmstxt.org). Lists every indexable post, grouped by topic, with its summary.
 */
export async function GET() {
  const [profile, categories, posts] = await Promise.all([
    getProfile(),
    sanityFetch<Category[]>(`*[_type == "category" && ${PUBLISHED}] | order(order asc) { _id, title, "slug": slug.current, description }`),
    sanityFetch<(BlogPost & { categoryId?: string })[]>(
      `*[_type == "blog" && ${PUBLISHED} && defined(slug.current) && seo.noIndex != true] | order(date desc) {
        title, "slug": slug.current, summary, date, "categoryId": category._ref
      }`
    ),
  ])

  const line = (p: BlogPost) => `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.summary ? `: ${p.summary}` : ""}`
  const sections = categories
    .map((c) => {
      const items = posts.filter((p) => p.categoryId === c._id)
      if (!items.length) return ""
      return `## ${c.title}\n\n${c.description ? `${c.description}\n\n` : ""}${items.map(line).join("\n")}`
    })
    .filter(Boolean)
  const known = new Set(categories.map((c) => c._id))
  const other = posts.filter((p) => !p.categoryId || !known.has(p.categoryId))
  if (other.length) sections.push(`## Other articles\n\n${other.map(line).join("\n")}`)

  const body = `# ${profile.name}: Engineering, AI & Architecture Journal

> Technical deep dives by ${profile.name} (${profile.jobTitle}) into LLM systems, RAG, AI agents, software architecture and production engineering.

Author: ${profile.name} (${profile.url}). Contact: ${profile.email}. RSS: ${SITE_URL}/feed.xml

${sections.join("\n\n")}

## About

- [About the author](${SITE_URL}/about)
- [Contact](${SITE_URL}/contact)
- [Portfolio](${profile.url})
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
