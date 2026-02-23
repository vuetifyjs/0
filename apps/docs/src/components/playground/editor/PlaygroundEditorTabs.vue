<script setup lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { computed, shallowRef, watch } from 'vue'

  // Data
  import { INFRASTRUCTURE_FILES } from '@/data/playground-defaults'

  const playground = usePlayground()
  const store = playground.store

  function isTabbable (f: { filename: string, hidden?: boolean }) {
    if (f.filename === 'src/main.ts') return true
    if (INFRASTRUCTURE_FILES.has(f.filename)) return false
    if (f.hidden) return false
    return true
  }

  const initialActive = store.activeFile.filename
  const initialClosed = new Set<string>()
  for (const f of Object.values(store.files)) {
    if (isTabbable(f) && f.filename !== initialActive) {
      initialClosed.add(f.filename)
    }
  }
  const closedTabs = shallowRef(initialClosed)
  const tabOrder = shallowRef<string[]>([initialActive])

  const tabs = computed(() => {
    const open = Object.values(store.files)
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

  const model = computed({
    get: () => store.activeFile?.filename,
    set: file => file && store.setActive(String(file)),
  })

  watch(() => store.activeFile?.filename, file => {
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

  function onClickClose (id: string) {
    const list = tabs.value
    const index = list.findIndex(t => t.id === id)
    const nextTab = list[index + 1] ?? list[index - 1] ?? list[0]

    const next = new Set(closedTabs.value)
    next.add(id)
    closedTabs.value = next

    if (id === model.value && nextTab) {
      store.setActive(nextTab.id)
    }
  }
</script>

<template>
  <Tabs.Root v-model="model">
    <Tabs.List
      class="flex items-end gap-px overflow-x-auto border-b border-divider bg-surface-variant/30"
      label="Open files"
    >
      <Tabs.Item
        v-for="tab in tabs"
        :key="tab.id"
        renderless
        :value="tab.id"
      >
        <template #default="{ isSelected, attrs }">
          <div
            v-bind="attrs"
            class="group/tab shrink-0 flex items-center gap-1 pl-3 py-1.5 text-xs transition-colors border-b-2 cursor-pointer"
            :class="[
              isSelected
                ? 'text-on-surface border-primary bg-surface'
                : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-tint',
              tabs.length > 1 ? 'pr-1' : 'pr-3',
            ]"
          >
            <span>{{ tab.label }}</span>

            <button
              v-if="tabs.length > 1"
              :aria-label="`Close ${tab.label}`"
              class="inline-flex items-center justify-center size-4 rounded-sm opacity-0 group-hover/tab:opacity-60 hover:!opacity-100 hover:bg-surface-variant focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-primary transition-opacity"
              tabindex="-1"
              @click.stop="onClickClose(tab.id)"
            >
              <AppIcon icon="close" :size="12" />
            </button>
          </div>
        </template>
      </Tabs.Item>
    </Tabs.List>
  </Tabs.Root>
</template>
