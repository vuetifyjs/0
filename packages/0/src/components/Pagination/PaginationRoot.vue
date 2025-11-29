<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createPaginationContext } from '#v0/composables/usePagination'
  import { createRegistryContext, useElementSize } from '#v0/composables'

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
  } = defineProps<PaginationRootProps>()

  const atom = useTemplateRef<AtomExpose>('atom')
  const rootEl = toRef(() => atom.value?.element as Element | undefined)
  const { width: containerWidth } = useElementSize(rootEl)

  const [, providePaginationItemContext, itemContext] = createRegistryContext({
    namespace: `${namespace}:item`,
  })

  const itemWidth = shallowRef(0)

  watch([() => itemContext.collection.size, containerWidth], () => {
    const first = itemContext.seek('first')
    const el = first?.value as HTMLElement | undefined
    const root = rootEl.value
    if (!el || !root) return

    const style = getComputedStyle(el)
    const marginX = Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight)
    const gapX = Number.parseFloat(getComputedStyle(root).gap) || 0

    itemWidth.value = el.offsetWidth + Math.max(marginX, gapX)
  }, { flush: 'post' })

  const maxButtons = computed(() => {
    const width = containerWidth.value
    const btnWidth = itemWidth.value
    if (width <= 0 || btnWidth <= 0) return 0

    const navButtonsSpace = btnWidth * 4
    const availableSpace = width - navButtonsSpace
    if (availableSpace <= 0) return 1

    return Math.max(1, Math.floor(availableSpace / btnWidth))
  })

  const visible = computed(() => {
    const max = maxButtons.value

    // If we can calculate what fits, respect container width
    if (max > 0) return isNullOrUndefined(totalVisible) ? max : Math.min(totalVisible, max)

    // Fallback when we can't calculate yet (no items registered)
    if (!isNullOrUndefined(totalVisible)) return totalVisible

    return Math.max(0, Math.floor(
      // Round to two decimal places to avoid floating point errors
      Number(((containerWidth.value - itemWidth.value * 3) / itemWidth.value).toFixed(2)),
    ))
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
    aria-label="pagination"
    :as
    :renderless
    role="navigation"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
