<script lang="ts">
  // Framework
  import { DataTable } from '@vuetify/v0'

  // Context
  import { orphan, useQuDataTable } from './QuDataTable.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DataTableTableProps } from '@vuetify/v0'

  export interface QuDataTableTableProps extends Pick<DataTableTableProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDataTableTable' })

  defineSlots<{
    /** Head and Body. */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<QuDataTableTableProps>()

  const context = useQuDataTable()

  orphan('QuDataTableTable', context)

  const namespace = toRef(() => _namespace ?? context?.namespace ?? 'v0:data-table')
</script>

<template>
  <div class="quantum-data-table__scroll">
    <DataTable.Table
      :aria-labelledby="context?.title.value"
      class="quantum-data-table__table"
      :namespace
    >
      <slot />
    </DataTable.Table>
  </div>
</template>
