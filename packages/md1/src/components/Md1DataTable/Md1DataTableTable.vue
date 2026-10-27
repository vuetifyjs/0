<script lang="ts">
  // Framework
  import { DataTable } from '@vuetify/v0'

  // Context
  import { orphan, useMd1DataTable } from './Md1DataTable.vue'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  // Types
  import type { DataTableTableProps } from '@vuetify/v0'

  // The root is the scroll wrapper, so naming attrs would land on a div and leave
  // the table unnamed; they go to the <table>, everything else stays on the wrapper.
  const NAMING = new Set(['id', 'aria-label', 'aria-labelledby', 'aria-describedby'])

  export interface Md1DataTableTableProps extends Pick<DataTableTableProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DataTableTable', inheritAttrs: false })

  defineSlots<{
    /** Head and Body. */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<Md1DataTableTableProps>()

  const context = useMd1DataTable()

  orphan('Md1DataTableTable', context)

  const namespace = toRef(() => _namespace ?? context?.namespace ?? 'v0:data-table')

  const attrs = useAttrs()
  const naming = toRef(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => NAMING.has(key))))
  const rest = toRef(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !NAMING.has(key))))
</script>

<template>
  <div class="md1-data-table__scroll" v-bind="rest">
    <DataTable.Table
      :aria-labelledby="context?.title.value"
      class="md1-data-table__table"
      :namespace
      v-bind="naming"
    >
      <slot />
    </DataTable.Table>
  </div>
</template>
