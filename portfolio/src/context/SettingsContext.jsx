import { createContext, useContext } from 'react'
import { useSettings } from '../hooks/useSettings'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const { settings, loading } = useSettings()
  return (
    <SettingsContext.Provider value={settings}>
      {loading ? null : children}
    </SettingsContext.Provider>
  )
}

export const useSettingsContext = () => useContext(SettingsContext)
