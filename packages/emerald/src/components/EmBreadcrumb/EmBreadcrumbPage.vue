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
    <slot />
  </BreadcrumbsPage>
</template>

<style>
.emerald-breadcrumb__page {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 400;
  color: rgb(var(--emerald-on-background-channels, 26 18 48) / 0.6);
}
</style>
