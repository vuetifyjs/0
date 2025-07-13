// Composables
import { useContext } from '#v0/composables/useContext'
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { computed, getCurrentScope, onScopeDispose, reactive, shallowRef, toRef, watch } from 'vue'
import { mergeDeep } from '#v0/utils/helpers'

// Globals
import { IN_BROWSER, SUPPORTS_MATCH_MEDIA } from '#v0/constants/globals'

// Types
import type { App, Reactive } from 'vue'

export interface Colors {
  [key: string]: string
}

export interface ThemeDefinition {
  dark: boolean
  colors: Colors
}

export interface ThemeOptions {
  cspNonce?: string
  default?: 'light' | 'dark' | 'system' | string
  stylesheetId?: string
  themes?: Record<string, Partial<ThemeDefinition>>
}

export interface ThemeContext {
  current: ThemeDefinition
  cspNonce?: string
  themes: Reactive<Record<string, ThemeDefinition>>
  stylesheetId: string
  styles: string
  change: (name: string) => void
  cycle: (themeArray?: string[]) => void
  reset: () => void
  toggle: (themeArray?: [string, string]) => void
}

const [useThemeContext, provideThemeContext] = useContext<ThemeContext>('theme')

function getOrCreateStyleElement (id: string, cspNonce?: string) {
  if (!IN_BROWSER) return null

  let style = document.querySelector(id) as HTMLStyleElement | null

  if (!style) {
    style = document.createElement('style')
    style.id = id

    if (cspNonce) style.setAttribute('nonce', cspNonce)

    document.head.append(style)
  }

  return style
}

function upsertStyles (id: string, cspNonce: string | undefined, styles: string) {
  const styleEl = getOrCreateStyleElement(id, cspNonce)

  if (!styleEl) return

  styleEl.textContent = styles
}

function parseThemes (_themes: ThemeOptions['themes'] = {}): Record<string, ThemeDefinition> {
  const defaults = {
    light: {
      dark: false,
      colors: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        success: '#4CAF50',
        warning: '#FB8C00',
        error: '#FF5252',
        info: '#2196F3',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: '#000000',
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: '#2196F3',
        secondary: '#757575',
        accent: '#BBDEFB',
        success: '#81C784',
        warning: '#FFB74D',
        error: '#E57373',
        info: '#64B5F6',
        background: '#121212',
        surface: '#1E1E1E',
        text: '#FFFFFF',
      },
    },
  }

  return Object.entries(_themes).reduce<Record<string, ThemeDefinition>>((acc, [key, theme]) => {
    const defaultTheme = theme.dark || key === 'dark' ? defaults.dark : defaults.light
    acc[key] = mergeDeep<ThemeDefinition>(defaultTheme, theme)
    return acc
  }, {})
}

export function createTheme (options: Partial<ThemeOptions> = {}): ThemeContext {
  const { isHydrated } = useHydration()

  const themes = reactive(parseThemes(options.themes))
  const _name = shallowRef()
  const stylesheetId = shallowRef(options.stylesheetId || 'v0:theme-stylesheet')
  const system = shallowRef('light')

  const name = computed({
    get () {
      return _name.value === 'system' ? system.value : _name.value
    },
    set (val: string) {
      _name.value = val
    },
  })
  const themeNames = toRef(() => Object.keys(themes))
  const current = toRef(() => themes[name.value])

  const styles = computed(() => {
    if (!current.value) return ''
    const vars = Object.entries(current.value.colors).map(([key, val]) => `  --v-theme-${key}: ${val};`).join('\n')
    return `:root {\n${vars}\n}`
  })

  if (SUPPORTS_MATCH_MEDIA) {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    function updateSystem () {
      system.value = media.matches ? 'dark' : 'light'
    }

    if (isHydrated.value) {
      updateSystem()
    } else {
      watch(isHydrated, updateSystem)
    }

    media.addEventListener('change', updateSystem, { passive: true })

    if (getCurrentScope()) {
      onScopeDispose(() => {
        media.removeEventListener('change', updateSystem)
      })
    }
  }

  function change (value: string) {
    name.value = value
  }

  function cycle (themeArray: string[] = themeNames.value) {
    const currentIndex = themeArray.indexOf(name.value)
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themeArray.length

    change(themeArray[nextIndex])
  }

  function toggle (themeArray: [string, string] = ['light', 'dark']) {
    cycle(themeArray)
  }

  function reset () {
    name.value = options.default ?? 'light'
  }

  return {
    current: current.value,
    stylesheetId: stylesheetId.value,
    styles: styles.value,
    cspNonce: options.cspNonce,
    themes,
    change,
    cycle,
    toggle,
    reset,
  }
}

export function useTheme (): ThemeContext {
  return useThemeContext()
}

export function createThemePlugin () {
  return {
    install (app: App) {
      const theme = createTheme()

      if (IN_BROWSER) {
        watch(() => theme.styles, updateStyles, { immediate: true, deep: true })
      } else {
        updateStyles()
      }

      function updateStyles () {
        upsertStyles(theme.stylesheetId, theme.cspNonce, theme.styles)
      }

      app.runWithContext(() => {
        provideThemeContext(theme, app)
      })
    },
  }
}
