/**
 * @module createBreadcrumbs
 *
 * @remarks
 * Lightweight breadcrumb composable for hierarchical navigation.
 *
 * Key features:
 * - No registry overhead - just a path array
 * - Direct ref support for v-model compatibility
 * - Navigation methods: first, prev, select, push, pop
 * - Computed visible items with collapse/ellipsis
 * - Trinity pattern for dependency injection
 *
 * Unlike registry-based composables, breadcrumbs track a path array
 * making it efficient for deep hierarchies.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { computed, isRef, shallowRef, toValue } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App, ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'

export interface BreadcrumbItem {
  /** Arbitrary metadata */
  [key: string]: unknown
  /** Unique identifier */
  id: string | number
  /** Display text */
  text: string
  /** Optional href for anchor rendering */
  href?: string
  /** Optional icon */
  icon?: string
  /** Whether item is disabled */
  disabled?: boolean
}

export type BreadcrumbTicket =
  | { type: 'item', value: BreadcrumbItem, index: number }
  | { type: 'ellipsis', value: string, collapsed: BreadcrumbItem[] }

export interface BreadcrumbsContext {
  /** Current path (array of items from root to current) */
  path: ShallowRef<BreadcrumbItem[]>
  /** Current depth (0 = empty, 1 = root only) */
  depth: ComputedRef<number>
  /** Separator character */
  separator: string
  /** Ellipsis character, or false if disabled */
  ellipsis: string | false
  /** Visible breadcrumb items for rendering (with collapse support) */
  items: ComputedRef<BreadcrumbTicket[]>
  /** Current (last) item in the path */
  current: ComputedRef<BreadcrumbItem | undefined>
  /** Parent of current item */
  parent: ComputedRef<BreadcrumbItem | undefined>
  /** Root (first) item in the path */
  root: ComputedRef<BreadcrumbItem | undefined>
  /** Whether at root level (depth <= 1) */
  isRoot: ComputedRef<boolean>
  /** Whether path is empty */
  isEmpty: ComputedRef<boolean>
  /** Go to root (keep only first item) */
  first: () => void
  /** Go up one level */
  prev: () => void
  /** Navigate to specific item by index (truncates path) */
  select: (index: number) => void
  /** Push a new item onto the path */
  push: (item: BreadcrumbItem) => void
  /** Replace entire path */
  replace: (items: BreadcrumbItem[]) => void
  /** Pop the last item and return it */
  pop: () => BreadcrumbItem | undefined
}

export interface BreadcrumbsOptions {
  /** Initial path or ref for v-model. @default [] */
  path?: BreadcrumbItem[] | ShallowRef<BreadcrumbItem[]>
  /** Maximum visible items before collapsing middle items. @default 0 (no collapse) */
  visible?: MaybeRefOrGetter<number>
  /** Separator character. @default '/' */
  separator?: string
  /** Ellipsis character for collapsed items. @default '…' */
  ellipsis?: string | false
}

export interface BreadcrumbsContextOptions extends BreadcrumbsOptions {
  /** Namespace for dependency injection */
  namespace?: string
}

/**
 * Creates a breadcrumbs instance.
 *
 * @param options The options for the breadcrumbs instance.
 * @returns A breadcrumbs context with navigation methods.
 *
 * @example
 * ```ts
 * import { createBreadcrumbs } from '@vuetify/v0'
 *
 * // Basic usage
 * const breadcrumbs = createBreadcrumbs({
 *   path: [
 *     { id: 'home', text: 'Home', href: '/' },
 *     { id: 'products', text: 'Products', href: '/products' },
 *   ]
 * })
 *
 * breadcrumbs.push({ id: 'phones', text: 'Phones', href: '/products/phones' })
 * breadcrumbs.prev() // Go back to Products
 *
 * // With v-model (pass a ref)
 * const path = shallowRef([{ id: 'home', text: 'Home' }])
 * const breadcrumbs = createBreadcrumbs({ path })
 * // Mutating breadcrumbs.path or the passed ref syncs both
 * ```
 */
