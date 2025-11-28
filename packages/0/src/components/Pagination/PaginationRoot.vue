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
    /** Width of each page button in pixels (used with maxVisible). @default 36 */
    buttonWidth?: MaybeRefOrGetter<number>
    /** Gap between buttons in pixels (used with maxVisible). @default 4 */
    buttonGap?: MaybeRefOrGetter<number>
    /** Number of navigation buttons to account for (used with maxVisible). @default 4 */
    navButtons?: MaybeRefOrGetter<number>
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
    visible,
    itemsPerPage,
    ellipsis,
    maxVisible,
    buttonWidth,
    buttonGap,
    navButtons,
    minVisible,
  } = defineProps<PaginationRootProps>()

  // Template ref for responsive sizing - Atom exposes element via defineExpose
  const atomRef = useTemplateRef<AtomExpose>('atomRef')
  const rootEl = toRef(() => atomRef.value?.element as Element | undefined)

  // Track container width for responsive calculation
  const { width: containerWidth } = useElementSize(rootEl)

  // Calculate responsive visible count based on container width
  const responsiveVisible = computed(() => {
    const max = toValue(maxVisible)
    if (max === undefined) return undefined

    const width = containerWidth.value
    const btnWidth = toValue(buttonWidth) ?? 36
    const gap = toValue(buttonGap) ?? 4
    const navBtns = toValue(navButtons) ?? 4
    const min = toValue(minVisible) ?? 1

    if (width <= 0) return min

    // Calculate space taken by navigation buttons
    const navSpace = navBtns * (btnWidth + gap)
    const availableSpace = width - navSpace

    if (availableSpace <= 0) return min

    // Calculate how many page buttons can fit
    // n buttons: n * btnWidth + (n-1) * gap = n * (btnWidth + gap) - gap
    const maxButtons = Math.floor((availableSpace + gap) / (btnWidth + gap))

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
