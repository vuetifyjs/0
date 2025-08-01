// Factories
import { createPlugin } from '#v0/factories/createPlugin'
import { createTrinity } from '#v0/factories/createTrinity'
import { useContext } from '#v0/factories/createContext'

// Composables
import { useSingle } from '#v0/composables/useSingle'
import { useTokens } from '#v0/composables/useTokens'

// Utilities
import { computed, watch } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Adapters
import { Vuetify0ThemeAdapter } from './adapters/v0'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { SingleContext, SingleTicket } from '#v0/composables/useSingle'
import type { ID } from '#v0/types'
import type { App, ComputedRef, Reactive } from 'vue'
import type { ThemeAdapter } from './adapters/adapter'
import type { TokenCollection, TokenContext, TokenTicket } from '#v0/composables/useTokens'
import type { ContextTrinity } from '#v0/factories/createTrinity'

export type Colors = {
  [key: string]: string
}

export type ThemeColors = {
  [key: string]: Colors | string
}

export type ThemeTicket = SingleTicket & {
  lazy: boolean
}

export interface ThemeContext<Z extends ThemeTicket> extends SingleContext<Z> {
  colors: ComputedRef<Record<string, Colors>>
  cycle: (themes: ID[]) => void
  toggle: (themes: [ID, ID]) => void
}

export interface ThemeOptions extends ThemePluginOptions {}

export interface ThemePluginOptions<Z extends TokenCollection = TokenCollection> {
  adapter?: ThemeAdapter
  default?: ID
  palette?: TokenCollection
  themes?: Record<ID, Z>
}

export interface ThemePlugin {
  install: (app: App, ...options: any[]) => any
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
 */
export function createTheme<
  Z extends ThemeTicket = ThemeTicket,
  E extends ThemeContext<Z> = ThemeContext<Z>,
> (
  namespace = 'v0:theme',
  options: ThemeOptions = {},
): ContextTrinity<E> {
  const { themes = {}, palette = {} } = options
  const [useThemeContext, provideThemeContext, registry] = useSingle<Z, E>(namespace)

  for (const id in themes) {
    registry.register({ value: themes[id], id } as Partial<Z>)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
  }

  const names = computed(() => Array.from(registry.collection.keys()))
  const colors = computed(() => {
    const resolved = {} as Record<string, Colors>
    for (const [id, theme] of registry.collection.entries()) {
      if (theme.lazy && theme.id !== registry.selectedId.value) continue

      resolved[String(id)] = resolve(id, theme.value as Colors)
    }
    return resolved
  })

  function cycle (themes: ID[] = names.value) {
    const current = themes.indexOf(registry.selectedId.value ?? '')
    const next = current === -1 ? 0 : (current + 1) % themes.length

    registry.select(themes[next])
  }

  function toggle (themes: [ID, ID]) {
    cycle(themes)
  }

  function resolve (themeId: ID, colors: Colors): Colors {
    const resolved: Colors = {}
    for (const [key, value] of Object.entries(colors)) {
      resolved[key] = resolveTokenReference(themeId, value)
    }
    return resolved
  }

  function resolveTokenReference (themeId: ID, value: string): string {
    // Handle token references like {primary} or {colors.surface}
    return value.replace(/{([a-zA-Z0-9.-_]+)}/g, (match, tokenKey) => {
      // Check palette first
      if (palette[tokenKey]) {
        return typeof palette[tokenKey] === 'string' ? palette[tokenKey] : match
      }

      // Check if it's a reference to another theme color
      const [targetTheme, ...colorPath] = tokenKey.split('.')
      const colorKey = colorPath.join('.')

      if (targetTheme && colorKey) {
        const targetColors = themes[targetTheme] as Colors
        const resolved = targetColors?.[colorKey]
        return typeof resolved === 'string' ? resolveTokenReference(targetTheme, resolved) : match
      }

      // Check current theme for the key
      const currentColors = themes[themeId] as Colors
      const resolved = currentColors?.[tokenKey]
      return typeof resolved === 'string' ? resolveTokenReference(themeId, resolved) : match
    })
  }

  function register (registrant: Partial<Z> = {}): Reactive<Z> {
    const id = registrant.id ?? genId()
    const item: Partial<Z> = {
      lazy: false,
      ...registrant,
      id,
    }
    return registry.register(item) as Reactive<Z>
  }

  const context: E = {
    ...registry,
    colors,
    register,
    cycle,
    toggle,
  }

  return createTrinity<E>(useThemeContext, provideThemeContext, context)
}

/**
 * Simple hook to access the theme context.
 *
 * @returns The theme context containing current theme state and utilities.
 */
export function useTheme (): ThemeContext<ThemeTicket> {
  return useContext<ThemeContext<ThemeTicket>>('v0:theme')()
}

/**
 * Creates a Vue plugin for theme management with automatic color system updates.
 * Integrates with token system for dynamic color resolution and provides reactive
 * theme switching capabilities throughout the application.
 *
 * @param options Configuration for themes, palette, and adapter.
 * @template Z The type of theme context.
 * @template E The type of theme items.
 * @template R The type of token context.
 * @template O The type of token items.
 * @returns A Vue plugin object with install method.
 */
export function createThemePlugin<
  Z extends ThemeTicket = ThemeTicket,
  E extends ThemeContext<Z> = ThemeContext<Z>,
  R extends TokenTicket = TokenTicket,
  O extends TokenContext<R> = TokenContext<R>,
> (options: ThemePluginOptions = {}): ThemePlugin {
  const { adapter = new Vuetify0ThemeAdapter(), palette = {}, themes = {} } = options
  const [, provideThemeTokenContext, tokensContext] = useTokens<R, O>('v0:theme:tokens', { palette, ...themes })
  const [, provideThemeContext, themeContext] = createTheme<Z, E>('v0:theme', { themes, palette })

  function update (colors: Record<string, Colors>) {
    adapter.update(colors)
  }

  return createPlugin<ThemePlugin>({
    namespace: 'v0:theme',
    provide: (app: App) => {
      provideThemeContext(undefined, themeContext, app)
      provideThemeTokenContext(undefined, tokensContext, app)
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
