import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pratikgond.blog'

  const query = `*[_type == "blog" && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    date
  }`
  
  const posts = await client.fetch(query)

  const blogUrls = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...blogUrls,
  ]
}
