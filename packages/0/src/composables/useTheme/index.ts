// Factories
import { createPlugin } from '#v0/factories/createPlugin'
import { createTrinity } from '#v0/factories/createTrinity'
import { useContext } from '#v0/factories/createContext'

// Composables
import { useSingle } from '#v0/composables/useSingle'
import { createTokens } from '#v0/composables/useTokens'

// Utilities
import { computed, watch } from 'vue'
import { genId } from '#v0/utils/helpers'

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

export type Colors = {
  [key: string]: string
}

export type ThemeTicket = SingleTicket & {
  lazy: boolean
  value: TokenCollection
}

export type ThemeContext = SingleContext & {
  colors: ComputedRef<Record<string, Colors | undefined>>
  cycle: (themeArray: ID[]) => void
  toggle: (themeArray: [ID, ID]) => void
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
 * Creates a theme registrar for managing theme selections and color resolution.
 *
 * @param namespace The namespace for the theme context.
 * @template Z The type of theme tickets managed by the registrar.
 * @template E The type of theme context.
 * @returns A tuple containing inject, provide functions and the theme context.
 */
export function createTheme<
  Z extends ThemeTicket,
  E extends ThemeContext,
> (
  namespace = 'v0:theme',
  tokens: ComputedRef<Record<string, string>>,
) {
  const [useThemeContext, provideThemeContext, registrar] = useSingle<Z, E>(namespace)

  const themeNames = computed(() => Array.from(registrar.tickets.keys()))
  const colors = computed(() => {
    const resolved = {} as Record<string, Colors | undefined>
    for (const [id, theme] of registrar.tickets.entries()) {
      if (theme.lazy && theme.id !== registrar.selectedId.value) continue

      resolved[id as string] = resolve(id, tokens.value)
    }
    return resolved
  })

  function cycle (themeArray: ID[] = themeNames.value) {
    const currentIndex = themeArray.indexOf(registrar.selectedId.value ?? '')
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeArray.length

    registrar.select(themeArray[nextIndex])
  }

  function toggle (themeArray: [ID, ID]) {
    cycle(themeArray)
  }

  function register (registrant: Partial<Z>, id: ID = genId()): Reactive<Z> {
    const item = registrar.register({
      lazy: registrant?.lazy ?? false,
      ...registrant,
    }, id)

    return item
  }

  function resolve (theme: ID, tokens: Record<string, string>): Colors {
    const colors: Colors = {}
    const prefix = `${String(theme)}.`

    for (const key in tokens) {
      if (key.startsWith(prefix)) {
        const colorName = key.slice(prefix.length)
        colors[colorName] = tokens[key]
      }
    }

    return colors
  }

  return createTrinity(useThemeContext, provideThemeContext, {
    ...registrar,
    colors,
    register,
    cycle,
    toggle,
  } as E)
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
 * Creates a Vue plugin for managing application themes and color systems.
 * Uses the universal plugin factory to eliminate boilerplate code.
 *
 * @param options Configuration for themes, palette, and adapter.
 * @template Z The type of theme tickets.
 * @template E The type of theme context.
 * @template R The type of token tickets.
 * @template O The type of token context.
 * @returns A Vue plugin object with install method.
 */
export function createThemePlugin<
  Z extends ThemeTicket = ThemeTicket,
  E extends ThemeContext = ThemeContext,
  R extends TokenTicket = TokenTicket,
  O extends TokenContext = TokenContext,
> (options: ThemePluginOptions = {}): ThemePlugin {
  const { adapter = new Vuetify0ThemeAdapter(), palette = {}, themes = {} } = options
  const [, provideThemeTokenContext, tokensContext] = createTokens<R, O>('v0:theme:tokens', { palette, ...themes })
  const [, provideThemeContext, themeContext] = createTheme<Z, E>('v0:theme', tokensContext.resolved)

  // Register themes if provided
  if (options.themes) {
    for (const id in options.themes) {
      themeContext.register({
        id,
        value: options.themes[id],
      } as Partial<Z>, id)

      if (id === options.default && !themeContext.selectedId.value) {
        themeContext.select(id as ID)
      }
    }
  }

  function update (colors: Record<string, Colors | undefined>) {
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
