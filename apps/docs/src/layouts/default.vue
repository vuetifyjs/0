<script setup lang="ts">
  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { defineAsyncComponent, watch } from 'vue'

  const DocsAsk = defineAsyncComponent(() => import('@/components/docs/DocsAsk.vue'))

  const discovery = useDiscovery()
  const settings = useSettings()

  // Force reduced motion during tours so elements don't animate.
  watch(() => discovery.isActive.value, active => {
    settings.forceReducedMotion.value = active
  })
</script>

<template>
  <div class="min-h-[calc(100vh-48px-var(--app-banner-h,24px))] flex flex-col">
    <AppNav />
    <AppMainDocs class="flex-1" />
    <AppFooter inset />
  </div>

  <DocsAsk />
</template>
