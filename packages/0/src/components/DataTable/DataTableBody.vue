<script lang="ts">
  /**
   * @module DataTableBody
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * The `<tbody>` element wrapper. Exposes the paginated items from the
   * context for rendering data rows.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataTableRoot } from './DataTableRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DataTableBodyProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
  }

  export interface DataTableBodySlotProps<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Paginated items for rendering */
    items: readonly T[]
    /** Whether the table is loading */
    isLoading: boolean
    /** Whether the table has no items */
    isEmpty: boolean
    /** 1-based index of the first visible data row (onboarded header-grid rows + pageStart + 1). Bind `:index="rowStart + i"` when aria-rowcount is set. */
    rowStart: number
    attrs: {
      role: 'rowgroup' | undefined
    }
  }
</script>

<script lang="ts" setup generic="T extends Record<string, unknown> = Record<string, unknown>">
  defineOptions({ name: 'DataTableBody', inheritAttrs: false })

  defineSlots<{
    default: (props: DataTableBodySlotProps<T>) => unknown
  }>()

  const {
    as = 'tbody',
    namespace = 'v0:data-table',
    renderless,
  } = defineProps<DataTableBodyProps>()

  const attrs = useAttrs()
  const context = useDataTableRoot<T>(namespace)

  const slotProps = toRef((): DataTableBodySlotProps<T> => ({
    items: context.items.value,
    isLoading: context.loading.value,
    isEmpty: context.items.value.length === 0,
    rowStart: context.headers.value.length + context.pagination.pageStart.value + 1,
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
