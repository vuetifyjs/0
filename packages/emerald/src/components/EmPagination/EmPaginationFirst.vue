<script lang="ts">
  // Framework
  import { PaginationFirst } from '@vuetify/v0'

  export interface EmPaginationFirstProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationFirst' })
</script>

<template>
  <PaginationFirst class="emerald-pagination__first">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PaginationFirst>
</template>

<style>
.emerald-pagination__first {
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

.emerald-pagination__first > * {
  width: 16px;
  height: 16px;
}

.emerald-pagination__first:hover:not([aria-disabled="true"]) {
  background: rgb(var(--emerald-primary-500-channels) / 0.08);
}

.emerald-pagination__first:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

.emerald-pagination__first[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
