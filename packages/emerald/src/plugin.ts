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

// Adapters
import { EmeraldStyleSheetAdapter } from './adapter'
import {
  error,
  info,
  neutral,
  primary,
  secondary,
  success,
  warning,
} from './theme'

export interface EmeraldPluginOptions {
  theme?: ThemePluginOptions | false
  locale?: LocalePluginOptions | false
  logger?: LoggerPluginOptions | false
  storage?: StoragePluginOptions | false
  hydration?: boolean
}

type Scale = Record<string, string>

function scale (name: string, values: Scale): Scale {
  const out: Scale = {}
  for (const [key, val] of Object.entries(values)) {
    out[key === 'DEFAULT' ? name : `${name}-${key}`] = val
  }
  return out
}

export const emeraldColors: Record<string, string> = {
  ...scale('primary', primary),
  ...scale('secondary', secondary),
  ...scale('success', success),
  ...scale('warning', warning),
  ...scale('error', error),
  ...scale('info', info),
  ...scale('neutral', neutral),
  'background': '#FAF9FF',
  'surface': '#F5F4FF',
  'surface-tint': '#EBE9FE',
  'divider': '#DEE2E6',
  'on-primary': '#FFFFFF',
  'on-background': '#1A1C1E',
  'on-surface': '#1A1C1E',
}

function emeraldThemeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'emerald',
    adapter: new EmeraldStyleSheetAdapter(),
    themes: {
      emerald: { colors: emeraldColors },
    },
  }
}

export function createEmeraldPlugin (options: EmeraldPluginOptions = {}): Plugin {
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
        const defaults = emeraldThemeDefaults()
        const theme = options.theme
          ? { ...defaults, ...options.theme, themes: { ...defaults.themes, ...options.theme.themes } }
          : defaults

        app.use(createThemePlugin(theme))
      }
    },
  }
}
