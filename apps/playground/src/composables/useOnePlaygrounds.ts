/**
 * Vuetify One playgrounds API (create / update / autosave).
 * Content is the v0play share payload JSON (`snapshotContent` in usePlaygroundFiles).
 *
 * After the first explicit Save (or open from One), the association is written to
 * `?playground=<id>` (play’s `/playgrounds/:id` equivalent) so reload keeps the id,
 * and edits debounce into POST `/one/playgrounds/:id`.
 */

// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Utilities
import { shallowRef } from 'vue'

export interface OnePlayground {
  id: string
  title: string
  content?: string
  favorite: boolean
  pinned: boolean
  locked: boolean
  visibility: 'private' | 'public'
  createdAt: string
  updatedAt: string
}

/** Resolved One API origin — always use this; never hardcode production. */
export const ONE_API = import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'

/** Query key for the associated One playground (durable like play’s route id). */
export const ONE_PLAYGROUND_PARAM = 'playground'

/** Debounce for content → API (play uses 100ms after store mutate; we batch keystrokes). */
const AUTOSAVE_MS = 500

/** Module-level so Open dialog + Save share the same "current" association. */
const currentId = shallowRef<string>()
const currentTitle = shallowRef('Untitled')
const currentMeta = shallowRef<Pick<OnePlayground, 'favorite' | 'pinned' | 'locked' | 'visibility'>>({
  favorite: false,
  pinned: false,
  locked: false,
  visibility: 'public',
})
const saving = shallowRef(false)
const error = shallowRef<string>()
/** User toggle — when false, edits do not POST until manual Save. Default on once linked. */
const autosaveEnabled = shallowRef(true)

/** Last content string successfully written to One — skip no-op POSTs. */
let lastSynced: string | undefined
let autosaveTimer: ReturnType<typeof setTimeout> | undefined
/** Nestable pause while loading One content into the REPL. */
let pauseDepth = 0
/** Coalesce edits that land while a save is in flight. */
let queuedContent: string | undefined

function cancelAutosaveTimer () {
  if (autosaveTimer !== undefined) {
    clearTimeout(autosaveTimer)
    autosaveTimer = undefined
  }
}

function cancelAutosave () {
  cancelAutosaveTimer()
  queuedContent = undefined
}

function markSynced (content: string) {
  lastSynced = content
}

function pauseAutosave () {
  pauseDepth++
  cancelAutosaveTimer()
}

function resumeAutosave () {
  pauseDepth = Math.max(0, pauseDepth - 1)
}

/** Keep `?playground=<id>` in the address bar without clobbering hash/content. */
function syncUrl (id: string | undefined) {
  if (!IN_BROWSER) return

  const url = new URL(window.location.href)
  if (id) {
    if (url.searchParams.get(ONE_PLAYGROUND_PARAM) === id) return
    url.searchParams.set(ONE_PLAYGROUND_PARAM, id)
  } else {
    if (!url.searchParams.has(ONE_PLAYGROUND_PARAM)) return
    url.searchParams.delete(ONE_PLAYGROUND_PARAM)
  }
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
}

export function readPlaygroundIdFromUrl (): string | undefined {
  if (!IN_BROWSER) return undefined
  const id = new URL(window.location.href).searchParams.get(ONE_PLAYGROUND_PARAM)
  return id || undefined
}

