import { useState, useEffect } from 'react'
import { collectionKey, fetchCollection, readCache } from '../lib/content'

/**
 * Stale-while-revalidate list hook: renders cached data instantly (memory or
 * localStorage), then refreshes from Sanity in the background.
 */
export function useCollection(name) {
  const [state, setState] = useState(() => {
    const cached = readCache(collectionKey(name))
    return { data: cached ?? [], loading: !cached, error: null }
  })

  useEffect(() => {
    let active = true
    fetchCollection(name)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (active) setState((prev) => ({ ...prev, loading: false, error }))
      })
    return () => {
      active = false
    }
  }, [name])

  return state
}
