<script setup lang="ts">
  // Composables
  import { createLevelFilter } from '@/composables/useLevelFilter'
  import { createNavConfig } from '@/composables/useNavConfig'

  // Stores
  import { useAppStore } from '@/stores/app'

  const app = useAppStore()
  const levelFilter = createLevelFilter(() => app.nav)
  levelFilter.provide()

  const navConfig = createNavConfig(levelFilter.filteredNav)
  navConfig.provide()
</script>

<template>
  <div class="fixed inset-0 z-10 flex flex-col bg-background" data-layout="fullscreen">
    <router-view />
  </div>
</template>

<style>
  html:has([data-layout="fullscreen"]) {
    scrollbar-gutter: auto;
  }
</style>
