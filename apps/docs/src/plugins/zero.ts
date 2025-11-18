// Vuetify0
import { createBreakpointsPlugin, createFeaturesPlugin, createHydrationPlugin, createLoggerPlugin, createPermissionsPlugin, createStoragePlugin, createThemePlugin, IN_BROWSER } from '@vuetify/v0'

// Plugins
import { createIconPlugin } from './icons'

// Types
import type { App } from 'vue'

export default function zero (app: App) {
  app.use(createIconPlugin())
  app.use(createLoggerPlugin())
  app.use(createHydrationPlugin())
  app.use(createBreakpointsPlugin())
  app.use(createStoragePlugin())
  app.use(
    createFeaturesPlugin({
      features: {
        devmode: {
          $value: false,
          $description: 'Enables development mode with additional logging and warnings',
        },
      },
    }),
  )
  app.use(
    createPermissionsPlugin({
      permissions: {
        super: [['use', 'devmode']],
      },
    }),
  )

  let savedTheme = 'light'
  if (IN_BROWSER) {
    const stored = localStorage.getItem('v0:theme')
    if (stored) {
      try {
        savedTheme = JSON.parse(stored)
      } catch {
        savedTheme = stored
      }
    }
  }

  app.use(
    createThemePlugin({
      default: savedTheme,
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
            'background': '#FFFFFF',
            'surface': '#FFFFFF',
            'surface-tint': '#fafafa',
            'surface-variant': '#212121',
            'divider': '#eeeeee',
            'pre': '{light.colors.surface-tint}',
            'on-primary': '#ffffff',
            'on-secondary': '#ffffff',
            'on-accent': '#ffffff',
            'on-error': '#ffffff',
            'on-info': '#ffffff',
            'on-success': '#ffffff',
            'on-warning': '#000000',
            'on-background': '#000000',
            'on-surface': '#000000',
            'on-surface-variant': '#ffffff',
          },
        },
        dark: {
          dark: true,
          colors: {
            'primary': '#a78bfa',
            'secondary': '#94a3b8',
            'accent': '#c084fc',
            'error': '#f87171',
            'info': '#38bdf8',
            'success': '#4ade80',
            'warning': '#fb923c',
            'background': '#0f0f0f',
            'surface': '#1a1a1a',
            'surface-tint': '#2a2a2a',
            'surface-variant': '#1e1e1e',
            'divider': '#404040',
            'pre': '{dark.colors.surface-tint}',
            'on-primary': '#000000',
            'on-secondary': '#000000',
            'on-accent': '#000000',
            'on-error': '#000000',
            'on-info': '#000000',
            'on-success': '#000000',
            'on-warning': '#000000',
            'on-background': '#e5e5e5',
            'on-surface': '#e5e5e5',
            'on-surface-variant': '#1a1a1a',
          },
        },
      },
    }),
  )
}
