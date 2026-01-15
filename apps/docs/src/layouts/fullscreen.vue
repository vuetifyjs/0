<script setup lang="ts">
  // Composables
  import { createLevelFilter } from '@/composables/useLevelFilter'
  import { createNavConfig } from '@/composables/useNavConfig'

  // Stores
  import { useAppStore } from '@/stores/app'

  const app = useAppStore()
  const levelFilter = createLevelFilter(() => app.nav)
  levelFilter.provide()

  // Capture ?features= param even on fullscreen pages
  const navConfig = createNavConfig(levelFilter.filteredNav)
  navConfig.provide()
</script>

<template>
  <div>
    <a
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded"
      href="#main-content"
    >
      Skip to main content
    </a>

    <div class="flex flex-col" style="min-height: calc(100vh - 72px)">
      <AppBanner />
      <AppBar />
      <main id="main-content" class="flex-1 flex flex-col">
        <router-view />
      </main>
    </div>
  </div>
</template>
