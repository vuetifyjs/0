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
  box-sizing: border-box;
  width: 32px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: var(--emerald-stroke-s) solid transparent;
  border-radius: var(--emerald-radius-xs);
  color: inherit;
  cursor: pointer;
  transition: background-color 120ms ease;
}

.emerald-pagination__next > * {
  width: 20px;
  height: 20px;
}

.emerald-pagination__next:hover:not([data-disabled]) {
  background: var(--emerald-neutral-200);
}

.emerald-pagination__next:focus-visible {
  outline: none;
  box-shadow: var(--emerald-shadow-focus);
}

.emerald-pagination__next[data-disabled] {
  color: var(--emerald-neutral-400);
  cursor: not-allowed;
}
</style>
