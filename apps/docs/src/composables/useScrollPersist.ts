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

// Framework
import { createStorage, useWindowEventListener } from '@vuetify/v0'
// Globals
import { IN_BROWSER } from '@vuetify/v0/constants'

// Utilities
import { useRouter } from 'vue-router'

// Types
interface ScrollPosition {
  left: number
  top: number
}

export function useScrollPersist (): void {
  if (!IN_BROWSER) return

  const router = useRouter()

  const storage = createStorage({
    adapter: window.sessionStorage,
    prefix: 'scroll:',
  })

  function getScrollKey () {
    // Exclude hash so saves keyed by path match what scrollBehavior reads;
    // useToc rewrites the URL hash via replaceState, so currentRoute.fullPath
    // alone wouldn't be reliable.
    return history.state?.key ?? router.currentRoute.value.path
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
