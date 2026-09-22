<script setup lang="ts">
  // Framework
  import { Dialog, useHotkey } from '@vuetify/v0'

  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'

  // Context
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { computed } from 'vue'

  const playground = usePlayground()
  const open = computed({
    get: () => playground.cheatsheet.value,
    set: value => {
      playground.cheatsheet.value = value
    },
  })

  const shortcuts = [
    { action: 'File tree', keys: 'Ctrl+B' },
    { action: 'Format', keys: 'Ctrl/Cmd+S' },
    { action: 'Hard reload', keys: 'Ctrl/Cmd+Shift+R' },
    { action: 'Keyboard shortcuts', keys: '?' },
  ] as const

  function onToggle () {
    playground.cheatsheet.value = !playground.cheatsheet.value
  }

  useHotkey('shift+?', onToggle)
  useHotkey('?', onToggle)
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Content
      class="m-auto rounded-lg bg-surface border border-divider w-[min(20rem,calc(100vw-2rem))] p-0 shadow-xl"
    >
      <div class="flex items-start justify-between gap-3 px-4 py-3 border-b border-divider">
        <Dialog.Title as="h2" class="text-sm font-medium text-on-surface">
          Keyboard shortcuts
        </Dialog.Title>

        <AppCloseButton @click="playground.cheatsheet.value = false" />
      </div>

      <ul class="py-1">
        <li
          v-for="item in shortcuts"
          :key="item.action"
          class="flex items-center justify-between gap-4 px-4 py-1.5 text-xs text-on-surface"
        >
          <span>{{ item.action }}</span>

          <kbd class="shrink-0 px-1.5 py-0.5 rounded border border-divider bg-surface-variant font-mono text-[10px] text-on-surface-variant">
            {{ item.keys }}
          </kbd>
        </li>
      </ul>
    </Dialog.Content>
  </Dialog.Root>
</template>
