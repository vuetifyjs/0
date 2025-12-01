/**
 * @module PaginationRoot
 *
 * @remarks
 * Root component for pagination controls that manages page state and provides context
 * to child components. Supports automatic calculation of visible page buttons based on
 * container width, or explicit totalVisible configuration.
 *
 * Built on createPaginationContext from usePagination composable. Provides navigation
 * methods (first, last, next, prev, goto) and computed page ranges via slot props.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createPaginationContext } from '#v0/composables/usePagination'
  import { createRegistryContext } from '#v0/composables/useRegistry'
  import { createOverflow } from '#v0/composables/useOverflow'
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { computed, shallowRef, toRef, useTemplateRef, watch } from 'vue'
  import { isNullOrUndefined } from '#v0/utilities'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { PaginationItem } from '#v0/composables/usePagination'

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
    /**
     * Reserved space for nav buttons.
     * - Values <= 10 are treated as multipliers (e.g., 4 = itemWidth * 4)
     * - Values > 10 are treated as pixels (e.g., 200 = 200px)
     * Defaults to 4 (space for first/prev/next/last buttons).
     */
    reserved?: number
  }

  export interface PaginationRootSlots {
    default: (props: {
      /** Current page (1-indexed) */
      page: number
      /** Total number of items */
      size: number
      /** Total number of pages */
      pages: number
      /** Items per page */
      itemsPerPage: number
      /** Visible page items for rendering */
      items: PaginationItem[]
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
      goto: (page: number) => void
    }) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationRoot' })

  defineSlots<PaginationRootSlots>()

  const page = defineModel<number>({ default: 1 })

  const {
    as = 'nav',
    renderless,
    namespace = 'v0:pagination',
    size = 1,
    totalVisible,
    itemsPerPage = 10,
    ellipsis = '...',
    reserved,
  } = defineProps<PaginationRootProps>()

  const atom = useTemplateRef<AtomExpose>('atom')
  const rootEl = toRef(() => atom.value?.element.value)

  const locale = useLocale()

  const [, providePaginationItemContext, itemContext] = createRegistryContext({
    namespace: `${namespace}:item`,
  })

  const itemWidth = shallowRef(0)

  const rootGap = shallowRef(0)

  const overflow = createOverflow({
    itemWidth,
    reserved: () => {
      const r = reserved ?? 4
      return r > 10 ? r : (itemWidth.value + rootGap.value) * r
    },
  })

  watch(rootEl, el => {
    overflow.container.value = el ?? undefined
  }, { immediate: true })

  watch([() => itemContext.collection.size, () => overflow.width.value], () => {
    const first = itemContext.seek('first')
    const el = first?.value as HTMLElement | undefined
    const root = rootEl.value
    if (!el || !root) return

    const rootStyle = getComputedStyle(root)
    const style = getComputedStyle(el)
    const marginX = Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight)
    const gapX = Number.parseFloat(rootStyle.gap) || 0

    rootGap.value = gapX
    itemWidth.value = el.offsetWidth + Math.max(marginX, gapX)
  }, { flush: 'post' })

  const visible = computed(() => {
    const cap = overflow.capacity.value

    if (cap === Infinity) return totalVisible ?? 7
    if (cap > 0) return isNullOrUndefined(totalVisible) ? cap : Math.min(totalVisible, cap)

    return isNullOrUndefined(totalVisible) ? 1 : totalVisible
  })

  const [, providePaginationContext, paginationContext] = createPaginationContext({
    namespace,
    page,
    visible,
    ellipsis,
    size: () => size,
    itemsPerPage: () => itemsPerPage,
  })

  const slotProps = toRef(() => ({
    page: paginationContext.page.value,
    size: paginationContext.size,
    pages: paginationContext.pages,
    itemsPerPage: paginationContext.itemsPerPage,
    items: paginationContext.items.value,
    pageStart: paginationContext.pageStart.value,
    pageStop: paginationContext.pageStop.value,
    isFirst: paginationContext.isFirst.value,
    isLast: paginationContext.isLast.value,
    first: paginationContext.first,
    last: paginationContext.last,
    next: paginationContext.next,
    prev: paginationContext.prev,
    goto: paginationContext.goto,
  }))

  providePaginationContext()
  providePaginationItemContext()
</script>

<template>
  <Atom
    ref="atom"
    :aria-label="locale.t('Pagination')"
    :as
    :renderless
    role="navigation"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
