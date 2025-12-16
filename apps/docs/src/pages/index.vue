<script lang="ts" setup>
  //
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
