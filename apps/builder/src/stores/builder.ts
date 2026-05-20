// Framework
import { useStorage } from '@vuetify/v0'

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
  const selectedComponents = shallowRef<Set<string>>(new Set(initial.selectedComponents))
  const componentConfig = shallowRef<Record<string, unknown>>({ ...initial.componentConfig })

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
    if (selectedComponents.value.has(id)) return
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

  function reset () {
    selectedPlugins.value = new Set()
    pluginConfig.value = {}
    selectedComponents.value = new Set()
    componentConfig.value = {}
    storage.remove(STORAGE_KEY)
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
