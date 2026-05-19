<script lang="ts">
  export type EmTableCellAlign = 'start' | 'center' | 'end'

  export interface EmTableCellProps {
    align?: EmTableCellAlign
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableCell' })

  const { align = 'start' } = defineProps<EmTableCellProps>()
</script>

<template>
  <td
    class="emerald-table__cell"
    :data-align="align"
  >
    <slot />
  </td>
</template>

<style>
.emerald-table__cell {
  padding: 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: normal;
  letter-spacing: 0.24px;
  color: #000;
  vertical-align: middle;
  background: transparent;
  transition: background 120ms ease;
}

.emerald-table__cell[data-align="center"] {
  text-align: center;
}

.emerald-table__cell[data-align="end"] {
  text-align: right;
}
</style>
