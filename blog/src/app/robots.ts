import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/sanity'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Never block /_next/: crawlers need the CSS/JS there to render pages.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
