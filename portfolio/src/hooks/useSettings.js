import { useSettingsContext } from '../context/SettingsContext'

/** The merged shared profile (Sanity `siteSettings` over the static fallback). */
export function useSettings() {
  return useSettingsContext()
}
