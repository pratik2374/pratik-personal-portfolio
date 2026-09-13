import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '8j6w8ohu',
    dataset: 'production'
  },
  deployment: {
    appId: 'a1v50qsc1ztg07ydgkz29jl6',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
