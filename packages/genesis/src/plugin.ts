// Framework
import {
  createHydrationPlugin,
  createLocalePlugin,
  createLoggerPlugin,
  createPluginContext,
  createStoragePlugin,
  createTheme,
} from '@vuetify/v0'

// Adapters
import { GenesisStyleSheetAdapter } from './adapter'
import { genesisColors, genesisDarkColors } from './theme'

// Types
import type {
  ID,
  LocalePluginOptions,
  LoggerPluginOptions,
  StoragePluginOptions,
  ThemeContext,
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

export const [createGenesisThemeContext, createGenesisThemePlugin, useGenesisTheme]
  = createPluginContext<ThemePluginOptions, ThemeContext>(
    'genesis:theme',
    options => createTheme(options),
    {
      setup: (context, app, { adapter = new GenesisStyleSheetAdapter(), target, rgb }) => {
        if (rgb) adapter.rgb = true
        adapter.setup(app, context, target)
      },
      persist: ctx => ctx.selectedId.value,
      restore: (ctx, saved) => ctx.select(saved as ID),
    },
  )

function genesisThemeDefaults (): ThemePluginOptions {
  return {
    target: 'body',
    default: 'genesis',
    adapter: new GenesisStyleSheetAdapter(),
    themes: {
      'genesis': { colors: genesisColors },
      'genesis-dark': { colors: genesisDarkColors },
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

        app.use(createGenesisThemePlugin(theme))
      }
    },
  }
}
