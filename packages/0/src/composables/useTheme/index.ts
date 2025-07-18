// Composables
import { useSingle } from '#v0/composables/useSingle'
import { useContext } from '#v0/composables/useContext'
import { createTokens } from '#v0/composables/useTokens'

// Utilities
import { computed, reactive, watch } from 'vue'
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

export interface ThemePluginOptions<T extends TokenCollection = TokenCollection> {
  adapter?: ThemeAdapter
  default?: ID
  palette?: TokenCollection
  themes?: Record<ID, T>
}

export function createTheme<
  T extends ThemeTicket,
  U extends ThemeContext,
> (namespace: string) {
  const [
    useThemeContext,
    provideThemeContext,
    single,
  ] = useSingle<T, U>(namespace)

  const themeNames = computed(() => Array.from(single.tickets.keys()))

  function cycle (themeArray: ID[] = themeNames.value) {
    const currentIndex = themeArray.indexOf(single.selectedId.value ?? '')
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeArray.length

    single.select(themeArray[nextIndex])
  }

  function toggle (themeArray: [ID, ID]) {
    cycle(themeArray)
  }

  function register (registrant: Partial<T>, id: ID = genId()): Reactive<T> {
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
  } as U

  return [
    useThemeContext,
    function (
      model?: Ref<ID>,
      _context: U = context,
      app?: App,
    ) {
      provideThemeContext(model, _context, app)

      return _context
    },
    context,
  ] as const
}

export function useTheme (): ThemeContext {
  return useContext<ThemeContext>('v0:theme')[0]()
}

export function createThemePlugin<
  T extends ThemeTicket = ThemeTicket,
  U extends ThemeContext = ThemeContext,
  R extends TokenTicket = TokenTicket,
  F extends TokenContext = TokenContext,
> (options: ThemePluginOptions = {}) {
  return {
    install (app: App) {
      const { adapter = new Vuetify0ThemeAdapter() } = options
      const [, provideThemeContext, themeContext] = createTheme<T, U>('v0:theme')
      const [, provideThemeTokenContext, tokensContext] = createTokens<R, F>('v0:theme:tokens', {
        palette: options.palette ?? {},
        ...options.themes,
      })

      if (options.themes) {
        for (const id in options.themes) {
          themeContext.register({
            id,
            value: options.themes[id],
          } as Partial<T>, id)

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

      if (IN_BROWSER) {
        watch(resolvedColors, updateStyles, { immediate: true, deep: true })
      } else {
        updateStyles(resolvedColors.value)
      }

      app.runWithContext(() => {
        provideThemeContext(undefined, themeContext, app)
        provideThemeTokenContext(tokensContext, app)
      })
    },
  }
}
