<script setup lang="ts">
  // Components
  import PlaygroundFileTree from '@/components/playground/PlaygroundFileTree.vue'

  // Types
  import type { ReplStore } from '@vue/repl'

  const { store, fileTreeKey, zIndex } = defineProps<{
    store: ReplStore
    fileTreeKey: number
    zIndex: number
  }>()

  const emit = defineEmits<{
    close: []
  }>()
</script>

<template>
  <div
    aria-label="File browser"
    class="fixed top-0 bottom-0 left-0 w-[260px] flex flex-col bg-surface border-r border-divider"
    role="dialog"
    :style="{ zIndex }"
  >
    <div class="flex items-center justify-end px-2 py-1">
      <button
        aria-label="Close file browser"
        class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint transition-colors"
        @click="emit('close')"
      >
        <AppIcon icon="close" :size="18" />
      </button>
    </div>

    <PlaygroundFileTree
      :key="fileTreeKey"
      class="flex-1 min-h-0"
      :store="store"
    />
  </div>
</template>
