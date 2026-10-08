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

  // Number of open() calls in flight. The persist watcher runs on the next tick, so
  // without suppressing it during a swap the outgoing build's contents would be written
  // over the incoming build the moment the refs are assigned. A counter rather than a
  // boolean because concurrent opens overlap — the first to finish must not un-suppress
  // while a later one is still mid-flight.
  const swapping = shallowRef(0)

  // Monotonic request token. Every open() captures one and re-checks it after each await;
  // a stale continuation performs no writes at all. Without this, two overlapping switches
  // interleave and the loser's purge-flush writes the winner's state into the loser's
  // build — silent cross-build data loss.
  let token = 0
  let requested: string | null = null

  const isSaving = shallowRef(false)
  const saveError = shallowRef<string | null>(null)

  function fail (error: unknown, action: string) {
    saveError.value = `Could not ${action}: ${error instanceof Error ? error.message : String(error)}`
  }

  const draft = shallowRef<{ id: string, config: unknown } | null>(null)

  const active = toRef(() => builds.value.find(entry => entry.id === activeId.value) ?? null)

  /**
   * Nothing worth persisting. Guards lazy creation: clearing state is a change like any
   * other, and without this the clean-up in detach() re-triggers the autosave watcher and
   * mints a replacement — putting back the build another tab just deleted.
   */
  function isBlank (): boolean {
    return selectedPlugins.value.size === 0
      && selectedComponents.value.size === 0
      && Object.keys(pluginConfig.value).length === 0
      && Object.keys(componentConfig.value).length === 0
  }

  function snapshot (): BuildState {
    return {
      selectedPlugins: [...selectedPlugins.value],
      pluginConfig: { ...pluginConfig.value },
      selectedComponents: [...selectedComponents.value],
      componentConfig: { ...componentConfig.value },
    }
  }

  async function apply (state: BuildState) {
    selectedPlugins.value = new Set(state.selectedPlugins)
    pluginConfig.value = { ...state.pluginConfig }
    // Restored state can name components since reclassified as draft (or removed). They
    // are unbuildable, so drop them rather than emit a starter that won't compile.
    selectedComponents.value = new Set(keepSelectable(state.selectedComponents))
    componentConfig.value = { ...state.componentConfig }

    await nextTick()
  }

  async function open (id: string) {
    const mine = ++token
    requested = id
    swapping.value++

    try {
      const state = await backend.load(id)
      if (mine !== token) return

      activeId.value = id
      await backend.setActive(id)
      if (mine !== token) return

      await apply(state ?? EMPTY_BUILD)
      if (mine !== token) return

      // A purge on load has to be flushed explicitly — the persist watcher only fires on a
      // later edit, so the dropped ids would otherwise linger in storage. Guarded by the
      // token: writing here from a superseded request would put the newer build's state
      // into this older build.
      if (state && state.selectedComponents.length !== selectedComponents.value.size) {
        await backend.save(id, snapshot())
      }
    } catch (error) {
      if (mine === token) fail(error, 'open that build')
    } finally {
      swapping.value--
    }
  }

  async function refresh () {
    try {
      builds.value = await backend.list()
    } catch (error) {
      fail(error, 'list your builds')
    }
  }

  /**
   * Drops local state. Used when the active build is gone.
   *
   * Also clears the stored pointer: leaving it naming a deleted build is how a stale id
   * survives a reload, and every id that outlives its build is a resurrection waiting to
   * happen. No build data is touched — the build is already gone.
   */
  async function detach () {
    draft.value = null
    activeId.value = null

    swapping.value++
    try {
      await apply(EMPTY_BUILD)
      await backend.setActive(null)
    } catch (error) {
      fail(error, 'update your builds')
    } finally {
      swapping.value--
    }
  }

  /**
   * Re-reads the index and repairs the active pointer if it no longer names a real build.
   *
   * `builds` is only ever a cache of the stored index. Another tab (or a storage clear) can
   * delete the build this tab is standing in, which used to leave a phantom entry in the
   * list that the next write would resurrect over the real index.
   *
   * Never creates. Zero builds is a legitimate state — it is what a first run and a
   * cleared storage both look like, and minting a replacement here is what made a deleted
   * build reappear.
   */
  async function reconcile () {
    await refresh()

    if (swapping.value > 0) return
    if (activeId.value && builds.value.some(entry => entry.id === activeId.value)) return
    if (!activeId.value) return

    if (builds.value.length === 0) {
      await detach()
      return
    }

    draft.value = null
    await open(builds.value[0]!.id)
  }

  /**
   * Loads the stored builds. Deliberately creates nothing: a first run and a cleared
   * storage both legitimately have zero builds, and minting one here made the landing page
   * claim saved work that didn't exist — and made a deleted build appear to come back.
   * The first build is created lazily, on the first real edit (see the autosave watcher).
   */
  async function hydrate () {
    try {
      builds.value = await backend.list()

      if (builds.value.length === 0) return

      const stored = await backend.activeId()
      const target = builds.value.some(entry => entry.id === stored) ? stored! : builds.value[0]!.id

      await open(target)
    } catch (error) {
      fail(error, 'load your builds')
    }
  }

  /**
   * Returns the build to write into, creating one on first use.
   *
   * Single-flight: the autosave watcher, the subscription callback and a user action can
   * all arrive within the same tick, and un-guarded that minted a build per caller. Callers
   * share one in-flight promise, so exactly one build is ever created.
   *
   * Does NOT call open() — that would apply an empty build over the edit that triggered it.
   */
  let creating: Promise<string | null> | null = null

  /**
   * Next default name. Counts up from the highest "Build N" already present rather than
   * from the list length — after a deletion the length repeats a number that is still in
   * use, and two builds end up sharing a name.
   */
  function nextName (): string {
    const highest = builds.value.reduce((max, entry) => {
      const match = /^Build (\d+)$/.exec(entry.name)
      return match ? Math.max(max, Number(match[1])) : max
    }, 0)

    return `Build ${highest + 1}`
  }

  function ensure (): Promise<string | null> {
    if (activeId.value) return Promise.resolve(activeId.value)
    if (creating) return creating

    creating = (async () => {
      try {
        const entry = await backend.create(nextName())

        activeId.value = entry.id
        await backend.setActive(entry.id)
        await refresh()

        return entry.id
      } catch (error) {
        fail(error, 'create a build')
        return null
      } finally {
        creating = null
      }
    })()

    return creating
  }

  // Exposed so the router guard can wait for state before deciding a redirect — a deep
  // link would otherwise be bounced to /builder because nothing had loaded yet. hydrate()
  // swallows its own failures, so awaiting this can never reject the guard.
  const ready = hydrate()

  // Track the stored index rather than snapshotting it once. Fires for our own writes too,
  // which is harmless — reconcile only reads, and repairs the active pointer if needed.
  backend.subscribe(() => {
    void reconcile()
  })

  async function switchTo (id: string) {
    // Compares against the latest *requested* id, not activeId: activeId lags behind an
    // in-flight open, so a second click would otherwise be dropped as a no-op.
    if (id === (requested ?? activeId.value)) return

    draft.value = null
    await open(id)
    await refresh()
  }

  /** Explicit "new build". Waits out any lazy creation so the two can't both mint one. */
  async function createBuild () {
    try {
      if (creating) await creating

      const entry = await backend.create(nextName())

      draft.value = null
      await refresh()
      await open(entry.id)

      return entry
    } catch (error) {
      fail(error, 'create a build')
      return null
    }
  }

  async function renameBuild (id: string, name: string) {
    const trimmed = name.trim()
    if (!trimmed) return

    try {
      await backend.rename(id, trimmed)
      await refresh()
    } catch (error) {
      fail(error, 'rename that build')
    }
  }

  /**
   * Idempotent: deleting a build that is already gone is success, not a failure. The list
   * can be a moment stale (another tab, a storage clear), so a delete aimed at an entry
   * that no longer exists must still resolve and leave the UI consistent rather than hang.
   *
   * reconcile() then repairs the active pointer if this removed the build we were standing
   * in — the next most recent build, or a fresh one when that was the last.
   */
  async function removeBuild (id: string) {
    try {
      await backend.remove(id)
      await reconcile()
    } catch (error) {
      fail(error, 'delete that build')
    }
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
    swapping.value++

    try {
      await apply(EMPTY_BUILD)

      if (activeId.value) await backend.save(activeId.value, snapshot())
    } catch (error) {
      fail(error, 'clear that build')
    } finally {
      swapping.value--
    }
  }

  /**
   * Autosave, and the only place a build is created implicitly.
   *
   * Two things it must not do. It must not write to a build that no longer exists — a tab
   * holding state in memory would otherwise resurrect a build another tab deleted, which is
   * what made "clear storage and refresh" bring the build back. And it must not redirect a
   * write to whichever build happens to be active when it resumes, so the target id is
   * captured up front and re-verified against the index immediately before writing.
   */
  watch(
    [selectedPlugins, pluginConfig, selectedComponents, componentConfig],
    async () => {
      if (swapping.value > 0) return

      // First real edit with nothing to write into: this is where a build gets born. An
      // empty state is not a real edit — see isBlank().
      if (!activeId.value && isBlank()) return

      const target = activeId.value ?? await ensure()
      if (!target) return

      isSaving.value = true

      try {
        const current = await backend.list()
        builds.value = current

        if (!current.some(entry => entry.id === target)) {
          // Deleted underneath us. Drop the write and let go of the state rather than
          // putting the build back.
          await detach()
          return
        }

        await backend.save(target, snapshot())
        saveError.value = null
        await refresh()
      } catch (error) {
        fail(error, 'save your changes')
      } finally {
        isSaving.value = false
      }
    },
    { deep: true },
  )

  return {
    builds,
    activeId,
    active,
    ready,
    isSaving,
    saveError,
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
