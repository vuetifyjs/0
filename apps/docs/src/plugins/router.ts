import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Composables
import { getPrefersReducedMotion } from '@/composables/useSettings'

// Types
import type { RouteLocationNormalized, RouterOptions } from 'vue-router'

let isInitialNavigation = true

function readPersistedPosition (to: RouteLocationNormalized) {
  // sessionStorage is keyed by path (no hash) to match useScrollPersist —
  // useToc rewrites the URL hash via replaceState, so a key that includes
  // the hash would drift from what was saved.
  const persistKey = history.state?.key ?? to.path
  const raw = sessionStorage.getItem(`scroll:${persistKey}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as { left: number, top: number }
  } catch {
    return null
  }
}

const routerOptions: Omit<RouterOptions, 'history'> = {
  routes: setupLayouts(routes),
  scrollBehavior (to, _from, savedPosition) {
    // SSR safety - scrollBehavior only runs client-side but guard for clarity
    if (!IN_BROWSER) return { top: 0 }

    // Avoid scrolling up (requires explicit params field)
    if ('savePosition' in to.params) return {}

    // If the user navigated via browser back/forward, restore their position
    if (savedPosition) return savedPosition

    // On refresh (the very first scrollBehavior call after page load),
    // honor the position saved by useScrollPersist instead of re-snapping
    // to the URL hash. Subsequent in-session navigations skip this so a
    // RouterLink to `/page#foo` still scrolls to #foo even if /page has a
    // stale entry from earlier in the session.
    if (isInitialNavigation) {
      isInitialNavigation = false
      const persisted = readPersistedPosition(to)
      if (persisted) return persisted
    }

    // If navigating to a hash (anchor), scroll to that element
    // Delay to allow DOM to settle after hydration
    if (to.hash) {
      return new Promise(resolve => {
        setTimeout(() => {
          try {
            const el = document.querySelector(`#${CSS.escape(to.hash.slice(1))}`)
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 80
              const behavior = getPrefersReducedMotion() ? 'auto' : 'smooth'
              resolve({ top, behavior })
              return
            }
          } catch {
            // Hash is not a valid CSS selector (e.g. base64 store state)
          }
          resolve({ top: 0 })
        }, 100)
      })
    }

    // Otherwise, scroll to top
    return { top: 0 }
  },
}

export default routerOptions
