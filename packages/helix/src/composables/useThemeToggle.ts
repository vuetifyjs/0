// Framework
import { usePrefersDark, useStorage, useTheme } from '@vuetify/v0'

// Utilities
import { effectScope, shallowRef, toRef, watch } from 'vue'

// Types
import type { Ref, ShallowRef } from 'vue'

export type ThemeMode = 'system' | 'light' | 'dark'

export interface UseThemeToggleReturn {
  /** Current mode preference: system, light, or dark */
  mode: ShallowRef<ThemeMode>
  /** Whether the resolved theme is dark */
  isDark: Readonly<Ref<boolean>>
  /** Cycle through modes: system → light → dark → system */
  toggle: () => void
  /** Set a specific mode */
  setMode: (mode: ThemeMode) => void
}

const MODES: ThemeMode[] = ['system', 'light', 'dark']
const STORAGE_KEY = 'theme-mode'

// Shared singleton state
const mode = shallowRef<ThemeMode>('system')
const scope = effectScope(true)

let initialized = false

export function useThemeToggle (): UseThemeToggleReturn {
  const theme = useTheme()
  const storage = useStorage()
  const { matches: prefersDark } = usePrefersDark()

  if (!initialized) {
    initialized = true

    const stored = storage.get<string>(STORAGE_KEY)
    if (stored.value && (MODES as string[]).includes(stored.value)) {
      mode.value = stored.value as ThemeMode
    }

    scope.run(() => {
      watch(
        [mode, prefersDark],
        ([m, dark]) => {
          storage.set(STORAGE_KEY, m)

          const wantsDark = m === 'system' ? dark : m === 'dark'
          if (theme.isDark.value !== wantsDark) {
            theme.cycle()
          }
        },
        { immediate: true },
      )
    })
  }

  const isDark = toRef(() => theme.isDark.value)

  function toggle () {
    const index = MODES.indexOf(mode.value)
    mode.value = MODES[(index + 1) % MODES.length]!
  }

  function setMode (m: ThemeMode) {
    mode.value = m
  }

  return {
    mode,
    isDark,
    toggle,
    setMode,
  }
}
