<script lang="ts">
  // Framework
  import { createContext, useStorage } from '@vuetify/v0'

  // Composables
  import { usePlaygroundFiles } from '@/composables/usePlaygroundFiles'

  // Utilities
  import { shallowRef } from 'vue'

  // Types
  import type { ReplStore } from '@vue/repl'
  import type { ShallowRef } from 'vue'

  export interface PlaygroundContext {
    store: ReplStore
    isReady: ShallowRef<boolean>
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

  // Persisted collapsed state (true = collapsed)
  const left = storage.get('playground-left-collapsed', false)
  // Persisted user preference for side preview position
  const sidePref = storage.get('playground-preview-right', false)
  // Side preview active when preferred and left panel is collapsed
  const sideActive = sidePref.value && left.value

  providePlayground({
    store,
    isReady,
    left,
    tree: shallowRef(false),
    bottom: shallowRef(sideActive),
    side: shallowRef(!sideActive),
    editor: shallowRef(true),
  })
</script>

<template>
  <div class="h-screen flex flex-col">
    <slot />
  </div>
</template>
