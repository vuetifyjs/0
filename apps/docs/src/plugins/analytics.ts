// Framework
import { IN_BROWSER } from '@vuetify/v0/constants'

async function initAnalytics () {
  try {
    const Swetrix = await import('swetrix')
    Swetrix.init('zBsmiQsAi0Bj', {
      apiURL: 'https://swetrix-api.vuetifyjs.com/log',
    })
    Swetrix.trackViews()
    Swetrix.trackErrors()
  } catch {
    // Analytics initialization failed - non-critical, silently ignore
  }
}

if (IN_BROWSER) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initAnalytics, { timeout: 2000 })
  } else {
    setTimeout(initAnalytics, 0)
  }
}
