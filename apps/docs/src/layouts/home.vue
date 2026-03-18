<script setup lang="ts">
  // Framework
  import { Scrim, useStack } from '@vuetify/v0'

  // Composables
  import { createLevelFilter } from '@/composables/useLevelFilter'
  import { createNavConfig } from '@/composables/useNavConfig'
  import { useScrollLock } from '@/composables/useScrollLock'

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

  const stack = useStack()
  useScrollLock(() => stack.isActive.value)
</script>

<template>
  <div class="pt-[72px]">
    <AppBanner />
    <AppBar />
    <AppHomePage />
    <AppFooter />

    <HomeAskDialog />
    <DocsSearch />

    <Scrim class="fixed inset-0 bg-black/30 transition-opacity" :teleport="false" />
  </div>
</template>
