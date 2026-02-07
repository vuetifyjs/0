<script setup lang="ts">
  // Composables
  import { createLevelFilter } from '@/composables/useLevelFilter'
  import { createNavConfig } from '@/composables/useNavConfig'

  // Utilities
  import { defineAsyncComponent } from 'vue'

  // Stores
  import { useAppStore } from '@/stores/app'

  // Lazy load modal components (behind user interaction)
  const HomeAskDialog = defineAsyncComponent(() => import('@/components/home/HomeAskDialog.vue'))
  const DocsSearch = defineAsyncComponent(() => import('@/components/docs/DocsSearch.vue'))

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
    <AppHomePage />
    <AppFooter />

    <HomeAskDialog />
    <DocsSearch />
  </div>
</template>
