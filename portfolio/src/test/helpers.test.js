import { describe, it, expect, vi } from 'vitest'

vi.mock('../lib/sanity', () => ({
  sanityClient: { fetch: vi.fn().mockResolvedValue([]) },
  getOptimizedImageUrl: () => '',
}))

import { buildMessageDoc, LIMITS } from '../components/ui/ContactForm'
import { pickHomePosts } from '../components/sections/BlogSection'
import { getEmbedUrl } from '../components/ui/VideoPlayer'
import { preloadRoute } from '../routes'

describe('buildMessageDoc', () => {
  it('writes only the fields Firestore rules allow, trimmed', () => {
    const doc = buildMessageDoc({ name: ' Ada ', email: ' a@b.co ', budget: '', message: ' hi ', extra: 'x' }, 'TS')
    expect(doc).toEqual({ name: 'Ada', email: 'a@b.co', message: 'hi', createdAt: 'TS' })
  })

  it('includes budget when chosen and enforces length limits', () => {
    const doc = buildMessageDoc(
      { name: 'n'.repeat(500), email: 'a@b.co', budget: '$10,000+', message: 'm'.repeat(9000) },
      'TS'
    )
    expect(doc.budget).toBe('$10,000+')
    expect(doc.name).toHaveLength(LIMITS.name)
    expect(doc.message).toHaveLength(LIMITS.message)
  })
})

describe('pickHomePosts', () => {
  const post = (id, extra = {}) => ({ id, ...extra })

  it('puts pinned posts first, then the newest, up to 3', () => {
    const posts = [post('a'), post('b'), post('c', { isFeatured: true }), post('d', { featuredInDesignThoughts: true })]
    expect(pickHomePosts(posts).map((p) => p.id)).toEqual(['c', 'd', 'a'])
  })

  it('handles fewer than 3 posts and empty input', () => {
    expect(pickHomePosts([post('a')])).toHaveLength(1)
    expect(pickHomePosts(undefined)).toEqual([])
  })
})

describe('getEmbedUrl', () => {
  it('handles YouTube, Vimeo, Loom and direct files', () => {
    expect(getEmbedUrl('https://youtu.be/dQw4w9WgXcQ').type).toBe('youtube')
    expect(getEmbedUrl('https://vimeo.com/12345').url).toBe('https://player.vimeo.com/video/12345')
    expect(getEmbedUrl('https://www.loom.com/share/abc123').url).toBe('https://www.loom.com/embed/abc123')
    expect(getEmbedUrl('https://x.com/clip.mp4').type).toBe('direct')
    expect(getEmbedUrl('')).toBeNull()
  })
})

describe('preloadRoute', () => {
  it('maps paths to the page chunks they need', () => {
    expect(preloadRoute('/projects')).toEqual(['projects'])
    expect(preloadRoute('/projects/some-slug')).toEqual(['projectDetail'])
    expect(preloadRoute('/experience/acme')).toEqual(['experienceDetail'])
    expect(preloadRoute('/tools')).toEqual(['tools'])
    expect(preloadRoute('/')).toEqual([])
  })
})
