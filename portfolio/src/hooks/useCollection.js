import { useState, useEffect } from 'react'
import { sanityClient } from '../lib/sanity'

export function useCollection(collectionName, orderField = '_createdAt') {
  const cacheKey = `portfolio_cache_${collectionName}_${orderField}`

  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (e) {
      // Ignore storage errors
    }
    return []
  })

  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) return false
    } catch (e) {}
    return true
  })

  const [error, setError] = useState(null)

  useEffect(() => {
    const typeMap = {
      'projects': 'project',
      'experience': 'experience',
      'blog': 'blog',
      'tools': 'tool'
    }
    const type = typeMap[collectionName] || collectionName

    const orderStr = orderField === 'order' || orderField === 'manualOrder' 
      ? `order(${orderField} asc)` 
      : `order(${orderField} desc)`

    const query = `*[_type == "${type}" && !(_id in path("drafts.**"))] | ${orderStr}`

    sanityClient.fetch(query)
      .then(docs => {
        const mapped = docs.map(doc => ({ 
          ...doc, 
          id: doc._id,
          slug: doc.slug?.current || doc.slug
        }))
        setData(mapped)
        try {
          localStorage.setItem(cacheKey, JSON.stringify(mapped))
        } catch (e) {}
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [collectionName, orderField, cacheKey])

  return { data, loading, error }
}
