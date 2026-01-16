// Framework
import { createBreakpointsPlugin, createDatePlugin, createFeaturesPlugin, createHydrationPlugin, createLocalePlugin, createLoggerPlugin, createPermissionsPlugin, createStoragePlugin, createThemePlugin, IN_BROWSER, useStorage } from '@vuetify/v0'
import { Vuetify0DateAdapter } from '@vuetify/v0/date'

// Types
import type { App } from 'vue'

// Themes
import { getAllThemeConfigs, themes, type ThemeId } from '@/themes'

// Plugins
import { createIconPlugin } from './icons'

export default function zero (app: App) {
  app.use(createIconPlugin())
  app.use(createLoggerPlugin())
  app.use(createHydrationPlugin())
  app.use(createBreakpointsPlugin())
  app.use(createStoragePlugin())
  function getDevmodeValue (): boolean {
    if (!IN_BROWSER) return false
    try {
      return localStorage.getItem('v0:devmode') === 'true'
    } catch {
      return false
    }
  }

  app.use(
    createFeaturesPlugin({
      features: {
        devmode: {
          $value: getDevmodeValue(),
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
  app.use(
    createDatePlugin({
      adapter: new Vuetify0DateAdapter(),
      locales: { en: 'en-US' },
    }),
  )

  function getSystemTheme (): 'light' | 'dark' {
    if (!IN_BROWSER) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function resolveTheme (preference: string | null | undefined): ThemeId {
    // Direct theme selection
    if (preference && preference in themes) return preference as ThemeId
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
      themes: getAllThemeConfigs(),
    }),
  )

  // System theme change listener is handled by useThemeToggle composable
}
