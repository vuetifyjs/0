<script setup lang="ts">
  // Composables
  import { useRouterLinks } from '@/composables/useRouterLinks'

  // Utilities
  import { useTemplateRef } from 'vue'

  const mainRef = useTemplateRef<HTMLElement>('main')

  useRouterLinks(mainRef)
</script>

<template>
  <main id="main-content" ref="main">
    <router-view />
  </main>
</template>
