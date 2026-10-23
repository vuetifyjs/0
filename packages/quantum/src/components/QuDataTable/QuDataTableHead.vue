<script lang="ts">
  // Framework
  import { Checkbox, DataTable, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuDataTable } from './QuDataTable.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DataTableHeaderProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuDataTableHeadProps extends Pick<DataTableHeaderProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDataTableHead' })

  defineSlots<{
    /** The `Column` parts. The select-all cell is rendered ahead of them when the table is selectable. */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<QuDataTableHeadProps>()

  const context = useQuDataTable()
  const locale = useLocale()

  orphan('QuDataTableHead', context)

  const namespace = toRef(() => _namespace ?? context?.namespace ?? 'v0:data-table')
  const selectable = toRef(() => context?.selectable.value ?? false)
  const all = toRef(() => context?.isAllSelected.value ?? false)
  const mixed = toRef(() => context?.isMixed.value ?? false)
  const label = toRef(() => locale.ti('Quantum.selectAll') ?? 'Select all')

  // The checkbox is controlled: its model is the page aggregate and a press toggles the page.
  function onToggle () {
    context?.toggleAll()
  }
</script>

<template>
  <DataTable.Header
    class="quantum-data-table__head"
    :namespace
  >
    <DataTable.Row
      class="quantum-data-table__row"
      :namespace
    >
      <DataTable.Column
        v-if="selectable"
        class="quantum-data-table__select"
        :namespace
      >
        <Checkbox.Root
          class="quantum-data-table__checkbox"
          :indeterminate="mixed"
          :label
          :model-value="all"
          @update:model-value="onToggle"
        >
          <QuRipple unbounded />

          <span class="quantum-data-table__box">
            <Checkbox.Indicator class="quantum-data-table__mark">
              <QuIcon :name="mixed ? 'remove' : 'check'" />
            </Checkbox.Indicator>
          </span>
        </Checkbox.Root>
      </DataTable.Column>

      <slot />
    </DataTable.Row>
  </DataTable.Header>
</template>
