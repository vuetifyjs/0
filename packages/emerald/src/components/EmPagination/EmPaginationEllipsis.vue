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
  width: 32px;
  height: 32px;
  padding: 8px;
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.7);
  user-select: none;
}

.emerald-pagination__ellipsis > * {
  width: 16px;
  height: 16px;
}
</style>
