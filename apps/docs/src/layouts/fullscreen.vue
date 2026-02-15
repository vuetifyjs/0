<script setup lang="ts">
  // Framework
  import { Scrim } from '@vuetify/v0'

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

    <Scrim class="fixed inset-0 bg-black/30 transition-opacity" :teleport="false" />
  </div>
</template>

<style>
  html:has([data-layout="fullscreen"]) {
    scrollbar-gutter: auto;
  }
</style>
