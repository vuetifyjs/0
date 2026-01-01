// Framework
import { IN_BROWSER, useStorage, useTheme } from '@vuetify/v0'

// Utilities
import { onScopeDispose, type Ref, shallowRef, type ShallowRef, toRef, watch } from 'vue'

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

function getSystemTheme (): 'light' | 'dark' {
  if (!IN_BROWSER) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Shared singleton state - ensures all consumers see the same preference
const preference = shallowRef<ThemePreference>('system')
let initialized = false

export function useThemeToggle (): UseThemeToggleReturn {
  const theme = useTheme()
  const storage = useStorage()

  // Initialize once on first use
  if (!initialized) {
    initialized = true

    // Load stored preference
    const storedPreference = storage.get<string>('theme')
    preference.value = PREFERENCE_ORDER.includes(storedPreference.value as ThemePreference)
      ? storedPreference.value as ThemePreference
      : 'system'

    // Apply preference function
    function applyPreference (pref: ThemePreference) {
      const actualTheme = pref === 'system' ? getSystemTheme() : pref
      theme.select(actualTheme)
    }

    // When preference changes, save it and apply the theme
    watch(preference, pref => {
      storage.set('theme', pref)
      applyPreference(pref)
    })

    // Listen for system theme changes when preference is 'system'
    if (IN_BROWSER) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      function handleChange () {
        if (preference.value === 'system') {
          applyPreference('system')
        }
      }
      mediaQuery.addEventListener('change', handleChange)
      onScopeDispose(() => mediaQuery.removeEventListener('change', handleChange))
    }
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
