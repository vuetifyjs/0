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

import { primary, error, info, success, warning } from './theme'

export interface EmeraldPluginOptions {
  theme?: ThemePluginOptions | false
  locale?: LocalePluginOptions | false
  logger?: LoggerPluginOptions | false
  storage?: StoragePluginOptions | false
  hydration?: boolean
}

function emeraldThemeDefaults (): ThemePluginOptions {
  return {
    default: 'emerald',
    themes: {
      emerald: {
        colors: {
          'primary': primary.DEFAULT,
          'secondary': primary[200],
          'accent': primary[400],
          'error': error.DEFAULT,
          'info': info.DEFAULT,
          'success': success.DEFAULT,
          'warning': warning.DEFAULT,
          'background': '#FAF9FF',
          'surface': '#F5F4FF',
          'surface-tint': '#EBE9FE',
          'divider': '#DEE2E6',
        },
      },
    },
  }
}

export function createEmeraldPlugin (options: EmeraldPluginOptions = {}): Plugin {
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

      // Theme — merge user options with Emerald defaults
      if (options.theme !== false) {
        const defaults = emeraldThemeDefaults()
        const theme = options.theme
          ? { ...defaults, ...options.theme, themes: { ...defaults.themes, ...options.theme.themes } }
          : defaults

        app.use(createThemePlugin(theme))
      }
    },
  }
}
