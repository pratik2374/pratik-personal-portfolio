import { useState, useEffect } from 'react'
import { sanityClient } from '../lib/sanity'

export function useDocumentBySlug(collectionName, slug) {
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
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

    // We check slug.current because Sanity slugs are objects: { current: 'my-slug' }
    // Filter out drafts automatically.
    const query = `*[_type == "${type}" && slug.current == "${slug}" && !(_id in path("drafts.**"))][0]`

    sanityClient.fetch(query)
      .then(result => {
        if (result) {
          // Map _id to id and flatten slug to match old Firebase format exactly
          setDoc({ ...result, id: result._id, slug: result.slug.current })
        } else {
          setError(new Error('Document not found'))
        }
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [collectionName, slug])

  return { doc, loading, error }
}
