<script setup lang="ts">
  // Composables
  import { createLevelFilter } from '@/composables/useLevelFilter'

  // Stores
  import { useAppStore } from '@/stores/app'

  const app = useAppStore()
  const levelFilter = createLevelFilter(() => app.nav)
  levelFilter.provide()
</script>

<template>
  <div class="flex flex-col" style="min-height: calc(100vh - 72px)">
    <AppBanner />
    <AppBar />
    <main class="flex-1 flex flex-col">
      <router-view />
    </main>
  </div>
</template>
