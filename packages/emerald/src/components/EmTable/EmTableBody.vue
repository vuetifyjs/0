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
.emerald-table__body .emerald-table__cell {
  border-bottom: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
}

.emerald-table__body tr:last-child .emerald-table__cell {
  border-bottom: none;
}
</style>
