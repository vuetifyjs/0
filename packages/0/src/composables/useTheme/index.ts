// Factories
import { createPlugin } from '#v0/factories/createPlugin'
import { createTrinity } from '#v0/factories/createTrinity'
import { useContext } from '#v0/factories/createContext'

// Composables
import { useSingle } from '#v0/composables/useSingle'
import { useTokens } from '#v0/composables/useTokens'

// Utilities
import { computed, toValue, watch } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Adapters
import { Vuetify0ThemeAdapter } from './adapters/v0'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { BaseSingleContext, SingleTicket } from '#v0/composables/useSingle'
import type { ID } from '#v0/types'
import type { App, ComputedRef, Reactive } from 'vue'
import type { ThemeAdapter } from './adapters/adapter'
import type { RegistryContext } from '#v0/composables/useRegistry'
import type { TokenCollection, TokenContext, TokenTicket } from '#v0/composables/useTokens'

export type Colors = {
  [key: string]: string
}

export type ThemeColors = {
  [key: string]: Colors | string
}

export type ThemeTicket = SingleTicket & {
  lazy: boolean
}

export type BaseThemeContext<Z extends ThemeTicket = ThemeTicket> = BaseSingleContext<Z> & {
  colors: ComputedRef<Record<string, Colors>>
  cycle: (themes: ID[]) => void
  toggle: (themes: [ID, ID]) => void
  register: (item?: Partial<ThemeTicket>, id?: ID) => Reactive<ThemeTicket>
  selectedItem: Reactive<ThemeTicket | undefined>
}

export type ThemeContext = RegistryContext<ThemeTicket> & BaseThemeContext

export interface ThemeOptions {
  default?: ID
  tokens: TokenContext
  themes?: Record<ID, TokenCollection>
}

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
 * @template Z The type of theme context.
 * @template E The type of theme items managed by the registry.
 * @returns A tuple containing inject, provide functions and the theme context.
 */
export function createTheme<
  Z extends ThemeTicket = ThemeTicket,
  E extends ThemeContext = ThemeContext,
> (
  namespace = 'v0:theme',
  options: ThemeOptions,
) {
  const { tokens, themes = {} } = options
  const [useThemeContext, provideThemeContext, registry] = useSingle<Z, E>(namespace)

  for (const id in themes) {
    registry.register({ value: themes[id] }, id)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
  }

  const names = computed(() => Array.from(registry.collection.keys()))
  const colors = computed(() => {
    const resolved = {} as Record<string, Colors>
    for (const [id, theme] of registry.collection.entries()) {
      if (theme.lazy && theme.id !== registry.selectedId.value) continue

      resolved[String(id)] = resolve(theme.value as Colors)
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

  function isTokenReference (value: string): boolean {
    if (value.length > 2 && value[0] === '{' && value.at(-1) === '}') return true
    return tokens.collection.has(value)
  }

  function resolve (theme: Colors): Colors {
    const resolved: Colors = {}
    for (const [key, value] of Object.entries(theme)) {
      resolved[key] = isTokenReference(value) ? toValue(tokens.resolve(value) ?? value) : toValue(value)
    }
    return resolved
  }

  function register (registrant: Partial<Z>, _id: ID = genId()): Reactive<Z> {
    const id = registrant?.id ?? _id

    const item: Partial<Z> = {
      lazy: false,
      ...registrant,
      id,
    }
    const ticket = registry.register(item, id) as unknown as Reactive<Z>

    return ticket
  }

  return createTrinity<E>(useThemeContext, provideThemeContext, {
    ...registry,
    colors,
    register,
    cycle,
    toggle,
  } as unknown as E)
}

/**
 * Simple hook to access the theme context.
 *
 * @returns The theme context containing current theme state and utilities.
 */
export function useTheme (): ThemeContext {
  return useContext<ThemeContext>('v0:theme')()
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
  E extends ThemeContext = ThemeContext,
  R extends TokenTicket = TokenTicket,
  O extends TokenContext = TokenContext,
> (options: ThemePluginOptions = {}): ThemePlugin {
  const { adapter = new Vuetify0ThemeAdapter(), palette = {}, themes = {} } = options
  const [, provideThemeTokenContext, tokens] = useTokens<R, O>('v0:theme:tokens', { palette, ...themes })
  const [, provideThemeContext, theme] = createTheme<Z, E>('v0:theme', { themes, tokens })

  function update (colors: Record<string, Colors>) {
    adapter.update(colors)
  }

  return createPlugin<ThemePlugin>({
    namespace: 'v0:theme',
    provide: (app: App) => {
      provideThemeContext(undefined, theme, app)
      provideThemeTokenContext(undefined, tokens, app)
    },
    setup: () => {
      if (IN_BROWSER) {
        watch(theme.colors, update, { immediate: true, deep: true })
      } else {
        update(theme.colors.value)
      }
    },
  })
}
