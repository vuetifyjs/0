// apps/builder/src/stores/persistence.ts

// The ONLY module that knows where builds live.
//
// Everything above it (the store, the pages) talks to `BuildsBackend` and never touches a
// storage key. Swapping localStorage for the Vuetify API is meant to be a rewrite of this
// file and nothing else — which is why every method is async even though the current
// implementation is synchronous. Making the shape async now means the swap changes no
// call sites and no component code.

// Framework
import { useStorage } from '@vuetify/v0'

// Utilities
import { watch } from 'vue'

// Types
import type { StorageContext } from '@vuetify/v0'

/**
 * A build's metadata, as listed in the index. Never contains the build's contents — the
 * counts are denormalized onto it so the landing page can render the whole list without
 * loading every build (which would be N requests once this backend is the API).
 */
export interface BuildSummary {
  id: string
  name: string
  created: number
  updated: number
  plugins: number
  components: number
}

/** The wizard state a build owns. Matches what the builder store persists. */
export interface BuildState {
  /** Shape version, so a future config migration has something to key on. */
  version?: number
  selectedPlugins: string[]
  pluginConfig: Record<string, unknown>
  selectedComponents: string[]
  componentConfig: Record<string, unknown>
}

/** Current BuildState shape. Bump when the stored config shape changes incompatibly. */
export const BUILD_VERSION = 1

export interface BuildsBackend {
  /** All builds, newest activity first. Runs the legacy migration on first call. */
  list: () => Promise<BuildSummary[]>
  load: (id: string) => Promise<BuildState | null>
  /** Writes contents and stamps `updated` on the index entry. */
  save: (id: string, state: BuildState) => Promise<void>
  create: (name: string) => Promise<BuildSummary>
  rename: (id: string, name: string) => Promise<void>
  remove: (id: string) => Promise<void>
  activeId: () => Promise<string | null>
  setActive: (id: string | null) => Promise<void>
  /**
   * Notifies when the index changes underneath us — another tab writing, or a storage
   * clear. Returns an unsubscribe. Consumers must treat their own copy of the list as a
   * cache of this, never as the source of truth, or a stale entry survives in the UI and
   * (worse) gets written back over the real index on the next mutation.
   *
   * An API backend implements this with polling or a socket; the shape does not change.
   */
  subscribe: (listener: () => void) => () => void
}

const INDEX_KEY = 'builder.builds'
const ACTIVE_KEY = 'builder.active'
const BUILD_KEY = 'builder.build.'

/** Pre-multi-build key. Migrated into the first build, then deleted. */
const LEGACY_KEY = 'builder.v1'

export const EMPTY_BUILD: BuildState = {
  version: BUILD_VERSION,
  selectedPlugins: [],
  pluginConfig: {},
  selectedComponents: [],
  componentConfig: {},
}

/**
 * The index as stored. `rev` is a monotonic counter used to detect a write that landed
 * between our read and our write — the read-modify-write cycles below are safe within a
 * tab (synchronous) but not across tabs, which useStorage already syncs via storage
 * events. This is belt-and-braces only: real conflict handling arrives with the API
 * backend, which can arbitrate server-side.
 */
interface BuildIndex {
  rev: number
  builds: BuildSummary[]
}

