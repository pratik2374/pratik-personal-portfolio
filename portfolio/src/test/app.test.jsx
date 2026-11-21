import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'

const fixtures = {
  project: [{ _id: 'p1', title: 'Demo Project', slug: 'demo', descriptionText: 'A demo project' }],
  experience: [{ _id: 'e1', companyName: 'Acme', role: 'Engineer', slug: 'acme', order: 1, descriptionText: 'Built things' }],
  tool: [{ _id: 't1', title: 'LangChain', slug: 'langchain' }],
  blog: [{ _id: 'b1', title: 'Hello Blog', slug: 'hello', summary: 'First post', date: '2026-11-16' }],
}

vi.mock('../lib/sanity', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    sanityClient: {
      fetch: vi.fn(async (query, params) => {
        if (params.slug === 'demo') {
          return { _id: 'p1', title: 'Demo Project', slug: 'demo', description: [{ _type: 'block', _key: 'k', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's', text: 'Detailed write-up', marks: [] }] }] }
        }
        if (params.slug) return null
        return fixtures[params.type] || []
      }),
    },
  }
})

import App from '../App'
import { __resetCacheForTests } from '../lib/content'

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.matchMedia = window.matchMedia || ((q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }))
  window.scrollTo = () => {}
})

beforeEach(() => {
  cleanup()
  __resetCacheForTests()
  localStorage.clear()
})

// Lazy route chunks are transformed on first import, which can take a few
// seconds on a cold run; the default 1s findBy timeout is too tight for that.
const LAZY = { timeout: 8000 }

function visit(path) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

describe('App routes', () => {
  it('renders home with data from every section', async () => {
    visit('/')
    expect(await screen.findByText('Demo Project')).toBeInTheDocument()
    expect(await screen.findByText('Acme')).toBeInTheDocument()
    expect(await screen.findByText('LangChain')).toBeInTheDocument()
    const post = await screen.findByText('Hello Blog')
    expect(post.closest('a')).toHaveAttribute('href', 'https://blog.pratikgond.tech/blog/hello')
  })

  it('lazy-loads the projects page', async () => {
    visit('/projects')
    expect(await screen.findByText('Demo Project', {}, LAZY)).toBeInTheDocument()
  })

  it('renders a project detail page', async () => {
    visit('/projects/demo')
    expect(await screen.findByText('Detailed write-up', {}, LAZY)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Demo Project' })).toBeInTheDocument()
  })

  it('shows not-found for a missing project', async () => {
    visit('/projects/missing')
    expect(await screen.findByText('Project not found.', {}, LAZY)).toBeInTheDocument()
  })

  it('renders the 404 page for unknown routes', async () => {
    visit('/definitely-not-a-page')
    expect(await screen.findByText('NOT FOUND', {}, LAZY)).toBeInTheDocument()
  })

  it('redirects blog posts to the blog site', async () => {
    const replace = vi.fn()
    window.history.pushState({}, '', '/blog/my-post')
    const original = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...original, pathname: original.pathname, search: '', hash: '', replace },
    })
    try {
      render(<App />)
      await waitFor(() => expect(replace).toHaveBeenCalledWith('https://blog.pratikgond.tech/blog/my-post'))
    } finally {
      Object.defineProperty(window, 'location', { configurable: true, value: original })
    }
  })
})
