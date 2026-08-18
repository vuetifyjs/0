// Framework
import { createContext, usePrefersDark, useStorage, useTheme } from '@vuetify/v0'

// Themes
import { themes, type ThemeId } from '@/themes'

// Utilities
import { type Ref, shallowRef, type ShallowRef, toRef, watch } from 'vue'

// Types
import type { UseThemeReturn } from '@vuetify/v0'

export type ModePreference = 'system' | 'light' | 'dark'

export type Palette =
  | 'vuetify0'
  | 'tailwind'
  | 'material-3'
  | 'radix'
  | 'ant-design'
  | 'emerald'

export const PALETTE_THEMES: Record<Palette, { dark: ThemeId, light: ThemeId }> = {
  'vuetify0': { dark: 'dark', light: 'light' },
  'tailwind': { dark: 'tailwind', light: 'tailwind-light' },
  'material-3': { dark: 'material-3', light: 'material-3-light' },
  'radix': { dark: 'radix', light: 'radix-light' },
  'ant-design': { dark: 'ant-design', light: 'ant-design-light' },
  'emerald': { dark: 'emerald-dark', light: 'emerald-light' },
}

export const PALETTES = Object.keys(PALETTE_THEMES) as Palette[]

export const PALETTE_ICONS: Record<Palette, string> = {
  'vuetify0': 'vuetify-0',
  'tailwind': 'theme-tailwind',
  'material-3': 'theme-material-3',
  'radix': 'theme-radix',
  'ant-design': 'theme-ant-design',
  'emerald': 'theme-emerald',
}

export const PALETTE_LABELS: Record<Palette, string> = {
  'vuetify0': 'Vuetify0',
  'tailwind': 'Tailwind',
  'material-3': 'Material',
  'radix': 'Radix',
  'ant-design': 'Ant Design',
  'emerald': 'Emerald',
}

const ACCESSIBILITY_THEMES = [
  'high-contrast',
  'protanopia',
  'deuteranopia',
  'tritanopia',
] as const

const MODES: ModePreference[] = ['system', 'light', 'dark']

/** Id prefix minted by `useCustomThemes`. */
const CUSTOM = 'custom-'

export type AccessibilityTheme = typeof ACCESSIBILITY_THEMES[number]

export type ThemePreference = ModePreference | AccessibilityTheme | Palette | (string & {})

export interface ThemeToggleOptions {
  /** Palette to keep while following the page. */
  palette?: Palette
}

export interface ThemeToggleContext {
  theme: UseThemeReturn
  themes: typeof themes
  mode: ShallowRef<ModePreference>
  palette: ShallowRef<Palette>
  preference: ShallowRef<ThemePreference>
  currentThemeId: Ref<string>
  isOverridden: Ref<boolean>
  isOverrideActive: Ref<boolean>
  icon: Ref<string>
  title: Ref<string>
  isDark: Ref<boolean>
  toggle: () => void
  setPreference: (pref: ThemePreference) => void
  setMode: (mode: ModePreference) => void
  setPalette: (palette: Palette) => void
  reset: () => void
}

export type UseThemeToggleReturn = ThemeToggleContext

export function isValidPalette (value: string | undefined): value is Palette {
  return !!value && value in PALETTE_THEMES
}

export function isAccessibilityTheme (value: string): value is AccessibilityTheme {
  return (ACCESSIBILITY_THEMES as readonly string[]).includes(value)
}

export function isModePreference (value: string): value is ModePreference {
  return (MODES as readonly string[]).includes(value)
}

export function isCustomTheme (value: string): boolean {
  return value.startsWith(CUSTOM)
}

/**
 * A preference that names a theme outright instead of resolving through
 * mode + palette. Accessibility themes and user-created themes both qualify.
 */
export function isOverrideTheme (value: string): boolean {
  return isAccessibilityTheme(value) || isCustomTheme(value)
}

export function resolveThemeId (
  mode: ModePreference,
  palette: Palette,
  preference: ThemePreference,
  prefersDark: boolean,
): string {
  const pref = String(preference)
  if (isOverrideTheme(pref)) {
    return pref
  }
  if (!isModePreference(pref) && !isValidPalette(pref)) {
    return pref
  }

  const dark = mode === 'system' ? prefersDark : mode === 'dark'
  const mapping = PALETTE_THEMES[palette]
  return dark ? mapping.dark : mapping.light
}

const [useThemeToggleContext, provideThemeToggle] = createContext<ThemeToggleContext | null>(
  'docs:theme-toggle',
  null,
)

export { provideThemeToggle }

export function useThemeToggleController (): ThemeToggleContext {
  return useThemeToggleContext() ?? useThemeToggle()
}

let page: ThemeToggleContext | undefined

export function useThemeToggle (): ThemeToggleContext {
  page ??= createThemeToggleState({ bindPage: true })
  return page
}

/**
 * Local mode / palette / a11y controller. Follows the page toggle until the
 * user overrides. Persistence is a plugin concern (`createThemePlugin({ persist })`).
 */
export function createThemeToggle (options: ThemeToggleOptions = {}): ThemeToggleContext {
  return createThemeToggleState({
    palette: options.palette,
    follow: useThemeToggle(),
  })
}

