/**
 * Optional install. Components render without it.
 *
 * Sets `data-bs-theme` from the app theme so Bootstrap's `light-dark()`
 * values follow light and dark. Color overrides pass through
 * `BootstrapThemeAdapter`.
 */

// Framework
import { createThemePlugin } from '@vuetify/v0'

// Adapters
import { BootstrapThemeAdapter } from './adapter'

// Types
import type { ThemePluginOptions } from '@vuetify/v0'
import type { App, Plugin } from 'vue'

export interface BootstrapPluginOptions {
  /**
   * Theme plugin options. `false` installs nothing, for an app that already
   * has `createThemePlugin` and will attach `BootstrapThemeAdapter` itself.
   */
  theme?: ThemePluginOptions | false
}

type ThemeMap = NonNullable<ThemePluginOptions['themes']>

/**
 * Connect the app theme to Bootstrap. Light and dark are registered, and
 * `prefers-color-scheme` picks between them until `select` is called.
 *
 * ```ts
 * import { createBootstrapPlugin } from '@paper/bootstrap'
 *
 * app.use(createBootstrapPlugin())
 * ```
 *
 * A color overrides one Bootstrap variable. `primary` writes
 * `--bs-primary-base`. The rest of that ramp stays on the stylesheet
 * unless those variables are passed too.
 */
export function createBootstrapPlugin (options: BootstrapPluginOptions = {}): Plugin {
  return {
    install (app: App) {
      if (options.theme === false) return

      const defaults = themeDefaults()
      const theme = options.theme
      app.use(createThemePlugin(theme
        ? {
            ...defaults,
            ...theme,
            themes: mergeThemes(defaults.themes, theme.themes),
            adapter: theme.adapter ?? defaults.adapter,
          }
        : defaults))
    },
  }
}

function themeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'light',
    system: { light: 'light', dark: 'dark' },
    adapter: new BootstrapThemeAdapter(),
    themes: {
      light: { colors: {} },
      dark: { colors: {}, dark: true },
    },
  }
}

function mergeThemes (defaults: ThemeMap | undefined, overrides: ThemeMap | undefined): ThemeMap {
  const base: ThemeMap = { ...defaults }
  if (!overrides) return base

  for (const [id, ticket] of Object.entries(overrides)) {
    const prev = base[id]
    base[id] = prev
      ? {
          ...prev,
          ...ticket,
          colors: { ...prev.colors, ...ticket.colors },
        }
      : ticket
  }

  return base
}
