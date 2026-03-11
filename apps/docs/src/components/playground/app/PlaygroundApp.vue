<script lang="ts">
  // Framework
  import { createContext, useBreakpoints, useStorage } from '@vuetify/v0'

  // Composables
  import { usePlaygroundFiles } from '@/composables/usePlaygroundFiles'

  // Utilities
  import { shallowRef, watch } from 'vue'

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

  // Persisted collapsed state (true = collapsed)
  const left = storage.get('playground-left-collapsed', false)
  const storedLeft = left.value

  // Persisted user preference for side preview position
  const sidePref = storage.get('playground-preview-right', false)
  // Side preview active when preferred and left panel is collapsed
  const sideActive = sidePref.value && left.value

  // Start collapsed (mobile-first default since isMobile defaults to true)
  const tree = shallowRef(true)
  left.value = true

  const ctx = {
    store,
    isReady,
    left,
    tree,
    bottom: shallowRef(sideActive),
    side: shallowRef(!sideActive),
    editor: shallowRef(true),
  }

  providePlayground(ctx)

  // When breakpoints confirm desktop, restore open state
  watch(isMobile, mobile => {
    if (!mobile) {
      tree.value = false
      left.value = storedLeft
    }
  })
</script>

<template>
  <div class="h-screen flex flex-col">
    <slot />
  </div>
</template>
