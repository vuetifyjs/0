<script lang="ts">
  /**
   * @module DataGridRoot
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @remarks
   * Provider for the DataGrid compound. Creates `createDataGrid` and
   * provides it to children. Rows and columns register themselves when
   * they mount — same lifecycle as Checkbox.Group. Renders only slot content.
   */

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

  const [_useDataGridRoot, provideDataGridRoot] = createContext<DataGridContext<Record<string, unknown>>>()

  export function useDataGridRoot<
    T extends Record<string, unknown> = Record<string, unknown>,
    > (namespace = 'v0:data-grid'): DataGridContext<T> {
    return _useDataGridRoot(namespace) as DataGridContext<T>
  }

  export { provideDataGridRoot }
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
