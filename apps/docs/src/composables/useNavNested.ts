// Framework
import { createContext, createNested } from '@vuetify/v0'

// Utilities
import { nextTick, onMounted, shallowRef, toValue, watch } from 'vue'
import { useRoute } from 'vue-router'

// Types
import type { NavItem, NavItemCategory, NavItemLink } from '@/stores/app'
import type { ID, NestedContext, NestedRegistration, NestedTicket } from '@vuetify/v0'
import type { MaybeRefOrGetter } from 'vue'

// =============================================================================
// Type Guards
// =============================================================================

export function isNavItemLink (item: NavItem): item is NavItemLink {
  return 'to' in item && typeof item.to === 'string'
}

export function isNavItemCategory (item: NavItem): item is NavItemCategory {
  return 'children' in item && Array.isArray(item.children) && !('to' in item)
}

// =============================================================================
// Transformation
// =============================================================================

type NavNestedValue = NavItemLink | NavItemCategory

/**
 * Transform NavItem[] to NestedRegistration[] for createNested
 * Uses route path as ID for links, synthetic ID for categories
 */
export function navToNestedItems (
  items: NavItem[],
  parentId?: string,
): NestedRegistration<NavNestedValue>[] {
  const result: NestedRegistration<NavNestedValue>[] = []
  let categoryIndex = 0

  for (const item of items) {
    // Skip dividers
    if ('divider' in item) continue

    // Determine ID: route path for links, synthetic for categories
    const id = isNavItemLink(item)
      ? item.to
      : `category-${parentId ?? 'root'}-${categoryIndex++}`

    // Recursively transform children
    const children = 'children' in item && item.children
      ? navToNestedItems(item.children, id)
      : undefined

    result.push({
      id,
      value: item as NavNestedValue,
      parentId,
      children,
    })
  }

  return result
}

// =============================================================================
// Context
// =============================================================================

export interface NavNestedContext {
  nested: NestedContext<NestedTicket<NavNestedValue>>
  getValue: (id: ID) => NavNestedValue | undefined
  /** True during initial state restoration (animations should be disabled) */
  isRestoring: Readonly<ReturnType<typeof shallowRef<boolean>>>
  /** True after initial state restoration + animations complete (safe to scroll on expand) */
  scrollEnabled: Readonly<ReturnType<typeof shallowRef<boolean>>>
}

const [useNavNestedContext, provideNavNestedContext] = createContext<NavNestedContext>('docs:nav-nested')

export { useNavNestedContext }

/**
 * Create nav nested state and provide to descendants
 * Handles route-based auto-expansion
 */
export function createNavNested (nav: MaybeRefOrGetter<NavItem[]>) {
  const route = useRoute()
  const nested = createNested<NestedTicket<NavNestedValue>>({ open: 'multiple' })
  const isRestoring = shallowRef(true)
  const scrollEnabled = shallowRef(false)

  // SSR-safe: Build tree structure on server and client
  // Preserve open state across nav changes (e.g., filtering)
  watch(() => toValue(nav), items => {
    const savedOpenIds = [...nested.openedIds]
    nested.clear()
    nested.onboard(navToNestedItems(items))
    // Restore any open IDs that still exist in the new tree
    if (savedOpenIds.length > 0) {
      nested.open(savedOpenIds.filter(id => nested.has(id)))
    }
  }, { immediate: true })

  // Client-only: Reveal current page's section on route change
  onMounted(async () => {
    watch(() => route.path, path => {
      nested.reveal(path)
      // If current page has children, open it too (reveal only opens ancestors)
      if (nested.children.has(path)) {
        nested.open([path])
      }
    }, { immediate: true })

    // Wait for DOM to reconcile before enabling animations
    await nextTick()
    isRestoring.value = false

    // Enable scroll after animations complete (200ms expand + buffer)
    setTimeout(() => {
      scrollEnabled.value = true
    }, 350)
  })

  // Helper to get the NavItem value
  function getValue (id: ID): NavNestedValue | undefined {
    return nested.get(id)?.value
  }

  const context: NavNestedContext = {
    nested,
    getValue,
    isRestoring,
    scrollEnabled,
  }

  return {
    ...context,
    provide: () => provideNavNestedContext(context),
  }
}
