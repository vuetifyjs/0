<script setup lang="ts">
  // Utilities
  import { computed } from 'vue'

  // Types
  import type { ReplStore } from '@vue/repl'

  const props = defineProps<{
    store: ReplStore
  }>()

  const PROJECT_FILES = new Set(['import-map.json', 'tsconfig.json', 'src/main.ts', 'src/uno.config.ts'])

  const tabs = computed(() => {
    return Object.values(props.store.files)
      .filter(f => !f.hidden && !PROJECT_FILES.has(f.filename))
      .map(f => ({
        id: f.filename,
        label: f.filename.split('/').pop()!,
      }))
  })

  const activeFile = computed(() => props.store.activeFile.filename)
</script>

<template>
  <div class="flex items-end gap-px overflow-x-auto border-b border-divider bg-surface-variant/30">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="shrink-0 px-3 py-1.5 text-xs transition-colors border-b-2 cursor-pointer"
      :class="tab.id === activeFile
        ? 'text-on-surface border-primary bg-surface'
        : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-tint'"
      @click="store.setActive(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
