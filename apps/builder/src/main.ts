import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

// Framework
import { createBreakpointsPlugin, createHydrationPlugin, createStoragePlugin, createThemePlugin, IN_BROWSER } from '@vuetify/v0'

// Context
import App from './App.vue'

// Router
import { builderGuard } from '@/router/guards'

// Utilities
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import 'virtual:uno.css'

function getSystemTheme (): 'light' | 'dark' {
  if (!IN_BROWSER) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
})

app.use(createPinia())
router.beforeEach(builderGuard)
app.use(router)
app.use(createHydrationPlugin())
app.use(createBreakpointsPlugin({ mobileBreakpoint: 768 }))
app.use(createStoragePlugin())
app.use(createThemePlugin({
  // Installed after createStoragePlugin so the theme plugin can persist the selected id
  // and restore it on the next boot; `default` then only applies on a first visit.
  persist: true,
  default: getSystemTheme(),
  target: 'html',
  themes: {
    // The builder's own chrome. It sits beside a preview of the user's colors, so the
    // chrome stays near-neutral and spends its one saturated hue on the thing the app is
    // about: what you have chosen. Both themes use the same hue so the product keeps one
    // identity across the toggle, and every pairing below clears 4.5:1.
    light: {
      dark: false,
      colors: {
        'primary': '#0f766e',
        'secondary': '#5b6266',
        'accent': '#6d5ae0',
        'error': '#b3261e',
        'warning': '#a8500a',
        'background': '#f4f5f4',
        'surface': '#ffffff',
        'surface-variant': '#e9ebec',
        'divider': '#d8dcdd',
        'on-primary': '#ffffff',
        'on-error': '#ffffff',
        'on-surface': '#16191b',
        'on-surface-variant': '#5b6266',
      },
    },
    dark: {
      dark: true,
      colors: {
        'primary': '#2dd4bf',
        'secondary': '#9aa3a7',
        'accent': '#a78bfa',
        // `error` has to work as body text on the dark background AND as a button fill.
        // A red dark enough to take a white label (#dc2626) drops to 3.95:1 as text, so
        // this sits between: 4.87:1 as text, 4.82:1 under the near-black on-error, and
        // dimmer than the old #f87171, which out-shouted the primary action.
        'error': '#e5484d',
        'warning': '#fbbf24',
        'background': '#0e1011',
        'surface': '#16191b',
        'surface-variant': '#21262a',
        'divider': '#2e3438',
        'on-primary': '#04211d',
        'on-error': '#250709',
        'on-surface': '#e6e9ea',
        'on-surface-variant': '#9aa3a7',
      },
    },
  },
}))

app.mount('#app')
