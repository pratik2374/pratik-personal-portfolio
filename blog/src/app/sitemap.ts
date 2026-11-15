import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.pratikgond.tech'

  // Fetch all published posts
  const postsQuery = `*[_type == "blog" && !(_id in path("drafts.**")) && defined(slug.current)] {
    "slug": slug.current,
    date,
    _updatedAt
  }`
  
  // Fetch all categories
  const categoriesQuery = `*[_type == "category" && !(_id in path("drafts.**")) && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`

  const [posts, categories] = await Promise.all([
    client.fetch(postsQuery).catch(() => []),
    client.fetch(categoriesQuery).catch(() => []),
  ])

  const blogUrls = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || post._updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const categoryUrls = categories.map((cat: any) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(cat._updatedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]

  return [...staticUrls, ...categoryUrls, ...blogUrls]
}
