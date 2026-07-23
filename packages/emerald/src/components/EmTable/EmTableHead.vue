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
.emerald-table__head tr > .emerald-table__header:first-child {
  border-start-start-radius: var(--emerald-radius-m);
  border-end-start-radius: var(--emerald-radius-m);
}

.emerald-table__head tr > .emerald-table__header:last-child {
  border-start-end-radius: var(--emerald-radius-m);
  border-end-end-radius: var(--emerald-radius-m);
}
</style>
