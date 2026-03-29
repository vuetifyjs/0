<script setup lang="ts">
  import { HxBreadcrumbs } from '@paper/helix'

  // Composables
  import { useBreadcrumbItems } from '@/composables/useBreadcrumbItems'

  // Utilities
  import { toRef } from 'vue'
  import { RouterLink } from 'vue-router'

  const items = useBreadcrumbItems()

  const breadcrumbs = toRef(() => items.value.map(item => ({
    label: item.text,
    to: item.to,
  })))
</script>

<template>
  <HxBreadcrumbs
    class="text-sm"
    :items="breadcrumbs"
    :link-component="RouterLink"
  />
</template>

<style scoped>
  :deep(.helix-breadcrumbs__divider) {
    color: var(--v0-on-surface-variant);
    list-style: none;
    margin: 0;
  }

  :deep(.helix-breadcrumbs__page) {
    color: var(--v0-on-surface-variant);
    white-space: nowrap;
  }

  :deep(.helix-breadcrumbs__link) {
    cursor: pointer;
    color: var(--v0-primary);
    white-space: nowrap;
  }

  :deep(.helix-breadcrumbs__link:hover) {
    text-decoration: underline;
  }
</style>
