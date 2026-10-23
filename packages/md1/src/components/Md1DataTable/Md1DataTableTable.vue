<script lang="ts">
  // Framework
  import { DataTable } from '@vuetify/v0'

  // Context
  import { orphan, useMd1DataTable } from './Md1DataTable.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DataTableTableProps } from '@vuetify/v0'

  export interface Md1DataTableTableProps extends Pick<DataTableTableProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DataTableTable' })

  defineSlots<{
    /** Head and Body. */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<Md1DataTableTableProps>()

  const context = useMd1DataTable()

  orphan('Md1DataTableTable', context)

  const namespace = toRef(() => _namespace ?? context?.namespace ?? 'v0:data-table')
</script>

<template>
  <div class="md1-data-table__scroll">
    <DataTable.Table
      :aria-labelledby="context?.title.value"
      class="md1-data-table__table"
      :namespace
    >
      <slot />
    </DataTable.Table>
  </div>
</template>
