<script lang="ts">
  /**
   * @module DataTableCell
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * A `<td>` element for data cells. Use inside DataTable.Row.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DataTableCellProps extends AtomProps {
    /** Number of columns this cell spans */
    colspan?: number
    /** Number of rows this cell spans */
    rowspan?: number
  }

  export interface DataTableCellSlotProps {
    attrs: {
      role: 'cell'
      colspan: number | undefined
      rowspan: number | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataTableCell', inheritAttrs: false })

  defineSlots<{
    default: (props: DataTableCellSlotProps) => unknown
  }>()

  const {
    as = 'td',
    colspan,
    rowspan,
    renderless,
  } = defineProps<DataTableCellProps>()

  const attrs = useAttrs()

  const slotProps = toRef((): DataTableCellSlotProps => ({
    attrs: {
      role: 'cell',
      colspan,
      rowspan,
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
