/**
 * @module PaginationRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/pagination
 *
 * @remarks
 * Root component for pagination controls that manages page state and provides context
 * to child components. Supports automatic calculation of visible page buttons based on
 * container width, or explicit totalVisible configuration.
 *
 * Built on createPaginationContext from createPagination. Provides navigation
 * methods (first, last, next, prev, select) and computed page ranges via slot props.
 *
 * Provides three contexts via dependency injection:
 * - `usePaginationRoot`: Core pagination state (page, length, navigation methods)
 * - `usePaginationItems`: Registry for page buttons and ellipses (used for width calculation)
 * - `usePaginationControls`: Registry for navigation buttons (first/prev/next/last)
 *
 * The dual registry architecture separates page items from navigation controls because
 * only page items contribute to the responsive visible count calculation. Navigation
 * buttons occupy reserved space that's subtracted from the available width.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createOverflow } from '#v0/composables/createOverflow'
  import { createPagination } from '#v0/composables/createPagination'
  import { createRegistry } from '#v0/composables/createRegistry'
  import { useLocale } from '#v0/composables/useLocale'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isElement, isNullOrUndefined, pxToNumber } from '#v0/utilities'
  import { computed, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { PaginationContext, PaginationTicket } from '#v0/composables/createPagination'
  import type { RegistryContext } from '#v0/composables/createRegistry'

  export const [usePaginationRoot, providePaginationRoot] = createContext<PaginationContext>()
  export const [usePaginationControls, providePaginationControls] = createContext<RegistryContext>({ suffix: 'controls' })
  export const [usePaginationItems, providePaginationItems] = createContext<RegistryContext>({ suffix: 'items' })

  export interface PaginationRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Total number of items */
    size?: number
    /**
     * Number of visible page buttons.
     * If undefined, auto-calculates based on container width.
     */
    totalVisible?: number
    /** Number of items per page */
    itemsPerPage?: number
    /** Ellipsis character */
    ellipsis?: string | false
  }

  export interface PaginationRootSlotProps {
    /** Current page (1-indexed) */
    page: number
    /** Total number of items */
    size: number
    /** Total number of pages */
    pages: number
    /** Items per page */
    itemsPerPage: number
    /** Visible page items for rendering */
    items: PaginationTicket[]
    /** Start index of items on current page (0-indexed) */
    pageStart: number
    /** End index of items on current page (exclusive) */
    pageStop: number
    /** Whether on first page */
    isFirst: boolean
    /** Whether on last page */
    isLast: boolean
    /** Go to first page */
    first: () => void
    /** Go to last page */
    last: () => void
    /** Go to next page */
    next: () => void
    /** Go to previous page */
    prev: () => void
    /** Go to specific page */
    select: (page: number) => void
    /** Attributes to bind to the root element */
    attrs: {
      'aria-label': string
      'role': 'navigation' | undefined
    }
  }
</script>

<script setup lang="ts" generic="T = unknown">
  defineOptions({ name: 'PaginationRoot' })

  defineSlots<{
    default: (props: PaginationRootSlotProps) => any
  }>()

  defineEmits<{
    /** Emitted when the pagination changes */
    'update:model-value': [value: T | T[]]
  }>()

  const {
    as = 'nav',
    renderless,
    namespace = 'v0:pagination',
    size = 1,
    totalVisible,
    itemsPerPage = 10,
    ellipsis = '...',
  } = defineProps<PaginationRootProps>()

  const page = defineModel<number>({ default: 1 })

  const locale = useLocale()
  const controls = createRegistry()
  const items = createRegistry()

  const atom = useTemplateRef<AtomExpose>('atom')
  const itemGap = shallowRef(0)
  const reserved = shallowRef(0)

  // Probe capacity is a page-slot count, not "everything minus N controls".
  // Controls are pixels (reserved). Pages are measured one by one. The
  // composable may ask for more slots than are mounted, then correct that
  // ask after layout — including growing back once a wide page is left.
  const overflow = createOverflow({
    container: () => atom.value?.element as Element | undefined,
    gap: itemGap,
    reserved,
    probe: true,
    max: () => totalVisible,
  })

  const visible = computed(() => {
    const pageCap = overflow.capacity.value

    // SSR or not measured yet
    if (pageCap === Infinity) return totalVisible ?? 7

    /* v8 ignore start -- branches require browser measurement */
    const noVisible = isNullOrUndefined(totalVisible)

    if (pageCap > 0) return noVisible ? pageCap : Math.min(totalVisible, pageCap)

    return noVisible ? 1 : totalVisible
    /* v8 ignore stop */
  })

  const pagination = createPagination({
    page,
    visible,
    ellipsis,
    size: () => size,
    itemsPerPage: () => itemsPerPage,
  })

  /* v8 ignore start -- browser-only measurement code */
  function outer (el: HTMLElement): number {
    const style = getComputedStyle(el)
    return (el.offsetWidth || 0) + pxToNumber(style.marginLeft) + pxToNumber(style.marginRight)
  }

  function sync () {
    if (!IN_BROWSER) return

    const root = overflow.container.value as HTMLElement | null
    if (!root) return

    const rootStyle = getComputedStyle(root)
    itemGap.value = pxToNumber(rootStyle.columnGap) || pxToNumber(rootStyle.gap)

    let controlsWidth = 0
    let controlCount = 0
    for (const ticket of controls.values()) {
      if (!isElement(ticket.value)) continue
      controlsWidth += outer(ticket.value as HTMLElement)
      controlCount++
    }
    // One gap per control, plus (pages - 1) inside the probe, is every gap in the row.
    reserved.value = controlsWidth + itemGap.value * controlCount

    overflow.reset()
    let index = 0
    for (const ticket of items.values()) {
      if (!isElement(ticket.value)) continue
      overflow.measure(index, ticket.value)
      index++
    }
    const asked = pagination.items.value.length
    overflow.settle(index >= asked && asked > 0)
  }

  let frame = 0
  function schedule () {
    if (!IN_BROWSER) return
    const id = ++frame
    requestAnimationFrame(() => {
      if (id !== frame) return
      sync()
    })
  }

  watch(
    () => [pagination.items.value, controls.size, overflow.width.value] as const,
    () => schedule(),
    { flush: 'post' },
  )
  /* v8 ignore stop */

  const slotProps = toRef((): PaginationRootSlotProps => ({
    page: pagination.page.value,
    size: pagination.size,
    pages: pagination.pages,
    itemsPerPage: pagination.itemsPerPage,
    items: pagination.items.value,
    pageStart: pagination.pageStart.value,
    pageStop: pagination.pageStop.value,
    isFirst: pagination.isFirst.value,
    isLast: pagination.isLast.value,
    first: pagination.first,
    last: pagination.last,
    next: pagination.next,
    prev: pagination.prev,
    select: pagination.select,
    attrs: {
      'aria-label': locale.ti('Pagination.label') ?? 'Pagination',
      'role': as === 'nav' ? undefined : 'navigation',
    },
  }))

  providePaginationRoot(namespace, pagination)
  providePaginationControls(namespace, controls)
  providePaginationItems(namespace, items)
</script>

<template>
  <Atom
    ref="atom"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
