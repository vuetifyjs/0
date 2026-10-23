<script lang="ts">
  // Framework
  import { Checkbox, DataTable, isUndefined, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuDataTable } from './QuDataTable.vue'

  // Utilities
  import { onBeforeUnmount, toRef, watch } from 'vue'

  // Types
  import type { DataTableRowProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuDataTableRowProps extends Pick<DataTableRowProps, 'id' | 'value' | 'namespace'> {
    /** `false` keeps this row out of selection: no checkbox, and select-all skips it. */
    selectable?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDataTableRow' })

  defineSlots<{
    /** The `Cell` parts. The checkbox cell is rendered ahead of them when the table is selectable. */
    default?: () => any
  }>()

  const {
    id,
    value,
    selectable = true,
    namespace: _namespace,
  } = defineProps<QuDataTableRowProps>()

  const context = useQuDataTable()
  const locale = useLocale()

  orphan('QuDataTableRow', context)

  const namespace = toRef(() => _namespace ?? context?.namespace ?? 'v0:data-table')
  const column = toRef(() => context?.selectable.value ?? false)
  const label = toRef(() => locale.ti('Quantum.selectRow') ?? 'Select row')

  // A row that opts out tells the root before the v0 row registers, so an
  // initial selection and select-all both skip it.
  if (context) {
    const excluded = context.excluded

    watch(() => [value, selectable] as const, ([record, ok], previous) => {
      if (previous && !isUndefined(previous[0])) excluded.delete(previous[0])
      if (!ok && !isUndefined(record)) excluded.add(record)
    }, { immediate: true })

    onBeforeUnmount(() => {
      if (!isUndefined(value)) excluded.delete(value)
    })
  }
</script>

<template>
  <DataTable.Row
    :id
    v-slot="{ isSelected, toggleSelection }"
    class="quantum-data-table__row"
    :namespace
    :value
  >
    <DataTable.Cell
      v-if="column"
      class="quantum-data-table__select"
    >
      <Checkbox.Root
        v-if="selectable"
        class="quantum-data-table__checkbox"
        :label
        :model-value="isSelected"
        @update:model-value="toggleSelection"
      >
        <QuRipple unbounded />

        <span class="quantum-data-table__box">
          <Checkbox.Indicator class="quantum-data-table__mark">
            <QuIcon name="check" />
          </Checkbox.Indicator>
        </span>
      </Checkbox.Root>
    </DataTable.Cell>

    <slot />
  </DataTable.Row>
</template>
