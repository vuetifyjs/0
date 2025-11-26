<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createPaginationContext } from '#v0/composables/usePagination'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { PaginationItem } from '#v0/composables/usePagination'
  import type { MaybeRefOrGetter } from 'vue'

  export interface PaginationRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Total number of pages */
    size?: MaybeRefOrGetter<number>
    /** Maximum visible page buttons */
    visible?: MaybeRefOrGetter<number>
    /** Number of items per page */
    itemsPerPage?: MaybeRefOrGetter<number>
    /** Ellipsis character */
    ellipsis?: string
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
  // Utilities
  import { toRef, toValue, watch } from 'vue'

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
  } = defineProps<PaginationRootProps>()

  const [, providePaginationContext] = createPaginationContext({
    namespace,
    page: page.value,
    size: () => toValue(size) ?? 1,
    visible: () => toValue(visible) ?? 5,
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
    aria-label="pagination"
    :as
    :renderless
    role="navigation"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
