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
  <p class="is-size-7 has-text-grey mb-2">arrow</p>

  <BuBreadcrumb class="mb-5" :items separator="arrow" />

  <p class="is-size-7 has-text-grey mb-2">bullet</p>

  <BuBreadcrumb :items separator="bullet" />
</template>
