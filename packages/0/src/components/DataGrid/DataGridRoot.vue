/**
 * @module DataGridRoot
 *
 * @see https://0.vuetifyjs.com/components/data/data-grid
 *
 * @remarks
 * Root provider for the DataGrid compound. Creates a data grid context via
 * createDataGrid and provides it to descendant components. The context
 * exposes layout, rows (ordering), editing, and spans on top of the inherited
 * DataTable pipeline.
 *
 * Rows are registered through the inherited registry surface (`register`,
 * `onboard`, `unregister`, `clear`) — they are not passed as an `items` option.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createDataGrid } from '#v0/composables/createDataGrid'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DataGridContext, DataGridOptions } from '#v0/composables/createDataGrid'

  export interface DataGridRootProps<T extends Record<string, unknown> = Record<string, unknown>> extends DataGridOptions<T> {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
  }

  export interface DataGridRootSlotProps<T extends Record<string, unknown> = Record<string, unknown>> {
    /** The data grid context instance */
    context: DataGridContext<T>
  }

  export const [useDataGridRoot, provideDataGridRoot] = createContext<DataGridContext<Record<string, unknown>>>()
</script>

<script lang="ts" setup generic="T extends Record<string, unknown> = Record<string, unknown>">
  defineOptions({ name: 'DataGridRoot' })

  defineSlots<{
    default: (props: DataGridRootSlotProps<T>) => unknown
  }>()

  const {
    namespace = 'v0:data-grid',
    editing,
    preserveRowOrder,
    rowSpanning,
    ...options
  } = defineProps<DataGridRootProps<T>>()

  const context = createDataGrid<T>({
    editing,
    preserveRowOrder,
    rowSpanning,
    ...options,
  })

  provideDataGridRoot(namespace, context as DataGridContext<Record<string, unknown>>)

  const slotProps = toRef((): DataGridRootSlotProps<T> => ({
    context,
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
