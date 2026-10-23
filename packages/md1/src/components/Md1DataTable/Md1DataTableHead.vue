<script lang="ts">
  // Framework
  import { Checkbox, DataTable, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1DataTable } from './Md1DataTable.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DataTableHeaderProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1DataTableHeadProps extends Pick<DataTableHeaderProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DataTableHead' })

  defineSlots<{
    /** The `Column` parts. The select-all cell is rendered ahead of them when the table is selectable. */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<Md1DataTableHeadProps>()

  const context = useMd1DataTable()
  const locale = useLocale()

  orphan('Md1DataTableHead', context)

  const namespace = toRef(() => _namespace ?? context?.namespace ?? 'v0:data-table')
  const selectable = toRef(() => context?.selectable.value ?? false)
  const all = toRef(() => context?.isAllSelected.value ?? false)
  const mixed = toRef(() => context?.isMixed.value ?? false)
  const label = toRef(() => locale.ti('Md1.selectAll') ?? 'Select all')

  // The checkbox is controlled: its model is the page aggregate and a press toggles the page.
  function onToggle () {
    context?.toggleAll()
  }
</script>

<template>
  <DataTable.Header
    class="md1-data-table__head"
    :namespace
  >
    <DataTable.Row
      class="md1-data-table__row"
      :namespace
    >
      <DataTable.Column
        v-if="selectable"
        class="md1-data-table__select"
        :namespace
      >
        <Checkbox.Root
          class="md1-data-table__checkbox"
          :indeterminate="mixed"
          :label
          :model-value="all"
          @update:model-value="onToggle"
        >
          <Md1Ripple unbounded />

          <span class="md1-data-table__box">
            <Checkbox.Indicator class="md1-data-table__mark">
              <Md1Icon :name="mixed ? 'remove' : 'check'" />
            </Checkbox.Indicator>
          </span>
        </Checkbox.Root>
      </DataTable.Column>

      <slot />
    </DataTable.Row>
  </DataTable.Header>
</template>
