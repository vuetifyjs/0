<script lang="ts">
  // Framework
  import { createContext, useBreakpoints, useStorage } from '@vuetify/v0'

  // Composables
  import { usePlaygroundFiles } from '@/composables/usePlaygroundFiles'

  // Utilities
  import { nextTick, onMounted, shallowRef, watch } from 'vue'

  // Types
  import type { ReplStore } from '@vue/repl'
  import type { Ref, ShallowRef } from 'vue'

  export interface PlaygroundContext {
    store: ReplStore
    isReady: { value: boolean }
    left: { value: boolean }
    tree: { value: boolean }
    bottom: { value: boolean }
    side: { value: boolean }
    editor: { value: boolean }
    vueVersion: Ref<string | null>
    v0Version: Ref<string>
    vueVersions: Ref<string[]>
    v0Versions: Ref<string[]>
    fetching: Ref<boolean>
    fetchVersions: () => Promise<void>
    activePreset: ShallowRef<string>
    applyPreset: (id: string) => Promise<void>
    activeAddons: ShallowRef<string[]>
    toggleAddon: (id: string) => Promise<void>
    filesVersion: ShallowRef<number>
    openPlayground: (content: string) => Promise<void>
  }

  export const [usePlayground, providePlayground] = createContext<PlaygroundContext>('v0:playground')
</script>

<script setup lang="ts">
  const { store, isReady, filesVersion, vueVersion, v0Version, vueVersions, v0Versions, fetching, fetchVersions, activePreset, applyPreset, activeAddons, toggleAddon, openPlayground } = usePlaygroundFiles()
  const storage = useStorage()
  const { isMobile } = useBreakpoints()

  // Persisted open state (true = open)
  const left = storage.get('playground-left-open', true)

  // Persisted user preference for side preview position
  const sidePref = storage.get('playground-preview-right', false)
  // Side preview active when preferred and left panel is closed
  const sideActive = sidePref.value && !left.value

  // Track the desktop left-panel state so it survives mobile transitions.
  // Updated whenever isMobile flips to true, restored when it flips back.
  const desktop$ = { left: left.value }

  // Initialize panels based on current viewport.
  // Breakpoints plugin flushes initial values synchronously during install,
  // so isMobile is already correct at setup time.
  const desktop = !isMobile.value
  const tree = shallowRef(desktop)
  const editor = shallowRef(desktop)
  const bottom = shallowRef(desktop && !sideActive)
  const side = shallowRef(desktop && sideActive)
  left.value = desktop ? desktop$.left : false

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
    vueVersion,
    v0Version,
    vueVersions,
    v0Versions,
    fetching,
    fetchVersions,
    activePreset,
    applyPreset,
    activeAddons,
    toggleAddon,
    filesVersion,
    openPlayground,
  })

  // Restore panel state on runtime breakpoint changes
  watch(isMobile, mobile => {
    if (mobile) {
      desktop$.left = left.value
      tree.value = false
      editor.value = false
      left.value = false
      bottom.value = false
      side.value = false
    } else {
      const currentSide = sidePref.value && !desktop$.left
      tree.value = true
      editor.value = true
      left.value = desktop$.left
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
