<script setup lang="ts">
  // Components
  import DocsSearch from '@/components/docs/DocsSearch.vue'

  // Composables
  import { createLevelFilter } from '@/composables/useLevelFilter'

  // Stores
  import { useAppStore } from '@/stores/app'

  const app = useAppStore()
  const levelFilter = createLevelFilter(() => app.nav)
  levelFilter.provide()
</script>

<template>
  <div>
    <AppBanner />
    <AppBar />
    <AppHomeMain />
    <AppFooter />

    <DocsSearch />
  </div>
</template>
