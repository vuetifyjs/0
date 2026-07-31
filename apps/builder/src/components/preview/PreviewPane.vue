<script setup lang="ts">
  // Utilities
  import { defineAsyncComponent, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const PreviewSummary = defineAsyncComponent(() => import('./PreviewSummary.vue'))

  const MODULES: Record<string, ReturnType<typeof defineAsyncComponent>> = {
    '/builder/theme': defineAsyncComponent(() => import('./PreviewTheme.vue')),
    '/builder/breakpoints': defineAsyncComponent(() => import('./PreviewBreakpoints.vue')),
    '/builder/locale': defineAsyncComponent(() => import('./PreviewLocale.vue')),
    '/builder/rtl': defineAsyncComponent(() => import('./PreviewRtl.vue')),
  }

  const route = useRoute()

  const module = toRef(() => MODULES[route.path] ?? PreviewSummary)
</script>

<template>
  <div class="p-4 lg:p-6">
    <p class="text-xs uppercase tracking-wide text-on-surface-variant mb-3">
      Live preview
    </p>

    <component :is="module" />
  </div>
</template>
