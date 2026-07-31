import { isSelectable, keepSelectable } from '@/data/components'
import dependencyGraph from '@/data/dependencies.json'
import { resolve } from '@/engine/resolve'

// Stores
import { EMPTY_BUILD, useBuilds } from '@/stores/persistence'

// Utilities
import { defineStore } from 'pinia'
import { nextTick, ref, shallowRef, toRef, watch } from 'vue'

// Types
import type { DependencyGraph } from '@/data/types'
import type { BuildState, BuildSummary } from '@/stores/persistence'

const graph = dependencyGraph as DependencyGraph

export const useBuilderStore = defineStore('builder', () => {
  const backend = useBuilds()

  const builds = ref<BuildSummary[]>([])
  const activeId = shallowRef<string | null>(null)

  const selectedPlugins = shallowRef<Set<string>>(new Set())
  const pluginConfig = shallowRef<Record<string, unknown>>({})
  const selectedComponents = shallowRef<Set<string>>(new Set())
  const componentConfig = shallowRef<Record<string, unknown>>({})

  // Set while state is swapped wholesale (hydrate, switch, delete). The persist watcher
  // runs on the next tick, so without this the outgoing build's contents would be written
  // over the incoming build the moment the refs are assigned.
  const swapping = shallowRef(false)

  const draft = shallowRef<{ id: string, config: unknown } | null>(null)

  const active = toRef(() => builds.value.find(entry => entry.id === activeId.value) ?? null)

  function snapshot (): BuildState {
    return {
      selectedPlugins: [...selectedPlugins.value],
      pluginConfig: { ...pluginConfig.value },
      selectedComponents: [...selectedComponents.value],
      componentConfig: { ...componentConfig.value },
    }
  }

  async function apply (state: BuildState) {
    swapping.value = true

    selectedPlugins.value = new Set(state.selectedPlugins)
    pluginConfig.value = { ...state.pluginConfig }
    // Restored state can name components since reclassified as draft (or removed). They
    // are unbuildable, so drop them rather than emit a starter that won't compile.
    selectedComponents.value = new Set(keepSelectable(state.selectedComponents))
    componentConfig.value = { ...state.componentConfig }

    await nextTick()
    swapping.value = false
  }

  async function open (id: string) {
    const state = await backend.load(id)

    activeId.value = id
    await backend.setActive(id)
    await apply(state ?? EMPTY_BUILD)

    // A purge on load has to be flushed explicitly — the persist watcher only fires on a
    // later edit, so the dropped ids would otherwise linger in storage.
    if (state && state.selectedComponents.length !== selectedComponents.value.size) {
      await backend.save(id, snapshot())
    }
  }

  async function refresh () {
    builds.value = await backend.list()
  }

  async function hydrate () {
    builds.value = await backend.list()

    if (builds.value.length === 0) {
      const entry = await backend.create('Build 1')
      builds.value = [entry]
    }

    const stored = await backend.activeId()
    const target = builds.value.some(entry => entry.id === stored) ? stored! : builds.value[0]!.id

    await open(target)
  }

  // Exposed so the router guard can wait for state before deciding a redirect — a deep
  // link would otherwise be bounced to /builder because nothing had loaded yet.
  const ready = hydrate()

  async function switchTo (id: string) {
    if (id === activeId.value) return

    draft.value = null
    await open(id)
    await refresh()
  }

  async function createBuild () {
    const entry = await backend.create(`Build ${builds.value.length + 1}`)

    draft.value = null
    await refresh()
    await open(entry.id)

    return entry
  }

  async function renameBuild (id: string, name: string) {
    const trimmed = name.trim()
    if (!trimmed) return

    await backend.rename(id, trimmed)
    await refresh()
  }

  // Deleting the build you are standing in has to leave you somewhere: the next most
  // recent build, or a fresh one when that was the last.
  async function removeBuild (id: string) {
    await backend.remove(id)
    await refresh()

    if (id !== activeId.value) return

    draft.value = null

    if (builds.value.length === 0) {
      const entry = await backend.create('Build 1')
      await refresh()
      await open(entry.id)
      return
    }

    await open(builds.value[0]!.id)
  }

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

  /** Empties the active build. The build itself survives — use removeBuild to delete it. */
  async function reset () {
    await apply(EMPTY_BUILD)

    if (activeId.value) await backend.save(activeId.value, snapshot())
  }

  watch(
    [selectedPlugins, pluginConfig, selectedComponents, componentConfig],
    async () => {
      if (swapping.value || !activeId.value) return

      await backend.save(activeId.value, snapshot())
      await refresh()
    },
    { deep: true },
  )

  return {
    builds,
    activeId,
    active,
    ready,
    selectedPlugins,
    pluginConfig,
    selectedComponents,
    componentConfig,
    allSelected,
    resolved,
    draft,
    switchTo,
    createBuild,
    renameBuild,
    removeBuild,
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
