<script lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBreadcrumbsPage' })
</script>

<template>
  <Breadcrumbs.Page class="emerald-breadcrumbs__page">
    <slot />
  </Breadcrumbs.Page>
</template>

<style>
  .emerald-breadcrumbs__page {
    font-weight: var(--emerald-text-b2-bold-weight, 600);
    color: var(--emerald-neutral-900, #494a4c);
  }
</style>
