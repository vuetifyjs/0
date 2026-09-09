<script lang="ts">
  /**
   * @module DataTableRoot
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * Provider for the DataTable compound. Creates `createDataTable` and
   * provides it to children. Rows and columns register themselves when
   * they mount — same lifecycle as Checkbox.Group. Renders only slot content.
   */

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createDataTable } from '#v0/composables/createDataTable'

  // Utilities
  import { toRef, watch } from 'vue'

  // Types
  import type { DataTableContext, DataTableOptions } from '#v0/composables/createDataTable'

  export interface DataTableRootProps<T extends object = object>
    extends DataTableOptions<T> {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
  }

  export interface DataTableRootSlotProps<T extends object = object> {
    /** The data table context for direct access to state and methods */
    context: DataTableContext<T>
  }

  const [_useDataTableRoot, provideDataTableRoot] = createContext<DataTableContext<object>>()

  export function useDataTableRoot<
    T extends object = object,
    > (namespace = 'v0:data-table'): DataTableContext<T> {
    return _useDataTableRoot(namespace) as unknown as DataTableContext<T>
  }

  export { provideDataTableRoot }
</script>

<script lang="ts" setup generic="T extends object = object">
  defineOptions({ name: 'DataTableRoot' })

  defineSlots<{
    default: (props: DataTableRootSlotProps<T>) => unknown
  }>()

  const {
    namespace = 'v0:data-table',
    filter,
    pagination,
    sortMultiple,
    mandate,
    firstSortOrder,
    selectStrategy,
    itemSelectable,
    groupBy,
    openAll,
    expandMultiple,
    locale,
    adapter,
  } = defineProps<DataTableRootProps<T>>()

  const context = createDataTable<T>({
    filter,
    pagination,
    sortMultiple,
    mandate,
    firstSortOrder,
    selectStrategy,
    itemSelectable,
    groupBy,
    openAll,
    expandMultiple,
    locale,
    adapter,
  })

  provideDataTableRoot(namespace, context as unknown as DataTableContext<object>)

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

  const slotProps = toRef((): DataTableRootSlotProps<T> => ({ context }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
