import { useState, useEffect } from 'react'
import { sanityClient } from '../lib/sanity'

export function useDocumentBySlug(collectionName, slug) {
  const cacheKey = `portfolio_doc_${collectionName}_${slug}`

  const [doc, setDoc] = useState(() => {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) return JSON.parse(cached)
    } catch (e) {}
    return null
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
    if (!slug) return

    const typeMap = {
      'projects': 'project',
      'experience': 'experience',
      'blog': 'blog',
      'tools': 'tool'
    }
    const type = typeMap[collectionName] || collectionName

    const query = `*[_type == "${type}" && slug.current == "${slug}" && !(_id in path("drafts.**"))][0]`

    sanityClient.fetch(query)
      .then(result => {
        if (result) {
          const mapped = { ...result, id: result._id, slug: result.slug?.current || result.slug }
          setDoc(mapped)
          try {
            localStorage.setItem(cacheKey, JSON.stringify(mapped))
          } catch (e) {}
        } else {
          setError(new Error('Document not found'))
        }
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [collectionName, slug, cacheKey])

  return { doc, loading, error }
}
