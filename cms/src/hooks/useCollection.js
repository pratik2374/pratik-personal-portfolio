import { useState, useEffect, useCallback } from 'react'
import {
  collection, getDocs,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc, writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useCollection(collectionName) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const snapshot = await getDocs(collection(db, collectionName))
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      // Sort by 'order' if present, otherwise by createdAt descending
      const hasOrder = docs.some(d => d.order !== undefined)
      if (hasOrder) {
        docs.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
      } else {
        docs.sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() ?? 0
          const tb = b.createdAt?.toMillis?.() ?? 0
          return tb - ta
        })
      }
      setData(docs)
      setError(null)
    } catch (err) {
      setError(err)
      console.error(`useCollection(${collectionName}):`, err)
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

  // Batch-write order field for all items after drag-and-drop
  const reorder = async (reorderedItems) => {
    // Optimistic update
    setData(reorderedItems)
    const batch = writeBatch(db)
    reorderedItems.forEach((item, index) => {
      batch.update(doc(db, collectionName, item.id), { order: index })
    })
    await batch.commit()
  }

  return { data, loading, error, getById, add, update, remove, reorder, refetch: fetchAll }
}
