// Composables
import { useSingle } from '#v0/composables/useSingle'
import { useContext } from '#v0/composables/useContext'
import { createTokens } from '#v0/composables/useTokens'

// Utilities
import { computed, watch } from 'vue'

// Adapters
import { Vuetify0ThemeAdapter } from './adapters/v0'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { SingleContext, SingleItem, SingleTicket } from '#v0/composables/useSingle'
import type { ID } from '#v0/types'
import type { App, Ref } from 'vue'
import type { ThemeAdapter } from './adapters/adapter'
import type { TokenCollection, TokenContext } from '#v0/composables/useTokens'

export interface Colors {
  [key: string]: string
}

export interface ThemeItem extends SingleItem {
  value: TokenCollection
}

export interface ThemeTicket extends SingleTicket {
  value: TokenCollection
  toggle: () => void
}

export interface ThemeContext extends SingleContext {
  cycle: (themeArray: ID[]) => void
  toggle: (themeArray: [ID, ID]) => void
}

export interface ThemePluginOptions<T extends TokenCollection = TokenCollection> {
  adapter?: ThemeAdapter
  themes?: Record<ID, T>
}

export function createTheme<T extends ThemeContext> (namespace: string) {
  const [
    useThemeContext,
    provideThemeContext,
    single,
  ] = useSingle<T>(namespace)

  const themeNames = computed(() => Array.from(single.registeredItems.keys()))

  function cycle (themeArray: ID[] = themeNames.value) {
    const currentIndex = themeArray.indexOf(single.selectedId.value ?? '')
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeArray.length

    single.select(themeArray[nextIndex])
  }

  function toggle (themeArray: [ID, ID]) {
    cycle(themeArray)
  }

  const context = {
    ...single,
    cycle,
    toggle,
  } as T

  return [
    useThemeContext,
    function (
      model?: Ref<ID>,
      _context: T = context,
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
  T extends ThemeContext = ThemeContext,
  U extends TokenContext = TokenContext,
> (options: ThemePluginOptions = {}) {
  return {
    install (app: App) {
      const { adapter = new Vuetify0ThemeAdapter() } = options
      const [, provideThemeContext, themeContext] = createTheme<T>('v0:theme')
      const [, provideThemeTokenContext, tokensContext] = createTokens<U>('v0:theme:tokens', options.themes)

      const resolvedColors = computed(() => {
        const selectedValue = themeContext.selectedValue.value
        if (!selectedValue || typeof selectedValue !== 'object' || Object.keys(selectedValue).length === 0) {
          return undefined
        }

        return tokensContext.resolve(selectedValue as TokenCollection)
      })

      function updateStyles (colors: Colors | undefined) {
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

export { Vuetify0ThemeAdapter } from './adapters/v0'
