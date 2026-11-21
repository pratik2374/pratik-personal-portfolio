import { createContext, useContext, useEffect, useState } from 'react'
import { settings as staticSettings } from '../data/settings'
import { SITE_SETTINGS_KEY, fetchSiteSettings, readCache } from '../lib/content'
import { mergeSettings } from '../lib/profile'

const SettingsContext = createContext(staticSettings)

/**
 * Shared profile, stale-while-revalidate: the first render uses the static
 * fallback merged with whatever is cached (memory/localStorage), so there is
 * never a blank frame; the fresh Sanity document is swapped in when it lands.
 */
export function SettingsProvider({ children }) {
  const [value, setValue] = useState(() => mergeSettings(staticSettings, readCache(SITE_SETTINGS_KEY)))

  useEffect(() => {
    let active = true
    fetchSiteSettings()
      .then((doc) => {
        if (active) setValue(mergeSettings(staticSettings, doc))
      })
      .catch(() => {
        // Offline or Sanity unavailable: keep the static/cached profile.
      })
    return () => {
      active = false
    }
  }, [])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettingsContext = () => useContext(SettingsContext) || staticSettings
