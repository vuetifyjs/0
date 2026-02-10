/**
 * @module createBreadcrumbs
 *
 * @remarks
 * Breadcrumb navigation composable built on createSingle.
 *
 * Key features:
 * - Extends createSingle for consistent registry patterns
 * - Navigation methods: first, prev, select (with truncation)
 * - Computed visible tickets with ellipsis collapse
 * - Trinity pattern for dependency injection
 *
 * Inheritance chain: createRegistry → createSelection → createSingle → createBreadcrumbs
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createSingle } from '#v0/composables/createSingle'

// Utilities
import { computed, toRef, toValue } from 'vue'

// Types
import type { SingleContext, SingleContextOptions, SingleOptions, SingleTicket, SingleTicketInput } from '#v0/composables/createSingle'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { App, ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

/**
 * Input type for breadcrumb tickets.
 */
export interface BreadcrumbTicketInput<V = unknown> extends SingleTicketInput<V> {
  /** Display text for the breadcrumb */
  text: string
}

/**
 * Output type for breadcrumb tickets.
 */
export type BreadcrumbTicket<Z extends BreadcrumbTicketInput = BreadcrumbTicketInput> = SingleTicket<Z>

/**
 * Rendered ticket for display (with collapse support).
 */
export type BreadcrumbRenderTicket<V = unknown> =
  | { type: 'crumb', value: BreadcrumbTicket<BreadcrumbTicketInput<V>>, index: number }
  | { type: 'ellipsis', value: string, collapsed: BreadcrumbTicket<BreadcrumbTicketInput<V>>[] }

/**
 * Context returned by createBreadcrumbs.
 */
export interface BreadcrumbsContext<
  Z extends BreadcrumbTicketInput = BreadcrumbTicketInput,
  E extends BreadcrumbTicket<Z> = BreadcrumbTicket<Z>,
> extends Omit<SingleContext<Z, E>, 'select'> {
  /** Number of items in the path */
  depth: Readonly<Ref<number>>
  /** Whether at root level (depth <= 1) */
  isRoot: Readonly<Ref<boolean>>
  /** Whether path is empty (depth === 0) */
  isEmpty: Readonly<Ref<boolean>>
  /** Visible tickets with ellipsis for rendering */
  tickets: ComputedRef<BreadcrumbRenderTicket<Z['value']>[]>
  /** Ellipsis character, or false if disabled */
  ellipsis: string | false
  /** Navigate to root (first item) */
  first: () => void
  /** Navigate up one level (remove last item) */
  prev: () => void
  /** Navigate to specific item by id (truncates path) */
  select: (id: ID) => void
}

export interface BreadcrumbsOptions extends SingleOptions {
  /** Maximum visible items before collapsing. @default Infinity */
  visible?: MaybeRefOrGetter<number>
  /** Ellipsis character. @default '…' */
  ellipsis?: string | false
  /** Which end to anchor when collapsing. 'end' keeps last items visible, 'start' keeps first items visible. @default 'end' */
  anchor?: MaybeRefOrGetter<'start' | 'end'>
}

