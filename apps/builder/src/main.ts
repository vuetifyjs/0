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
        'background': '#f4f5f4',
        'surface': '#ffffff',
        'surface-variant': '#e9ebec',
        'divider': '#d8dcdd',
        'on-primary': '#ffffff',
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
        'error': '#f87171',
        'background': '#0e1011',
        'surface': '#16191b',
        'surface-variant': '#21262a',
        'divider': '#2e3438',
        'on-primary': '#04211d',
        'on-surface': '#e6e9ea',
        'on-surface-variant': '#9aa3a7',
      },
    },
  },
}))

app.mount('#app')
