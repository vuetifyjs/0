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

  // Persisted open state (true = open)
  const left = storage.get('playground-left-open', true)
  const storedLeft = left.value

  // Persisted user preference for side preview position
  const sidePref = storage.get('playground-preview-right', false)
  // Side preview active when preferred and left panel is closed
  const sideActive = sidePref.value && !left.value

  // Start closed (mobile-first default since isMobile defaults to true)
  const tree = shallowRef(false)
  const bottom = shallowRef(false)
  const side = shallowRef(false)
  left.value = false

  providePlayground({
    store,
    isReady,
    left,
    tree,
    bottom,
    side,
    editor: shallowRef(true),
  })

  // When breakpoints confirm desktop, restore open state
  watch(isMobile, mobile => {
    if (!mobile) {
      tree.value = true
      left.value = storedLeft
      bottom.value = !sideActive
      side.value = sideActive
    }
  }, { immediate: true })
</script>

<template>
  <div class="h-screen flex flex-col bg-background">
    <slot />
  </div>
</template>
