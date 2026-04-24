<script lang="ts">
  // Framework
  import { BreadcrumbsEllipsis } from '@vuetify/v0'

  export interface EmBreadcrumbEllipsisProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbEllipsis' })
</script>

<template>
  <BreadcrumbsEllipsis class="emerald-breadcrumb__ellipsis">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </BreadcrumbsEllipsis>
</template>

<style>
.emerald-breadcrumb__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 24px;
  color: rgb(var(--emerald-on-background-channels, 26 18 48) / 0.6);
  user-select: none;
  flex-shrink: 0;
}

.emerald-breadcrumb__ellipsis :deep(svg) {
  width: 16px;
  height: 16px;
}
</style>
