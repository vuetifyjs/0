// Framework
import { usePrefersDark } from '@vuetify/v0'

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
  type ThemeToggleContext,
} from '@/composables/useThemeToggle'

// Utilities
import { type Ref, shallowRef, toRef, watch } from 'vue'

export interface ExampleThemeOptions {
  /** Palette to keep while following the page. Omit to track the page palette. */
  palette?: Palette
}

export interface ExampleThemeContext extends ThemeToggleContext {
  currentThemeId: Ref<string>
  isOverridden: Ref<boolean>
  reset: () => void
}

/**
 * Per-example theme controller. Spreads the page toggle and overrides writes
 * so mode/palette/a11y changes stay on the preview.
 */
export function createExampleTheme (options: ExampleThemeOptions = {}): ExampleThemeContext {
  const page = useThemeToggle()
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

  const currentThemeId = toRef(() => {
    const pref = String(preference.value)
    if (
      !isAccessibilityTheme(pref)
      && pref !== 'system'
      && pref !== 'light'
      && pref !== 'dark'
      && !isValidPalette(pref)
    ) {
      return pref
    }

    return resolveThemeId(mode.value, palette.value, preference.value, prefersDark.value)
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

  function toggle () {
    const modes: ModePreference[] = ['system', 'light', 'dark']
    setMode(modes[(modes.indexOf(mode.value) + 1) % modes.length])
  }

  return {
    ...page,
    mode,
    palette,
    preference,
    isAccessibilityActive: toRef(() => isAccessibilityTheme(String(preference.value))),
    icon: toRef(() => {
      if (isAccessibilityTheme(String(preference.value))) {
        return `theme-${preference.value}`
      }
      return PALETTE_ICONS[palette.value] ?? 'theme-custom'
    }),
    title: toRef(() => {
      if (isAccessibilityTheme(String(preference.value))) {
        return `Theme: ${preference.value}`
      }
      return `Theme: ${PALETTE_LABELS[palette.value] ?? 'Custom'}`
    }),
    isDark: toRef(() => {
      if (isAccessibilityTheme(String(preference.value))) {
        return page.theme.get(preference.value)?.dark ?? page.isDark.value
      }
      return mode.value === 'system' ? prefersDark.value : mode.value === 'dark'
    }),
    currentThemeId,
    isOverridden: toRef(() => override.value),
    setMode,
    setPalette,
    setPreference,
    toggle,
    reset,
  }
}
