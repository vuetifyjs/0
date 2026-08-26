<script lang="ts">
  /**
   * @module DataGridBody
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @remarks
   * The `<tbody>` element wrapper. Exposes the paginated items from the
   * context for rendering data rows.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DataGridBodyProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
  }

  export interface DataGridBodySlotProps<T extends object = object> {
    /** Paginated items for the current page. Row hides off-page rows itself. */
    items: readonly T[]
    /** Filtered and sorted items in adapter order. Sort only — ignores `rows.move()`. */
    sortedItems: readonly T[]
    /** Filter+sort+row-order list before pagination. */
    orderedItems: readonly T[]
    /** Rank a source array by `orderedItems`. v-for `rank(users)` so rows register themselves. */
    rank: <U extends object>(source: readonly U[]) => U[]
    /** Whether the table is loading */
    isLoading: boolean
    /** Whether the table has no items */
    isEmpty: boolean
    /** Header-grid row count. */
    headerRows: number
    /** 1-based index of the first visible data row (header-grid rows + pageStart + 1). Row sets aria-rowindex unless `:index` is passed. */
    rowStart: number
    /** Registry size — 0 before rows register (first paint). */
    size: number
    attrs: {
      role: 'rowgroup' | undefined
    }
  }
</script>

<script lang="ts" setup generic="T extends object = object">
  defineOptions({ name: 'DataGridBody', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridBodySlotProps<T>) => unknown
  }>()

  const {
    as = 'tbody',
    namespace = 'v0:data-grid',
    renderless,
  } = defineProps<DataGridBodyProps>()

  const attrs = useAttrs()
  const context = useDataGridRoot<T>(namespace)

  const slotProps = toRef((): DataGridBodySlotProps<T> => ({
    items: context.items.value,
    sortedItems: context.sortedItems.value,
    orderedItems: context.orderedItems.value,
    rank: context.rank,
    isLoading: context.loading.value,
    isEmpty: context.items.value.length === 0,
    headerRows: context.headers.value.length,
    rowStart: context.headers.value.length + context.pagination.pageStart.value + 1,
    size: context.size,
    attrs: {
      role: as === 'tbody' ? undefined : 'rowgroup',
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