function createThemeToggleState (options: {
  palette?: Palette
  follow?: ThemeToggleContext
  bindPage?: boolean
}): ThemeToggleContext {
  const home = options.palette
  const follow = options.follow
  const bindPage = options.bindPage === true
  const theme = useTheme()
  const storage = useStorage()
  const { matches: prefersDark } = usePrefersDark()

  const mode = shallowRef<ModePreference>(follow?.mode.value ?? 'system')
  const palette = shallowRef<Palette>(home ?? follow?.palette.value ?? 'vuetify0')
  const preference = shallowRef<ThemePreference>(follow?.preference.value ?? 'system')
  const override = shallowRef(false)

  if (bindPage) {
    restore(storage, mode, palette, preference)
  } else if (follow) {
    watch(
      [follow.mode, follow.palette, follow.preference],
      ([nextMode, nextPalette, nextPreference]) => {
        if (override.value) return
        mode.value = nextMode
        palette.value = home ?? nextPalette
        preference.value = nextPreference
      },
    )
  }

  const currentThemeId = toRef(() =>
    resolveThemeId(mode.value, palette.value, preference.value, prefersDark.value),
  )

  if (bindPage) {
    watch(
      [mode, palette, preference, prefersDark],
      () => {
        const id = currentThemeId.value
        storage.set('theme-mode', mode.value)
        storage.set('theme-palette', palette.value)
        // Legacy key name; holds any override id (accessibility or custom).
        storage.set(
          'theme-accessibility',
          isOverrideTheme(String(preference.value)) ? preference.value : null,
        )
        storage.set('theme', id)
        theme.select(id as ThemeId)
      },
      { immediate: true },
    )
  }

  function lock () {
    if (!bindPage) override.value = true
  }

  function setMode (next: ModePreference) {
    lock()
    mode.value = next
    preference.value = next
  }

  function setPalette (next: Palette) {
    lock()
    palette.value = next
    if (isOverrideTheme(String(preference.value))) {
      preference.value = mode.value
    }
  }

  function setPreference (pref: ThemePreference) {
    lock()
    if (isOverrideTheme(String(pref)) || isModePreference(pref)) {
      if (isModePreference(pref)) mode.value = pref
      preference.value = pref
    } else if (isValidPalette(pref)) {
      palette.value = pref
      preference.value = mode.value
    } else {
      preference.value = pref
    }
  }

  function toggle () {
    setMode(MODES[(MODES.indexOf(mode.value) + 1) % MODES.length])
  }

  function reset () {
    if (bindPage || !follow) {
      mode.value = 'system'
      palette.value = home ?? 'vuetify0'
      preference.value = 'system'
      return
    }

    override.value = false
    mode.value = follow.mode.value
    palette.value = home ?? follow.palette.value
    preference.value = follow.preference.value
  }

  return {
    theme,
    themes,
    mode,
    palette,
    preference,
    currentThemeId,
    isOverridden: toRef(() => override.value),
    isOverrideActive: toRef(() => isOverrideTheme(String(preference.value))),
    icon: toRef(() => {
      if (isCustomTheme(String(preference.value))) {
        return 'theme-custom'
      }
      if (isAccessibilityTheme(String(preference.value))) {
        return `theme-${preference.value}`
      }
      return PALETTE_ICONS[palette.value] ?? 'theme-custom'
    }),
    title: toRef(() => {
      if (isCustomTheme(String(preference.value))) {
        return 'Theme: Custom'
      }
      if (isAccessibilityTheme(String(preference.value))) {
        return `Theme: ${preference.value}`
      }
      return `Theme: ${PALETTE_LABELS[palette.value] ?? 'Custom'}`
    }),
    isDark: bindPage
      ? theme.isDark
      : toRef(() => {
          if (isOverrideTheme(String(preference.value))) {
            return theme.get(preference.value)?.dark ?? theme.isDark.value
          }
          return mode.value === 'system' ? prefersDark.value : mode.value === 'dark'
        }),
    toggle,
    setPreference,
    setMode,
    setPalette,
    reset,
  }
}

function restore (
  storage: ReturnType<typeof useStorage>,
  mode: ShallowRef<ModePreference>,
  palette: ShallowRef<Palette>,
  preference: ShallowRef<ThemePreference>,
) {
  const storedMode = storage.get<string>('theme-mode')
  const storedPalette = storage.get<string>('theme-palette')
  const legacy = storage.get<string>('theme')

  if (legacy.value && !storedMode.value) {
    if (isModePreference(legacy.value)) {
      mode.value = legacy.value
    } else if (isAccessibilityTheme(legacy.value)) {
      mode.value = 'system'
      preference.value = legacy.value
    } else if (isValidPalette(legacy.value)) {
      palette.value = legacy.value
      mode.value = 'dark'
    } else if (legacy.value in themes) {
      for (const [key, mapping] of Object.entries(PALETTE_THEMES)) {
        if (mapping.dark === legacy.value || mapping.light === legacy.value) {
          palette.value = key as Palette
          mode.value = mapping.dark === legacy.value ? 'dark' : 'light'
          break
        }
      }
    }
  } else {
    if (storedMode.value && isModePreference(storedMode.value)) {
      mode.value = storedMode.value
    }
    if (isValidPalette(storedPalette.value)) {
      palette.value = storedPalette.value
    }
  }

  const stored = storage.get<string>('theme-accessibility')
  preference.value = stored.value && isOverrideTheme(stored.value)
    ? stored.value
    : mode.value
}
