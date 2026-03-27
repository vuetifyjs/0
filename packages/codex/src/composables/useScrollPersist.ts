/**
 * @module useScrollPersist
 *
 * @remarks
 * Persists scroll position across page refreshes using sessionStorage.
 *
 * Key features:
 * - Saves scroll position on beforeunload
 * - Restores position on next call with the same key
 * - SSR-safe
 */

// Framework
import { createStorage, IN_BROWSER, useWindowEventListener } from '@vuetify/v0'

// Types
interface ScrollPosition {
  left: number
  top: number
}

export function useScrollPersist (key: string): void {
  if (!IN_BROWSER) return

  const storage = createStorage({
    adapter: window.sessionStorage,
    prefix: 'scroll:',
  })

  function save () {
    storage.set<ScrollPosition>(key, {
      left: window.scrollX,
      top: window.scrollY,
    })
  }

  function restore () {
    const position = storage.get<ScrollPosition | null>(key, null)

    if (position.value) {
      window.scrollTo(position.value.left, position.value.top)
    }
  }

  useWindowEventListener('beforeunload', save)

  restore()
}
