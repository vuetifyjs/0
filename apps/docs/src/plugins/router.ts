import { setupLayouts } from 'virtual:generated-layouts'
import type { RouterOptions } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const routerOptions: Omit<RouterOptions, 'history'> = {
  routes: setupLayouts(routes),
  scrollBehavior (to, _from, savedPosition) {
    // If the user navigated via browser back/forward, restore their position
    if (savedPosition) return savedPosition

    // If navigating to a hash (anchor), scroll to that element
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    // Otherwise, scroll to top
    return { top: 0 }
  },
}

export default routerOptions