export function useOnePlaygrounds () {
  function setCurrent (
    id: string | undefined,
    title?: string,
    meta?: Partial<Pick<OnePlayground, 'favorite' | 'pinned' | 'locked' | 'visibility'>>,
  ) {
    currentId.value = id
    if (title !== undefined) currentTitle.value = title || 'Untitled'
    if (meta) {
      currentMeta.value = {
        favorite: meta.favorite ?? false,
        pinned: meta.pinned ?? false,
        locked: meta.locked ?? false,
        visibility: meta.visibility ?? 'public',
      }
    }
    syncUrl(id)
  }

  function clearCurrent () {
    cancelAutosave()
    lastSynced = undefined
    autosaveEnabled.value = true
    currentId.value = undefined
    currentTitle.value = 'Untitled'
    currentMeta.value = {
      favorite: false,
      pinned: false,
      locked: false,
      visibility: 'public',
    }
    syncUrl(undefined)
  }

  function setAutosave (enabled: boolean) {
    autosaveEnabled.value = enabled
    if (!enabled) cancelAutosave()
  }

  function remember (playground: OnePlayground) {
    setCurrent(playground.id, playground.title, {
      favorite: playground.favorite,
      pinned: playground.pinned,
      locked: playground.locked,
      visibility: playground.visibility,
    })
  }

  async function fetchById (id: string): Promise<OnePlayground | null> {
    const res = await fetch(`${ONE_API}/one/playgrounds/${id}`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    const data = await res.json()
    return (data.playground ?? data) as OnePlayground
  }

  async function create (title: string, content: string): Promise<OnePlayground> {
    const res = await fetch(`${ONE_API}/one/playgrounds`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playground: {
          title: title.trim() || 'Untitled',
          content,
          favorite: false,
          pinned: false,
          locked: false,
          visibility: 'public',
        },
      }),
    })

    if (res.status === 401) throw new Error('Sign in required')
    if (!res.ok) throw new Error(`Save failed (${res.status})`)

    const data = await res.json()
    const playground = (data.playground ?? data) as OnePlayground
    remember(playground)
    markSynced(content)
    return playground
  }

  async function update (id: string, title: string, content: string): Promise<OnePlayground> {
    const res = await fetch(`${ONE_API}/one/playgrounds/${id}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playground: {
          title: title.trim() || 'Untitled',
          content,
          favorite: currentMeta.value.favorite,
          pinned: currentMeta.value.pinned,
          locked: currentMeta.value.locked,
          visibility: currentMeta.value.visibility,
        },
      }),
    })

    if (res.status === 401) throw new Error('Sign in required')
    if (res.status === 403) throw new Error('You do not own this playground')
    if (res.status === 404) throw new Error('Playground not found')
    if (!res.ok) throw new Error(`Save failed (${res.status})`)

    const data = await res.json()
    const playground = (data.playground ?? data) as OnePlayground
    remember(playground)
    markSynced(content)
    return playground
  }

  async function flushAutosave (content: string) {
    if (!IN_BROWSER || !currentId.value || !autosaveEnabled.value || pauseDepth > 0) return
    if (content === lastSynced) return

    if (saving.value) {
      queuedContent = content
      return
    }

    saving.value = true
    error.value = undefined
    try {
      await update(currentId.value, currentTitle.value, content)
    } catch (error_) {
      // Match play: don't interrupt editing; surface on `error` for optional UI.
      error.value = error_ instanceof Error ? error_.message : 'Auto-save failed'
    } finally {
      saving.value = false
      if (autosaveEnabled.value && queuedContent && queuedContent !== lastSynced) {
        const next = queuedContent
        queuedContent = undefined
        void flushAutosave(next)
      } else {
        queuedContent = undefined
      }
    }
  }

  /**
   * Debounced update when associated with a One playground and autosave is on.
   * No-ops until the first explicit Save / open from One sets `currentId`.
   */
  function scheduleAutosave (content: string | null | undefined) {
    if (!IN_BROWSER || !currentId.value || !autosaveEnabled.value || pauseDepth > 0) return
    if (content == null || content === lastSynced) return

    cancelAutosaveTimer()
    autosaveTimer = setTimeout(() => {
      autosaveTimer = undefined
      void flushAutosave(content)
    }, AUTOSAVE_MS)
  }

  /**
   * Create or update. Pass `asNew: true` to always create (Save as).
   * Pass `title` to set/rename; otherwise reuses `currentTitle`.
   * Writes `?playground=<id>`; autosave stays on for subsequent edits unless toggled off.
   */
  async function save (
    content: string,
    options: { title?: string, asNew?: boolean } = {},
  ): Promise<OnePlayground> {
    if (!IN_BROWSER) throw new Error('Save is only available in the browser')

    cancelAutosaveTimer()
    // Drop pre-click queue — the explicit snapshot is authoritative.
    queuedContent = undefined
    saving.value = true
    error.value = undefined
    try {
      const title = options.title ?? currentTitle.value
      if (options.asNew || !currentId.value) {
        return await create(title, content)
      }
      return await update(currentId.value, title, content)
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : 'Save failed'
      error.value = message
      throw error_
    } finally {
      saving.value = false
      // Drain edits that landed while this save held the lock.
      if (autosaveEnabled.value && queuedContent && queuedContent !== lastSynced) {
        const next = queuedContent
        queuedContent = undefined
        void flushAutosave(next)
      } else {
        queuedContent = undefined
      }
    }
  }

  return {
    currentId,
    currentTitle,
    saving,
    error,
    autosaveEnabled,
    setAutosave,
    setCurrent,
    clearCurrent,
    create,
    update,
    save,
    fetchById,
    scheduleAutosave,
    pauseAutosave,
    resumeAutosave,
    markSynced,
  }
}
