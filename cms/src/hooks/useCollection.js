import { useState, useEffect, useCallback } from 'react'
import {
  collection, query, orderBy, getDocs,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useCollection(collectionName) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  useEffect(() => { fetchAll() }, [fetchAll])

  const getById = async (id) => {
    const snap = await getDoc(doc(db, collectionName, id))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  }

  const add = async (item) => {
    await addDoc(collection(db, collectionName), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    await fetchAll()
  }

  const update = async (id, updates) => {
    await updateDoc(doc(db, collectionName, id), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    await fetchAll()
  }

  const remove = async (id) => {
    await deleteDoc(doc(db, collectionName, id))
    await fetchAll()
  }

  return { data, loading, error, getById, add, update, remove, refetch: fetchAll }
}
