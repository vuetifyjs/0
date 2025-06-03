import { computed, provide, ref, watchEffect, type Ref } from 'vue'

export interface Theme {
  dark: boolean
  colors: {
    primary: string
    secondary: string
    tertiary: string
    accent: string
    error: string
    info: string
    success: string
    warning: string
    background: string
    surface: string
    surfaceLight: string
    surfaceVariant: string
    surfaceBright: string
    surfaceTint: string

    onPrimary: string
    onSecondary: string
    onTertiary: string
    onAccent: string
    onError: string
    onInfo: string
    onSuccess: string
    onWarning: string
    onBackground: string
    onSurface: string
    onSurfaceVariant?: string
    onSurfaceLight?: string
    onSurfaceBright?: string
    onSurfaceTint?: string
  }
}

export interface ThemeOptions {
  auto: boolean
  themes: Record<string, Theme>
  current?: string
}

export interface ThemeProvider {
  theme: Ref<ThemeOptions>
  get: (name?: string) => Theme | undefined
  register: (name: string, value: Theme) => void
  set: (key: keyof Theme['colors'], value: string) => void
}

export function DEFAULT_LIGHT (): Theme {
  return {
    dark: false,
    colors: {
      primary: '#1976D2',
      secondary: '#424242',
      tertiary: '#82B1FF',
      accent: '#82B1FF',
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107',
      background: '#F9F9F9',
      surface: '#FFFFFF',
      surfaceLight: '#F5F5F5',
      surfaceVariant: '#F9F9F9',
      surfaceBright: '#FFFFFF',
      surfaceTint: '#F0F0F0',

      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
      onTertiary: '#FFFFFF',
      onAccent: '#FFFFFF',
      onError: '#FFFFFF',
      onInfo: '#FFFFFF',
      onSuccess: '#FFFFFF',
      onWarning: '#FFFFFF',
      onBackground: '#000000',
      onSurface: '#000000',
      onSurfaceVariant: '#000000',
      onSurfaceLight: '#000000',
      onSurfaceBright: '#000000',
      onSurfaceTint: '#000000',
    },
  }
}

export function DEFAULT_DARK (): Theme {
  return {
    dark: true,
    colors: {
      primary: '#2196F3',
      secondary: '#424242',
      tertiary: '#64B5F6',
      accent: '#FF4081',
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107',
      background: '#121212',
      surface: '#333333',
      surfaceLight: '#424242',
      surfaceVariant: '#1E1E1E',
      surfaceBright: '#424242',
      surfaceTint: '#2C2C2C',

      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
      onTertiary: '#FFFFFF',
      onAccent: '#FFFFFF',
      onError: '#FFFFFF',
      onInfo: '#FFFFFF',
      onSuccess: '#FFFFFF',
      onWarning: '#FFFFFF',
      onBackground: '#FFFFFF',
      onSurface: '#FFFFFF',
      onSurfaceVariant: '#FFFFFF',
      onSurfaceLight: '#FFFFFF',
      onSurfaceBright: '#FFFFFF',
      onSurfaceTint: '#FFFFFF',
    },
  }
}

export function createTheme (options: ThemeOptions) {
  const styleEl = ref()
  const theme = ref<ThemeOptions>({
    auto: options.auto ?? true,
    current: options.current,
    themes: structuredClone({
      light: DEFAULT_LIGHT(),
      dark: DEFAULT_DARK(),
    }, options.themes),
  })

  const css = computed(() => {
    if (!theme.value.current) {
      return ''
    }

    const currentTheme = theme.value.themes[theme.value.current]
    let cssVariables = ':root {\n'

    for (const [key, value] of Object.entries(currentTheme.colors)) {
      cssVariables += `  --v0-${key}: ${value};\n`
    }

    cssVariables += '}'

    return cssVariables
  })

  watchEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    styleEl.value = document.querySelector('#vue-theme-styles')

    if (!styleEl.value) {
      styleEl.value = document.createElement('style')
      styleEl.value.id = 'vue-theme-styles'
      styleEl.value.type = 'text/css'
      document.head.append(styleEl.value)
    }

    styleEl.value.textContent = css.value
  })

  if (typeof window !== 'undefined' && theme.value.auto && !theme.value.current) {
    const dark = window.matchMedia('(prefers-color-scheme: dark)')

    theme.value.current = dark.matches ? 'dark' : 'light'
  }

  function register (name: string, value: Theme) {
    theme.value.themes[name] = value
  }

  function get (name: string | undefined = theme.value.current) {
    if (!name) {
      return
    }

    return theme.value.themes[name]
  }

  function set (key: keyof Theme['colors'], value: string) {
    if (!theme.value.current) {
      return
    }

    theme.value.themes[theme.value.current].colors[key] = value
  }

  const providing: ThemeProvider = {
    theme,
    get,
    register,
    set,
  }

  provide('theme', providing)

  return providing
}
