// Framework
import { useBreakpoints, useStorage } from '@vuetify/v0'

// Utilities
import { defineStore } from 'pinia'
import { computed, shallowRef, watch } from 'vue'

export interface PlaygroundControl {
  open: () => void
  close: () => void
  toggle: () => void
}

export const usePlaygroundStore = defineStore('playground', () => {
  const storage = useStorage()
  const breakpoints = useBreakpoints()
  const isDesktop = breakpoints.mdAndUp

  // Persistent UI preferences
  const panelOpen = storage.get<boolean>('playground-panel-open', false)
  const replLayout = storage.get<'horizontal' | 'vertical'>('playground-layout', 'horizontal')

  // Session UI state
  const sidebarOpen = shallowRef(true)
  const showExamples = shallowRef(false)

  const isPanelMode = computed(() => isDesktop.value && panelOpen.value)

  // Sync sidebar with desktop breakpoint
  watch(isDesktop, v => {
    sidebarOpen.value = v
  })

  // Namespaced control objects for tour handlers
  const panel: PlaygroundControl = {
    open: () => {
      panelOpen.value = true
    },
    close: () => {
      panelOpen.value = false
    },
    toggle: () => {
      panelOpen.value = !panelOpen.value
    },
  }

  const sidebar: PlaygroundControl = {
    open: () => {
      sidebarOpen.value = true
    },
    close: () => {
      sidebarOpen.value = false
    },
    toggle: () => {
      sidebarOpen.value = !sidebarOpen.value
    },
  }

  const examples: PlaygroundControl = {
    open: () => {
      showExamples.value = true
    },
    close: () => {
      showExamples.value = false
    },
    toggle: () => {
      showExamples.value = !showExamples.value
    },
  }

  return {
    isDesktop,
    sidebarOpen,
    panelOpen,
    showExamples,
    replLayout,
    isPanelMode,
    panel,
    sidebar,
    examples,
  }
})
