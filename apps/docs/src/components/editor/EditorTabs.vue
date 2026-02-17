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

  function isTabbable (f: { filename: string, hidden?: boolean }) {
    if (f.filename === 'src/main.ts') return true
    if (INFRASTRUCTURE_FILES.has(f.filename)) return false
    if (f.hidden) return false
    return true
  }

  // Start with only the active file's tab open
  const initialClosed = new Set<string>()
  const active = props.store.activeFile.filename
  for (const f of Object.values(props.store.files)) {
    if (isTabbable(f) && f.filename !== active) {
      initialClosed.add(f.filename)
    }
  }
  const closedTabs = shallowRef(initialClosed)

  // Track tab open order so new tabs appear at the end
  const tabOrder = shallowRef<string[]>([active])

  const tabs = computed(() => {
    const open = Object.values(props.store.files)
      .filter(f => isTabbable(f) && !closedTabs.value.has(f.filename))
    const order = tabOrder.value
    return open
      .toSorted((a, b) => {
        const ai = order.indexOf(a.filename)
        const bi = order.indexOf(b.filename)
        return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi)
      })
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
    if (!tabOrder.value.includes(file)) {
      tabOrder.value = [...tabOrder.value, file]
    }
  })

  function closeTab (id: string) {
    // Find next tab before modifying state
    const idx = tabs.value.findIndex(t => t.id === id)
    const nextTab = tabs.value[idx + 1] ?? tabs.value[idx - 1] ?? tabs.value[0]

    const next = new Set(closedTabs.value)
    next.add(id)
    closedTabs.value = next

    // If closing the active file, switch to another tab
    if (id === activeFile.value && nextTab) {
      props.store.setActive(nextTab.id)
    }
  }

  function onTabKeydown (e: KeyboardEvent, index: number) {
    const list = tabs.value
    let target: number | null = null

    switch (e.key) {
      case 'ArrowRight': {
        target = (index + 1) % list.length
        break
      }
      case 'ArrowLeft': {
        target = (index - 1 + list.length) % list.length
        break
      }
      case 'Home': {
        target = 0
        break
      }
      case 'End': {
        target = list.length - 1
        break
      }
      default: {
        return
      }
    }

    e.preventDefault()
    props.store.setActive(list[target].id)
  }
</script>

<template>
  <div
    aria-label="Open files"
    class="flex items-end gap-px overflow-x-auto border-b border-divider bg-surface-variant/30"
    role="tablist"
  >
    <div
      v-for="(tab, index) in tabs"
      :key="tab.id"
      :aria-selected="tab.id === activeFile"
      class="group/tab shrink-0 flex items-center gap-1 pl-3 py-1.5 text-xs transition-colors border-b-2 cursor-pointer"
      :class="[
        tab.id === activeFile
          ? 'text-on-surface border-primary bg-surface'
          : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-tint',
        tabs.length > 1 ? 'pr-1' : 'pr-3',
      ]"
      role="tab"
      :tabindex="tab.id === activeFile ? 0 : -1"
      @click="store.setActive(tab.id)"
      @keydown="onTabKeydown($event, index)"
    >
      <span>{{ tab.label }}</span>

      <button
        v-if="tabs.length > 1"
        :aria-label="`Close ${tab.label}`"
        class="inline-flex items-center justify-center size-4 rounded-sm opacity-0 group-hover/tab:opacity-60 hover:!opacity-100 hover:bg-surface-variant focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-primary transition-opacity"
        tabindex="-1"
        @click.stop="closeTab(tab.id)"
      >
        <AppIcon icon="close" :size="12" />
      </button>
    </div>
  </div>
</template>
