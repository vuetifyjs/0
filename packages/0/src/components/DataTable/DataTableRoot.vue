<script lang="ts">
  /**
   * @module DataTableRoot
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * Root component for the DataTable compound. Creates and provides the
   * `createDataTable` context for child components to consume. The Root itself
   * is a pure provider — it renders only its slot content without adding DOM.
   */

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createDataTable } from '#v0/composables/createDataTable'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DataTableContext, DataTableOptions } from '#v0/composables/createDataTable'

  export interface DataTableRootProps<T extends Record<string, unknown> = Record<string, unknown>>
    extends DataTableOptions<T> {
    /** Namespace for dependency injection. @default 'v0:data-table' */
    namespace?: string
  }

  export interface DataTableRootSlotProps<T extends Record<string, unknown> = Record<string, unknown>> {
    /** The data table context for direct access to state and methods */
    context: DataTableContext<T>
  }

  const [_useDataTableRoot, provideDataTableRoot] = createContext<DataTableContext<Record<string, unknown>>>()

  export function useDataTableRoot<
    T extends Record<string, unknown> = Record<string, unknown>,
    > (namespace = 'v0:data-table'): DataTableContext<T> {
    return _useDataTableRoot(namespace) as DataTableContext<T>
  }

  export { provideDataTableRoot }
</script>

<script lang="ts" setup generic="T extends Record<string, unknown> = Record<string, unknown>">
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

  provideDataTableRoot(namespace, context as DataTableContext<Record<string, unknown>>)

  const slotProps = toRef((): DataTableRootSlotProps<T> => ({ context }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
