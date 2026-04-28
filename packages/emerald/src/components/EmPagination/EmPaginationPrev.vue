<script lang="ts">
  // Framework
  import { PaginationPrev } from '@vuetify/v0'

  export interface EmPaginationPrevProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationPrev' })
</script>

<template>
  <PaginationPrev class="emerald-pagination__prev">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PaginationPrev>
</template>

<style>
.emerald-pagination__prev {
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

.emerald-pagination__prev > * {
  width: 16px;
  height: 16px;
}

.emerald-pagination__prev:hover:not([aria-disabled="true"]) {
  background: rgb(var(--emerald-primary-500-channels) / 0.08);
}

.emerald-pagination__prev:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

.emerald-pagination__prev[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
