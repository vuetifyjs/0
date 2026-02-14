<script setup lang="ts">
  // Utilities
  import { computed, shallowRef, watch } from 'vue'

  // Types
  import type { ReplStore } from '@vue/repl'

  const props = defineProps<{
    store: ReplStore
  }>()

  const PROJECT_FILES = new Set(['import-map.json', 'tsconfig.json', 'src/main.ts', 'src/uno.config.ts'])
  const closedTabs = shallowRef(new Set<string>())

  const tabs = computed(() => {
    return Object.values(props.store.files)
      .filter(f => !f.hidden && !PROJECT_FILES.has(f.filename) && !closedTabs.value.has(f.filename))
      .map(f => ({
        id: f.filename,
        label: f.filename.split('/').pop()!,
      }))
  })

  const hasTabs = computed(() => tabs.value.length > 0)
  defineExpose({ hasTabs })

  const activeFile = computed(() => props.store.activeFile.filename)

  // Re-open tab when file is activated from tree
  watch(activeFile, file => {
    if (closedTabs.value.has(file)) {
      const next = new Set(closedTabs.value)
      next.delete(file)
      closedTabs.value = next
    }
  })

  function openFile (id: string) {
    const next = new Set(closedTabs.value)
    next.delete(id)
    closedTabs.value = next
    props.store.setActive(id)
  }

  function closeTab (id: string) {
    // Find next tab before modifying state
    const idx = tabs.value.findIndex(t => t.id === id)
    const nextTab = tabs.value[idx + 1] ?? tabs.value[idx - 1]

    const next = new Set(closedTabs.value)
    next.add(id)
    closedTabs.value = next

    // If closing the active file, switch to another tab
    if (id === activeFile.value && nextTab) {
      props.store.setActive(nextTab.id)
    }
  }
</script>

<template>
  <div class="flex items-end gap-px overflow-x-auto border-b border-divider bg-surface-variant/30">
    <template v-if="hasTabs">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="group/tab shrink-0 flex items-center gap-1 pl-3 pr-1 py-1.5 text-xs transition-colors border-b-2 cursor-pointer"
        :class="tab.id === activeFile
          ? 'text-on-surface border-primary bg-surface'
          : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-tint'"
        @click="store.setActive(tab.id)"
      >
        <span>{{ tab.label }}</span>

        <button
          aria-label="Close tab"
          class="inline-flex items-center justify-center size-4 rounded-sm opacity-0 group-hover/tab:opacity-60 hover:!opacity-100 hover:bg-surface-variant focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-primary transition-opacity"
          @click.stop="closeTab(tab.id)"
        >
          <AppIcon icon="close" :size="12" />
        </button>
      </div>
    </template>

    <button
      v-else
      class="flex items-center gap-1.5 px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      @click="openFile('src/App.vue')"
    >
      <AppIcon icon="file-plus" :size="14" />
      <span>Open file</span>
    </button>
  </div>
</template>
