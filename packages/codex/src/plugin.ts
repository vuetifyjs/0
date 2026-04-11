// Framework
import {
  createHydrationPlugin,
  createLocalePlugin,
  createLoggerPlugin,
  createStoragePlugin,
  createThemePlugin,
} from '@vuetify/v0'

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
  primary,
  secondary,
  success,
  surface,
  surfaceTint,
  warning,
} from './theme'

export interface CodexPluginOptions {
  theme?: ThemePluginOptions | false
  locale?: LocalePluginOptions | false
  logger?: LoggerPluginOptions | false
  storage?: StoragePluginOptions | false
  hydration?: boolean
}

function codexThemeDefaults (): ThemePluginOptions {
  return {
    default: 'codex',
    themes: {
      codex: {
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
          divider,
        },
      },
    },
  }
}

export function createCodexPlugin (options: CodexPluginOptions = {}): Plugin {
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

      // Theme — merge user options with Codex defaults
      if (options.theme !== false) {
        const defaults = codexThemeDefaults()
        const theme = options.theme
          ? { ...defaults, ...options.theme, themes: { ...defaults.themes, ...options.theme.themes } }
          : defaults

        app.use(createThemePlugin(theme))
      }
    },
  }
}
