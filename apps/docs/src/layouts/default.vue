<script setup lang="ts">
  // Framework
  import { useBreakpoints } from '@vuetify/v0'

  // Composables
  import { useAskSheet } from '@/composables/useAskSheet'
  import { createLevelFilter } from '@/composables/useLevelFilter'
  import { createNavConfig } from '@/composables/useNavConfig'
  import { useScrollLock } from '@/composables/useScrollLock'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, defineAsyncComponent, toRef } from 'vue'

  // Stores
  import { useAppStore } from '@/stores/app'

  // Lazy load modal components (behind user interaction)
  const DocsAsk = defineAsyncComponent(() => import('@/components/docs/DocsAsk.vue'))
  const DocsSearch = defineAsyncComponent(() => import('@/components/docs/DocsSearch.vue'))
  const AppSettingsSheet = defineAsyncComponent(() => import('@/components/app/AppSettingsSheet.vue'))

  const app = useAppStore()
  const levelFilter = createLevelFilter(() => app.nav)
  levelFilter.provide()

  const navConfig = createNavConfig(levelFilter.filteredNav)
  navConfig.provide()

  const breakpoints = useBreakpoints()
  const { isOpen: isAskOpen } = useAskSheet()
  const { isOpen: isSearchOpen } = useSearch()
  const { isOpen: isSettingsOpen, close: closeSettings, prefersReducedMotion } = useSettings()

  const fadeTransition = toRef(() => prefersReducedMotion.value ? undefined : 'fade')
  const slideTransition = toRef(() => prefersReducedMotion.value ? undefined : 'slide')

  const isModalOpen = computed(() => {
    if (isSearchOpen.value) return true
    if (isSettingsOpen.value) return true
    if (isAskOpen.value && !breakpoints.lgAndUp.value) return true
    return false
  })

  const isMobileNavOpen = toRef(() => app.drawer && !breakpoints.mdAndUp.value)

  useScrollLock(isSettingsOpen)
  useScrollLock(isMobileNavOpen)
</script>

<template>
  <div>
    <a
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded"
      href="#main-content"
    >
      Skip to main content
    </a>

    <div class="min-h-[calc(100vh-72px)] flex flex-col" :inert="isModalOpen || undefined">
      <AppBanner />
      <AppNav />
      <AppBar />
      <AppMain class="flex-1" />
      <AppFooter inset />
    </div>

    <DocsAsk />

    <DocsSearch />

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
