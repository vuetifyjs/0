<script lang="ts">
  export interface EmTableHeadProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableHead' })
</script>

<template>
  <thead class="emerald-table__head">
    <slot />
  </thead>
</template>

<style>
.emerald-table__head .emerald-table__header {
  background: var(--emerald-secondary-50, #f4f7f9);
}

.emerald-table__head tr > .emerald-table__header:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.emerald-table__head tr > .emerald-table__header:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
</style>
