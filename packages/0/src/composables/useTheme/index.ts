// Factories
import { createPlugin } from '#v0/factories/createPlugin'
import { createTrinity } from '#v0/factories/createTrinity'
import { createContext, useContext } from '#v0/factories/createContext'

// Composables
import { useSingle } from '#v0/composables/useSingle'
import { useTokens } from '#v0/composables/useTokens'

// Utilities
import { computed, watch } from 'vue'

// Adapters
import { Vuetify0ThemeAdapter } from './adapters/v0'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { SingleContext, SingleTicket } from '#v0/composables/useSingle'
import type { ID } from '#v0/types'
import type { App, ComputedRef } from 'vue'
import type { ThemeAdapter } from './adapters/adapter'
import type { TokenCollection } from '#v0/composables/useTokens'
import type { ContextTrinity } from '#v0/factories/createTrinity'

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
 * Creates a theme registry for managing theme selections with dynamic color resolution.
 * Supports token-based color systems and lazy theme loading for optimal performance.
 *
 * @param namespace The namespace for the theme context.
 * @param options Configuration including adapter and themes.
 * @template Z The type of theme context.
 * @template E The type of theme items managed by the registry.
 * @returns A tuple containing inject, provide functions and the theme context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-theme
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
  } as E

  function provideThemeContext (_context: E = context, app?: App): E {
    return _provideThemeContext(_context, app)
  }

  return createTrinity<E>(useThemeContext, provideThemeContext, context)
}

/**
 * Simple hook to access the theme context.
 *
 * @returns The theme context containing current theme state and utilities.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-theme
 */
export function useTheme (): ThemeContext<ThemeTicket> {
  return useContext<ThemeContext<ThemeTicket>>('v0:theme')
}

/**
 * Creates a Vue plugin for theme management with automatic color system updates.
 * Integrates with token system for dynamic color resolution and provides reactive
 * theme switching capabilities throughout the application.
 *
 * @param options Configuration for themes, palette, and adapter.
 * @template Z The type of theme context.
 * @template E The type of theme items.
 * @returns A Vue plugin object with install method.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-theme
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
        watch(themeContext.colors, update, { immediate: true, deep: true })
      } else {
        update(themeContext.colors.value)
      }
    },
  })
}
