<script setup lang="ts">
  // Framework
  import { useBreakpoints } from '@vuetify/v0'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { createLevelFilter } from '@/composables/useLevelFilter'
  import { createNavConfig } from '@/composables/useNavConfig'
  import { useScrollLock } from '@/composables/useScrollLock'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, defineAsyncComponent } from 'vue'

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
  const { isOpen: isAskOpen } = useAsk()
  const { isOpen: isSearchOpen } = useSearch()
  const { isOpen: isSettingsOpen } = useSettings()

  const isModalOpen = computed(() => {
    if (isSearchOpen.value) return true
    if (isSettingsOpen.value) return true
    if (isAskOpen.value && !breakpoints.lgAndUp.value) return true
    return false
  })

  const isMobileNavOpen = computed(() => app.drawer && !breakpoints.mdAndUp.value)

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

    <!-- Settings sheet (Dialog handles backdrop internally) -->
    <AppSettingsSheet />
  </div>
</template>
