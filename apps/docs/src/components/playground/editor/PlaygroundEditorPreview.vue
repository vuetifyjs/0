<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Utilities
  import { Sandbox } from '@vue/repl'

  const playground = usePlayground()
  const store = playground.store
  const theme = useTheme()
</script>

<template>
  <div class="flex-1 min-w-0 min-h-0">
    <Sandbox
      :auto-store-init="false"
      :clear-console="false"
      show
      :store="store"
      :theme="theme.isDark.value ? 'dark' : 'light'"
    />
  </div>
</template>
