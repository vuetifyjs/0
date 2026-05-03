import { setupLayouts } from 'virtual:generated-layouts'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'

// Framework
import { createBreakpointsPlugin, createHydrationPlugin, createLoggerPlugin, createStackPlugin, createStoragePlugin, createThemePlugin, IN_BROWSER } from '@vuetify/v0'

// Context
import App from './App.vue'

import { createIconPlugin } from './plugins/icons'
import pinia from './plugins/pinia'

import 'virtual:uno.css'

export const createApp = ViteSSG(
  App,
  { routes: setupLayouts(routes) },
  async ({ app, initialState }) => {
    app.use(pinia)
    app.use(createIconPlugin())
    app.use(createLoggerPlugin())
    app.use(createHydrationPlugin())
    app.use(createBreakpointsPlugin({ mobileBreakpoint: 768 }))
    app.use(createStoragePlugin())
    app.use(createStackPlugin())

    function getSystemTheme (): 'light' | 'dark' {
      if (!IN_BROWSER) return 'light'
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    app.use(
      createThemePlugin({
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
              'info': '#1867c0',
              'success': '#22c55e',
              'warning': '#f59e0b',
              'background': '#f5f5f5',
              'surface': '#ffffff',
              'surface-tint': '#eeeef0',
              'surface-variant': '#f5f5f5',
              'divider': '#e0e0e0',
              'on-primary': '#ffffff',
              'on-secondary': '#ffffff',
              'on-accent': '#1a1a1a',
              'on-error': '#ffffff',
              'on-info': '#ffffff',
              'on-success': '#1a1a1a',
              'on-warning': '#1a1a1a',
              'on-background': '#212121',
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
              'info': '#38bdf8',
              'success': '#4ade80',
              'warning': '#fb923c',
              'background': '#121212',
              'surface': '#1a1a1a',
              'surface-tint': '#2a2a2a',
              'surface-variant': '#1e1e1e',
              'divider': '#404040',
              'on-primary': '#1a1a1a',
              'on-secondary': '#ffffff',
              'on-accent': '#ffffff',
              'on-error': '#1a1a1a',
              'on-info': '#1a1a1a',
              'on-success': '#1a1a1a',
              'on-warning': '#1a1a1a',
              'on-background': '#e0e0e0',
              'on-surface': '#e0e0e0',
              'on-surface-variant': '#a0a0a0',
            },
          },
        },
      }),
    )

    if (import.meta.env.SSR)
      initialState.pinia = pinia.state.value
    else
      pinia.state.value = initialState.pinia || {}

    if (!import.meta.env.SSR) {
      const { useAuthStore } = await import('@vuetify/auth')
      useAuthStore().verify()
    }
  },
)
