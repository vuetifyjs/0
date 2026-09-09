// Framework
import { IN_BROWSER } from '@vuetify/v0/constants'

async function initAnalytics () {
  const Swetrix = await import('swetrix')
  Swetrix.init('NYQnHCV4oCFA', {
    apiURL: 'https://swetrix-api.vuetifyjs.com/log',
  })
  Swetrix.trackViews()
  Swetrix.trackErrors()
}

if (IN_BROWSER) {
  const timeout = 2000
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => initAnalytics(), { timeout })
  } else {
    setTimeout(initAnalytics, timeout)
  }
}
