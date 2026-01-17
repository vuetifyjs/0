import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Composables
import { getPrefersReducedMotion } from '@/composables/useSettings'

// Types
import type { RouterOptions, RouteRecordRaw } from 'vue-router'

// TODO: Replace vite-plugin-vue-layouts-next with unplugin-vue-router's extendRoutes hook.
// The layouts plugin doesn't handle nested routes, forcing this workaround.
// We could define layouts via definePage and process them in extendRoutes directly.
function applyLayoutsRecursively (route: RouteRecordRaw): RouteRecordRaw {
  if (route.children) {
    route.children = route.children.map(child => applyLayoutsRecursively(child))
    return route
  }
  return setupLayouts([route])[0]
}

const routerOptions: Omit<RouterOptions, 'history'> = {
  routes: routes.map(route => applyLayoutsRecursively(route)),
  scrollBehavior (to, _from, savedPosition) {
    // SSR safety - scrollBehavior only runs client-side but guard for clarity
    if (!IN_BROWSER) return { top: 0 }

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
