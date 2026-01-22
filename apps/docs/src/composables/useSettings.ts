// Framework
import { createContext, createPlugin, usePrefersReducedMotion, useStorage } from '@vuetify/v0'
import { IN_BROWSER } from '@vuetify/v0/constants'
import { isNullOrUndefined } from '@vuetify/v0/utilities'

// Utilities
import { nextTick, shallowRef, toRef, watch } from 'vue'

// Types
import type { UseStorageReturn } from '@vuetify/v0'
import type { Ref, ShallowRef } from 'vue'

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

export interface DocSettings {
  lineWrap: boolean
  reduceMotion: 'system' | 'on' | 'off'
  packageManager: PackageManager
  showInlineApi: boolean
  showSkillFilter: boolean
  showThemeToggle: boolean
  showSocialLinks: boolean
  collapsibleNav: boolean
  showDotGrid: boolean
  showMeshTransition: boolean
  showBgGlass: boolean
}

export interface SettingsContext {
  isOpen: ShallowRef<boolean>
  lineWrap: ShallowRef<boolean>
  reduceMotion: ShallowRef<DocSettings['reduceMotion']>
  packageManager: ShallowRef<DocSettings['packageManager']>
  prefersReducedMotion: Ref<boolean>
  showInlineApi: ShallowRef<boolean>
  showSkillFilter: ShallowRef<boolean>
  showThemeToggle: ShallowRef<boolean>
  showSocialLinks: ShallowRef<boolean>
  collapsibleNav: ShallowRef<boolean>
  showDotGrid: ShallowRef<boolean>
  showMeshTransition: ShallowRef<boolean>
  showBgGlass: ShallowRef<boolean>
  hasChanges: ShallowRef<boolean>
  open: () => void
  close: () => void
  toggle: () => void
  reset: () => void
}

const DEFAULTS: DocSettings = {
  lineWrap: false,
  reduceMotion: 'system',
  packageManager: 'pnpm',
  showInlineApi: true,
  showSkillFilter: true,
  showThemeToggle: true,
  showSocialLinks: true,
  collapsibleNav: true,
  showDotGrid: true,
  showMeshTransition: true,
  showBgGlass: true,
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
  const parsed = stored ? JSON.parse(stored) : null
  const setting: DocSettings['reduceMotion'] = parsed === 'system' || parsed === 'on' || parsed === 'off' ? parsed : 'system'

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
  const showInlineApi = shallowRef(DEFAULTS.showInlineApi)
  const showSkillFilter = shallowRef(DEFAULTS.showSkillFilter)
  const showThemeToggle = shallowRef(DEFAULTS.showThemeToggle)
  const showSocialLinks = shallowRef(DEFAULTS.showSocialLinks)
  const collapsibleNav = shallowRef(DEFAULTS.collapsibleNav)
  const showDotGrid = shallowRef(DEFAULTS.showDotGrid)
  const showMeshTransition = shallowRef(DEFAULTS.showMeshTransition)
  const showBgGlass = shallowRef(DEFAULTS.showBgGlass)

  // Load stored preferences
  loadSetting(storage, 'lineWrap', lineWrap)
  loadSetting(storage, 'reduceMotion', reduceMotion)
  loadSetting(storage, 'packageManager', packageManager)
  loadSetting(storage, 'showInlineApi', showInlineApi)
  loadSetting(storage, 'showSkillFilter', showSkillFilter)
  loadSetting(storage, 'showThemeToggle', showThemeToggle)
  loadSetting(storage, 'showSocialLinks', showSocialLinks)
  loadSetting(storage, 'collapsibleNav', collapsibleNav)
  loadSetting(storage, 'showDotGrid', showDotGrid)
  loadSetting(storage, 'showMeshTransition', showMeshTransition)
  loadSetting(storage, 'showBgGlass', showBgGlass)

  // Persist on change
  const settings = { lineWrap, reduceMotion, packageManager, showInlineApi, showSkillFilter, showThemeToggle, showSocialLinks, collapsibleNav, showDotGrid, showMeshTransition, showBgGlass }
  for (const [key, ref] of Object.entries(settings)) {
    watch(ref, val => storage.set(key, val))
  }

  // Computed effective reduced motion based on setting
  const prefersReducedMotion = toRef(() => {
    if (reduceMotion.value === 'system') return systemReducedMotion.value
    return reduceMotion.value === 'on'
  })

  // Check if any setting differs from defaults
  const hasChanges = toRef(() => (
    lineWrap.value !== DEFAULTS.lineWrap ||
    reduceMotion.value !== DEFAULTS.reduceMotion ||
    packageManager.value !== DEFAULTS.packageManager ||
    showInlineApi.value !== DEFAULTS.showInlineApi ||
    showSkillFilter.value !== DEFAULTS.showSkillFilter ||
    showThemeToggle.value !== DEFAULTS.showThemeToggle ||
    showSocialLinks.value !== DEFAULTS.showSocialLinks ||
    collapsibleNav.value !== DEFAULTS.collapsibleNav ||
    showDotGrid.value !== DEFAULTS.showDotGrid ||
    showMeshTransition.value !== DEFAULTS.showMeshTransition ||
    showBgGlass.value !== DEFAULTS.showBgGlass
  ))

  // Track trigger element for focus restoration
  const triggerRef = shallowRef<HTMLElement | null>(null)

  function open () {
    if (IN_BROWSER) {
      triggerRef.value = document.activeElement as HTMLElement | null
    }
    isOpen.value = true
  }

  function close () {
    isOpen.value = false
    nextTick(() => {
      triggerRef.value?.focus()
      triggerRef.value = null
    })
  }

  function toggle () {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  function reset () {
    lineWrap.value = DEFAULTS.lineWrap
    reduceMotion.value = DEFAULTS.reduceMotion
    packageManager.value = DEFAULTS.packageManager
    showInlineApi.value = DEFAULTS.showInlineApi
    showSkillFilter.value = DEFAULTS.showSkillFilter
    showThemeToggle.value = DEFAULTS.showThemeToggle
    showSocialLinks.value = DEFAULTS.showSocialLinks
    collapsibleNav.value = DEFAULTS.collapsibleNav
    showDotGrid.value = DEFAULTS.showDotGrid
    showMeshTransition.value = DEFAULTS.showMeshTransition
    showBgGlass.value = DEFAULTS.showBgGlass
  }

  return {
    isOpen,
    lineWrap,
    reduceMotion,
    packageManager,
    prefersReducedMotion,
    showInlineApi,
    showSkillFilter,
    showThemeToggle,
    showSocialLinks,
    collapsibleNav,
    showDotGrid,
    showMeshTransition,
    showBgGlass,
    hasChanges,
    open,
    close,
    toggle,
    reset,
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
