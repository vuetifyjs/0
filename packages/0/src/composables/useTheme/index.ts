// Composables
import { useSingle } from '#v0/composables/useSingle'
import { useContext } from '#v0/composables/useContext'

// Utilities
import { computed, nextTick, toValue, watch } from 'vue'

// Adapters
import { Vuetify0ThemeAdapter } from './adapters/v0'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { SingleContext, SingleItem, SingleTicket } from '#v0/composables/useSingle'
import type { ID } from '#v0/types'
import type { App, ComputedRef, Ref } from 'vue'
import type { ThemeAdapter } from './adapters/adapter'
import { createTokens, type TokenAlias, type TokenCollection, type TokenContext, type TokenItem, type TokenTicket } from '../useTokens'

export interface Colors {
  [key: string]: string | TokenAlias
}

export interface ThemeItem extends SingleItem {
  dark: boolean
  colors: Colors
}

export interface ThemeTicket extends SingleTicket {
  dark: boolean
  colors: TokenCollection
  toggle: () => void
}

export interface ThemeContext extends SingleContext {
  selectedColors: ComputedRef<Colors | undefined>
  cycle: (themeArray: ID[]) => void
  toggle: (themeArray: [ID, ID]) => void
}

export interface ThemePluginOptions {
  adapter?: ThemeAdapter
  themes?: Record<ID, TokenCollection>
}

export function createTheme<T extends ThemeContext> (namespace: string) {
  const [
    ,
    provideThemeContext,
    single,
  ] = useSingle<T>(namespace)

  const selectedColors = computed(() => (single.selectedItem.value as ThemeTicket)?.colors)
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
    selectedColors,
    cycle,
    toggle,
  } as T

  return [
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

export function createThemePlugin (options: ThemePluginOptions = {}) {
  return {
    install (app: App) {
      const { adapter = new Vuetify0ThemeAdapter() } = options
      const [provideThemeContext, themeContext] = createTheme<ThemeContext>('v0:theme')
      const [, provideThemeTokenContext, tokensContext] = createTokens('v0:theme:tokens', options.themes)

      function updateStyles (colors: Colors | undefined) {
        if (!colors) return

        adapter.update(colors)
      }

      if (IN_BROWSER) {
        watch(themeContext.selectedColors, updateStyles, { immediate: true, deep: true })
      } else {
        updateStyles(themeContext.selectedColors.value)
      }

      app.runWithContext(() => {
        provideThemeContext(undefined, themeContext, app)
        provideThemeTokenContext(tokensContext, app)
      })
    },
  }
}

export { Vuetify0ThemeAdapter } from './adapters/v0'
