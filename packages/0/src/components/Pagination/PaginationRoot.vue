<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createPaginationContext } from '#v0/composables/usePagination'
  import { useResponsivePagination } from '#v0/composables/useResponsivePagination'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { PaginationItem } from '#v0/composables/usePagination'
  import type { MaybeRefOrGetter } from 'vue'

  export interface PaginationRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Total number of pages */
    size?: MaybeRefOrGetter<number>
    /** Maximum visible page buttons (or max when autoVisible is enabled) */
    visible?: MaybeRefOrGetter<number>
    /** Number of items per page */
    itemsPerPage?: MaybeRefOrGetter<number>
    /** Ellipsis character */
    ellipsis?: string
    /** Enable responsive auto-calculation of visible buttons based on container width */
    autoVisible?: boolean
    /** Width of each page button in pixels (used when autoVisible is true). @default 36 */
    buttonWidth?: MaybeRefOrGetter<number>
    /** Gap between buttons in pixels (used when autoVisible is true). @default 4 */
    buttonGap?: MaybeRefOrGetter<number>
    /** Number of navigation buttons to account for (used when autoVisible is true). @default 4 */
    navButtons?: MaybeRefOrGetter<number>
    /** Minimum number of visible page buttons (used when autoVisible is true). @default 1 */
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
      /** Number of visible page buttons (computed when autoVisible is enabled) */
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
  import { toRef, toValue, useTemplateRef, watch } from 'vue'

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
    autoVisible,
    buttonWidth,
    buttonGap,
    navButtons,
    minVisible,
  } = defineProps<PaginationRootProps>()

  // Template ref for responsive sizing - Atom exposes element via defineExpose
  const atomRef = useTemplateRef<AtomExpose>('atomRef')
  const rootEl = toRef(() => atomRef.value?.element as Element | undefined)

  // Use responsive pagination when autoVisible is enabled
  const { visible: responsiveVisible } = useResponsivePagination(rootEl, {
    buttonWidth: () => toValue(buttonWidth) ?? 36,
    gap: () => toValue(buttonGap) ?? 4,
    navButtons: () => toValue(navButtons) ?? 4,
    minVisible: () => toValue(minVisible) ?? 1,
    maxVisible: () => toValue(visible) ?? Infinity,
  })

  const [, providePaginationContext] = createPaginationContext({
    namespace,
    page: page.value,
    size: () => toValue(size) ?? 1,
    visible: () => autoVisible ? responsiveVisible.value : (toValue(visible) ?? 5),
    itemsPerPage: toRef(() => toValue(itemsPerPage) ?? 10),
    ellipsis,
  })

  const context = providePaginationContext()

  // Sync model with context
  watch(page, v => context.page.value = v)
  watch(() => context.page.value, v => page.value = v)

  // Compute current visible value
  const currentVisible = toRef(() => autoVisible ? responsiveVisible.value : (toValue(visible) ?? 5))

  const slotProps = toRef(() => ({
    page: context.page.value,
    size: context.size,
    pages: context.pages,
    itemsPerPage: context.itemsPerPage.value,
    visible: currentVisible.value,
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
