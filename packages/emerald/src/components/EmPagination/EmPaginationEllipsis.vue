<script lang="ts">
  // Framework
  import { PaginationEllipsis } from '@vuetify/v0'

  export interface EmPaginationEllipsisProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationEllipsis' })
</script>

<template>
  <PaginationEllipsis class="emerald-pagination__ellipsis">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PaginationEllipsis>
</template>

<style>
.emerald-pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 32px;
  height: 28px;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  color: inherit;
  user-select: none;
}

.emerald-pagination__ellipsis > * {
  width: 20px;
  height: 20px;
}
</style>
