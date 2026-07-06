<script lang="ts">
  // Framework
  import { BreadcrumbsPage } from '@vuetify/v0'

  export interface EmBreadcrumbPageProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbPage' })
</script>

<template>
  <BreadcrumbsPage class="emerald-breadcrumb__page">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </BreadcrumbsPage>
</template>

<style>
.emerald-breadcrumb__page {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs, 4px);
  color: var(--emerald-neutral-400, #aeb6be);
}
</style>
