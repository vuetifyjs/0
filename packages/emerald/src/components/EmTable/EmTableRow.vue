<script lang="ts">
  export interface EmTableRowProps {
    selected?: boolean
    /** Visually mark the row as expanded (used alongside EmTableExpandRow). */
    expanded?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableRow' })

  const { selected = false, expanded = false } = defineProps<EmTableRowProps>()
</script>

<template>
  <tr
    class="emerald-table__row"
    :data-expanded="expanded || undefined"
    :data-selected="selected || undefined"
  >
    <slot />
  </tr>
</template>

<style>
.emerald-table__row[data-selected] .emerald-table__cell {
  background: var(--emerald-background, #faf9ff);
}

.emerald-table__body .emerald-table__row:hover .emerald-table__cell {
  background: rgb(var(--emerald-primary-500-channels) / 0.04);
}

.emerald-table__body .emerald-table__row[data-selected]:hover .emerald-table__cell {
  background: var(--emerald-background, #faf9ff);
}
</style>
