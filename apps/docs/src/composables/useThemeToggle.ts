// Framework
import { usePrefersDark, useStorage, useTheme } from '@vuetify/v0'

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

// Maps palette ID → [dark ThemeId, light ThemeId]
const PALETTE_THEMES: Record<Palette, { dark: ThemeId, light: ThemeId }> = {
  'vuetify0': { dark: 'dark', light: 'light' },
  'tailwind': { dark: 'tailwind', light: 'tailwind-light' },
  'material-3': { dark: 'material-3', light: 'material-3-light' },
  'radix': { dark: 'radix', light: 'radix-light' },
  'ant-design': { dark: 'ant-design', light: 'ant-design-light' },
}

export const PALETTES = Object.keys(PALETTE_THEMES) as Palette[]

export const PALETTE_ICONS: Record<Palette, string> = {
  'vuetify0': 'vuetify-0',
  'tailwind': 'theme-tailwind',
  'material-3': 'theme-material-3',
  'radix': 'theme-radix',
  'ant-design': 'theme-ant-design',
}

export const PALETTE_LABELS: Record<Palette, string> = {
  'vuetify0': 'Vuetify0',
  'tailwind': 'Tailwind',
  'material-3': 'Material',
  'radix': 'Radix',
  'ant-design': 'Ant Design',
}

// Accessibility themes bypass palette — direct theme selection
const ACCESSIBILITY_THEMES = [
  'high-contrast',
  'protanopia',
  'deuteranopia',
  'tritanopia',
] as const

export type AccessibilityTheme = typeof ACCESSIBILITY_THEMES[number]

export type ThemePreference = ModePreference | AccessibilityTheme | Palette | (string & {})

export interface UseThemeToggleReturn {
  theme: UseThemeReturn
  themes: typeof themes
  mode: ShallowRef<ModePreference>
  palette: ShallowRef<Palette>
  preference: ShallowRef<ThemePreference>
  isAccessibilityActive: Ref<boolean>
  icon: Ref<string>
  title: Ref<string>
  toggle: () => void
  setPreference: (pref: ThemePreference) => void
  setMode: (mode: ModePreference) => void
  setPalette: (palette: Palette) => void
  isDark: UseThemeReturn['isDark']
}

// Shared singleton state
const mode = shallowRef<ModePreference>('system')
const palette = shallowRef<Palette>('vuetify0')
const preference = shallowRef<ThemePreference>('system')

function isValidPalette (value: string | undefined): value is Palette {
  return !!value && value in PALETTE_THEMES
}

function isAccessibilityTheme (value: string): value is AccessibilityTheme {
  return (ACCESSIBILITY_THEMES as readonly string[]).includes(value)
}

let initialized = false

export function useThemeToggle (): UseThemeToggleReturn {
  const theme = useTheme()
  const storage = useStorage()
  const { matches: prefersDark } = usePrefersDark()

  if (!initialized) {
    initialized = true

    const storedMode = storage.get<string>('theme-mode')
    const storedPalette = storage.get<string>('theme-palette')

    // Migrate from old single-preference storage
    const legacy = storage.get<string>('theme')
    if (legacy.value && !storedMode.value) {
      if (['system', 'light', 'dark'].includes(legacy.value)) {
        mode.value = legacy.value as ModePreference
      } else if (isAccessibilityTheme(legacy.value)) {
        mode.value = 'system'
        preference.value = legacy.value
      } else if (isValidPalette(legacy.value)) {
        palette.value = legacy.value
        mode.value = 'dark'
      } else if (legacy.value in themes) {
        // Old design system theme selected directly
        for (const [key, mapping] of Object.entries(PALETTE_THEMES)) {
          if (mapping.dark === legacy.value || mapping.light === legacy.value) {
            palette.value = key as Palette
            mode.value = mapping.dark === legacy.value ? 'dark' : 'light'
            break
          }
        }
      }
    } else {
      if (storedMode.value && ['system', 'light', 'dark'].includes(storedMode.value)) {
        mode.value = storedMode.value as ModePreference
      }
      if (isValidPalette(storedPalette.value)) {
        palette.value = storedPalette.value
      }
    }

    // Sync preference from mode (for accessibility overrides)
    const storedAccessibility = storage.get<string>('theme-accessibility')
    preference.value = storedAccessibility.value && isAccessibilityTheme(storedAccessibility.value) ? storedAccessibility.value : mode.value

    watch(
      [mode, palette, prefersDark],
      ([m, p, isDark]) => {
        storage.set('theme-mode', m)
        storage.set('theme-palette', p)

        // If preference is an accessibility theme, use it directly
        if (isAccessibilityTheme(preference.value)) {
          storage.set('theme-accessibility', preference.value)
          storage.set('theme', preference.value)
          theme.select(preference.value as ThemeId)
          return
        }

        storage.set('theme-accessibility', null)

        // Resolve mode
        const dark = m === 'system' ? isDark : m === 'dark'
        const mapping = PALETTE_THEMES[p]
        const actual = dark ? mapping.dark : mapping.light
        storage.set('theme', actual)
        theme.select(actual)
      },
      { immediate: true },
    )

    // Also watch preference for accessibility toggle
    watch(preference, pref => {
      if (isAccessibilityTheme(pref)) {
        storage.set('theme-accessibility', pref)
        storage.set('theme', pref)
        theme.select(pref as ThemeId)
      } else {
        storage.set('theme-accessibility', null)
        // Re-resolve from mode + palette
        const dark = mode.value === 'system' ? prefersDark.value : mode.value === 'dark'
        const mapping = PALETTE_THEMES[palette.value]
        const actual = dark ? mapping.dark : mapping.light
        storage.set('theme', actual)
        theme.select(actual)
      }
    })
  }

  const isAccessibilityActive = toRef(() => isAccessibilityTheme(preference.value))

  const icon = toRef(() => {
    if (isAccessibilityTheme(preference.value)) {
      return `theme-${preference.value}`
    }
    return PALETTE_ICONS[palette.value] ?? 'theme-custom'
  })

  const title = toRef(() => {
    if (isAccessibilityTheme(preference.value)) {
      return `Theme: ${preference.value}`
    }
    return `Theme: ${PALETTE_LABELS[palette.value] ?? 'Custom'}`
  })

  function toggle () {
    const modes: ModePreference[] = ['system', 'light', 'dark']
    const index = modes.indexOf(mode.value)
    mode.value = modes[(index + 1) % modes.length]
    preference.value = mode.value
  }

  function setPreference (pref: ThemePreference) {
    if (isAccessibilityTheme(pref)) {
      preference.value = pref
    } else if (['system', 'light', 'dark'].includes(pref)) {
      mode.value = pref as ModePreference
      preference.value = pref
    } else if (isValidPalette(pref)) {
      palette.value = pref
      preference.value = mode.value
    }
  }

  function setMode (m: ModePreference) {
    mode.value = m
    preference.value = m
  }

  function setPalette (p: Palette) {
    palette.value = p
    // Clear accessibility override when picking a palette
    if (isAccessibilityTheme(preference.value)) {
      preference.value = mode.value
    }
  }

  return {
    theme,
    themes,
    mode,
    palette,
    preference,
    isAccessibilityActive,
    icon,
    title,
    toggle,
    setPreference,
    setMode,
    setPalette,
    isDark: theme.isDark,
  }
}
