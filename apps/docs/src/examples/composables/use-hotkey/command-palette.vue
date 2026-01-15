<script setup lang="ts">
  import { Dialog, useHotkey, useToggleScope } from '@vuetify/v0'
  import { IN_BROWSER } from '@vuetify/v0/constants'
  import { computed, shallowRef, useTemplateRef, watch } from 'vue'

  const isOpen = shallowRef(false)
  const query = shallowRef('')
  const selectedIndex = shallowRef(0)
  const inputRef = useTemplateRef('input')

  const isMac = IN_BROWSER && navigator.userAgent.includes('Mac')
  const modKey = isMac ? '⌘' : 'Ctrl'

  const lastAction = shallowRef('')

  const commands = [
    { id: 'theme', label: 'Toggle theme', icon: 'i-mdi-brightness-6', hotkey: 'L', action: () => lastAction.value = 'Toggled theme' },
    { id: 'search', label: 'Search docs', icon: 'i-mdi-magnify', hotkey: 'S', action: () => lastAction.value = 'Opened search' },
    { id: 'home', label: 'Go to home', icon: 'i-mdi-home', hotkey: 'H', action: () => lastAction.value = 'Navigated home' },
    { id: 'github', label: 'View on GitHub', icon: 'i-mdi-github', hotkey: 'G', action: () => lastAction.value = 'Opened GitHub' },
    { id: 'copy', label: 'Copy link', icon: 'i-mdi-link', hotkey: 'C', action: () => lastAction.value = 'Copied link' },
    { id: 'feedback', label: 'Send feedback', icon: 'i-mdi-message-outline', hotkey: 'F', action: () => lastAction.value = 'Opened feedback' },
  ]

  const filtered = computed(() =>
    commands.filter(c => c.label.toLowerCase().includes(query.value.toLowerCase())),
  )

  // Global hotkey to open palette
  useHotkey('cmd+j', () => {
    isOpen.value = true
  })

  // Hotkeys active only when palette is open
  useToggleScope(isOpen, () => {
    // Command shortcuts (inputs: true to work while typing in search)
    for (const cmd of commands) {
      useHotkey(`cmd+${cmd.hotkey.toLowerCase()}`, () => {
        cmd.action()
        isOpen.value = false
      }, { inputs: true })
    }

    // Navigation
    useHotkey('arrowdown', () => {
      selectedIndex.value = (selectedIndex.value + 1) % filtered.value.length
    }, { inputs: true })

    useHotkey('arrowup', () => {
      selectedIndex.value = (selectedIndex.value - 1 + filtered.value.length) % filtered.value.length
    }, { inputs: true })
  })

  watch(isOpen, open => {
    if (open) {
      query.value = ''
      selectedIndex.value = 0
      setTimeout(() => inputRef.value?.focus(), 0)
    }
  })

  watch(filtered, () => {
    selectedIndex.value = 0
  })
</script>

<template>
  <div class="text-center">
    <Dialog.Root v-model="isOpen">
      <Dialog.Activator class="inline-flex items-center gap-3 px-4 py-2 bg-surface border border-divider rounded-lg hover:border-primary transition-colors">
        <span class="i-mdi-magnify text-on-surface-variant" />
        <span class="text-on-surface-variant">Search commands...</span>
        <kbd class="ml-4 px-1.5 py-0.5 text-xs font-mono bg-surface-variant text-on-surface-variant rounded">
          {{ modKey }}+J
        </kbd>
      </Dialog.Activator>

      <p v-if="lastAction" class="mt-3 text-sm text-on-surface-variant">
        Last action: <span class="text-primary font-medium">{{ lastAction }}</span>
      </p>

      <Dialog.Content class="w-full max-w-lg mx-auto mt-[15vh] rounded-xl bg-surface border border-divider shadow-2xl overflow-hidden text-left">
        <div class="flex items-center gap-3 px-4 py-3 border-b border-divider">
          <span class="i-mdi-magnify text-xl text-on-surface-variant" />
          <input
            ref="input"
            v-model="query"
            class="flex-1 bg-transparent text-on-surface outline-none placeholder:text-on-surface-variant"
            placeholder="Type a command..."
          >
          <kbd class="px-1.5 py-0.5 text-xs font-mono bg-surface-variant text-on-surface-variant rounded">ESC</kbd>
        </div>

        <div class="max-h-72 overflow-auto py-2">
          <Dialog.Close
            v-for="(cmd, i) in filtered"
            :key="cmd.id"
            as="button"
            class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
            :class="i === selectedIndex ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-variant'"
            @click="cmd.action()"
            @mouseenter="selectedIndex = i"
          >
            <span class="text-lg" :class="cmd.icon" />
            <span class="flex-1">{{ cmd.label }}</span>
            <kbd class="px-1.5 py-0.5 text-xs font-mono bg-surface-variant/50 rounded">
              {{ modKey }}+{{ cmd.hotkey }}
            </kbd>
          </Dialog.Close>
          <div v-if="filtered.length === 0" class="px-4 py-8 text-center text-on-surface-variant">
            No commands found
          </div>
        </div>

        <div class="flex items-center gap-4 px-4 py-2 border-t border-divider text-xs text-on-surface-variant">
          <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 bg-surface-variant rounded">↑</kbd><kbd class="px-1 py-0.5 bg-surface-variant rounded">↓</kbd> navigate</span>
          <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 bg-surface-variant rounded">↵</kbd> select</span>
          <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 bg-surface-variant rounded">esc</kbd> close</span>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  </div>
</template>
