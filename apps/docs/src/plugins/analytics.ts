// Framework
import { IN_BROWSER } from '@vuetify/v0/constants'

// Composables
import { useIdleCallback } from '@/composables/useIdleCallback'

async function initAnalytics () {
  const Swetrix = await import('swetrix')
  Swetrix.init('zBsmiQsAi0Bj', {
    apiURL: 'https://swetrix-api.vuetifyjs.com/log',
  })
  Swetrix.trackViews()
  Swetrix.trackErrors()
}

if (IN_BROWSER && import.meta.env.VITE_INDEX !== 'false') {
  useIdleCallback(initAnalytics, 2000)
}
