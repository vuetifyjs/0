// Vuetify0
import { createBreakpointsPlugin, createFeaturesPlugin, createHydrationPlugin, createLoggerPlugin, createPermissionsPlugin, createThemePlugin } from '@vuetify/v0'

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
  app.use(
    createThemePlugin({
      default: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            'primary': '#3b82f6',
            'secondary': '#64748b',
            'accent': '#6366f1',
            'error': '#ef4444',
            'info': '#0ea5e9',
            'success': '#22c55e',
            'warning': '#f59e0b',
            'background': '#FFFFFF',
            'surface': '#FFFFFF',
            'surface-tint': '#ececec',
            'surface-variant': '#212121',
            'divider': '#eeeeee',
            'pre': '#fafafa',
            'on-primary': '#ffffff',
            'on-secondary': '#ffffff',
            'on-accent': '#ffffff',
            'on-error': '#ffffff',
            'on-info': '#ffffff',
            'on-success': '#ffffff',
            'on-warning': '#ffffff',
            'on-background': '#000000',
            'on-surface': '#000000',
            'on-surface-variant': '#ffffff',
          },
        },
        dark: {
          dark: true,
          colors: {
            'primary': '#675496',
            'secondary': '#5d5d72',
            'accent': '#86468c',
            'error': '#ba1a1a',
            'info': '#0066b3',
            'success': '#006d3b',
            'warning': '#b25c00',
            'background': '#FFFFFF',
            'surface': '#FFFFFF',
            'surface-tint': '#ded8e0',
            'surface-variant': '#322f35',
            'divider': '#7a757f',
            'pre': '#f8f2fa',
            'on-primary': '#ffffff',
            'on-secondary': '#ffffff',
            'on-accent': '#ffffff',
            'on-error': '#ffffff',
            'on-info': '#ffffff',
            'on-success': '#ffffff',
            'on-warning': '#ffffff',
            'on-background': '#000000',
            'on-surface': '#000000',
            'on-surface-variant': '#ffffff',
          },
        },
      },
    }),
  )
}
