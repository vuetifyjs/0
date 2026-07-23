<script lang="ts">
  export interface EmTableRowProps {
    disabled?: boolean
    selected?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableRow' })

  const { disabled = false, selected = false } = defineProps<EmTableRowProps>()
</script>

<template>
  <tr
    class="emerald-table__row"
    :data-disabled="disabled || undefined"
    :data-selected="selected || undefined"
  >
    <slot />
  </tr>
</template>

<style>
.emerald-table__row[data-selected] .emerald-table__cell,
.emerald-table__row[data-selected] .emerald-table__toggle {
  background: var(--emerald-primary-100);
}

.emerald-table__body .emerald-table__row:hover .emerald-table__cell,
.emerald-table__body .emerald-table__row:hover .emerald-table__toggle {
  background: var(--emerald-neutral-200);
}

.emerald-table__body .emerald-table__row[data-selected]:hover .emerald-table__cell,
.emerald-table__body .emerald-table__row[data-selected]:hover .emerald-table__toggle {
  background: var(--emerald-primary-100);
}

.emerald-table__row[data-disabled] .emerald-table__cell,
.emerald-table__row[data-disabled] .emerald-table__toggle {
  color: var(--emerald-neutral-400);
}

.emerald-table__body .emerald-table__row[data-disabled]:hover .emerald-table__cell,
.emerald-table__body .emerald-table__row[data-disabled]:hover .emerald-table__toggle {
  background: transparent;
}
</style>
