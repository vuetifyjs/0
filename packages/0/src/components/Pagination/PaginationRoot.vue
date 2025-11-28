<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createPaginationContext } from '#v0/composables/usePagination'
  import { createRegistryContext } from '#v0/composables/useRegistry'
  import { useElementSize } from '#v0/composables/useResizeObserver'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { PaginationItem } from '#v0/composables/usePagination'
  import type { MaybeRefOrGetter } from 'vue'

  // Element registry for responsive measurement
  // Child components register their elements, first one is used for measurement
  export const [
    usePaginationElements,
    providePaginationElements,
  ] = createRegistryContext({ namespace: 'v0:pagination-elements' })

  export interface PaginationRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Total number of items to paginate */
    size?: MaybeRefOrGetter<number>
    /** Number of items per page */
    itemsPerPage?: MaybeRefOrGetter<number>
    /** Ellipsis character */
    ellipsis?: string
    /**
     * Maximum number of visible page buttons.
     * Enables responsive auto-calculation based on container width.
     */
    maxVisible?: MaybeRefOrGetter<number>
    /** Minimum number of visible page buttons. @default 1 */
    minVisible?: MaybeRefOrGetter<number>
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
      /** Number of visible page buttons */
      visible: number
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
  // Utilities
  import { computed, toRef, toValue, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose } from '#v0/components/Atom'

  defineOptions({ name: 'PaginationRoot' })

  defineSlots<PaginationRootSlots>()

  const page = defineModel<number>({ default: 1 })

  const {
    as = 'nav',
    renderless,
    namespace = 'v0:pagination',
    size,
    itemsPerPage,
    ellipsis,
    maxVisible,
    minVisible,
  } = defineProps<PaginationRootProps>()

  // Template ref for responsive sizing - Atom exposes element via defineExpose
  const atomRef = useTemplateRef<AtomExpose>('atomRef')
  const rootEl = toRef(() => atomRef.value?.element as Element | undefined)

  // Track container width for responsive calculation
  const { width: containerWidth } = useElementSize(rootEl)

  // Element registry - child components register their elements
  const elementRegistry = providePaginationElements()

  // Measure item width from first registered element
  const itemWidth = computed(() => {
    const firstTicket = elementRegistry.seek('first')
    const el = firstTicket?.value as HTMLElement | undefined
    const root = rootEl.value
    if (!el || !root) return 0

    const style = getComputedStyle(el)
    const marginX = parseFloat(style.marginLeft) + parseFloat(style.marginRight)
    const gapX = parseFloat(getComputedStyle(root).gap) || 0

    return el.offsetWidth + Math.max(marginX, gapX)
  })

  // Calculate responsive visible count based on container width
  const responsiveVisible = computed(() => {
    const max = toValue(maxVisible)
    if (max === undefined) return max

    const width = containerWidth.value
    const min = toValue(minVisible) ?? 1
    const btnWidth = itemWidth.value

    if (width <= 0 || btnWidth <= 0) return min

    // Reserve space for nav buttons (first, prev, next, last)
    const navButtonsSpace = btnWidth * 4
    const availableSpace = width - navButtonsSpace

    if (availableSpace <= 0) return min

    const maxButtons = Math.floor(availableSpace / btnWidth)

    return Math.min(max, Math.max(min, maxButtons))
  })

  // Use responsive value, or maxVisible as static fallback, or default 5
  const effectiveVisible = computed(() => {
    return responsiveVisible.value ?? toValue(maxVisible) ?? 5
  })

  const [, providePaginationContext] = createPaginationContext({
    namespace,
    page: page.value,
    size: () => toValue(size) ?? 1,
    visible: effectiveVisible,
    itemsPerPage: toRef(() => toValue(itemsPerPage) ?? 10),
    ellipsis,
  })

  const context = providePaginationContext()

  // Sync model with context
  watch(page, v => context.page.value = v)
  watch(() => context.page.value, v => page.value = v)

  const slotProps = toRef(() => ({
    page: context.page.value,
    size: context.size,
    pages: context.pages,
    itemsPerPage: context.itemsPerPage.value,
    visible: effectiveVisible.value,
    items: context.items.value,
    pageStart: context.pageStart.value,
    pageStop: context.pageStop.value,
    isFirst: context.isFirst.value,
    isLast: context.isLast.value,
    first: context.first,
    last: context.last,
    next: context.next,
    prev: context.prev,
    goto: context.goto,
  }))
</script>

<template>
  <Atom
    ref="atomRef"
    aria-label="pagination"
    :as
    :renderless
    role="navigation"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
