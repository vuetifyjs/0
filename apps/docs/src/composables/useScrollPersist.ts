/**
 * @module useScrollPersist
 *
 * @remarks
 * Persists scroll position across page refreshes using sessionStorage.
 *
 * Key features:
 * - Saves scroll position on beforeunload
 * - Restores position after router is ready
 * - Uses v0 storage composable with sessionStorage adapter
 * - SSR-safe
 */

// Composables
import { createStorage, useWindowEventListener } from '@vuetify/v0'

// Utilities
import { useRouter } from 'vue-router'

// Globals
import { IN_BROWSER } from '@vuetify/v0/constants'

// Types
interface ScrollPosition {
  left: number
  top: number
}

export function useScrollPersist () {
  if (!IN_BROWSER) return

  const router = useRouter()

  const storage = createStorage({
    adapter: window.sessionStorage,
    prefix: 'scroll:',
  })

  function getScrollKey () {
    return history.state?.key ?? router.currentRoute.value.fullPath
  }

  function savePosition () {
    const key = getScrollKey()
    if (!key) return

    storage.set<ScrollPosition>(key, {
      left: window.scrollX,
      top: window.scrollY,
    })
  }

  function restorePosition () {
    const key = getScrollKey()
    const position = storage.get<ScrollPosition | null>(key, null)

    if (position.value) {
      window.scrollTo(position.value.left, position.value.top)
    }
  }

  useWindowEventListener('beforeunload', savePosition)

  router.isReady().then(restorePosition)
}
