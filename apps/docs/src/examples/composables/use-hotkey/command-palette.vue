<script setup lang="ts">
  import { useHotkey } from '@vuetify/v0'
  import { computed, shallowRef, useTemplateRef, watch } from 'vue'

  const isOpen = shallowRef(false)
  const query = shallowRef('')
  const selectedIndex = shallowRef(0)
  const inputRef = useTemplateRef('input')

  const isMac = navigator.userAgent.includes('Mac')
  const modKey = isMac ? '\u2318' : 'Ctrl'

  const commands = [
    { id: 'theme', label: 'Toggle theme', icon: 'i-mdi-brightness-6', hotkey: 'T' },
    { id: 'search', label: 'Search docs', icon: 'i-mdi-magnify', hotkey: 'S' },
    { id: 'home', label: 'Go to home', icon: 'i-mdi-home', hotkey: 'H' },
    { id: 'github', label: 'View on GitHub', icon: 'i-mdi-github', hotkey: 'G' },
    { id: 'copy', label: 'Copy link', icon: 'i-mdi-link', hotkey: 'C' },
    { id: 'feedback', label: 'Send feedback', icon: 'i-mdi-message-outline', hotkey: 'F' },
  ]

  const filtered = computed(() =>
    commands.filter(c => c.label.toLowerCase().includes(query.value.toLowerCase())),
  )

  useHotkey('cmd+j', () => {
    isOpen.value = true
  })
  useHotkey('escape', () => {
    isOpen.value = false
  }, { inputs: true })
  useHotkey('arrowdown', () => {
    selectedIndex.value = (selectedIndex.value + 1) % filtered.value.length
  }, { inputs: true })
  useHotkey('arrowup', () => {
    selectedIndex.value = (selectedIndex.value - 1 + filtered.value.length) % filtered.value.length
  }, { inputs: true })

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
  <div class="flex justify-center">
    <button
      class="inline-flex items-center gap-3 px-4 py-2 bg-surface border border-divider rounded-lg hover:border-primary transition-colors"
      @click="isOpen = true"
    >
      <span class="i-mdi-magnify text-on-surface-variant" />
      <span class="text-on-surface-variant">Search commands...</span>
      <kbd class="ml-4 px-1.5 py-0.5 text-xs font-mono bg-surface-variant text-on-surface-variant rounded">
        {{ modKey }}+J
      </kbd>
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-150"
        enter-from-class="opacity-0"
        leave-active-class="transition-all duration-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50" @click.self="isOpen = false">
          <div class="w-full max-w-lg bg-surface border border-divider rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
              <button
                v-for="(cmd, i) in filtered"
                :key="cmd.id"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                :class="i === selectedIndex ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-variant'"
                @click="isOpen = false"
                @mouseenter="selectedIndex = i"
              >
                <span class="text-lg" :class="cmd.icon" />
                <span class="flex-1">{{ cmd.label }}</span>
                <kbd class="px-1.5 py-0.5 text-xs font-mono bg-surface-variant/50 rounded">
                  {{ modKey }}+{{ cmd.hotkey }}
                </kbd>
              </button>
              <div v-if="filtered.length === 0" class="px-4 py-8 text-center text-on-surface-variant">
                No commands found
              </div>
            </div>

            <div class="flex items-center gap-4 px-4 py-2 border-t border-divider text-xs text-on-surface-variant">
              <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 bg-surface-variant rounded">↑</kbd><kbd class="px-1 py-0.5 bg-surface-variant rounded">↓</kbd> navigate</span>
              <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 bg-surface-variant rounded">↵</kbd> select</span>
              <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 bg-surface-variant rounded">esc</kbd> close</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
