// Framework
import { usePrefersDark, useStorage, useTheme } from '@vuetify/v0'

// Utilities
import { type Ref, shallowRef, type ShallowRef, toRef, watch } from 'vue'

// Types
import type { UseThemeReturn } from '@vuetify/v0'

// Themes
import { themes, type ThemeId } from '@/themes'

const PREFERENCE_ORDER = [
  'system',
  'light',
  'dark',
  'high-contrast',
  'blackguard',
  'polaris',
  'nebula',
  'odyssey',
] as const

const PREFERENCE_ICONS: Record<string, string> = {
  'system': 'theme-system',
  'light': 'theme-light',
  'dark': 'theme-dark',
  'high-contrast': 'theme-high-contrast',
  'blackguard': 'theme-blackguard',
  'polaris': 'theme-polaris',
  'nebula': 'theme-nebula',
  'odyssey': 'theme-odyssey',
}

const PREFERENCE_LABELS: Record<string, string> = {
  'system': 'System',
  'light': 'Light',
  'dark': 'Dark',
  'high-contrast': 'High Contrast',
  'blackguard': 'Blackguard',
  'polaris': 'Polaris',
  'nebula': 'Nebula',
  'odyssey': 'Odyssey',
}

export type ThemePreference = typeof PREFERENCE_ORDER[number] | (string & {})

export interface UseThemeToggleReturn {
  theme: UseThemeReturn
  themes: typeof themes
  preference: ShallowRef<ThemePreference>
  icon: Ref<string>
  title: Ref<string>
  toggle: () => void
  setPreference: (pref: ThemePreference) => void
  isDark: UseThemeReturn['isDark']
}

// Shared singleton state - ensures all consumers see the same preference
const preference = shallowRef<ThemePreference>('system')

/**
 * Check if a preference is valid (preset or custom theme)
 */
function isValidPreference (pref: string | undefined): pref is ThemePreference {
  if (!pref) return false
  // Preset themes
  if ((PREFERENCE_ORDER as readonly string[]).includes(pref)) return true
  // Custom themes start with 'custom-'
  if (pref.startsWith('custom-')) return true
  return false
}
let initialized = false

export function useThemeToggle (): UseThemeToggleReturn {
  const theme = useTheme()
  const storage = useStorage()
  const { matches: prefersDark } = usePrefersDark()

  // Initialize once on first use
  if (!initialized) {
    initialized = true

    // Load stored preference (supports preset and custom themes)
    const storedPreference = storage.get<string>('theme')
    preference.value = isValidPreference(storedPreference.value)
      ? storedPreference.value
      : 'system'

    // Watch preference and system theme changes together
    // When preference is 'system', react to prefersDark changes
    watch(
      [preference, prefersDark],
      ([pref, isDark]) => {
        storage.set('theme', pref)
        // 'system' resolves to light/dark based on OS preference
        // All other preferences are actual theme names
        const actualTheme: ThemeId = pref === 'system'
          ? (isDark ? 'dark' : 'light')
          : pref
        theme.select(actualTheme)
      },
    )
  }

  const icon = toRef(() => PREFERENCE_ICONS[preference.value] ?? 'theme-custom')
  const title = toRef(() => `Theme: ${PREFERENCE_LABELS[preference.value] ?? 'Custom'}`)

  function toggle () {
    const currentIndex = PREFERENCE_ORDER.indexOf(preference.value)
    const nextIndex = (currentIndex + 1) % PREFERENCE_ORDER.length
    preference.value = PREFERENCE_ORDER[nextIndex]
  }

  function setPreference (pref: ThemePreference) {
    preference.value = pref
  }

  return {
    theme,
    themes,
    preference,
    icon,
    title,
    toggle,
    setPreference,
    isDark: theme.isDark,
  }
}
