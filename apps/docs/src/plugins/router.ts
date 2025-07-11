import { setupLayouts } from 'virtual:generated-layouts'
// eslint-disable-next-line import/no-duplicates
import { createRouter, createWebHistory } from 'vue-router'
// eslint-disable-next-line import/no-duplicates
import { routes } from 'vue-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(),
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
})
