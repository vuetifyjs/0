<script setup lang="ts">
  // Components
  import DocsSearch from '@/components/docs/DocsSearch.vue'

  // Composables
  import { createLevelFilter } from '@/composables/useLevelFilter'
  import { createNavConfig } from '@/composables/useNavConfig'

  // Stores
  import { useAppStore } from '@/stores/app'

  const app = useAppStore()
  const levelFilter = createLevelFilter(() => app.nav)
  levelFilter.provide()

  // Capture ?features= param even on home page
  const navConfig = createNavConfig(levelFilter.filteredNav)
  navConfig.provide()
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
