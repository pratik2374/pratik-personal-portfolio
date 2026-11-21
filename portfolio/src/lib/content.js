import { sanityClient } from './sanity'

/**
 * Single source of truth for what the portfolio reads from Sanity.
 * Every collection has a list projection (only what cards render) and,
 * where a detail page exists, a detail projection.
 */

// Image with the metadata needed for blur-up placeholders and layout.
const IMAGE = `{ asset, crop, hotspot, alt, "lqip": asset->metadata.lqip }`

// Portable Text or a legacy plain string, flattened for card summaries.
const DESCRIPTION_TEXT = `"descriptionText": coalesce(pt::text(description), description)`

const PUBLISHED = `!(_id in path("drafts.**"))`

export const COLLECTIONS = {
  projects: {
    type: 'project',
    order: '_createdAt desc',
    list: `_id, title, "slug": slug.current, ${DESCRIPTION_TEXT}, image${IMAGE}`,
    detail: `_id, title, "slug": slug.current, description, link, github, demo, video, image${IMAGE}, gallery[]${IMAGE}`,
  },
  experience: {
    type: 'experience',
    order: 'order asc',
    list: `_id, companyName, role, date, order, "slug": slug.current, ${DESCRIPTION_TEXT}`,
    detail: `_id, companyName, role, date, employmentType, "slug": slug.current, description, link, video, image${IMAGE}, gallery[]${IMAGE}`,
  },
  tools: {
    type: 'tool',
    order: '_createdAt desc',
    list: `_id, title, "slug": slug.current, description, link, image${IMAGE}`,
  },
  blog: {
    type: 'blog',
    order: 'date desc',
    // Never fetch `content` here: cards only need metadata.
    list: `_id, title, "slug": slug.current, summary, date, readTime, isFeatured, featuredInDesignThoughts`,
  },
}

function getConfig(name) {
  const config = COLLECTIONS[name]
  if (!config) throw new Error(`Unknown collection "${name}"`)
  return config
}

export function buildCollectionQuery(name) {
  const { order, list } = getConfig(name)
  return {
    query: `*[_type == $type && ${PUBLISHED}] | order(${order}) { ${list} }`,
    params: { type: getConfig(name).type },
  }
}

export function buildDocumentQuery(name, slug) {
  const config = getConfig(name)
  if (!config.detail) throw new Error(`Collection "${name}" has no detail view`)
  return {
    query: `*[_type == $type && slug.current == $slug && ${PUBLISHED}][0] { ${config.detail} }`,
    params: { type: config.type, slug },
  }
}

export function normalizeDoc(doc) {
  if (!doc) return null
  return { ...doc, id: doc._id }
}

/* ── Cache: in-memory first, localStorage for instant repeat visits ───────── */

export const CACHE_VERSION = 'v2'
const STORAGE_PREFIX = `portfolio:${CACHE_VERSION}:`
const MAX_PERSIST_BYTES = 200 * 1024 // never let one entry eat the quota
const FRESH_MS = 60 * 1000 // skip refetching data fetched in the last minute

const memory = new Map() // key -> { value, fetchedAt }
const inflight = new Map() // key -> Promise

export const collectionKey = (name) => `collection:${name}`
export const documentKey = (name, slug) => `doc:${name}:${slug}`

function safeStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

/** Remove entries from older cache versions (v1 stored whole blog posts). */
export function purgeLegacyCache(storage = safeStorage()) {
  if (!storage) return
  try {
    const stale = []
    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i)
      if (!k) continue
      const isOld = k.startsWith('portfolio_cache_') || k.startsWith('portfolio_doc_')
      const isOtherVersion = k.startsWith('portfolio:') && !k.startsWith(STORAGE_PREFIX)
      if (isOld || isOtherVersion) stale.push(k)
    }
    stale.forEach((k) => storage.removeItem(k))
  } catch {
    // Storage unavailable (private mode, blocked): nothing to clean.
  }
}

export function readCache(key) {
  const hit = memory.get(key)
  if (hit) return hit.value
  const storage = safeStorage()
  if (!storage) return undefined
  try {
    const raw = storage.getItem(STORAGE_PREFIX + key)
    if (!raw) return undefined
    const value = JSON.parse(raw)
    memory.set(key, { value, fetchedAt: 0 }) // 0 = from disk, still revalidate
    return value
  } catch {
    return undefined
  }
}

export function writeCache(key, value) {
  memory.set(key, { value, fetchedAt: Date.now() })
  const storage = safeStorage()
  if (!storage) return
  try {
    if (value == null) {
      storage.removeItem(STORAGE_PREFIX + key)
      return
    }
    const raw = JSON.stringify(value)
    if (raw.length > MAX_PERSIST_BYTES) return
    try {
      storage.setItem(STORAGE_PREFIX + key, raw)
    } catch {
      // Quota exceeded: drop old versions and try once more.
      purgeLegacyCache(storage)
      storage.setItem(STORAGE_PREFIX + key, raw)
    }
  } catch {
    // Persisting is a convenience; memory cache still works.
  }
}

function isFresh(key) {
  const hit = memory.get(key)
  return Boolean(hit && Date.now() - hit.fetchedAt < FRESH_MS)
}

function dedupe(key, run) {
  if (isFresh(key)) return Promise.resolve(memory.get(key).value)
  if (inflight.has(key)) return inflight.get(key)
  const promise = run().finally(() => inflight.delete(key))
  inflight.set(key, promise)
  return promise
}

export function fetchCollection(name) {
  const key = collectionKey(name)
  return dedupe(key, async () => {
    const { query, params } = buildCollectionQuery(name)
    const docs = (await sanityClient.fetch(query, params)) || []
    const mapped = docs.map(normalizeDoc)
    writeCache(key, mapped)
    return mapped
  })
}

export function fetchDocument(name, slug) {
  const key = documentKey(name, slug)
  return dedupe(key, async () => {
    const { query, params } = buildDocumentQuery(name, slug)
    const doc = normalizeDoc(await sanityClient.fetch(query, params))
    writeCache(key, doc)
    return doc
  })
}

/* ── Shared profile (singleton `siteSettings`, also read by the blog) ─────── */

export const SITE_SETTINGS_KEY = 'siteSettings'

// `_id == "siteSettings"` only matches the published document, never its draft.
export const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0]{
  ...,
  avatar{ ..., "lqip": asset->metadata.lqip }
}`

export function fetchSiteSettings() {
  return dedupe(SITE_SETTINGS_KEY, async () => {
    const doc = (await sanityClient.fetch(SITE_SETTINGS_QUERY, {})) || null
    writeCache(SITE_SETTINGS_KEY, doc)
    return doc
  })
}

/** Fire-and-forget warmers for hover/focus intent. */
export function prefetchCollection(name) {
  fetchCollection(name).catch(() => {})
}

export function prefetchDocument(name, slug) {
  if (!slug) return
  fetchDocument(name, slug).catch(() => {})
}

/** Test helper. */
export function __resetCacheForTests() {
  memory.clear()
  inflight.clear()
}
