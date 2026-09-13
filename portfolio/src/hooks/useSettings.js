import { useState, useEffect } from 'react'
import { settings as staticSettings } from '../data/settings'

export function useSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate a tiny delay for consistency, or just set it immediately
    setSettings(staticSettings)
    setLoading(false)
  }, [])

  return { settings, loading }
}
