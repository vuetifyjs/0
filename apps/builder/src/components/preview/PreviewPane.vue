<script setup lang="ts">
  // Utilities
  import { defineAsyncComponent, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const PreviewSummary = defineAsyncComponent(() => import('./PreviewSummary.vue'))

  const MODULES: Record<string, ReturnType<typeof defineAsyncComponent>> = {
    '/builder/theme': defineAsyncComponent(() => import('./PreviewTheme.vue')),
    '/builder/breakpoints': defineAsyncComponent(() => import('./PreviewBreakpoints.vue')),
    '/builder/reduced-motion': defineAsyncComponent(() => import('./PreviewReducedMotion.vue')),
    '/builder/locale': defineAsyncComponent(() => import('./PreviewLocale.vue')),
    '/builder/rtl': defineAsyncComponent(() => import('./PreviewRtl.vue')),
    '/builder/date': defineAsyncComponent(() => import('./PreviewDate.vue')),
    '/builder/storage': defineAsyncComponent(() => import('./PreviewStorage.vue')),
    '/builder/logger': defineAsyncComponent(() => import('./PreviewLogger.vue')),
    '/builder/stack': defineAsyncComponent(() => import('./PreviewStack.vue')),
    '/builder/tooltip': defineAsyncComponent(() => import('./PreviewTooltip.vue')),
    '/builder/notifications': defineAsyncComponent(() => import('./PreviewNotifications.vue')),
    '/builder/features': defineAsyncComponent(() => import('./PreviewFeatures.vue')),
    '/builder/permissions': defineAsyncComponent(() => import('./PreviewPermissions.vue')),
    '/builder/rules': defineAsyncComponent(() => import('./PreviewRules.vue')),
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
