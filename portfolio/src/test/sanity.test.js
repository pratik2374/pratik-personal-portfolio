import { describe, it, expect } from 'vitest'
import { buildQueryUrl, getOptimizedImageUrl } from '../lib/sanity'

describe('buildQueryUrl', () => {
  it('targets the API CDN and JSON-encodes parameters', () => {
    const url = new URL(buildQueryUrl('*[_type == $type]', { type: 'project', slug: 'a"b' }))
    expect(url.host).toBe('8j6w8ohu.apicdn.sanity.io')
    expect(url.searchParams.get('query')).toBe('*[_type == $type]')
    expect(url.searchParams.get('$type')).toBe('"project"')
    expect(url.searchParams.get('$slug')).toBe('"a\\"b"')
  })
})

describe('getOptimizedImageUrl', () => {
  it('returns an empty string without an asset', () => {
    expect(getOptimizedImageUrl(null)).toBe('')
    expect(getOptimizedImageUrl({})).toBe('')
  })

  it('builds a sized, auto-format CDN URL', () => {
    const url = getOptimizedImageUrl(
      { asset: { _ref: 'image-abc123-1920x1080-png' } },
      { width: 240, height: 240 }
    )
    expect(url).toContain('https://cdn.sanity.io/images/8j6w8ohu/production/abc123-1920x1080.png')
    expect(url).toContain('w=240')
    expect(url).toContain('auto=format')
  })
})
