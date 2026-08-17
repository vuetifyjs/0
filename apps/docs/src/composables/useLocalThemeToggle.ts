// Framework
import { usePrefersDark, useTheme } from '@vuetify/v0'

// Composables
import {
  PALETTE_ICONS,
  PALETTE_LABELS,
  isAccessibilityTheme,
  isValidPalette,
  resolveThemeId,
  useThemeToggle,
  type ModePreference,
  type Palette,
  type ThemePreference,
  type UseThemeToggleReturn,
} from '@/composables/useThemeToggle'

// Themes
import { themes } from '@/themes'

// Utilities
import { type Ref, shallowRef, toRef, watch } from 'vue'

export interface UseLocalThemeToggleOptions {
  /** Palette to keep while following the page. Omit to track the page palette. */
  palette?: Palette
}

export interface UseLocalThemeToggleReturn extends UseThemeToggleReturn {
  currentThemeId: Ref<string>
  isOverridden: Ref<boolean>
  reset: () => void
}

/**
 * Per-example copy of the app-bar theme controller. Same mode/palette/a11y
 * surface, but it never writes storage or selects the page theme.
 */
export function useLocalThemeToggle (options: UseLocalThemeToggleOptions = {}): UseLocalThemeToggleReturn {
  const page = useThemeToggle()
  const theme = useTheme()
  const { matches: prefersDark } = usePrefersDark()
  const home = options.palette

  const mode = shallowRef<ModePreference>(page.mode.value)
  const palette = shallowRef<Palette>(home ?? page.palette.value)
  const preference = shallowRef<ThemePreference>(page.preference.value)
  const override = shallowRef(false)

  watch(
    [page.mode, page.palette, page.preference],
    ([nextMode, nextPalette, nextPreference]) => {
      if (override.value) return
      mode.value = nextMode
      palette.value = home ?? nextPalette
      preference.value = nextPreference
    },
  )

  const currentThemeId = toRef(() =>
    resolveThemeId(mode.value, palette.value, preference.value, prefersDark.value),
  )

  const isOverridden = toRef(() => override.value)
  const isAccessibilityActive = toRef(() => isAccessibilityTheme(String(preference.value)))

  const isDark = toRef(() => {
    if (isAccessibilityTheme(String(preference.value))) {
      return themes[preference.value as keyof typeof themes]?.dark ?? page.isDark.value
    }

    return mode.value === 'system' ? prefersDark.value : mode.value === 'dark'
  })

  const icon = toRef(() => {
    if (isAccessibilityTheme(String(preference.value))) {
      return `theme-${preference.value}`
    }
    return PALETTE_ICONS[palette.value] ?? 'theme-custom'
  })

  const title = toRef(() => {
    if (isAccessibilityTheme(String(preference.value))) {
      return `Theme: ${preference.value}`
    }
    return `Theme: ${PALETTE_LABELS[palette.value] ?? 'Custom'}`
  })

  function lock () {
    override.value = true
  }

  function reset () {
    override.value = false
    mode.value = page.mode.value
    palette.value = home ?? page.palette.value
    preference.value = page.preference.value
  }

  function toggle () {
    lock()
    const modes: ModePreference[] = ['system', 'light', 'dark']
    const index = modes.indexOf(mode.value)
    mode.value = modes[(index + 1) % modes.length]
    preference.value = mode.value
  }

  function setPreference (pref: ThemePreference) {
    lock()
    if (isAccessibilityTheme(String(pref))) {
      preference.value = pref
    } else if (pref === 'system' || pref === 'light' || pref === 'dark') {
      mode.value = pref
      preference.value = pref
    } else if (isValidPalette(pref)) {
      palette.value = pref
      preference.value = mode.value
    } else {
      preference.value = pref
    }
  }

  function setMode (next: ModePreference) {
    lock()
    mode.value = next
    preference.value = next
  }

  function setPalette (next: Palette) {
    lock()
    palette.value = next
    if (isAccessibilityTheme(String(preference.value))) {
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
    isDark,
    currentThemeId,
    isOverridden,
    reset,
  }
}