// Not `useId` from #v0/utilities: outside a component it falls back to a per-session
// counter, so ids would collide across reloads and one build would overwrite another.
function id (): string {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function clone<T> (value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Builds backend over the v0 storage plugin.
 *
 * Must be called from inside the app context (a store setup or component) so `useStorage`
 * resolves the installed plugin rather than its memory fallback.
 */
export function useBuilds (): BuildsBackend {
  const storage: StorageContext = useStorage()

  // Tolerates the pre-rev shape (a bare array) so an index written by an older build of
  // the app still loads.
  function readEnvelope (): BuildIndex {
    const raw = storage.get<BuildIndex | BuildSummary[]>(INDEX_KEY, { rev: 0, builds: [] }).value

    if (Array.isArray(raw)) return { rev: 0, builds: raw }

    return { rev: raw?.rev ?? 0, builds: raw?.builds ?? [] }
  }

  function readIndex (): BuildSummary[] {
    return readEnvelope().builds
  }

  /**
   * Read-modify-write with a single retry. If another writer bumped `rev` between our read
   * and our write, the transform is replayed against the fresh list rather than clobbering
   * it. One retry is enough here: the loser of a genuine race re-reads the winner's state.
   */
  function mutate (transform: (builds: BuildSummary[]) => BuildSummary[]) {
    const before = readEnvelope()
    const next = transform(before.builds)
    const current = readEnvelope()

    if (current.rev !== before.rev) {
      storage.set(INDEX_KEY, { rev: current.rev + 1, builds: transform(current.builds) })
      return
    }

    storage.set(INDEX_KEY, { rev: before.rev + 1, builds: next })
  }

  function key (buildId: string) {
    return `${BUILD_KEY}${buildId}`
  }

  // A pre-multi-build session left its wizard state in a single key. Adopt it as the first
  // build so nobody mid-flow loses work, then drop the legacy key. Reading it through
  // `storage.get` first is what makes it removable — `remove` only clears keys this
  // instance has seen.
  let migrated = false
  function migrate () {
    if (migrated) return
    migrated = true

    if (readIndex().length > 0 || !storage.has(LEGACY_KEY)) return

    const legacy = storage.get<BuildState>(LEGACY_KEY).value
    if (!legacy) return

    const now = Date.now()
    const entry: BuildSummary = {
      id: id(),
      name: 'First build',
      created: now,
      updated: now,
      plugins: legacy.selectedPlugins?.length ?? 0,
      components: legacy.selectedComponents?.length ?? 0,
    }

    storage.set(key(entry.id), clone({ ...legacy, version: BUILD_VERSION }))
    mutate(() => [entry])
    storage.set(ACTIVE_KEY, entry.id)
    storage.remove(LEGACY_KEY)
  }

  return {
    async list () {
      migrate()

      return readIndex().toSorted((a, b) => b.updated - a.updated)
    },

    async load (buildId) {
      return storage.get<BuildState>(key(buildId)).value ?? null
    },

    async save (buildId, state) {
      if (!readIndex().some(entry => entry.id === buildId)) return

      storage.set(key(buildId), clone({ ...state, version: BUILD_VERSION }))

      mutate(builds => builds.map(entry => entry.id === buildId
        ? {
            ...entry,
            updated: Date.now(),
            plugins: state.selectedPlugins.length,
            components: state.selectedComponents.length,
          }
        : entry,
      ))
    },

    async create (name) {
      const now = Date.now()
      const entry: BuildSummary = {
        id: id(),
        name,
        created: now,
        updated: now,
        plugins: 0,
        components: 0,
      }

      storage.set(key(entry.id), clone(EMPTY_BUILD))
      mutate(builds => [...builds, entry])

      return entry
    },

    async rename (buildId, name) {
      mutate(builds => builds.map(entry =>
        entry.id === buildId ? { ...entry, name, updated: Date.now() } : entry,
      ))
    },

    async remove (buildId) {
      mutate(builds => builds.filter(entry => entry.id !== buildId))

      // Read before removing. `remove` only clears keys this storage instance has already
      // seen, so deleting a build that was never opened this session would otherwise leave
      // its contents orphaned in storage forever.
      storage.get(key(buildId))
      storage.remove(key(buildId))
    },

    async activeId () {
      return storage.get<string | null>(ACTIVE_KEY, null).value ?? null
    },

    async setActive (buildId) {
      storage.set(ACTIVE_KEY, buildId)
    },

    // useStorage keeps one reactive ref per key and updates it from the window `storage`
    // event, so watching that ref is what makes another tab's write observable here.
    subscribe (listener) {
      return watch(
        storage.get<BuildIndex | BuildSummary[]>(INDEX_KEY, { rev: 0, builds: [] }),
        () => listener(),
        { deep: true },
      )
    },
  }
}
