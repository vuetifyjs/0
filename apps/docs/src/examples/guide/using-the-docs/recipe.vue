<script setup lang="ts">
  import { useHotkey } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const count = shallowRef(0)

  useHotkey('shift+k', () => count.value++)
</script>

<template>
  <div class="flex items-center gap-3">
    <kbd class="px-2 py-1 border border-divider rounded bg-surface-tint text-xs font-mono">Shift+K</kbd>
    <span class="text-sm">Pressed {{ count }} times</span>
  </div>
</template>
