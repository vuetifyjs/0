<script lang="ts">
  export interface EmTableBodyProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableBody' })
</script>

<template>
  <tbody class="emerald-table__body">
    <slot />
  </tbody>
</template>

<style>
.emerald-table__body .emerald-table__cell,
.emerald-table__body .emerald-table__toggle {
  /* TODO(token): 0.5px hairline stroke not in the stroke scale (s = 1px) */
  border-bottom: 0.5px solid var(--emerald-divider);
}

.emerald-table__body tr:last-child .emerald-table__cell,
.emerald-table__body tr:last-child .emerald-table__toggle {
  border-bottom: none;
}
</style>
