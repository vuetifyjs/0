// Framework
import {
  createHydrationPlugin,
  createLocalePlugin,
  createLoggerPlugin,
  createStoragePlugin,
  createThemePlugin,
} from '@vuetify/v0'

// Adapters
import { EmeraldStyleSheetAdapter } from './adapter'
import {
  alert,
  background,
  border,
  danger,
  info,
  neutral,
  on,
  primary,
  secondary,
  success,
  surface,
} from './theme'

// Types
import type {
  LocalePluginOptions,
  LoggerPluginOptions,
  StoragePluginOptions,
  ThemePluginOptions,
} from '@vuetify/v0'
import type { App, Plugin } from 'vue'

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
  ...scale('neutral', neutral),
  ...scale('danger', danger),
  ...scale('alert', alert),
  ...scale('success', success),
  ...scale('info', info),
  ...scale('on', on),
  'background': background.DEFAULT,
  'surface': surface.DEFAULT,
  'surface-tint': primary['alpha-10'],
  'divider': neutral[300],
  'border': border.DEFAULT,
  // Semantic status aliases (Figma status/* bg + br bindings).
  // Note: spec binds status/success to the PRIMARY green family,
  // not the success family.
  'status-danger-bg': danger[100],
  'status-danger-br': danger[500],
  'status-success-bg': primary[100],
  'status-success-br': primary[600],
  'status-info-bg': info[100],
  'status-info-br': info[500],
  'status-warning-bg': alert[100],
  'status-warning-br': alert[500],
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
