<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Utilities
  import { defineAsyncComponent } from 'vue'

  const playground = usePlayground()
  const theme = useTheme()

  const Sandbox = defineAsyncComponent(() =>
    import('@vue/repl').then(m => m.Sandbox),
  )
</script>

<template>
  <div class="relative flex-1 min-w-0 min-h-0">
    <Sandbox
      v-if="playground.isReady.value"
      :auto-store-init="false"
      :clear-console="false"
      show
      :store="playground.store"
      :theme="theme.isDark.value ? 'dark' : 'light'"
    />

    <div v-else class="absolute inset-0 flex items-center justify-center">
      <DocsSkeleton height="h-16" :lines="1" :widths="['w-16']" />
    </div>
  </div>
</template>

<style>
.toggler { display: none !important; }
.iframe-container { position: absolute; inset: 0; }
</style>
