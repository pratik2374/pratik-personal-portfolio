import { settings as staticSettings } from '../data/settings'

export function useSettings() {
  return { settings: staticSettings, loading: false }
}
