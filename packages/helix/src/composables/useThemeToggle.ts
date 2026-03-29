// Framework
import { IN_BROWSER, usePrefersDark, useStorage, useTheme } from '@vuetify/v0'

// Utilities
import { effectScope, shallowRef, toRef, watch } from 'vue'

// Types
import type { EffectScope, Ref, ShallowRef } from 'vue'

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

// Singleton state is lazily initialized inside the function
// to prevent SSR leaks across requests
let mode: ShallowRef<ThemeMode> | null = null
let scope: EffectScope | null = null
let initialized = false

function getState () {
  if (!mode) {
    mode = shallowRef<ThemeMode>('system')
    scope = effectScope(true)
  }
  return { mode: mode!, scope: scope! }
}

export function useThemeToggle (): UseThemeToggleReturn {
  if (!IN_BROWSER) {
    const localMode = shallowRef<ThemeMode>('system')
    return {
      mode: localMode,
      isDark: toRef(() => false),
      toggle () {},
      setMode () {},
    }
  }

  const { mode: singletonMode, scope: singletonScope } = getState()
  const theme = useTheme()
  const storage = useStorage()
  const { matches: prefersDark } = usePrefersDark()

  if (!initialized) {
    initialized = true

    const stored = storage.get<string>(STORAGE_KEY)
    if (stored.value && (MODES as string[]).includes(stored.value)) {
      singletonMode.value = stored.value as ThemeMode
    }

    singletonScope.run(() => {
      watch(
        [singletonMode, prefersDark],
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
    const index = MODES.indexOf(singletonMode.value)
    singletonMode.value = MODES[(index + 1) % MODES.length]!
  }

  function setMode (m: ThemeMode) {
    singletonMode.value = m
  }

  return {
    mode: singletonMode,
    isDark,
    toggle,
    setMode,
  }
}
