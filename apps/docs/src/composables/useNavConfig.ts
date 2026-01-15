// Framework
import { createContext } from '@vuetify/v0'

// Composables
import { useSettings } from '@/composables/useSettings'

// Utilities
import { computed, toValue } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Types
import type { NavItem, NavItemLink } from '@/stores/app'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

// =============================================================================
// Types
// =============================================================================

export interface NavConfigContext {
  /** Flat mode - all sections expanded, no collapse buttons */
  flatMode: ComputedRef<boolean>
  /** Features from URL query param */
  urlFeatures: ComputedRef<string[] | null>
  /** Nav filtered by URL features (or original if no filter) */
  configuredNav: ComputedRef<NavItem[]>
  /** Clear URL filter and show all */
  clearUrlFilter: () => void
}

const [useNavConfigContext, provideNavConfigContext] = createContext<NavConfigContext>('docs:nav-config')

export { useNavConfigContext }

// =============================================================================
// Feature matching
// =============================================================================

/**
 * Convert kebab-case path segment to camelCase feature name
 * e.g., "create-context" -> "createContext"
 */
function kebabToCamel (str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

/**
 * Extract feature name from nav item path
 * e.g., "/composables/foundation/create-context" -> "createContext"
 */
function getFeatureName (to: string): string {
  const segments = to.split('/').filter(Boolean)
  const lastSegment = segments.at(-1) || ''
  return kebabToCamel(lastSegment)
}

/**
 * Check if a nav item matches any of the requested features
 * Case-insensitive to handle both createContext and Atom/Dialog
 */
function matchesFeature (item: NavItemLink, features: Set<string>): boolean {
  const featureName = getFeatureName(item.to).toLowerCase()
  return features.has(featureName)
}

/**
 * Filter nav items to only include those matching requested features
 * Preserves category structure if any children match
 */
function filterNavByFeatures (items: NavItem[], features: Set<string>): NavItem[] {
  const filtered = items
    .map(item => {
      if ('divider' in item) return item
      if ('children' in item && item.children) {
        const childFiltered = filterNavByFeatures(item.children, features)
        if (childFiltered.length === 0) return null
        return { ...item, children: childFiltered }
      }
      if ('to' in item && !matchesFeature(item, features)) return null
      return item
    })
    .filter((item): item is NavItem => item !== null)

  // Remove orphaned dividers
  return filtered.filter((item, i, arr) => {
    if (!('divider' in item)) return true
    const prev = arr[i - 1]
    const next = arr[i + 1]
    if (!prev || !next) return false
    if ('divider' in prev || 'divider' in next) return false
    return true
  })
}

// =============================================================================
// Composable
// =============================================================================

export function createNavConfig (nav: MaybeRefOrGetter<NavItem[]>) {
  const route = useRoute()
  const router = useRouter()
  const { collapsibleNav } = useSettings()

  // Parse features from URL query param
  const urlFeatures = computed<string[] | null>(() => {
    const param = route.query.features
    if (!param || typeof param !== 'string') return null
    const features = param.split(',').map(f => f.trim()).filter(Boolean)
    return features.length > 0 ? features : null
  })

  // Flat mode when collapsible is off OR URL filtering is active
  const flatMode = computed(() => {
    if (urlFeatures.value) return true
    return !collapsibleNav.value
  })

  // Filter nav by URL features (case-insensitive)
  const configuredNav = computed(() => {
    const items = toValue(nav)
    const features = urlFeatures.value
    if (!features) return items
    return filterNavByFeatures(items, new Set(features.map(f => f.toLowerCase())))
  })

  function clearUrlFilter () {
    const query = { ...route.query }
    delete query.features
    router.replace({ query })
  }

  const context: NavConfigContext = {
    flatMode,
    urlFeatures,
    configuredNav,
    clearUrlFilter,
  }

  return {
    ...context,
    provide: () => provideNavConfigContext(context),
  }
}
