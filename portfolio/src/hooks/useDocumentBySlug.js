import { useState, useEffect } from 'react'
import { documentKey, fetchDocument, readCache } from '../lib/content'

function initialState(key) {
  const cached = key ? readCache(key) : undefined
  return { key, doc: cached ?? null, loading: Boolean(key) && !cached, error: null }
}

/**
 * Loads one document by slug. State is keyed by slug, so navigating from one
 * project to another never shows the previous project's content or error.
 */
export function useDocumentBySlug(name, slug) {
  const key = slug ? documentKey(name, slug) : null
  const [state, setState] = useState(() => initialState(key))

  // Slug changed: reset during render (no flash of the previous document).
  let current = state
  if (state.key !== key) {
    current = initialState(key)
    setState(current)
  }

  useEffect(() => {
    if (!key) return
    let active = true
    fetchDocument(name, slug)
      .then((doc) => {
        if (!active) return
        setState({
          key,
          doc,
          loading: false,
          error: doc ? null : new Error('Document not found'),
        })
      })
      .catch((error) => {
        if (active) setState((prev) => (prev.key === key ? { ...prev, loading: false, error } : prev))
      })
    return () => {
      active = false
    }
  }, [name, slug, key])

  return { doc: current.doc, loading: current.loading, error: current.error }
}
