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
    light: {
      dark: false,
      colors: {
        'primary': '#3b82f6',
        'secondary': '#64748b',
        'accent': '#6366f1',
        'error': '#ef4444',
        'background': '#f5f5f5',
        'surface': '#ffffff',
        'surface-variant': '#f5f5f5',
        'divider': '#e0e0e0',
        'on-primary': '#ffffff',
        'on-surface': '#212121',
        'on-surface-variant': '#666666',
      },
    },
    dark: {
      dark: true,
      colors: {
        'primary': '#c4b5fd',
        'secondary': '#94a3b8',
        'accent': '#c084fc',
        'error': '#f87171',
        'background': '#121212',
        'surface': '#1a1a1a',
        'surface-variant': '#1e1e1e',
        'divider': '#404040',
        'on-primary': '#1a1a1a',
        'on-surface': '#e0e0e0',
        'on-surface-variant': '#a0a0a0',
      },
    },
  },
}))

app.mount('#app')
