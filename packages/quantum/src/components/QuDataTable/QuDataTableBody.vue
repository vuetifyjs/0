<script lang="ts">
  // Framework
  import { DataTable } from '@vuetify/v0'

  // Context
  import { orphan, useQuDataTable } from './QuDataTable.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DataTableBodyProps } from '@vuetify/v0'

  export interface QuDataTableBodyProps extends Pick<DataTableBodyProps, 'namespace'> {}

  export interface QuDataTableBodySlotProps {
    /** Orders a source array by the table's sort; `v-for` over `rank(rows)` so the rows register in pipeline order. */
    rank: <U extends object>(source: readonly U[]) => U[]
    /** The records on the current page. */
    items: readonly object[]
    /** No record passes the pipeline. */
    isEmpty: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDataTableBody' })

  defineSlots<{
    /** The `Row` parts, usually `v-for="row in rank(rows)"`. */
    default?: (props: QuDataTableBodySlotProps) => any
  }>()

  const { namespace: _namespace } = defineProps<QuDataTableBodyProps>()

  const context = useQuDataTable()

  orphan('QuDataTableBody', context)

  const namespace = toRef(() => _namespace ?? context?.namespace ?? 'v0:data-table')
</script>

<template>
  <DataTable.Body
    v-slot="{ rank, items, isEmpty }"
    class="quantum-data-table__body"
    :namespace
  >
    <slot
      :is-empty
      :items
      :rank
    />
  </DataTable.Body>
</template>
