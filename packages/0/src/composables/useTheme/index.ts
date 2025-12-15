/**
 * @module useTheme
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-theme
 *
 * @remarks
 * Theme management composable with token resolution and CSS variable injection.
 *
 * Key features:
 * - Single-selection theme switching (extends createSingle)
 * - Token alias resolution via useTokens
 * - Lazy theme loading (compute colors only when selected)
 * - CSS variable generation via adapter pattern
 * - SSR support with head integration
 * - Theme cycling
 *
 * Integrates with createSingle for selection and useTokens for color resolution.
 */

// Factories
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'
import { createContext, useContext } from '#v0/composables/createContext'

// Composables
import { createSingle } from '#v0/composables/useSingle'
import { createTokens } from '#v0/composables/useTokens'

// Utilities
import { computed, toRef } from 'vue'

// Adapters
import { Vuetify0ThemeAdapter } from '#v0/composables/useTheme/adapters'

// Types
import type { SingleContext, SingleTicket } from '#v0/composables/useSingle'
import type { RegistryOptions } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'
import type { App, ComputedRef, Ref } from 'vue'
import type { ThemeAdapter } from '#v0/composables/useTheme/adapters'
import type { TokenCollection } from '#v0/composables/useTokens'
import type { ContextTrinity } from '#v0/composables/createTrinity'

// Exports
export { Vuetify0ThemeAdapter } from '#v0/composables/useTheme/adapters'

export type { ThemeAdapter } from '#v0/composables/useTheme/adapters'

export type Colors = {
  [key: string]: string
}

export type ThemeColors = {
  [key: string]: Colors | string
}

export type ThemeRecord = {
  dark?: boolean
  lazy?: boolean
  colors: ThemeColors
}

export interface ThemeTicket extends SingleTicket<ThemeColors> {
  /**
   * Indicates whether the theme is dark or light.
   *
   * @remarks Defaults to `false` (light theme).
   */
  dark: boolean
  /**
   * Indicates whether the theme should be loaded lazily.
   *
   * @remarks Defaults to `false`.
   */
  lazy: boolean
}

export interface ThemeContext<Z extends ThemeTicket> extends SingleContext<Z> {
  /**
   * A computed reference to the resolved colors of the current theme.
   *
   * @remarks The colors are resolved by replacing any token aliases with their actual values.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-theme#colors
   *
   * @example
   * ```ts
   * import { useTheme } from '@vuetify/v0'
   *
   * const theme = useTheme()
   *
   * console.log(theme.colors.value)
   * ```
   */
  colors: ComputedRef<Record<string, Colors>>
  /**
   * A ref indicating whether the current theme is dark.
   *
   * @remarks Returns `true` if the current theme has `dark: true`, otherwise `false`.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-theme#isDark
   *
   * @example
   * ```ts
   * import { useTheme } from '@vuetify/v0'
   *
   * const theme = useTheme()
   *
   * console.log(theme.isDark.value) // true or false
   * ```
   */
  isDark: Readonly<Ref<boolean>>
  /**
   * Cycles through the provided themes in order.
   *
   * @param themes An array of theme IDs to cycle through. Defaults to all registered themes.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-theme#cycle
   *
   * @example
   * ```ts
   * import { useTheme } from '@vuetify/v0'
   *
   * const theme = useTheme()
   *
   * theme.cycle(['light', 'dark'])
   * ```
   */
  cycle: (themes?: ID[]) => void
}

export interface ThemeOptions<Z extends ThemeRecord = ThemeRecord> extends RegistryOptions {
  /**
   * The theme adapter to use.
   *
   * @remarks Defaults to `Vuetify0ThemeAdapter`.
   */
  adapter?: ThemeAdapter
  /**
   * The default theme ID to select on initialization.
   */
  default?: ID
  /**
   * A collection of tokens to use for resolving theme colors.
   */
  palette?: TokenCollection
  /**
   * A record of themes to register.
   */
  themes?: Record<ID, Z>
  /**
   * The target element or selector to apply theme classes to.
   *
   * @remarks If `null`, no classes will be applied.
   */
  target?: string | HTMLElement | null
}

export interface ThemeContextOptions extends ThemeOptions {
  namespace?: string
}

export interface ThemePluginOptions extends ThemeContextOptions {}

/**
 * Creates a new theme instance.
 *
 * @param options The options for the theme instance.
 * @template Z The type of the theme ticket.
 * @template E The type of the theme context.
 * @returns A new theme instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-theme
 *
 * @example
 * ```ts
 * import { createTheme } from '@vuetify/v0'
 *
 * export const [useTheme, provideTheme] = createTheme({
 *   namespace: 'v0:theme',
 *   default: 'light',
 *   themes: {
 *     light: {
 *       dark: false,
 *       colors: {
 *         primary: '#3b82f6',
 *       },
 *     },
 *     dark: {
 *       dark: true,
 *       colors: {
 *         primary: '#675496',
 *       },
 *     },
 *   },
 * })
 * ```
 */

