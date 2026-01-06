/**
 * @module PaginationRoot
 *
 * @remarks
 * Root component for pagination controls that manages page state and provides context
 * to child components. Supports automatic calculation of visible page buttons based on
 * container width, or explicit totalVisible configuration.
 *
 * Built on createPaginationContext from usePagination composable. Provides navigation
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
  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'
  import { createOverflow } from '#v0/composables/useOverflow'
  import { createPagination } from '#v0/composables/usePagination'
  import { createRegistry } from '#v0/composables/useRegistry'

  // Utilities
  import { isNullOrUndefined } from '#v0/utilities'
  import { computed, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { PaginationContext, PaginationTicket } from '#v0/composables/usePagination'
  import type { RegistryContext } from '#v0/composables/useRegistry'

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
    'update:model-value': T | T[]
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
  const itemWidth = shallowRef(0)
  const itemGap = shallowRef(0)

  const overflow = createOverflow({
    container: () => atom.value?.element as Element | undefined,
    itemWidth,
    gap: itemGap,
  })

  watch([() => items.size, () => overflow.width.value], () => {
    if (!IN_BROWSER) return

    const el = items.seek('first')?.value as HTMLElement | undefined
    const root = overflow.container.value
    if (!el || !root) return

    const rootStyle = getComputedStyle(root)
    const style = getComputedStyle(el)
    const marginX = Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight)
    const gapX = Number.parseFloat(rootStyle.gap) || 0

    itemWidth.value = el.offsetWidth + marginX
    itemGap.value = gapX
  }, { flush: 'post' })

  const visible = computed(() => {
    const totalCap = overflow.capacity.value

    // SSR or not measured yet
    if (totalCap === Infinity) return totalVisible ?? 7

    // Subtract nav buttons from total capacity to get page item capacity
    const pageCap = Math.max(0, totalCap - controls.size)
    const noVisible = isNullOrUndefined(totalVisible)

    if (pageCap > 0) return noVisible ? pageCap : Math.min(totalVisible, pageCap)

    return noVisible ? 1 : totalVisible
  })

  const pagination = createPagination({
    page,
    visible,
    ellipsis,
    size: () => size,
    itemsPerPage: () => itemsPerPage,
  })

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
      'aria-label': locale.t('Pagination.label', undefined, 'Pagination'),
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
