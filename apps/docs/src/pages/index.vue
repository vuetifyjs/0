<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  useHead({
    title: 'Headless Vue 3 UI Primitives',
    meta: [
      { key: 'description', name: 'description', content: 'Build custom design systems with Vuetify0. Headless, accessible Vue 3 components and composables with zero styling opinions. Full control, full flexibility.' },
      { key: 'og:title', property: 'og:title', content: 'Vuetify0 - Headless Vue 3 UI Primitives' },
      { key: 'og:description', property: 'og:description', content: 'Build custom design systems with Vuetify0. Headless, accessible Vue 3 components and composables with zero styling opinions.' },
    ],
  })
</script>

<template>
  <div class="home-page">
    <HomeHero />
    <HomeFeatures />
    <HomeIntegrations />
    <HomeDemo />
    <HomeEcosystem />
    <HomeCta />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style scoped>
  .home-page :deep(section) {
    border-bottom: thin solid var(--v0-divider);
  }

  .home-page :deep(section:last-child) {
    border-bottom: none;
  }
</style>
