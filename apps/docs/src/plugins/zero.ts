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
            accent: '#6366f1',
            error: '#ef4444',
            info: '#0ea5e9',
            success: '#22c55e',
            warning: '#f59e0b',
            background: '#FFFFFF',
            surface: '#FFFFFF',
            surfaceTint: '#ececec',
            surfaceVariant: '#212121',
            divider: '#eeeeee',
            pre: '#fafafa',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#675496',
            secondary: '#5d5d72',
            accent: '#86468c',
            error: '#ba1a1a',
            info: '#0066b3',
            success: '#006d3b',
            warning: '#b25c00',
            background: '#FFFFFF',
            surface: '#FFFFFF',
            surfaceTint: '#ded8e0',
            surfaceVariant: '#322f35',
            divider: '#7a757f',
            pre: '#f8f2fa',
          },
        },
      },
    }),
  )
}
