import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'general'))
      .then(snap => {
        if (snap.exists()) setSettings(snap.data())
      })
      .finally(() => setLoading(false))
  }, [])

  return { settings, loading }
}
