// Framework
import {
  createHydrationPlugin,
  createLocalePlugin,
  createLoggerPlugin,
  createStoragePlugin,
  createThemePlugin,
} from '@vuetify/v0'

// Adapters
import { GenesisStyleSheetAdapter } from './adapter'
import { genesisColors } from './theme'

// Types
import type {
  LocalePluginOptions,
  LoggerPluginOptions,
  StoragePluginOptions,
  ThemePluginOptions,
} from '@vuetify/v0'
import type { App, Plugin } from 'vue'

export interface GenesisPluginOptions {
  theme?: ThemePluginOptions | false
  locale?: LocalePluginOptions | false
  logger?: LoggerPluginOptions | false
  storage?: StoragePluginOptions | false
  hydration?: boolean
}

function genesisThemeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'genesis',
    adapter: new GenesisStyleSheetAdapter(),
    themes: {
      genesis: { colors: genesisColors },
    },
  }
}

export function createGenesisPlugin (options: GenesisPluginOptions = {}): Plugin {
  return {
    install (app: App) {
      if (options.hydration !== false) {
        app.use(createHydrationPlugin())
      }

      if (options.logger !== false) {
        app.use(createLoggerPlugin(options.logger || {}))
      }

      if (options.storage !== false) {
        app.use(createStoragePlugin(options.storage || {}))
      }

      if (options.locale !== false) {
        app.use(createLocalePlugin(options.locale || { default: 'en' }))
      }

      if (options.theme !== false) {
        const defaults = genesisThemeDefaults()
        const theme = options.theme
          ? { ...defaults, ...options.theme, themes: { ...defaults.themes, ...options.theme.themes } }
          : defaults

        app.use(createThemePlugin(theme))
      }
    },
  }
}
