<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Utilities
  import { Sandbox } from '@vue/repl'

  const playground = usePlayground()
  const store = playground.store
  const theme = useTheme()
</script>

<template>
  <Discovery.Activator
    active-class="rounded-lg"
    as="div"
    class="flex-1 min-w-0 min-h-0"
    step="preview"
  >
    <Sandbox
      :auto-store-init="false"
      :clear-console="false"
      show
      :store="store"
      :theme="theme.isDark.value ? 'dark' : 'light'"
    />
  </Discovery.Activator>
</template>
