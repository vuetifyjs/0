<script lang="ts" setup>
  import { useHead, useSeoMeta } from '@unhead/vue'

  useHead({
    title: 'Headless Vue 3 UI Primitives',
  })

  useSeoMeta({
    description: 'Build custom design systems with Vuetify0. Headless, accessible Vue 3 components and composables with zero styling opinions. Full control, full flexibility.',
    ogTitle: 'Vuetify0 - Headless Vue 3 UI Primitives',
    ogDescription: 'Build custom design systems with Vuetify0. Headless, accessible Vue 3 components and composables with zero styling opinions.',
    twitterTitle: 'Vuetify0 - Headless Vue 3 UI Primitives',
    twitterDescription: 'Build custom design systems with Vuetify0. Headless, accessible Vue 3 components and composables with zero styling opinions.',
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
