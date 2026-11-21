import { lazy } from 'react'
import { prefetchCollection, prefetchDocument } from './lib/content'

/**
 * Route-level code splitting. Each page is its own chunk; `preloadRoute`
 * warms both the chunk and its data on hover/focus so clicks feel instant.
 */
const loaders = {
  projects: () => import('./pages/Projects'),
  projectDetail: () => import('./pages/ProjectDetail'),
  experience: () => import('./pages/Experience'),
  experienceDetail: () => import('./pages/ExperienceDetail'),
  tools: () => import('./pages/Tools'),
  notFound: () => import('./pages/NotFound'),
}

export const Pages = Object.fromEntries(
  Object.entries(loaders).map(([name, load]) => [name, lazy(load)])
)

const loaded = new Set()

export function preloadPage(name) {
  const load = loaders[name]
  if (!load || loaded.has(name)) return
  loaded.add(name)
  load().catch(() => loaded.delete(name))
}

/** Preload every page chunk once the browser is idle after first paint. */
export function preloadAllPagesWhenIdle() {
  const run = () => Object.keys(loaders).forEach(preloadPage)
  if (typeof window === 'undefined') return
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
  else window.setTimeout(run, 2000)
}

/**
 * Map an in-app path to what it needs. Returns the page names it touched
 * (useful for tests).
 */
export function preloadRoute(path) {
  if (!path) return []
  const [, section, slug] = path.split('/')
  const touched = []
  const page = (name) => {
    preloadPage(name)
    touched.push(name)
  }

  if (section === 'projects') {
    if (slug) {
      page('projectDetail')
      prefetchDocument('projects', slug)
    } else {
      page('projects')
      prefetchCollection('projects')
    }
  } else if (section === 'experience') {
    if (slug) {
      page('experienceDetail')
      prefetchDocument('experience', slug)
    } else {
      page('experience')
      prefetchCollection('experience')
    }
  } else if (section === 'tools') {
    page('tools')
    prefetchCollection('tools')
  }
  return touched
}

/** Props that trigger preloading on pointer/keyboard/touch intent. */
export function preloadProps(path) {
  const warm = () => preloadRoute(path)
  return { onMouseEnter: warm, onFocus: warm, onTouchStart: warm }
}
