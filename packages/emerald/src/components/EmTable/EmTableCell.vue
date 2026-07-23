<script lang="ts">
  export type EmTableCellAlign = 'start' | 'center' | 'end'

  export interface EmTableCellProps {
    align?: EmTableCellAlign
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableCell' })

  const { align = 'start', disabled = false } = defineProps<EmTableCellProps>()
</script>

<template>
  <td
    class="emerald-table__cell"
    :data-align="align"
    :data-disabled="disabled || undefined"
  >
    <slot />
  </td>
</template>

<style>
.emerald-table__cell {
  padding: var(--emerald-spacing-s);
  vertical-align: middle;
  background: transparent;
  transition: background 120ms ease;
}

.emerald-table__cell[data-align="center"] {
  text-align: center;
}

.emerald-table__cell[data-align="end"] {
  text-align: end;
}

.emerald-table__cell[data-disabled] {
  color: var(--emerald-neutral-400);
}
</style>
