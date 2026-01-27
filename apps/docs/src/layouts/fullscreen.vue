<script setup lang="ts">
  // Composables
  import { createLevelFilter } from '@/composables/useLevelFilter'
  import { createNavConfig } from '@/composables/useNavConfig'
  import { useScrollLock } from '@/composables/useScrollLock'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { defineAsyncComponent, toRef } from 'vue'

  // Stores
  import { useAppStore } from '@/stores/app'

  const AppSettingsSheet = defineAsyncComponent(() => import('@/components/app/AppSettingsSheet.vue'))

  const app = useAppStore()
  const levelFilter = createLevelFilter(() => app.nav)
  levelFilter.provide()

  // Capture ?features= param even on fullscreen pages
  const navConfig = createNavConfig(levelFilter.filteredNav)
  navConfig.provide()

  const { isOpen: isSettingsOpen, close: closeSettings, prefersReducedMotion } = useSettings()

  const fadeTransition = toRef(() => prefersReducedMotion.value ? undefined : 'fade')
  const slideTransition = toRef(() => prefersReducedMotion.value ? undefined : 'slide')

  useScrollLock(isSettingsOpen)
</script>

<template>
  <div>
    <a
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded"
      href="#main-content"
    >
      Skip to main content
    </a>

    <div class="flex flex-col" :inert="isSettingsOpen || undefined" style="min-height: calc(100vh - 72px)">
      <AppBanner />
      <AppBar />
      <main id="main-content" class="flex-1 flex flex-col">
        <router-view />
      </main>
    </div>

    <!-- Settings backdrop -->
    <Transition :name="fadeTransition">
      <div
        v-if="isSettingsOpen"
        class="fixed inset-0 bg-black/30 z-40"
        @click="closeSettings"
      />
    </Transition>

    <!-- Settings sheet -->
    <Transition :name="slideTransition">
      <AppSettingsSheet v-if="isSettingsOpen" />
    </Transition>
  </div>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }
</style>
