<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createPaginationContext } from '#v0/composables/usePagination'
  import { useElementSize } from '#v0/composables/useResizeObserver'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { PaginationItem } from '#v0/composables/usePagination'
  import type { MaybeRefOrGetter } from 'vue'

  export interface PaginationRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Total number of items to paginate */
    size?: MaybeRefOrGetter<number>
    /** Number of visible page buttons. When maxVisible is set, this is ignored. @default 5 */
    visible?: MaybeRefOrGetter<number>
    /** Number of items per page */
    itemsPerPage?: MaybeRefOrGetter<number>
    /** Ellipsis character */
    ellipsis?: string
    /**
     * Maximum number of visible page buttons (enables responsive auto-calculation).
     * When set, visible buttons are calculated based on container width,
     * up to this maximum value.
     */
    maxVisible?: MaybeRefOrGetter<number>
    /** Minimum number of visible page buttons (used with maxVisible). @default 1 */
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
      /** Number of visible page buttons (computed when maxVisible is set) */
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
  import { computed, shallowRef, toRef, toValue, useTemplateRef, watch } from 'vue'

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
    visible,
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

  // Measure actual button dimensions from the DOM
  const itemWidth = shallowRef(0)

  function measureItemWidth () {
    const el = rootEl.value
    if (!el) return

    // Find first button element (pagination item or nav button)
    const firstItem = el.querySelector('button') as HTMLElement
    if (!firstItem) return

    const style = getComputedStyle(firstItem)
    const marginX = parseFloat(style.marginLeft) + parseFloat(style.marginRight)
    const gapX = parseFloat(getComputedStyle(el).gap) || 0

    itemWidth.value = firstItem.offsetWidth + Math.max(marginX, gapX)
  }

  // Measure on width changes (ResizeObserver triggers this)
  watch(containerWidth, () => {
    if (itemWidth.value === 0) measureItemWidth()
  })

  // Calculate responsive visible count based on container width
  const responsiveVisible = computed(() => {
    const max = toValue(maxVisible)
    if (max === undefined) return undefined

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

  // Determine effective visible value
  const effectiveVisible = computed(() => {
    if (responsiveVisible.value !== undefined) {
      return responsiveVisible.value
    }
    return toValue(visible) ?? 5
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
