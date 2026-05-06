import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useCollection(collectionName, orderField = 'createdAt') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      where('status', '==', 'live')
    )
    getDocs(q)
      .then(snapshot => {
        let docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        
        docs.sort((a, b) => {
          const valA = a[orderField]?.toMillis ? a[orderField].toMillis() : a[orderField]
          const valB = b[orderField]?.toMillis ? b[orderField].toMillis() : b[orderField]
          if (valA < valB) return 1
          if (valA > valB) return -1
          return 0
        })
        
        setData(docs)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [collectionName, orderField])

  return { data, loading, error }
}
