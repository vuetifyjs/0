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
      default: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#3b82f6',
            secondary: '#64748b',
            error: '#ef4444',
            info: '#0ea5e9',
            success: '#22c55e',
            warning: '#f59e0b',
            background: '#FFFFFF',
            surface: '#FFFFFF',
            surfaceTint: '#ececec',
            surfaceVariant: '#212121',
            divider: '#0000001F',
            pre: '#fafafa',
            text: '#212121',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#2196F3',
            secondary: '#54B6B2',
            error: '#CF6679',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00',
            background: '#121212',
            surface: '#212121',
            surfaceTint: '#424242',
            surfaceVariant: '#c8c8c8',
            divider: '#FFFFFF1F',
            pre: '#212121',
            text: '#FFFFFF',
          },
        },
      },
    }),
  )
}
