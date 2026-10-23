<script lang="ts">
  // Framework
  import { DataTable } from '@vuetify/v0'

  // Context
  import { orphan, useMd1DataTable } from './Md1DataTable.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DataTableBodyProps } from '@vuetify/v0'

  export interface Md1DataTableBodyProps extends Pick<DataTableBodyProps, 'namespace'> {}

  export interface Md1DataTableBodySlotProps {
    /** Orders a source array by the table's sort; `v-for` over `rank(rows)` so the rows register in pipeline order. */
    rank: <U extends object>(source: readonly U[]) => U[]
    /** The records on the current page. */
    items: readonly object[]
    /** No record passes the pipeline. */
    isEmpty: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DataTableBody' })

  defineSlots<{
    /** The `Row` parts, usually `v-for="row in rank(rows)"`. */
    default?: (props: Md1DataTableBodySlotProps) => any
  }>()

  const { namespace: _namespace } = defineProps<Md1DataTableBodyProps>()

  const context = useMd1DataTable()

  orphan('Md1DataTableBody', context)

  const namespace = toRef(() => _namespace ?? context?.namespace ?? 'v0:data-table')
</script>

<template>
  <DataTable.Body
    v-slot="{ rank, items, isEmpty }"
    class="md1-data-table__body"
    :namespace
  >
    <slot
      :is-empty
      :items
      :rank
    />
  </DataTable.Body>
</template>
