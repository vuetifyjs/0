// Framework
import {
  createHydrationPlugin,
  createLocalePlugin,
  createLoggerPlugin,
  createStoragePlugin,
  createThemePlugin,
} from '@vuetify/v0'

// Composables
import { provideSettings } from './composables/useSettings'

// Types
import type {
  LocalePluginOptions,
  LoggerPluginOptions,
  StoragePluginOptions,
  ThemePluginOptions,
} from '@vuetify/v0'
import type { App, Plugin } from 'vue'

import {
  accent,
  background,
  divider,
  error,
  info,
  onAccent,
  onBackground,
  onError,
  onInfo,
  onPrimary,
  onSecondary,
  onSuccess,
  onSurface,
  onSurfaceVariant,
  onWarning,
  primary,
  secondary,
  success,
  surface,
  surfaceTint,
  surfaceVariant,
  warning,
} from './theme'

// Dark theme colors
const darkPrimary = '#c4b5fd'
const darkSecondary = '#94a3b8'
const darkAccent = '#c084fc'
const darkError = '#f87171'
const darkInfo = '#60a5fa'
const darkSuccess = '#4ade80'
const darkWarning = '#fbbf24'
const darkBackground = '#1a1a1a'
const darkSurface = '#1a1a1a'
const darkSurfaceTint = '#2a2a2a'
const darkDivider = '#333333'

export interface HelixPluginOptions {
  theme?: ThemePluginOptions | false
  locale?: LocalePluginOptions | false
  logger?: LoggerPluginOptions | false
  storage?: StoragePluginOptions | false
  hydration?: boolean
}

function helixThemeDefaults (): ThemePluginOptions {
  return {
    default: 'helix',
    themes: {
      helix: {
        colors: {
          primary,
          secondary,
          accent,
          error,
          info,
          success,
          warning,
          background,
          surface,
          'surface-tint': surfaceTint,
          'surface-variant': surfaceVariant,
          divider,
          'on-primary': onPrimary,
          'on-secondary': onSecondary,
          'on-accent': onAccent,
          'on-error': onError,
          'on-info': onInfo,
          'on-success': onSuccess,
          'on-warning': onWarning,
          'on-background': onBackground,
          'on-surface': onSurface,
          'on-surface-variant': onSurfaceVariant,
        },
      },
      helixDark: {
        dark: true,
        colors: {
          'primary': darkPrimary,
          'secondary': darkSecondary,
          'accent': darkAccent,
          'error': darkError,
          'info': darkInfo,
          'success': darkSuccess,
          'warning': darkWarning,
          'background': darkBackground,
          'surface': darkSurface,
          'surface-tint': darkSurfaceTint,
          'surface-variant': '#333333',
          'divider': darkDivider,
          'on-primary': '#1a1a1a',
          'on-secondary': '#1a1a1a',
          'on-accent': '#1a1a1a',
          'on-error': '#1a1a1a',
          'on-info': '#1a1a1a',
          'on-success': '#1a1a1a',
          'on-warning': '#1a1a1a',
          'on-background': '#e0e0e0',
          'on-surface': '#e0e0e0',
          'on-surface-variant': '#999999',
        },
      },
    },
  }
}

export function createHelixPlugin (options: HelixPluginOptions = {}): Plugin {
  return {
    install (app: App) {
      // Hydration — lightweight, no config
      if (options.hydration !== false) {
        app.use(createHydrationPlugin())
      }

      // Logger
      if (options.logger !== false) {
        app.use(createLoggerPlugin(options.logger || {}))
      }

      // Storage
      if (options.storage !== false) {
        app.use(createStoragePlugin(options.storage || {}))
      }

      // Locale
      if (options.locale !== false) {
        app.use(createLocalePlugin(options.locale || { default: 'en' }))
      }

      // Settings depends on storage — only install if storage is available
      if (options.storage !== false) {
        app.runWithContext(() => provideSettings(app))
      }

      // Theme — merge user options with Helix defaults
      if (options.theme !== false) {
        const defaults = helixThemeDefaults()
        const theme = options.theme
          ? { ...defaults, ...options.theme, themes: { ...defaults.themes, ...options.theme.themes } }
          : defaults

        app.use(createThemePlugin(theme))
      }
    },
  }
}
