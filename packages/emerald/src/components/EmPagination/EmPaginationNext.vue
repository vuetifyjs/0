<script lang="ts">
  // Framework
  import { PaginationNext } from '@vuetify/v0'

  export interface EmPaginationNextProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationNext' })
</script>

<template>
  <PaginationNext class="emerald-pagination__next">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PaginationNext>
</template>

<style>
.emerald-pagination__next {
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

.emerald-pagination__next > * {
  width: 16px;
  height: 16px;
}

.emerald-pagination__next:hover:not([aria-disabled="true"]) {
  background: rgb(var(--emerald-primary-500-channels) / 0.08);
}

.emerald-pagination__next:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

.emerald-pagination__next[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