export interface BreadcrumbsContextOptions extends SingleContextOptions {
  /** Maximum visible items before collapsing. @default Infinity */
  visible?: MaybeRefOrGetter<number>
  /** Ellipsis character. @default '…' */
  ellipsis?: string | false
  /** Which end to anchor when collapsing. 'end' keeps last items visible, 'start' keeps first items visible. @default 'end' */
  anchor?: MaybeRefOrGetter<'start' | 'end'>
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
 * const breadcrumbs = createBreadcrumbs()
 *
 * breadcrumbs.register({ text: 'Home' })
 * breadcrumbs.register({ text: 'Products' })
 * breadcrumbs.register({ text: 'Electronics' })
 *
 * breadcrumbs.tickets.value // [{ type: 'crumb', ... }, ...]
 *
 * // Navigate back
 * breadcrumbs.prev() // removes Electronics
 * breadcrumbs.first() // truncates to Home
 * ```
 */
export function createBreadcrumbs<
  Z extends BreadcrumbTicketInput = BreadcrumbTicketInput,
  E extends BreadcrumbTicket<Z> = BreadcrumbTicket<Z>,
  R extends BreadcrumbsContext<Z, E> = BreadcrumbsContext<Z, E>,
> (_options: BreadcrumbsOptions = {}): R {
  const {
    visible: _visible = Infinity,
    ellipsis = '…',
    anchor: _anchor = 'end',
    ...singleOptions
  } = _options

  const single = createSingle<Z, E>({ ...singleOptions, reactive: true, enroll: true })

  // Derived state
  const depth = toRef(() => single.size)
  const isRoot = toRef(() => depth.value <= 1)
  const isEmpty = toRef(() => depth.value === 0)

  /**
   * Select an item and truncate everything after it.
   */
  function select (id: ID) {
    const ticket = single.get(id)
    if (!ticket) return

    const index = ticket.index
    const items = single.values()

    // Offboard all items after the selected one
    const toRemove = items
      .filter(item => item.index > index)
      .map(item => item.id)

    if (toRemove.length > 0) {
      single.offboard(toRemove)
    }

    single.select(id)
  }

  /**
   * Navigate to root (first item).
   */
  function first () {
    const root = single.seek('first')
    if (root) select(root.id)
  }

  /**
   * Navigate up one level (select previous item, removing current).
   */
  function prev () {
    if (single.size <= 1) return

    const currentIndex = single.selectedIndex.value
    if (currentIndex <= 0) return

    const prevId = single.lookup(currentIndex - 1)
    if (prevId) select(prevId)
  }

  /**
   * Computed tickets for rendering with collapse support.
   */
  const tickets = computed<BreadcrumbRenderTicket<Z['value']>[]>(() => {
    const visible = toValue(_visible)
    const anchor = toValue(_anchor)
    const items = single.values()

    if (items.length === 0) return []
    if (visible <= 0) return []
    if (visible >= items.length || ellipsis === false) {
      return items.map((value, index) => ({ type: 'crumb' as const, value, index }))
    }

    if (anchor === 'start') {
      // Keep first items visible, collapse from end
      // visible=4 with 6 items: [0] [1] [2] [...] [5]
      const headCount = Math.max(1, visible - 2)
      const collapseStart = headCount
      const collapseEnd = items.length - 1

      const head: BreadcrumbRenderTicket<Z['value']>[] = items
        .slice(0, headCount)
        .map((value, i) => ({ type: 'crumb' as const, value, index: i }))

      const middle: BreadcrumbRenderTicket<Z['value']>[] = collapseEnd > collapseStart
        ? [{ type: 'ellipsis', value: ellipsis, collapsed: items.slice(collapseStart, collapseEnd) }]
        : []

      const tail: BreadcrumbRenderTicket<Z['value']> = { type: 'crumb', value: items.at(-1)!, index: items.length - 1 }

      return [...head, ...middle, tail]
    }

    // anchor === 'end': keep last items visible, collapse from start (default)
    // visible=4 with 6 items: [0] [...] [4] [5]
    const tailCount = Math.max(1, visible - 2)
    const collapseStart = 1
    const collapseEnd = items.length - tailCount

    const head: BreadcrumbRenderTicket<Z['value']> = { type: 'crumb', value: items[0]!, index: 0 }

    const middle: BreadcrumbRenderTicket<Z['value']>[] = collapseEnd > collapseStart
      ? [{ type: 'ellipsis', value: ellipsis, collapsed: items.slice(collapseStart, collapseEnd) }]
      : []

    const startIndex = Math.max(1, collapseEnd)
    const tail: BreadcrumbRenderTicket<Z['value']>[] = items
      .slice(startIndex)
      .map((value, i) => ({ type: 'crumb' as const, value, index: startIndex + i }))

    return [head, ...middle, ...tail]
  })

  return {
    ...single,
    select,
    first,
    prev,
    depth,
    isRoot,
    isEmpty,
    tickets,
    ellipsis,
    get size () {
      return single.size
    },
  } as R
}

/**
 * Creates a breadcrumbs context for dependency injection.
 *
 * @param options The options including namespace.
 * @returns A trinity: [useBreadcrumbs, provideBreadcrumbs, defaultContext]
 *
 * @example
 * ```ts
 * const [useBreadcrumbs, provideBreadcrumbs] = createBreadcrumbsContext()
 *
 * // Parent component
 * provideBreadcrumbs()
 *
 * // Child component
 * const breadcrumbs = useBreadcrumbs()
 * breadcrumbs.register({ text: 'Details' })
 * ```
 */
export function createBreadcrumbsContext<
  Z extends BreadcrumbTicketInput = BreadcrumbTicketInput,
  E extends BreadcrumbTicket<Z> = BreadcrumbTicket<Z>,
  R extends BreadcrumbsContext<Z, E> = BreadcrumbsContext<Z, E>,
> (_options: BreadcrumbsContextOptions = {}): ContextTrinity<R> {
  const { namespace = 'v0:breadcrumbs', ...options } = _options
  const [useBreadcrumbsContext, _provideBreadcrumbsContext] = createContext<R>(namespace)
  const context = createBreadcrumbs<Z, E, R>(options)

  function provideBreadcrumbsContext (_context: R = context, app?: App): R {
    return _provideBreadcrumbsContext(_context, app)
  }

  return createTrinity<R>(useBreadcrumbsContext, provideBreadcrumbsContext, context)
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
 *   import { useBreadcrumbs } from '@vuetify/v0'
 *
 *   const breadcrumbs = useBreadcrumbs()
 * </script>
 *
 * <template>
 *   <nav>
 *     <template v-for="ticket in breadcrumbs.tickets.value" :key="ticket.type === 'crumb' ? ticket.value.id : 'ellipsis'">
 *       <span v-if="ticket.type === 'ellipsis'">{{ ticket.value }}</span>
 *       <a v-else @click="breadcrumbs.select(ticket.value.id)">{{ ticket.value.text }}</a>
 *     </template>
 *   </nav>
 * </template>
 * ```
 */
export function useBreadcrumbs<
  Z extends BreadcrumbTicketInput = BreadcrumbTicketInput,
  E extends BreadcrumbTicket<Z> = BreadcrumbTicket<Z>,
  R extends BreadcrumbsContext<Z, E> = BreadcrumbsContext<Z, E>,
> (namespace = 'v0:breadcrumbs'): R {
  return useContext<R>(namespace)
}
