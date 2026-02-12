<script setup lang="ts">
  // Framework
  import { IN_BROWSER, Scrim, useBreakpoints, useStack } from '@vuetify/v0'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useDiscovery } from '@/composables/useDiscovery'
  import { createLevelFilter } from '@/composables/useLevelFilter'
  import { createNavConfig } from '@/composables/useNavConfig'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, defineAsyncComponent, onScopeDispose, toRef, watch } from 'vue'

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
  const discovery = useDiscovery()
  const ask = useAsk()
  const search = useSearch()
  const settings = useSettings()
  const stack = useStack()

  // Force reduced motion during tours so elements don't animate
  watch(() => discovery.isActive.value, active => {
    settings.forceReducedMotion.value = active
  })

  const slideTransition = toRef(() => settings.prefersReducedMotion.value ? undefined : 'slide')

  const isModalOpen = computed(() => {
    if (search.isOpen.value) return true
    if (settings.isOpen.value) return true
    if (ask.isOpen.value && !breakpoints.lgAndUp.value) return true
    return false
  })

  // Unified scroll lock via stack
  watch(() => stack.isActive.value, active => {
    if (!IN_BROWSER) return
    document.body.style.overflow = active ? 'hidden' : ''
  }, { immediate: true })

  onScopeDispose(() => {
    if (!IN_BROWSER) return
    document.body.style.overflow = ''
  })
</script>

<template>
  <div>
    <a
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded"
      href="#main-content"
    >
      Skip to main content
    </a>

    <div class="min-h-[calc(100vh-72px)] pt-[72px] flex flex-col" :inert="isModalOpen || undefined">
      <AppBanner />
      <AppNav />
      <AppBar />
      <AppMain class="flex-1" />
      <AppFooter inset />
    </div>

    <DocsAsk />

    <DocsSearch />

    <!-- Unified scrim for all overlays (teleport disabled to share stacking context) -->
    <Scrim class="fixed inset-0 bg-black/30 transition-opacity" :teleport="false" />

    <!-- Settings sheet -->
    <Transition :name="slideTransition">
      <AppSettingsSheet v-if="settings.isOpen.value" />
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
