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
      where('status', '==', 'live'),
      orderBy(orderField, 'desc')
    )
    getDocs(q)
      .then(snapshot => {
        setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [collectionName, orderField])

  return { data, loading, error }
}
