<script setup lang="ts">
  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useSearch } from '@/composables/useSearch'

  // Utilities
  import { computed, defineAsyncComponent } from 'vue'

  // Lazy load modal components (behind user interaction)
  const DocsAsk = defineAsyncComponent(() => import('@/components/docs/DocsAsk.vue'))
  const DocsSearch = defineAsyncComponent(() => import('@/components/docs/DocsSearch.vue'))

  const { isOpen: isAskOpen } = useAsk()
  const { isOpen: isSearchOpen } = useSearch()
  const isModalOpen = computed(() => isAskOpen.value || isSearchOpen.value)
</script>

<template>
  <a
    class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded"
    href="#main-content"
  >
    Skip to main content
  </a>

  <div :inert="isModalOpen || undefined">
    <AppBanner />
    <AppNav />
    <AppBar />
    <AppMain />
    <AppFooter />
  </div>

  <DocsAsk />

  <DocsSearch />
</template>
