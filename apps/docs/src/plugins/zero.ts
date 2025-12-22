// Types
import type { App } from 'vue'

// Vuetify0
import { createBreakpointsPlugin, createFeaturesPlugin, createHydrationPlugin, createLocalePlugin, createLoggerPlugin, createPermissionsPlugin, createStoragePlugin, createThemePlugin, IN_BROWSER, useStorage } from '@vuetify/v0'

// Plugins
import { createIconPlugin } from './icons'

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
          $value: IN_BROWSER ? localStorage.getItem('v0:devmode') === 'true' : false,
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
    createLocalePlugin({
      default: 'en',
      fallback: 'en',
    }),
  )

  function getSystemTheme (): 'light' | 'dark' {
    if (!IN_BROWSER) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function resolveTheme (preference: string | null | undefined): 'light' | 'dark' | 'high-contrast' {
    if (preference === 'light' || preference === 'dark' || preference === 'high-contrast') return preference
    // 'system' or unknown/null preference resolves to system theme
    return getSystemTheme()
  }

  // Read initial preference via app context (storage plugin already installed)
  const themePreference = app.runWithContext(() => useStorage().get<string>('theme'))
  const savedTheme = resolveTheme(themePreference.value)

  app.use(
    createThemePlugin({
      default: savedTheme,
      target: 'html',
      themes: {
        'light': {
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
            'surface': '#fafafa',
            'surface-tint': '#f5f5f5',
            'surface-variant': '#212121',
            'divider': '#e0e0e0',
            'pre': '{light.colors.surface-tint}',
            'on-primary': '#ffffff',
            'on-secondary': '#ffffff',
            'on-accent': '#ffffff',
            'on-error': '#ffffff',
            'on-info': '#ffffff',
            'on-success': '#ffffff',
            'on-warning': '#1a1a1a',
            'on-background': '#212121',
            'on-surface': '#212121',
            'on-surface-variant': '#f5f5f5',
          },
        },
        'dark': {
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
            'pre': '{dark.colors.surface-tint}',
            'on-primary': '#1a1a1a',
            'on-secondary': '#1a1a1a',
            'on-accent': '#1a1a1a',
            'on-error': '#1a1a1a',
            'on-info': '#1a1a1a',
            'on-success': '#1a1a1a',
            'on-warning': '#1a1a1a',
            'on-background': '#e0e0e0',
            'on-surface': '#e0e0e0',
            'on-surface-variant': '#1a1a1a',
          },
        },
        'high-contrast': {
          dark: true,
          colors: {
            'primary': '#ffff00',
            'secondary': '#00ffff',
            'accent': '#ff00ff',
            'error': '#ff0000',
            'info': '#00ffff',
            'success': '#00ff00',
            'warning': '#ffff00',
            'background': '#000000',
            'surface': '#000000',
            'surface-tint': '#1a1a1a',
            'surface-variant': '#000000',
            'divider': '#ffffff',
            'pre': '#0a0a0a',
            'on-primary': '#000000',
            'on-secondary': '#000000',
            'on-accent': '#000000',
            'on-error': '#000000',
            'on-info': '#000000',
            'on-success': '#000000',
            'on-warning': '#000000',
            'on-background': '#ffffff',
            'on-surface': '#ffffff',
            'on-surface-variant': '#ffffff',
          },
        },
      },
    }),
  )

  // System theme change listener is handled by useThemeToggle composable
}
