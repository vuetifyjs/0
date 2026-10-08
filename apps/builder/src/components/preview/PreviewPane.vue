<script setup lang="ts">
  import { getPluginBySlug } from '@/data/plugins'

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

  // Per-plugin modules get a titled frame so all fifteen read as one family. The summary
  // composes its own panels, so it is left unframed rather than nested inside a second one.
  const framed = toRef(() => route.path in MODULES)

  const meta = toRef(() => getPluginBySlug(route.path.slice('/builder/'.length)))
</script>

<template>
  <div class="p-4 lg:p-5">
    <div v-if="framed" class="panel overflow-hidden">
      <div class="flex items-center justify-between gap-3 h-10 px-4 border-b border-divider bg-surface-variant/50">
        <p class="t-eyebrow text-on-surface">{{ meta?.title }}</p>

        <span class="font-mono text-[0.6875rem] text-on-surface-variant">{{ meta?.id }}</span>
      </div>

      <div class="p-4">
        <component :is="module" />
      </div>
    </div>

    <component :is="module" v-else />
  </div>
</template>
