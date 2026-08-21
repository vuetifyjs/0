<script setup lang="ts">
  import { BuBreadcrumb } from '@paper/bulma'

  const items = [
    { text: 'Bulma', href: '#' },
    { text: 'Documentation', href: '#' },
    { text: 'Components', href: '#' },
    { text: 'Breadcrumb', href: '#' },
  ]
</script>

<template>
  <BuBreadcrumb :items />
</template>
