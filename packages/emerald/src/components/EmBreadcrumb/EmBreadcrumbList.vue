<script lang="ts">
  // Framework
  import { BreadcrumbsList } from '@vuetify/v0'

  export interface EmBreadcrumbListProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbList' })
</script>

<template>
  <BreadcrumbsList class="emerald-breadcrumb__list">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </BreadcrumbsList>
</template>

<style>
.emerald-breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
