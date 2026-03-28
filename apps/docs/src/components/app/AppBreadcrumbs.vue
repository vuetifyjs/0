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
