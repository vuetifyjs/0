// Composables
import { useSingle } from '#v0/composables/useSingle'
import { useContext } from '#v0/composables/useContext'
import { createTokens } from '#v0/composables/useTokens'
import { createPlugin } from '#v0/composables/createPlugin'
import { toSingleton } from '../toSingleton'

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
import type { App, Reactive, Ref } from 'vue'
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
  resolveTheme: (theme: ID, resolvedTokens: Record<string, string>) => Colors
  cycle: (themeArray: ID[]) => void
  toggle: (themeArray: [ID, ID]) => void
}

export interface ThemePluginOptions<Z extends TokenCollection = TokenCollection> {
  adapter?: ThemeAdapter
  default?: ID
  palette?: TokenCollection
  themes?: Record<ID, Z>
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
> (namespace: string) {
  const [
    useThemeContext,
    provideThemeContext,
    single,
  ] = useSingle<Z, E>(namespace)

  const themeNames = computed(() => Array.from(single.tickets.keys()))

  function cycle (themeArray: ID[] = themeNames.value) {
    const currentIndex = themeArray.indexOf(single.selectedId.value ?? '')
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeArray.length

    single.select(themeArray[nextIndex])
  }

  function toggle (themeArray: [ID, ID]) {
    cycle(themeArray)
  }

  function register (registrant: Partial<Z>, id: ID = genId()): Reactive<Z> {
    const item = single.register({
      lazy: registrant?.lazy ?? false,
      ...registrant,
    }, id)

    return item
  }

  function resolveTheme (theme: ID, resolvedTokens: Record<string, string>): Colors {
    const colors: Colors = {}
    const prefix = `${String(theme)}.`

    for (const key in resolvedTokens) {
      if (key.startsWith(prefix)) {
        const colorName = key.slice(prefix.length)
        colors[colorName] = resolvedTokens[key]
      }
    }

    return colors
  }

  const context = {
    ...single,
    resolveTheme,
    register,
    cycle,
    toggle,
  } as E

  return toSingleton(
    useThemeContext,
    (model?: Ref<ID>, _context: E = context, app?: App) => {
      provideThemeContext(model, _context, app)

      return _context
    },
    context,
  )
}

/**
 * Simple hook to access the theme context.
 *
 * @returns The theme context containing current theme state and utilities.
 */
export function useTheme (): ThemeContext {
  return useContext<ThemeContext>('v0:theme')[0]()
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
> (options: ThemePluginOptions = {}) {
  const { adapter = new Vuetify0ThemeAdapter() } = options
  const [, provideThemeContext, themeContext] = createTheme<Z, E>('v0:theme')
  const [, provideThemeTokenContext, tokensContext] = createTokens<R, O>('v0:theme:tokens', {
    palette: options.palette ?? {},
    ...options.themes,
  })

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

  const resolvedColors = computed(() => {
    const resolved = {} as Record<string, Colors | undefined>
    for (const [id, theme] of themeContext.tickets.entries()) {
      if (theme.lazy && theme.id !== themeContext.selectedId.value) continue

      resolved[id as string] = themeContext.resolveTheme(id, tokensContext.resolved)
    }
    return resolved
  })

  function updateStyles (colors: Record<string, Colors | undefined>) {
    adapter.update(colors)
  }

  return createPlugin({
    namespace: 'v0:theme',
    provide: (app: App) => {
      provideThemeContext(undefined, themeContext, app)
      provideThemeTokenContext(tokensContext, app)
    },
    setup: () => {
      if (IN_BROWSER) {
        watch(resolvedColors, updateStyles, { immediate: true, deep: true })
      } else {
        updateStyles(resolvedColors.value)
      }
    },
  })
}
