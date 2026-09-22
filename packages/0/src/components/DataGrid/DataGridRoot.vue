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
  import { toRef, watch } from 'vue'

  // Types
  import type { DataGridContext, DataGridOptions } from '#v0/composables/createDataGrid'

  export interface DataGridRootProps<T extends object = object> extends DataGridOptions<T> {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
  }

  export interface DataGridRootSlotProps<T extends object = object> {
    /** The data grid context instance */
    context: DataGridContext<T>
  }

  const [_useDataGridRoot, provideDataGridRoot] = createContext<DataGridContext<object>>()

  export function useDataGridRoot<
    T extends object = object,
    > (namespace = 'v0:data-grid'): DataGridContext<T> {
    return _useDataGridRoot(namespace) as unknown as DataGridContext<T>
  }

  export { provideDataGridRoot }
</script>

<script lang="ts" setup generic="T extends object = object">
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

  provideDataGridRoot(namespace, context as unknown as DataGridContext<object>)

  defineEmits<{
    'update:search': [value: string]
  }>()

  const search = defineModel<string>('search', { default: '' })

  watch(search, value => {
    if (context.query.value !== (value ?? '')) context.search(value ?? '')
  }, { immediate: true })

  watch(context.query, value => {
    if (search.value !== value) search.value = value
  })

  const slotProps = toRef((): DataGridRootSlotProps<T> => ({
    context,
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
