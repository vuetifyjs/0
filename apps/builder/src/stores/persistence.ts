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
  selectedPlugins: string[]
  pluginConfig: Record<string, unknown>
  selectedComponents: string[]
  componentConfig: Record<string, unknown>
}

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
}

const INDEX_KEY = 'builder.builds'
const ACTIVE_KEY = 'builder.active'
const BUILD_KEY = 'builder.build.'

/** Pre-multi-build key. Migrated into the first build, then deleted. */
const LEGACY_KEY = 'builder.v1'

export const EMPTY_BUILD: BuildState = {
  selectedPlugins: [],
  pluginConfig: {},
  selectedComponents: [],
  componentConfig: {},
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

  function readIndex (): BuildSummary[] {
    return storage.get<BuildSummary[]>(INDEX_KEY, []).value ?? []
  }

  function writeIndex (next: BuildSummary[]) {
    storage.set(INDEX_KEY, next)
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

    storage.set(key(entry.id), clone(legacy))
    writeIndex([entry])
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

      storage.set(key(buildId), clone(state))

      writeIndex(readIndex().map(entry => entry.id === buildId
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
      writeIndex([...readIndex(), entry])

      return entry
    },

    async rename (buildId, name) {
      writeIndex(readIndex().map(entry =>
        entry.id === buildId ? { ...entry, name, updated: Date.now() } : entry,
      ))
    },

    async remove (buildId) {
      writeIndex(readIndex().filter(entry => entry.id !== buildId))

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
  }
}
