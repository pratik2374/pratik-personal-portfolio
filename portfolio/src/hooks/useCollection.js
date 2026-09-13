import { useState, useEffect } from 'react'
import { sanityClient } from '../lib/sanity'

export function useCollection(collectionName, orderField = '_createdAt') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Map Firebase collection names to Sanity types
    const typeMap = {
      'projects': 'project',
      'experience': 'experience',
      'blog': 'blog',
      'tools': 'tool'
    }
    const type = typeMap[collectionName] || collectionName

    // We only want published documents (native Sanity draft filtering)
    // Default ordering is descending. If orderField is manualOrder or order, sort ascending
    const orderStr = orderField === 'order' || orderField === 'manualOrder' 
      ? `order(${orderField} asc)` 
      : `order(${orderField} desc)`

    const query = `*[_type == "${type}" && !(_id in path("drafts.**"))] | ${orderStr}`

    sanityClient.fetch(query)
      .then(docs => {
        // Map Sanity _id to id and flatten slug so frontend doesn't break
        const mapped = docs.map(doc => ({ 
          ...doc, 
          id: doc._id,
          slug: doc.slug?.current || doc.slug
        }))
        setData(mapped)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [collectionName, orderField])

  return { data, loading, error }
}