export function createBreadcrumbs (_options: BreadcrumbsOptions = {}): BreadcrumbsContext {
  const {
    path: _path = [],
    visible: _visible = 0,
    separator = '/',
    ellipsis = '…',
  } = _options

  const path: ShallowRef<BreadcrumbItem[]> = isRef(_path) ? _path : shallowRef(_path)

  const depth = computed(() => path.value.length)
  const isEmpty = computed(() => path.value.length === 0)
  const isRoot = computed(() => path.value.length <= 1)

  const current = computed(() => path.value.at(-1))
  const parent = computed(() => path.value.at(-2))
  const root = computed(() => path.value.at(0))

  function first () {
    if (path.value.length > 1) {
      path.value = path.value.slice(0, 1)
    }
  }

  function prev () {
    if (path.value.length > 1) {
      path.value = path.value.slice(0, -1)
    }
  }

  function select (index: number) {
    if (index < 0) {
      path.value = []
    } else if (index < path.value.length - 1) {
      path.value = path.value.slice(0, index + 1)
    }
  }

  function push (item: BreadcrumbItem) {
    path.value = [...path.value, item]
  }

  function replace (items: BreadcrumbItem[]) {
    path.value = items
  }

  function pop (): BreadcrumbItem | undefined {
    if (path.value.length === 0) return undefined
    const item = path.value.at(-1)
    path.value = path.value.slice(0, -1)
    return item
  }

  function toItem (item: BreadcrumbItem, index: number): BreadcrumbTicket {
    return { type: 'item', value: item, index }
  }

  function toEllipsis (collapsed: BreadcrumbItem[]): BreadcrumbTicket | false {
    return ellipsis === false ? false : { type: 'ellipsis', value: ellipsis, collapsed }
  }

  const items = computed<BreadcrumbTicket[]>(() => {
    const pathValue = path.value
    const visible = toValue(_visible)
    const count = pathValue.length

    // No collapse if visible is 0 or path fits within visible
    if (visible <= 0 || count <= visible) {
      return pathValue.map(toItem)
    }

    // Need at least 3 visible to show: first + ellipsis + last
    if (visible < 3) {
      return pathValue.map(toItem)
    }

    // Calculate how many items to show at start and end
    // Always show first item and last (visible - 2) items
    // Example: visible=4, count=6 → [0, ellipsis, 3, 4, 5]
    const endCount = visible - 2 // Reserve 1 for first, 1 for ellipsis
    const startIndex = count - endCount

    const firstItem = toItem(pathValue[0]!, 0)
    const collapsed = pathValue.slice(1, startIndex)
    const ellipsisTicket = toEllipsis(collapsed)
    const endItems = pathValue.slice(startIndex).map((item, i) => toItem(item, startIndex + i))

    if (ellipsisTicket === false) {
      return [firstItem, ...endItems]
    }

    return [firstItem, ellipsisTicket, ...endItems]
  })

  return {
    path,
    depth,
    separator,
    ellipsis,
    items,
    current,
    parent,
    root,
    isRoot,
    isEmpty,
    first,
    prev,
    select,
    push,
    replace,
    pop,
  }
}

/**
 * Creates a breadcrumbs context for dependency injection.
 *
 * @param options The options including namespace.
 * @returns A trinity: [useBreadcrumbs, provideBreadcrumbs, defaultContext]
 *
 * @example
 * ```ts
 * // With default namespace 'v0:breadcrumbs'
 * const [useBreadcrumbs, provideBreadcrumbsContext] = createBreadcrumbsContext({
 *   path: [{ id: 'home', text: 'Home' }]
 * })
 *
 * // Or with custom namespace
 * const [useBreadcrumbs, provideBreadcrumbsContext] = createBreadcrumbsContext({
 *   namespace: 'my-breadcrumbs',
 *   path: [{ id: 'home', text: 'Home' }]
 * })
 *
 * // Parent component
 * provideBreadcrumbsContext()
 *
 * // Child component
 * const breadcrumbs = useBreadcrumbs()
 * breadcrumbs.push({ id: 'page', text: 'Page' })
 * ```
 */
export function createBreadcrumbsContext (_options: BreadcrumbsContextOptions = {}): ContextTrinity<BreadcrumbsContext> {
  const { namespace = 'v0:breadcrumbs', ...options } = _options
  const [useBreadcrumbsContext, _provideBreadcrumbsContext] = createContext<BreadcrumbsContext>(namespace)
  const context = createBreadcrumbs(options)

  function provideBreadcrumbsContext (_context: BreadcrumbsContext = context, app?: App): BreadcrumbsContext {
    return _provideBreadcrumbsContext(_context, app)
  }

  return createTrinity<BreadcrumbsContext>(useBreadcrumbsContext, provideBreadcrumbsContext, context)
}

/**
 * Returns the current breadcrumbs instance from context.
 *
 * @param namespace The namespace. @default 'v0:breadcrumbs'
 * @returns The breadcrumbs context.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useBreadcrumbs } from '@vuetify/v0'
 *
 * const breadcrumbs = useBreadcrumbs()
 * </script>
 *
 * <template>
 *   <nav aria-label="Breadcrumb">
 *     <ol>
 *       <li v-for="item in breadcrumbs.items.value" :key="item.type === 'item' ? item.value.id : 'ellipsis'">
 *         <template v-if="item.type === 'item'">
 *           <a :href="item.value.href" @click.prevent="breadcrumbs.select(item.index)">
 *             {{ item.value.text }}
 *           </a>
 *         </template>
 *         <template v-else>
 *           <span>{{ item.value }}</span>
 *         </template>
 *       </li>
 *     </ol>
 *   </nav>
 * </template>
 * ```
 */
export function useBreadcrumbs (namespace = 'v0:breadcrumbs'): BreadcrumbsContext {
  return useContext<BreadcrumbsContext>(namespace)
}
