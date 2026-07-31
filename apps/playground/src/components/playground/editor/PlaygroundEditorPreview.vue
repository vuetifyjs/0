<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Composables
  import { usePreviewHealth } from '@/composables/usePreviewHealth'

  // Utilities
  import { defineAsyncComponent, useTemplateRef } from 'vue'

  const playground = usePlayground()
  const theme = useTheme()

  const host = useTemplateRef<HTMLElement>('host')
  const { status, failed, dismissed, reloadKey, retry, dismiss } = usePreviewHealth(
    () => host.value?.querySelector('iframe'),
  )

  const Sandbox = defineAsyncComponent(() =>
    import('@vue/repl').then(m => m.Sandbox),
  )
</script>

<template>
  <div ref="host" class="relative flex-1 min-w-0 min-h-0">
    <Sandbox
      v-if="playground.isReady.value"
      :key="reloadKey"
      :auto-store-init="false"
      :clear-console="false"
      show
      :store="playground.store"
      :theme="theme.isDark.value ? 'dark' : 'light'"
    />

    <div v-else class="absolute inset-0 flex items-center justify-center">
      <AppSkeleton height="h-16" :lines="1" :widths="['w-16']" />
    </div>

    <PlaygroundPreviewError
      v-if="status === 'failed' && !dismissed"
      :failed
      @dismiss="dismiss"
      @retry="retry"
    />
  </div>
</template>

<style>
.toggler { display: none !important; }
.iframe-container { position: absolute; inset: 0; }
</style>
