<script lang="ts" setup>
  // Utilities
  import { defineAsyncComponent } from 'vue'

  // Lazy load modal components (behind user interaction)
  const DocsAsk = defineAsyncComponent(() => import('@/components/docs/DocsAsk.vue'))
  const DocsSearch = defineAsyncComponent(() => import('@/components/docs/DocsSearch.vue'))
</script>

<template>
  <AppBanner />
  <AppNav />
  <AppBar />
  <AppMain />
  <AppFooter />

  <DocsAsk />

  <DocsSearch />
</template>
