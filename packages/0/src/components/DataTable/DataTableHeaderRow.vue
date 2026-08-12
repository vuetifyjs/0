<script lang="ts">
  /**
   * @module DataTableHeaderRow
   *
   * @see https://0.vuetifyjs.com/components/data/data-table
   *
   * @remarks
   * A `<tr>` element for header rows. Use inside DataTable.Head to render
   * one or more header rows from the 2D header grid.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { mergeProps, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DataTableHeaderRowProps extends AtomProps {}

  export interface DataTableHeaderRowSlotProps {
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataTableHeaderRow', inheritAttrs: false })

  defineSlots<{
    default: (props: DataTableHeaderRowSlotProps) => unknown
  }>()

  const {
    as = 'tr',
    renderless,
  } = defineProps<DataTableHeaderRowProps>()

  const attrs = useAttrs()

  const slotProps: DataTableHeaderRowSlotProps = {
    attrs: {},
  }
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
