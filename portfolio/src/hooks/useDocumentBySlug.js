import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useDocumentBySlug(collectionName, slug) {
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    const q = query(
      collection(db, collectionName),
      where('slug', '==', slug),
      where('status', '==', 'live')
    )
    getDocs(q)
      .then(snapshot => {
        if (!snapshot.empty) {
          setDoc({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() })
        } else {
          setError(new Error('Post not found'))
        }
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [collectionName, slug])

  return { doc, loading, error }
}
