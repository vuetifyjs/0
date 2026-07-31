// Framework
import { useStorage } from '@vuetify/v0'

import { isSelectable, keepSelectable } from '@/data/components'
import dependencyGraph from '@/data/dependencies.json'
import { resolve } from '@/engine/resolve'

// Utilities
import { defineStore } from 'pinia'
import { shallowRef, toRef, watch } from 'vue'

// Types
import type { DependencyGraph } from '@/data/types'

const graph = dependencyGraph as DependencyGraph

interface PersistedState {
  selectedPlugins: string[]
  pluginConfig: Record<string, unknown>
  selectedComponents: string[]
  componentConfig: Record<string, unknown>
}

const STORAGE_KEY = 'builder.v1'

const EMPTY_STATE: PersistedState = {
  selectedPlugins: [],
  pluginConfig: {},
  selectedComponents: [],
  componentConfig: {},
}

export const useBuilderStore = defineStore('builder', () => {
  const storage = useStorage()
  const persisted = storage.get<PersistedState>(STORAGE_KEY, EMPTY_STATE)

  const initial = persisted.value ?? EMPTY_STATE

  const selectedPlugins = shallowRef<Set<string>>(new Set(initial.selectedPlugins))
  const pluginConfig = shallowRef<Record<string, unknown>>({ ...initial.pluginConfig })
  // Restored state can name components that have since been reclassified as draft (or
  // removed outright). They are unbuildable, so drop them rather than letting a stale
  // selection produce a starter that won't compile.
  const restored = keepSelectable(initial.selectedComponents)
  const selectedComponents = shallowRef<Set<string>>(new Set(restored))
  const componentConfig = shallowRef<Record<string, unknown>>({ ...initial.componentConfig })

  // Flush the purge to storage immediately. The persist watcher below only fires on a
  // subsequent change, so without this the dropped ids would linger in localStorage and
  // reappear in any other tab reading the same key.
  if (restored.length !== initial.selectedComponents.length) {
    persisted.value = { ...initial, selectedComponents: restored }
  }

  const draft = shallowRef<{ id: string, config: unknown } | null>(null)

  function setDraft (id: string, config: unknown) {
    draft.value = { id, config }
  }

  function clearDraft (id: string) {
    if (draft.value?.id !== id) return
    draft.value = null
  }

  const allSelected = toRef(() => [
    ...selectedPlugins.value,
    ...selectedComponents.value,
  ])

  const resolved = toRef(() => resolve(allSelected.value, graph))

  function selectPlugin (id: string) {
    if (selectedPlugins.value.has(id)) return
    selectedPlugins.value = new Set([...selectedPlugins.value, id])
  }

  function deselectPlugin (id: string) {
    if (!selectedPlugins.value.has(id)) return
    const next = new Set(selectedPlugins.value)
    next.delete(id)
    selectedPlugins.value = next
    if (id in pluginConfig.value) {
      const next = { ...pluginConfig.value }
      delete next[id]
      pluginConfig.value = next
    }
  }

  function togglePlugin (id: string) {
    selectedPlugins.value.has(id) ? deselectPlugin(id) : selectPlugin(id)
  }

  function isPluginSelected (id: string) {
    return selectedPlugins.value.has(id)
  }

  function savePluginConfig (id: string, config: unknown) {
    pluginConfig.value = { ...pluginConfig.value, [id]: config }
  }

  function selectComponent (id: string) {
    if (!isSelectable(id) || selectedComponents.value.has(id)) return
    selectedComponents.value = new Set([...selectedComponents.value, id])
  }

  function deselectComponent (id: string) {
    if (!selectedComponents.value.has(id)) return
    const next = new Set(selectedComponents.value)
    next.delete(id)
    selectedComponents.value = next
  }

  function toggleComponent (id: string) {
    selectedComponents.value.has(id) ? deselectComponent(id) : selectComponent(id)
  }

  function isComponentSelected (id: string) {
    return selectedComponents.value.has(id)
  }

  // Clearing goes through the live `persisted` ref, never storage.remove(). remove() stops
  // the watcher useStorage attached to that ref and drops it from the cache, orphaning it —
  // every later write would be silently discarded until a reload.
  function reset () {
    selectedPlugins.value = new Set()
    pluginConfig.value = {}
    selectedComponents.value = new Set()
    componentConfig.value = {}
    persisted.value = {
      selectedPlugins: [],
      pluginConfig: {},
      selectedComponents: [],
      componentConfig: {},
    }
  }

  watch(
    [selectedPlugins, pluginConfig, selectedComponents, componentConfig],
    ([plugins, pluginCfg, components, componentCfg]) => {
      persisted.value = {
        selectedPlugins: [...plugins],
        pluginConfig: { ...pluginCfg },
        selectedComponents: [...components],
        componentConfig: { ...componentCfg },
      }
    },
    { deep: true },
  )

  return {
    selectedPlugins,
    pluginConfig,
    selectedComponents,
    componentConfig,
    allSelected,
    resolved,
    draft,
    setDraft,
    clearDraft,
    selectPlugin,
    deselectPlugin,
    togglePlugin,
    isPluginSelected,
    savePluginConfig,
    selectComponent,
    deselectComponent,
    toggleComponent,
    isComponentSelected,
    reset,
  }
})
