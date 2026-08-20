// Framework
import { createContext } from '@vuetify/v0'
import { IN_BROWSER } from '@vuetify/v0/constants'

// Composables
import { useSettings } from '@/composables/useSettings'

// Utilities
import { filterNav } from '@/utilities/nav'
import { toCamel } from '@/utilities/strings'
import { computed, shallowRef, toRef, toValue, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Types
import type { NavItem, NavItemLink } from '@/stores/app'
import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

// =============================================================================
// Constants
// =============================================================================

const STORAGE_KEY = 'v0:docs:features'

// =============================================================================
// Types
// =============================================================================

export interface NavConfigContext {
  /** Flat mode - all sections expanded, no collapse buttons */
  flatMode: Readonly<Ref<boolean>>
  /** Active features filter (from URL or sessionStorage) */
  activeFeatures: ShallowRef<string[] | null>
  /** Nav filtered by active features (or original if no filter) */
  configuredNav: ComputedRef<NavItem[]>
  /** Clear feature filter and show all */
  clearFilter: () => void
}

const [useNavConfigContext, provideNavConfigContext] = createContext<NavConfigContext>('docs:nav-config')

export { useNavConfigContext }

// =============================================================================
// Feature matching
// =============================================================================

/**
 * Extract feature name from nav item path
 * e.g., "/composables/foundation/create-context" -> "createContext"
 */
function getFeatureName (to: string): string {
  const segments = to.split('/').filter(Boolean)
  const lastSegment = segments.at(-1) || ''
  return toCamel(lastSegment)
}

/**
 * Check if a nav item matches any of the requested features
 * Case-insensitive to handle both createContext and Atom/Dialog
 */
function matchesFeature (item: NavItemLink, features: Set<string>): boolean {
  const featureName = getFeatureName(item.to).toLowerCase()
  return features.has(featureName)
}

// =============================================================================
// Composable
// =============================================================================

export function createNavConfig (nav: MaybeRefOrGetter<NavItem[]>) {
  const route = useRoute()
  const router = useRouter()
  const { collapsibleNav } = useSettings()

  // Active features - persisted to sessionStorage
  const activeFeatures = shallowRef<string[] | null>(null)

  // Load from sessionStorage on init (client-side only)
  if (IN_BROWSER) {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        activeFeatures.value = JSON.parse(stored)
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Watch URL for features param - overwrites stored value
  watch(() => route.query.features, param => {
    if (!param || typeof param !== 'string') return

    const features = param.split(',').map(f => f.trim()).filter(Boolean)
    if (features.length > 0) {
      activeFeatures.value = features
      // Persist to sessionStorage
      if (IN_BROWSER) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(features))
      }
      // Remove from URL to keep it clean
      const query = { ...route.query }
      delete query.features
      router.replace({ query })
    }
  }, { immediate: true })

  // Flat mode when collapsible setting is off
  const flatMode = toRef(() => !collapsibleNav.value)

  // Filter nav by active features (case-insensitive)
  const configuredNav = computed(() => {
    const items = toValue(nav)
    const features = activeFeatures.value
    if (!features) return items
    const set = new Set(features.map(f => f.toLowerCase()))
    return filterNav(items, item => matchesFeature(item, set))
  })

  function clearFilter () {
    activeFeatures.value = null
    if (IN_BROWSER) {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  const context: NavConfigContext = {
    flatMode,
    activeFeatures,
    configuredNav,
    clearFilter,
  }

  return {
    ...context,
    provide: () => provideNavConfigContext(context),
  }
}
