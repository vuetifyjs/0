// Vuetify0
import { createBreakpointsPlugin, createHydrationPlugin, createLoggerPlugin, createThemePlugin } from '@vuetify/v0'

// Plugins
import { createIconPlugin } from './icons'

// Types
import type { App } from 'vue'

export default function zero (app: App) {
  app.use(createIconPlugin())
  app.use(createLoggerPlugin())
  app.use(createHydrationPlugin())
  app.use(createBreakpointsPlugin())
  app.use(
    createThemePlugin({
      default: 'slate',
      themes: {
        slate: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#6366f1',
          error: '#ef4444',
          info: '#0ea5e9',
          success: '#22c55e',
          warning: '#f59e0b',
          background: '#f9fafb',
          surface: '#FFFFFF',
          surfaceTint: '#ececec',
          surfaceVariant: '#212121',
          divider: '#eeeeee',
        },
      },
    }),
  )
}
