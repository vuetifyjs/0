// Framework
import { createContext, createPlugin, usePrefersReducedMotion, useStorage } from '@vuetify/v0'
import { IN_BROWSER } from '@vuetify/v0/constants'
import { isNullOrUndefined } from '@vuetify/v0/utilities'

// Utilities
import { shallowRef, toRef, watch } from 'vue'

// Types
import type { UseStorageReturn } from '@vuetify/v0'
import type { Ref, ShallowRef } from 'vue'

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

export interface DocSettings {
  lineWrap: boolean
  reduceMotion: 'system' | 'on' | 'off'
  packageManager: PackageManager
  showSkillFilter: boolean
  showThemeToggle: boolean
  showSocialLinks: boolean
}

export interface SettingsContext {
  isOpen: ShallowRef<boolean>
  lineWrap: ShallowRef<boolean>
  reduceMotion: ShallowRef<DocSettings['reduceMotion']>
  packageManager: ShallowRef<DocSettings['packageManager']>
  prefersReducedMotion: Ref<boolean>
  showSkillFilter: ShallowRef<boolean>
  showThemeToggle: ShallowRef<boolean>
  showSocialLinks: ShallowRef<boolean>
  open: () => void
  close: () => void
  toggle: () => void
}

const DEFAULTS: DocSettings = {
  lineWrap: false,
  reduceMotion: 'system',
  packageManager: 'pnpm',
  showSkillFilter: true,
  showThemeToggle: true,
  showSocialLinks: true,
}

// Create context
const [useSettingsContext, provideSettingsContext] = createContext<SettingsContext>('v0:docs:settings')

/**
 * Get reduced motion preference outside Vue component context.
 * Reads directly from localStorage for use in router scrollBehavior.
 */
export function getPrefersReducedMotion (): boolean {
  if (!IN_BROWSER) return false

  const stored = localStorage.getItem('v0:reduceMotion')
  const setting = stored ? JSON.parse(stored) as DocSettings['reduceMotion'] : 'system'

  if (setting === 'system') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return setting === 'on'
}

/** Load a setting from storage into a ref */
function loadSetting<T> (
  storage: UseStorageReturn,
  key: keyof DocSettings,
  ref: ShallowRef<T>,
) {
  const stored = storage.get<T>(key)
  if (!isNullOrUndefined(stored.value)) {
    ref.value = stored.value
  }
}

/**
 * Creates a new settings context instance.
 * Called once during app initialization.
 */
export function createSettingsContext (): SettingsContext {
  const storage = useStorage()
  const { matches: systemReducedMotion } = usePrefersReducedMotion()

  // Reactive state
  const isOpen = shallowRef(false)
  const lineWrap = shallowRef(DEFAULTS.lineWrap)
  const reduceMotion = shallowRef<DocSettings['reduceMotion']>(DEFAULTS.reduceMotion)
  const packageManager = shallowRef<DocSettings['packageManager']>(DEFAULTS.packageManager)
  const showSkillFilter = shallowRef(DEFAULTS.showSkillFilter)
  const showThemeToggle = shallowRef(DEFAULTS.showThemeToggle)
  const showSocialLinks = shallowRef(DEFAULTS.showSocialLinks)

  // Load stored preferences
  loadSetting(storage, 'lineWrap', lineWrap)
  loadSetting(storage, 'reduceMotion', reduceMotion)
  loadSetting(storage, 'packageManager', packageManager)
  loadSetting(storage, 'showSkillFilter', showSkillFilter)
  loadSetting(storage, 'showThemeToggle', showThemeToggle)
  loadSetting(storage, 'showSocialLinks', showSocialLinks)

  // Persist on change
  const settings = { lineWrap, reduceMotion, packageManager, showSkillFilter, showThemeToggle, showSocialLinks }
  for (const [key, ref] of Object.entries(settings)) {
    watch(ref, val => storage.set(key, val))
  }

  // Computed effective reduced motion based on setting
  const prefersReducedMotion = toRef(() => {
    if (reduceMotion.value === 'system') return systemReducedMotion.value
    return reduceMotion.value === 'on'
  })

  function open () {
    isOpen.value = true
  }

  function close () {
    isOpen.value = false
  }

  function toggle () {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    lineWrap,
    reduceMotion,
    packageManager,
    prefersReducedMotion,
    showSkillFilter,
    showThemeToggle,
    showSocialLinks,
    open,
    close,
    toggle,
  }
}

/**
 * Plugin to provide settings context at app level.
 */
export const SettingsPlugin = createPlugin({
  namespace: 'v0:docs:settings',
  provide: app => {
    const context = createSettingsContext()
    provideSettingsContext(context, app)
  },
})

/**
 * Access the settings context.
 * Must be called within a component where SettingsPlugin is installed.
 */
export function useSettings (): SettingsContext {
  return useSettingsContext()
}
