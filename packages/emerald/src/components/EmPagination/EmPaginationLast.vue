<script lang="ts">
  // Framework
  import { PaginationLast } from '@vuetify/v0'

  export interface EmPaginationLastProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationLast' })
</script>

<template>
  <PaginationLast class="emerald-pagination__last">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PaginationLast>
</template>

<style>
.emerald-pagination__last {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 4px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  color: inherit;
  cursor: pointer;
  transition: background-color 120ms ease;
}

.emerald-pagination__last > * {
  width: 16px;
  height: 16px;
}

.emerald-pagination__last:hover:not([aria-disabled="true"]) {
  background: rgb(var(--emerald-primary-500-channels) / 0.08);
}

.emerald-pagination__last:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

.emerald-pagination__last[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
