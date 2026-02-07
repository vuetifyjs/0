<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  useHead({
    title: 'The AI-Native Headless Framework for Vue',
    meta: [
      { key: 'description', name: 'description', content: 'Build custom design systems with Vuetify0. AI-native headless Vue 3 components and composables with published benchmarks, MCP integration, and zero styling opinions.' },
      { key: 'og:title', property: 'og:title', content: 'Vuetify0 - The AI-Native Headless Framework for Vue' },
      { key: 'og:description', property: 'og:description', content: 'Composable-first primitives. AI-integrated docs. Published benchmarks. Built by Vuetify.' },
    ],
  })
</script>

<template>
  <div class="home-page">
    <HomeHero />
    <HomeAiFirst />
    <HomeArchitecture />
    <HomeBenchmarks />
    <HomeDx />
    <HomeEcosystem />
    <HomeFoundation />
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

  .home-page :deep(section) {
    max-width: 900px;
    margin-inline: auto;
    padding-inline: 1rem;
  }

  @media (max-width: 639.98px) {
    .home-page :deep(section) {
      padding-inline: 0;
    }
  }
</style>
