<script lang="ts">
  // Framework
  import { createContext, useBreakpoints, useStorage } from '@vuetify/v0'

  // Composables
  import { usePlaygroundFiles } from '@/composables/usePlaygroundFiles'

  // Utilities
  import { nextTick, onMounted, shallowRef, watch } from 'vue'

  // Types
  import type { ReplStore } from '@vue/repl'

  export interface PlaygroundContext {
    store: ReplStore
    isReady: { value: boolean }
    left: { value: boolean }
    tree: { value: boolean }
    bottom: { value: boolean }
    side: { value: boolean }
    editor: { value: boolean }
  }

  export const [usePlayground, providePlayground] = createContext<PlaygroundContext>('v0:playground')
</script>

<script setup lang="ts">
  const { store, isReady } = usePlaygroundFiles()
  const storage = useStorage()
  const { isMobile } = useBreakpoints()

  // Persisted open state (true = open)
  const left = storage.get('playground-left-open', true)
  const storedLeft = left.value

  // Persisted user preference for side preview position
  const sidePref = storage.get('playground-preview-right', false)
  // Side preview active when preferred and left panel is closed
  const sideActive = sidePref.value && !left.value

  // Initialize panels based on current viewport.
  // Breakpoints plugin flushes initial values synchronously during install,
  // so isMobile is already correct at setup time.
  const desktop = !isMobile.value
  const tree = shallowRef(desktop)
  const editor = shallowRef(desktop)
  const bottom = shallowRef(desktop && !sideActive)
  const side = shallowRef(desktop && sideActive)
  left.value = desktop ? storedLeft : false

  // Invisible until layout stabilizes — prevents hydration flash
  // while panels and splitters resolve to their persisted sizes.
  const settled = shallowRef(false)

  providePlayground({
    store,
    isReady,
    left,
    tree,
    bottom,
    side,
    editor,
  })

  // Restore panel state on runtime breakpoint changes
  watch(isMobile, mobile => {
    if (!mobile) {
      const currentSide = sidePref.value && !storedLeft
      tree.value = true
      editor.value = true
      left.value = storedLeft
      bottom.value = !currentSide
      side.value = currentSide
    }
  })

  onMounted(() => {
    const stop = watch(isReady, ready => {
      if (!ready) return
      stop()
      nextTick(() => {
        settled.value = true
      })
    }, { immediate: true })
  })
</script>

<template>
  <div
    class="h-screen flex flex-col overflow-hidden bg-background transition-opacity duration-150"
    :class="settled ? 'opacity-100' : 'opacity-0'"
  >
    <slot />
  </div>
</template>