export function createTheme<
  Z extends ThemeTicket = ThemeTicket,
  E extends ThemeContext<Z> = ThemeContext<Z>,
> (_options: ThemeOptions = {}): E {
  const { themes = {}, palette = {}, ...options } = _options
  const tokens = createTokens({ palette, ...themes }, { flat: true })
  const registry = createSingle<Z, E>(options)

  for (const id in themes) {
    const { colors: value, ...theme } = themes[id]!

    register({ id, value, ...theme } as Partial<Z>)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
  }

  const names = computed(() => registry.keys())
  const colors = computed(() => {
    const resolved = {} as Record<ID, Colors>
    for (const theme of registry.values()) {
      if (theme.lazy && theme.id !== registry.selectedId.value) continue

      resolved[theme.id] = resolve(theme.value as Colors)
    }

    return resolved
  })

  const isDark = toRef(() => registry.selectedItem.value?.dark ?? false)

  function cycle (themes: ID[] = names.value) {
    const current = themes.indexOf(registry.selectedId.value ?? '')
    const next = current === -1 ? 0 : (current + 1) % themes.length

    registry.select(themes[next]!)
  }

  function resolve (colors: Colors): Colors {
    const resolved: Colors = {}
    for (const [key, value] of Object.entries(colors)) {
      resolved[key] = tokens.isAlias(value) ? tokens.resolve(value) as string : value
    }

    return resolved
  }

  function register (registration: Partial<Z> = {}): Z {
    const item: Partial<Z> = {
      lazy: false,
      dark: false,
      ...registration,
    }

    return registry.register(item)
  }

  return {
    ...registry,
    colors,
    isDark,
    register,
    cycle,
    get size () {
      return registry.size
    },
  } as E
}

/**
 * Creates a new theme context trinity.
 *
 * @param options The options for the theme context.
 * @template Z The type of the theme ticket.
 * @template E The type of the theme context.
 * @returns A new theme context trinity.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-theme
 *
 * @example
 * ```ts
 * import { createThemeContext } from '@vuetify/v0'
 *
 * export const [useThemeContext, provideThemeContext, context] = createThemeContext({
 *   namespace: 'v0:theme',
 *   default: 'light',
 *   themes: {
 *     light: {
 *       dark: false,
 *       colors: {
 *         primary: '#3b82f6',
 *       },
 *     },
 *     dark: {
 *       dark: true,
 *       colors: {
 *         primary: '#675496',
 *       },
 *     },
 *   },
 * })
 * ```
 */
export function createThemeContext<
  Z extends ThemeTicket = ThemeTicket,
  E extends ThemeContext<Z> = ThemeContext<Z>,
> (_options: ThemeContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:theme', ...options } = _options
  const [useThemeContext, _provideThemeContext] = createContext<E>(namespace)
  const context = createTheme<Z, E>(options)

  function provideThemeContext (_context: E = context, app?: App): E {
    return _provideThemeContext(_context, app)
  }

  return createTrinity<E>(useThemeContext, provideThemeContext, context)
}

/**
 * Creates a new theme plugin.
 *
 * @param options The options for the theme plugin.
 * @template Z The type of the theme ticket.
 * @template E The type of the theme context.
 * @returns A new theme plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-theme
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createThemePlugin } from '@vuetify/v0'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 *
 * app.use(
 *   createThemePlugin({
 *     default: 'light',
 *     themes: {
 *       light: {
 *         dark: false,
 *         colors: {
 *           primary: '#3b82f6',
 *         },
 *       },
 *       dark: {
 *         dark: true,
 *         colors: {
 *           primary: '#675496',
 *         },
 *       },
 *     },
 *   })
 * )
 *
 * app.mount('#app')
 * ```
 */
export function createThemePlugin<
  Z extends ThemeTicket = ThemeTicket,
  E extends ThemeContext<Z> = ThemeContext<Z>,
> (_options: ThemePluginOptions = {}) {
  const { adapter = new Vuetify0ThemeAdapter(), namespace = 'v0:theme', palette = {}, themes = {}, target, ...options } = _options
  const [, provideThemeContext, context] = createThemeContext<Z, E>({ ...options, namespace, themes, palette })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideThemeContext(context, app)
    },
    setup: (app: App) => {
      adapter.setup(app, context, target)
    },
  })
}

/**
 * Returns the current theme instance.
 *
 * @param namespace The namespace for the theme context. Defaults to `v0:theme`.
 * @returns The current theme instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-theme
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useTheme } from '@vuetify/v0'
 *
 *   const theme = useTheme()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Current theme: {{ theme.selected.value }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useTheme<
  Z extends ThemeTicket = ThemeTicket,
  E extends ThemeContext<Z> = ThemeContext<Z>,
> (namespace = 'v0:theme'): E {
  return useContext<E>(namespace)
}
