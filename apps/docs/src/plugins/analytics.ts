import { IN_BROWSER } from '@vuetify/v0/constants'
import * as Swetrix from 'swetrix'

function initAnalytics () {
  Swetrix.init('zBsmiQsAi0Bj', {
    apiURL: 'https://swetrix-api.vuetifyjs.com/log',
  })
  Swetrix.trackViews()
  Swetrix.trackErrors()
}

if (IN_BROWSER) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initAnalytics, { timeout: 2000 })
  } else {
    setTimeout(initAnalytics, 0)
  }
}
