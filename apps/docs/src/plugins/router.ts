import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

// Composables
import { getPrefersReducedMotion } from '@/composables/useSettings'

// Types
import type { RouterOptions } from 'vue-router'

const routerOptions: Omit<RouterOptions, 'history'> = {
  routes: setupLayouts(routes),
  scrollBehavior (to, _from, savedPosition) {
    // If the user navigated via browser back/forward, restore their position
    if (savedPosition) return savedPosition

    // If navigating to a hash (anchor), scroll to that element
    // Delay to allow DOM to settle after hydration
    if (to.hash) {
      return new Promise(resolve => {
        setTimeout(() => {
          const el = document.querySelector(to.hash)
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80
            const behavior = getPrefersReducedMotion() ? 'auto' : 'smooth'
            resolve({ top, behavior })
          } else {
            resolve({ top: 0 })
          }
        }, 100)
      })
    }

    // Otherwise, scroll to top
    return { top: 0 }
  },
}

export default routerOptions
