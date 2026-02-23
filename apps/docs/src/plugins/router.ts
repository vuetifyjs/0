import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Composables
import { getPrefersReducedMotion } from '@/composables/useSettings'

// Types
import type { RouterOptions } from 'vue-router'

const routerOptions: Omit<RouterOptions, 'history'> = {
  routes: setupLayouts(routes),
  scrollBehavior (to, _from, savedPosition) {
    // SSR safety - scrollBehavior only runs client-side but guard for clarity
    if (!IN_BROWSER) return { top: 0 }

    // Avoid scrolling up (requires explicit params field)
    if ((to.params as any).savePosition) return {}

    // If the user navigated via browser back/forward, restore their position
    if (savedPosition) return savedPosition

    // If navigating to a hash (anchor), scroll to that element
    // Delay to allow DOM to settle after hydration
    if (to.hash) {
      return new Promise(resolve => {
        setTimeout(() => {
          try {
            const el = document.querySelector(to.hash)
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
