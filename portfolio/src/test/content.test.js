import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../lib/sanity', () => ({
  sanityClient: { fetch: vi.fn() },
}))

import { sanityClient } from '../lib/sanity'
import {
  buildCollectionQuery,
  buildDocumentQuery,
  fetchCollection,
  fetchDocument,
  readCache,
  writeCache,
  collectionKey,
  documentKey,
  purgeLegacyCache,
  __resetCacheForTests,
} from '../lib/content'

beforeEach(() => {
  __resetCacheForTests()
  localStorage.clear()
  sanityClient.fetch.mockReset()
})

describe('buildCollectionQuery', () => {
  it('uses a $type parameter and excludes drafts', () => {
    const { query, params } = buildCollectionQuery('projects')
    expect(params).toEqual({ type: 'project' })
    expect(query).toContain('_type == $type')
    expect(query).toContain('!(_id in path("drafts.**"))')
  })

  it('never fetches blog content and orders posts by date', () => {
    const { query } = buildCollectionQuery('blog')
    expect(query).not.toMatch(/\bcontent\b/)
    expect(query).toContain('order(date desc)')
  })

  it('requests LQIP placeholders for images', () => {
    expect(buildCollectionQuery('projects').query).toContain('asset->metadata.lqip')
  })

  it('throws for unknown collections', () => {
    expect(() => buildCollectionQuery('nope')).toThrow()
  })
})

describe('buildDocumentQuery', () => {
  it('passes the slug as a parameter instead of interpolating it', () => {
    const evil = '"] | *[_type == "secret'
    const { query, params } = buildDocumentQuery('projects', evil)
    expect(query).not.toContain(evil)
    expect(query).toContain('slug.current == $slug')
    expect(params).toEqual({ type: 'project', slug: evil })
  })

  it('includes gallery images for detail views', () => {
    expect(buildDocumentQuery('experience', 'x').query).toContain('gallery[]')
  })

  it('rejects collections without a detail view', () => {
    expect(() => buildDocumentQuery('tools', 'x')).toThrow()
  })
})

describe('cache + fetching', () => {
  it('normalizes ids and caches collections', async () => {
    sanityClient.fetch.mockResolvedValue([{ _id: 'a', title: 'A' }])
    const docs = await fetchCollection('projects')
    expect(docs).toEqual([{ _id: 'a', id: 'a', title: 'A' }])
    expect(readCache(collectionKey('projects'))).toEqual(docs)
  })

  it('deduplicates concurrent requests and skips refetching fresh data', async () => {
    sanityClient.fetch.mockResolvedValue([])
    await Promise.all([fetchCollection('tools'), fetchCollection('tools')])
    await fetchCollection('tools')
    expect(sanityClient.fetch).toHaveBeenCalledTimes(1)
  })

  it('returns null for missing documents', async () => {
    sanityClient.fetch.mockResolvedValue(null)
    expect(await fetchDocument('projects', 'missing')).toBeNull()
  })

  it('survives a full localStorage', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })
    expect(() => writeCache(documentKey('projects', 'x'), { id: 'x' })).not.toThrow()
    expect(readCache(documentKey('projects', 'x'))).toEqual({ id: 'x' })
    setItem.mockRestore()
  })

  it('purges caches from the previous version', () => {
    localStorage.setItem('portfolio_cache_blog__createdAt', '[]')
    localStorage.setItem('portfolio_doc_blog_x', '{}')
    localStorage.setItem('unrelated', '1')
    purgeLegacyCache()
    expect(localStorage.getItem('portfolio_cache_blog__createdAt')).toBeNull()
    expect(localStorage.getItem('portfolio_doc_blog_x')).toBeNull()
    expect(localStorage.getItem('unrelated')).toBe('1')
  })
})
