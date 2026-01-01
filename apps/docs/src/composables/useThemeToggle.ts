// Framework
import { usePrefersDark, useStorage, useTheme } from '@vuetify/v0'

// Utilities
import { type Ref, shallowRef, type ShallowRef, toRef, watch } from 'vue'

// Types
import type { UseThemeReturn } from '@vuetify/v0'

const PREFERENCE_ORDER = ['system', 'light', 'dark', 'high-contrast'] as const
const PREFERENCE_ICONS: Record<string, string> = {
  'light': 'theme-light',
  'dark': 'theme-dark',
  'high-contrast': 'theme-high-contrast',
  'system': 'theme-system',
}
const PREFERENCE_LABELS: Record<string, string> = {
  'light': 'Light',
  'dark': 'Dark',
  'high-contrast': 'High Contrast',
  'system': 'System',
}

type ThemePreference = typeof PREFERENCE_ORDER[number]

export interface UseThemeToggleReturn {
  theme: UseThemeReturn
  preference: ShallowRef<ThemePreference>
  icon: Ref<string>
  title: Ref<string>
  toggle: () => void
  isDark: UseThemeReturn['isDark']
}

// Shared singleton state - ensures all consumers see the same preference
const preference = shallowRef<ThemePreference>('system')
let initialized = false

export function useThemeToggle (): UseThemeToggleReturn {
  const theme = useTheme()
  const storage = useStorage()
  const { matches: prefersDark } = usePrefersDark()

  // Initialize once on first use
  if (!initialized) {
    initialized = true

    // Load stored preference
    const storedPreference = storage.get<string>('theme')
    preference.value = PREFERENCE_ORDER.includes(storedPreference.value as ThemePreference)
      ? storedPreference.value as ThemePreference
      : 'system'

    // Watch preference and system theme changes together
    // When preference is 'system', react to prefersDark changes
    watch(
      [preference, prefersDark],
      ([pref, isDark]) => {
        storage.set('theme', pref)
        const actualTheme = pref === 'system' ? (isDark ? 'dark' : 'light') : pref
        theme.select(actualTheme)
      },
    )
  }

  const icon = toRef(() => PREFERENCE_ICONS[preference.value] ?? 'theme-system')
  const title = toRef(() => `Toggle Theme (${PREFERENCE_LABELS[preference.value] ?? 'System'})`)

  function toggle () {
    const currentIndex = PREFERENCE_ORDER.indexOf(preference.value)
    const nextIndex = (currentIndex + 1) % PREFERENCE_ORDER.length
    preference.value = PREFERENCE_ORDER[nextIndex]
  }

  return {
    theme,
    preference,
    icon,
    title,
    toggle,
    isDark: theme.isDark,
  }
}
