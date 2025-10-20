// Factories
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'
import { createContext, useContext } from '../createContext'

// Composables
import { useSingle } from '#v0/composables/useSingle'
import { useTokens } from '#v0/composables/useTokens'

// Utilities
import { computed, watch, onScopeDispose } from 'vue'

// Adapters
import { Vuetify0ThemeAdapter } from '#v0/composables/useTheme/adapters'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { SingleContext, SingleTicket } from '#v0/composables/useSingle'
import type { ID } from '#v0/types'
import type { App, ComputedRef } from 'vue'
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
  [key: string]: any
  dark?: boolean
  lazy?: boolean
  colors: ThemeColors
}

export type ThemeTicket = SingleTicket & {
  lazy: boolean
  dark: boolean
}

export interface ThemeContext<Z extends ThemeTicket> extends SingleContext<Z> {
  colors: ComputedRef<Record<string, Colors>>
  cycle: (themes: ID[]) => void
}

export interface ThemeOptions extends ThemePluginOptions {}

export interface ThemePluginOptions<Z extends ThemeRecord = ThemeRecord> {
  adapter?: ThemeAdapter
  default?: ID
  palette?: TokenCollection
  themes?: Record<ID, Z>
}

/**
 * Creates a new theme instance.
 *
 * @param namespace The namespace for the theme instance.
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
 * export const [useTheme, provideTheme] = createTheme('v0:theme', {
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
> (
  namespace = 'v0:theme',
  options: ThemeOptions = {},
): ContextTrinity<E> {
  const { themes = {}, palette = {} } = options
  const [useThemeContext, _provideThemeContext] = createContext<E>(namespace)
  const tokens = useTokens({ palette, ...themes }, { flat: true })
  const registry = useSingle<Z, E>()

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

    return registry.register(item) as Z
  }

  const context = {
    ...registry,
    colors,
    register,
    cycle,
    get size () {
      return registry.size
    },
  } as E

  function provideThemeContext (_context: E = context, app?: App): E {
    return _provideThemeContext(_context, app)
  }

  return createTrinity<E>(useThemeContext, provideThemeContext, context)
}

/**
 * Returns the current theme instance.
 *
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
export function useTheme (): ThemeContext<ThemeTicket> {
  return useContext<ThemeContext<ThemeTicket>>('v0:theme')
}

/**
 * Creates a new theme plugin.
 *
 * @param _options The options for the theme plugin.
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
  const { adapter = new Vuetify0ThemeAdapter(), palette = {}, themes = {}, ...options } = _options
  const [, provideThemeContext, themeContext] = createTheme<Z, E>('v0:theme', { ...options, themes, palette })

  function update (colors: Record<string, Colors>) {
    adapter.update(colors)
  }

  return createPlugin({
    namespace: 'v0:theme',
    provide: (app: App) => {
      provideThemeContext(themeContext, app)
    },
    setup: () => {
      if (IN_BROWSER) {
        const stop = watch(themeContext.colors, update, { immediate: true, deep: true })
        onScopeDispose(stop, true)
      } else {
        update(themeContext.colors.value)
      }
    },
  })
}
