<script lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbsList' })
</script>

<template>
  <Breadcrumbs.List class="emerald-breadcrumbs__list">
    <slot />
  </Breadcrumbs.List>
</template>

<style>
  .emerald-breadcrumbs__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
