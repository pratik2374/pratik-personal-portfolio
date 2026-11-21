import { sanityFetch, PUBLISHED, POST_CARD_FIELDS, SITE_URL, type BlogPost, type Category } from "@/lib/sanity"
import { BlogHomeView } from "@/components/BlogHomeView"
import { jsonLd } from "@/lib/seo"
import { PERSON_ID } from "@/lib/profile"
import { stegaClean } from "@sanity/client/stega"
import { Metadata } from "next"

export const revalidate = 3600 // Revalidate cache every hour

export const metadata: Metadata = {
  title: "Pratik Gond | Engineering, AI & Architecture Journal",
  description:
    "Technical deep dives into Artificial Intelligence, autonomous agents, modern web architecture, and production software engineering by Pratik Gond.",
  alternates: {
    canonical: SITE_URL,
  },
}

async function getCategories(): Promise<Category[]> {
  const query = `*[_type == "category" && ${PUBLISHED}] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    color,
    order
  }`
  return sanityFetch<Category[]>(query).catch(() => [])
}

async function getAllPosts(): Promise<BlogPost[]> {
  const query = `*[_type == "blog" && ${PUBLISHED} && defined(slug.current)] | order(date desc) { ${POST_CARD_FIELDS} }`
  return sanityFetch<BlogPost[]>(query).catch(() => [])
}

export default async function Home() {
  const [categories, allPosts] = await Promise.all([
    getCategories(),
    getAllPosts(),
  ])

  // Lists every post on the Blog entity declared in the root layout.
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/#blog`,
    url: SITE_URL,
    author: { "@id": PERSON_ID },
    blogPost: allPosts
      .filter((p) => !p.seo?.noIndex)
      .map((p) => ({
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${p.slug}#article`,
        url: `${SITE_URL}/blog/${p.slug}`,
        headline: stegaClean(p.title),
        ...(p.date && { datePublished: stegaClean(p.date) }),
        author: { "@id": PERSON_ID },
      })),
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(blogSchema) }} />
      <BlogHomeView
        categories={categories}
        allPosts={allPosts}
      />
    </div>
  )
}
