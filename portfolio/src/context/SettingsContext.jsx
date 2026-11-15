import { createContext, useContext } from 'react'
import { settings as staticSettings } from '../data/settings'

const SettingsContext = createContext(staticSettings)

export function SettingsProvider({ children }) {
  // Provide static settings synchronously — 0ms delay, zero blank screens
  return (
    <SettingsContext.Provider value={staticSettings}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettingsContext = () => useContext(SettingsContext) || staticSettings
