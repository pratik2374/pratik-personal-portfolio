import type { MetadataRoute } from 'next'
import { sanityFetch, PUBLISHED, SITE_URL } from '@/lib/sanity'

interface SitemapPost {
  slug: string
  date?: string
  updatedAt?: string
  _updatedAt: string
}

interface SitemapCategory {
  slug: string
  /** Newest change across the category and its posts. */
  lastChange?: string
  _updatedAt: string
}

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, latest] = await Promise.all([
    sanityFetch<SitemapPost[]>(
      `*[_type == "blog" && ${PUBLISHED} && defined(slug.current) && seo.noIndex != true] | order(date desc) {
        "slug": slug.current,
        date,
        updatedAt,
        _updatedAt
      }`
    ).catch(() => []),
    sanityFetch<SitemapCategory[]>(
      `*[_type == "category" && ${PUBLISHED} && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt,
        "lastChange": *[_type == "blog" && references(^._id) && ${PUBLISHED}] | order(_updatedAt desc)[0]._updatedAt
      }`
    ).catch(() => []),
    sanityFetch<string | null>(`*[_type == "blog" && ${PUBLISHED}] | order(_updatedAt desc)[0]._updatedAt`).catch(() => null),
  ])

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}`
    return {
      url,
      lastModified: new Date(post.updatedAt || post._updatedAt || post.date || Date.now()),
      changeFrequency: 'monthly',
      priority: 0.9,
      // Image sitemap entry: the share image (cover-based when the post has one).
      images: [`${url}/opengraph-image`],
    }
  })

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: new Date(cat.lastChange || cat._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Static pages: report a real date (newest post for the home page, a fixed date for
  // policies) instead of "now", which tells crawlers every page changes on every build.
  const POLICIES_UPDATED = new Date('2026-11-21')
  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: latest ? new Date(latest) : undefined, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: POLICIES_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: POLICIES_UPDATED, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: POLICIES_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: POLICIES_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: POLICIES_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
  ]

  return [...staticUrls, ...categoryUrls, ...postUrls]
}
