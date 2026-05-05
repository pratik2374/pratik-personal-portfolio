import { describe, it, expect } from 'vitest'
import { slugify } from '../utils/slugify'

describe('slugify', () => {
  it('lowercases text', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })
  it('replaces spaces with hyphens', () => {
    expect(slugify('my blog post')).toBe('my-blog-post')
  })
  it('removes special characters', () => {
    expect(slugify('Dr. Aria — AI Platform!')).toBe('dr-aria-ai-platform')
  })
  it('collapses multiple hyphens', () => {
    expect(slugify('hello   world')).toBe('hello-world')
  })
  it('trims leading and trailing hyphens', () => {
    expect(slugify('  hello  ')).toBe('hello')
  })
})
