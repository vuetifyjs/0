<script setup lang="ts">
  // Utilities
  import { computed, shallowRef, watch } from 'vue'

  // Types
  import type { ReplStore } from '@vue/repl'

  // Data
  import { INFRASTRUCTURE_FILES } from '@/data/editor-defaults'

  const props = defineProps<{
    store: ReplStore
  }>()

  // Start with only the active file's tab open
  const initialClosed = new Set<string>()
  const active = props.store.activeFile.filename
  for (const f of Object.values(props.store.files)) {
    if (!f.hidden && !INFRASTRUCTURE_FILES.has(f.filename) && f.filename !== active) {
      initialClosed.add(f.filename)
    }
  }
  const closedTabs = shallowRef(initialClosed)

  const tabs = computed(() => {
    return Object.values(props.store.files)
      .filter(f => !f.hidden && !INFRASTRUCTURE_FILES.has(f.filename) && !closedTabs.value.has(f.filename))
      .map(f => ({
        id: f.filename,
        label: f.filename.split('/').pop()!,
      }))
  })

  const activeFile = computed(() => props.store.activeFile?.filename)

  // Re-open tab when file is activated from tree
  watch(activeFile, file => {
    if (!file) return
    if (closedTabs.value.has(file)) {
      const next = new Set(closedTabs.value)
      next.delete(file)
      closedTabs.value = next
    }
  })

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
    <div
      v-for="tab in tabs"
      :key="tab.id"
      class="group/tab shrink-0 flex items-center gap-1 pl-3 py-1.5 text-xs transition-colors border-b-2 cursor-pointer"
      :class="[
        tab.id === activeFile
          ? 'text-on-surface border-primary bg-surface'
          : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-tint',
        tabs.length > 1 ? 'pr-1' : 'pr-3',
      ]"
      @click="store.setActive(tab.id)"
    >
      <span>{{ tab.label }}</span>

      <button
        v-if="tabs.length > 1"
        aria-label="Close tab"
        class="inline-flex items-center justify-center size-4 rounded-sm opacity-0 group-hover/tab:opacity-60 hover:!opacity-100 hover:bg-surface-variant focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-primary transition-opacity"
        @click.stop="closeTab(tab.id)"
      >
        <AppIcon icon="close" :size="12" />
      </button>
    </div>
  </div>
</template>
