// Framework
import { createContext, isNullOrUndefined, usePrefersReducedMotion, useStorage } from '@vuetify/v0'

// Utilities
import { shallowRef, toRef, watch } from 'vue'

// Types
import type { StorageContext } from '@vuetify/v0'
import type { App, Ref, ShallowRef } from 'vue'

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

export interface CodexSettings {
  lineWrap: boolean
  reduceMotion: 'system' | 'on' | 'off'
  packageManager: PackageManager
}

export interface UseSettingsReturn {
  isOpen: ShallowRef<boolean>
  lineWrap: ShallowRef<boolean>
  reduceMotion: ShallowRef<CodexSettings['reduceMotion']>
  packageManager: ShallowRef<CodexSettings['packageManager']>
  prefersReducedMotion: Readonly<Ref<boolean>>
  hasChanges: Readonly<Ref<boolean>>
  open: () => void
  close: () => void
  toggle: () => void
  reset: () => void
}

const DEFAULTS: CodexSettings = {
  lineWrap: false,
  reduceMotion: 'system',
  packageManager: 'pnpm',
}

// Create context
const [useSettingsContext, provideSettingsContext] = createContext<UseSettingsReturn>('codex:settings')

/** Load a setting from storage into a ref */
function load<T> (
  storage: StorageContext,
  key: keyof CodexSettings,
  target: ShallowRef<T>,
) {
  const stored = storage.get<T>(key)
  if (!isNullOrUndefined(stored.value)) {
    target.value = stored.value
  }
}

/**
 * Creates a new settings context instance.
 * Called once during app initialization via `provideSettings`.
 */
function createSettingsContext (): UseSettingsReturn {
  const storage = useStorage()
  const { matches: systemReducedMotion } = usePrefersReducedMotion()

  // Reactive state
  const isOpen = shallowRef(false)
  const lineWrap = shallowRef(DEFAULTS.lineWrap)
  const reduceMotion = shallowRef<CodexSettings['reduceMotion']>(DEFAULTS.reduceMotion)
  const packageManager = shallowRef<CodexSettings['packageManager']>(DEFAULTS.packageManager)

  // Load stored preferences
  load(storage, 'lineWrap', lineWrap)
  load(storage, 'reduceMotion', reduceMotion)
  load(storage, 'packageManager', packageManager)

  // Persist on change
  const settings = { lineWrap, reduceMotion, packageManager }
  for (const [key, value] of Object.entries(settings)) {
    watch(value, v => storage.set(key, v))
  }

  // Effective reduced motion based on setting + system preference
  const prefersReducedMotion = toRef(() => {
    if (reduceMotion.value === 'system') return systemReducedMotion.value
    return reduceMotion.value === 'on'
  })

  // Check if any setting differs from defaults
  const hasChanges = toRef(() => (
    lineWrap.value !== DEFAULTS.lineWrap
    || reduceMotion.value !== DEFAULTS.reduceMotion
    || packageManager.value !== DEFAULTS.packageManager
  ))

  function open () {
    isOpen.value = true
  }

  function close () {
    isOpen.value = false
  }

  function toggle () {
    isOpen.value = !isOpen.value
  }

  function reset () {
    lineWrap.value = DEFAULTS.lineWrap
    reduceMotion.value = DEFAULTS.reduceMotion
    packageManager.value = DEFAULTS.packageManager
  }

  return {
    isOpen,
    lineWrap,
    reduceMotion,
    packageManager,
    prefersReducedMotion,
    hasChanges,
    open,
    close,
    toggle,
    reset,
  }
}

/**
 * Provide the settings context at app level.
 * Call once during app initialization.
 */
export function provideSettings (app?: App): UseSettingsReturn {
  const context = createSettingsContext()
  return provideSettingsContext(context, app)
}

/**
 * Access the settings context.
 * Must be called within a component where settings have been provided.
 */
export function useSettings (): UseSettingsReturn {
  return useSettingsContext()
}
