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

.emerald-pagination__prev > * {
  width: 20px;
  height: 20px;
}

.emerald-pagination__prev:hover:not([data-disabled]) {
  background: var(--emerald-neutral-200);
}

.emerald-pagination__prev:focus-visible {
  outline: none;
  box-shadow: var(--emerald-shadow-focus);
}

.emerald-pagination__prev[data-disabled] {
  color: var(--emerald-neutral-400);
  cursor: not-allowed;
}
</style>
