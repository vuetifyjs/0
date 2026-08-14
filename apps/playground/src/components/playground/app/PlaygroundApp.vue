<script lang="ts">
  // Framework
  import { createContext, useBreakpoints, useStorage } from '@vuetify/v0'

  // Composables
  import { usePlaygroundFiles } from '@/composables/usePlaygroundFiles'

  // Utilities
  import { nextTick, onMounted, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { ActiveExample } from '@/composables/usePlaygroundFiles'
  import type { RegistryExampleRef } from '@/data/registry'
  import type { VuetifyExampleRef } from '@/data/vuetify-examples'
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
    vuetifyVersion: Ref<string>
    vuetifyNightly: Ref<boolean>
    vueVersions: Ref<string[]>
    v0Versions: Ref<string[]>
    vuetifyVersions: Ref<string[]>
    vuetifyNightlyVersions: Ref<string[]>
    fetching: Ref<boolean>
    fetchVersions: () => Promise<void>
    activePreset: ShallowRef<string>
    applyPreset: (id: string) => Promise<void>
    activeAddons: ShallowRef<string[]>
    toggleAddon: (id: string) => Promise<void>
    filesVersion: ShallowRef<number>
    loadError: ShallowRef<string | undefined>
    openPlayground: (content: string) => Promise<void>
    openRegistryExample: (ref: RegistryExampleRef, options?: { clearSearch?: boolean }) => Promise<void>
    openVuetifyExample: (ref: VuetifyExampleRef, options?: { clearSearch?: boolean }) => Promise<void>
    /** Last Open-gallery example loaded into the editor (for highlight). */
    activeExample: ShallowRef<ActiveExample | undefined>
    /** JSON payload for Vuetify One `playground.content`. */
    snapshotContent: () => string
    showConfig: ShallowRef<boolean>
    /** Current playground locked state from Vuetify One. */
    isLocked: Ref<boolean>
  }

  export const [usePlayground, providePlayground] = createContext<PlaygroundContext>('v0:playground')
</script>

<script setup lang="ts">
  // Composables
  import { useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  const one = useOnePlaygrounds()

  const {
    store,
    isReady,
    filesVersion,
    loadError,
    vueVersion,
    v0Version,
    vuetifyVersion,
    vuetifyNightly,
    vueVersions,
    v0Versions,
    vuetifyVersions,
    vuetifyNightlyVersions,
    fetching,
    fetchVersions,
    activePreset,
    applyPreset,
    activeAddons,
    toggleAddon,
    openPlayground,
    openRegistryExample,
    openVuetifyExample,
    activeExample,
    snapshotContent,
  } = usePlaygroundFiles()

  const isLocked = toRef(() => one.currentMeta?.value.locked ?? false)
  const storage = useStorage()
  const { isMobile } = useBreakpoints()

  // Persisted open state (true = open)
  const left = storage.get('playground-left-open', true)

  // Persisted user preference for side preview position
  const sidePref = storage.get('playground-preview-right', false)

  // Initialize panels based on current viewport.
  // Breakpoints plugin flushes initial values synchronously during install,
  // so isMobile is already correct at setup time.
  const desktop = !isMobile.value
  const tree = storage.get('playground-tree-open', desktop)

  // Track the desktop panel state so it survives mobile transitions.
  // Updated whenever isMobile flips to true, restored when it flips back.
  const desktop$ = { left: left.value, tree: tree.value }
  const editor = shallowRef(desktop)
  const bottom = shallowRef(desktop && !(sidePref.value && !left.value))
  const side = shallowRef(desktop && (sidePref.value && !left.value))
  left.value = desktop ? desktop$.left : false

  // Invisible until layout stabilizes — prevents hydration flash
  // while panels and splitters resolve to their persisted sizes.
  const settled = shallowRef(false)

  // Shared with the tabs strip so config files are enrolled as tabbable
  // before a click can race the mandatory Tabs.Root selection.
  const showConfig = shallowRef(false)

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
    vuetifyVersion,
    vuetifyNightly,
    vueVersions,
    v0Versions,
    vuetifyVersions,
    vuetifyNightlyVersions,
    fetching,
    fetchVersions,
    activePreset,
    applyPreset,
    activeAddons,
    toggleAddon,
    filesVersion,
    loadError,
    openPlayground,
    openRegistryExample,
    openVuetifyExample,
    activeExample,
    snapshotContent,
    showConfig,
    isLocked,
  })

  // Restore panel state on runtime breakpoint changes
  watch(isMobile, mobile => {
    if (mobile) {
      desktop$.left = left.value
      desktop$.tree = tree.value
      tree.value = false
      editor.value = false
      left.value = false
      bottom.value = false
      side.value = false
    } else {
      const currentSide = sidePref.value && !desktop$.left
      tree.value = desktop$.tree
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
    <div
      v-if="loadError"
      class="flex items-center justify-between gap-3 px-3 py-2 text-xs bg-error/10 text-error border-b border-error/20 shrink-0"
      role="alert"
    >
      <span class="min-w-0 truncate">{{ loadError }}</span>

      <button
        class="shrink-0 underline opacity-80 hover:opacity-100"
        type="button"
        @click="loadError = undefined"
      >
        Dismiss
      </button>
    </div>

    <slot />
  </div>
</template>
