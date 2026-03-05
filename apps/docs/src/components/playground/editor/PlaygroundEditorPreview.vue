<script setup lang="ts">
  // Components
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Composables
  import { usePlaygroundTheme } from '@/composables/usePlaygroundTheme'

  // Utilities
  import { Sandbox } from '@vue/repl'

  const playground = usePlayground()
  const store = playground.store
  const { sandboxTheme } = usePlaygroundTheme()
</script>

<template>
  <div class="relative flex-1 min-w-0 min-h-0">
    <Sandbox
      :auto-store-init="false"
      :clear-console="false"
      show
      :store="store"
      :theme="sandboxTheme"
    />
  </div>
</template>

<style>
.toggler { display: none !important; }
.iframe-container { position: absolute; inset: 0; }
</style>
