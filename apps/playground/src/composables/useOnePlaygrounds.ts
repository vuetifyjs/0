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

// Stores
import { useAuthStore } from '@vuetify/auth'

// Utilities
import { isNullOrUndefined, isUndefined } from '#v0/utilities'
import { computed, type ComputedRef, type InjectionKey, inject, provide, shallowRef, toRef } from 'vue'
import { useRouter } from 'vue-router'

/** Injection key for route-provided playground ID (from `/playgrounds/:id`). */
const ROUTE_ID_KEY: InjectionKey<ComputedRef<string | undefined>> = Symbol('v0play:routeId')

/**
 * Provide a reactive route-based playground ID from `/playgrounds/:id`.
 * Called by the `[id].vue` page to inject the ID for usePlaygroundFiles.
 */
export function providePlaygroundRoute (id: ComputedRef<string | undefined>) {
  provide(ROUTE_ID_KEY, id)
}

/**
 * Inject the route-provided playground ID (if any).
 * Returns undefined when on the root `/` route.
 */
export function usePlaygroundRouteId (): ComputedRef<string | undefined> {
  return inject(ROUTE_ID_KEY, computed(() => undefined))
}

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
  /** Owner from API response (publicUserResponse shape). */
  owner?: { id: string }
}

export type OnePlaygroundMeta = Pick<OnePlayground, 'favorite' | 'pinned' | 'locked' | 'visibility'>

/** Resolved One API origin — always use this; never hardcode production. */
export const ONE_API = import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'

/** Query key for the associated One playground (durable like play’s route id). */
export const ONE_PLAYGROUND_PARAM = 'playground'

/** Debounce for content → API (play uses 100ms after store mutate; we batch keystrokes). */
const AUTOSAVE_MS = 500

/** Module-level so Open dialog + Save share the same "current" association. */
const currentId = shallowRef<string>()
const currentTitle = shallowRef('Untitled')
const currentMeta = shallowRef<OnePlaygroundMeta>({
  favorite: false,
  pinned: false,
  locked: false,
  visibility: 'public',
})
/** Owner user ID of current playground (undefined if not linked). */
const currentOwner = shallowRef<string>()
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
  if (!isUndefined(autosaveTimer)) {
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

/** Router instance set by useOnePlaygrounds for URL sync. */
let _router: ReturnType<typeof useRouter> | undefined

/**
 * Navigate to `/playgrounds/:id` (or back to `/`) while preserving the hash.
 * Uses vue-router for proper SPA navigation.
 */
function syncUrl (id: string | undefined) {
  if (!IN_BROWSER || !_router) return

  const hash = window.location.hash
  const currentPath = window.location.pathname

  if (id) {
    const targetPath = `/playgrounds/${id}`
    if (currentPath === targetPath) return
    _router.replace({ path: targetPath, hash })
  } else {
    if (currentPath === '/') return
    _router.replace({ path: '/', hash })
  }
}

/**
 * Read playground ID from route params (canonical `/playgrounds/:id`) or
 * legacy query param (`?playground=<id>`). Route params take precedence.
 */
export function readPlaygroundIdFromUrl (): string | undefined {
  if (!IN_BROWSER) return undefined
  const url = new URL(window.location.href)

  // Check route path first (canonical form)
  const pathMatch = url.pathname.match(/^\/playgrounds\/([^/]+)$/)
  if (pathMatch?.[1]) return pathMatch[1]

  // Fallback to query param (backwards compat)
  const queryId = url.searchParams.get(ONE_PLAYGROUND_PARAM)
  return queryId || undefined
}

export function useOnePlaygrounds () {
  // Initialize router for syncUrl navigation (only if called in component context)
  try {
    _router = useRouter()
  } catch {
    // Not in component context — syncUrl will no-op
  }

  // Auth store for ownership checks — safe to call during setup
  let _auth: ReturnType<typeof useAuthStore> | undefined
  try {
    _auth = useAuthStore()
  } catch {
    // SSR or outside component context
  }

  const isOwner = toRef(() => {
    if (!currentId.value || !currentOwner.value) return false
    return _auth?.user?.id === currentOwner.value
  })

  function setCurrent (
    id: string | undefined,
    title?: string,
    meta?: Partial<OnePlaygroundMeta>,
    options?: { skipUrlSync?: boolean, owner?: string },
  ) {
    currentId.value = id
    if (!isUndefined(title)) currentTitle.value = title || 'Untitled'
    if (meta) {
      currentMeta.value = {
        favorite: meta.favorite ?? false,
        pinned: meta.pinned ?? false,
        locked: meta.locked ?? false,
        visibility: meta.visibility ?? 'public',
      }
    }
    const owner = options?.owner
    if (!isUndefined(owner)) {
      currentOwner.value = owner
    }
    if (!options?.skipUrlSync) {
      syncUrl(id)
    }
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
    currentOwner.value = undefined
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
    }, { owner: playground.owner?.id })
  }

  async function fetchById (id: string): Promise<OnePlayground | null> {
    const res = await fetch(`${ONE_API}/one/playgrounds/${id}`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    const data = await res.json()
    return (data.playground ?? data) as OnePlayground
  }

  async function create (
    title: string,
    content: string,
    options?: { visibility?: 'private' | 'public' },
  ): Promise<OnePlayground> {
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
          visibility: options?.visibility ?? 'public',
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
    if (isNullOrUndefined(content) || content === lastSynced) return

    const next = content ?? ''
    cancelAutosaveTimer()
    autosaveTimer = setTimeout(() => {
      autosaveTimer = undefined
      void flushAutosave(next)
    }, AUTOSAVE_MS)
  }

  /**
   * Create or update. Pass `asNew: true` to always create (Save as).
   * Pass `title` to set/rename; otherwise reuses `currentTitle`.
   * Navigates to `/playgrounds/<id>`; autosave stays on for subsequent edits unless toggled off.
   */
  async function save (
    content: string,
    options: { title?: string, asNew?: boolean, visibility?: 'private' | 'public' } = {},
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
        return await create(title, content, { visibility: options.visibility })
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

  /**
   * Partial update for meta fields only — does not touch content.
   * Keeps meta and content autosave on separate paths to avoid races.
   */
  async function patchMeta (
    patch: Partial<Pick<OnePlaygroundMeta, 'favorite' | 'pinned' | 'locked' | 'visibility'> & { title?: string }>,
  ): Promise<OnePlayground> {
    if (!IN_BROWSER) throw new Error('patchMeta is only available in the browser')
    if (!currentId.value) throw new Error('No playground linked')

    const res = await fetch(`${ONE_API}/one/playgrounds/${currentId.value}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playground: patch }),
    })

    if (res.status === 401) throw new Error('Sign in required')
    if (res.status === 403) throw new Error('You do not own this playground')
    if (res.status === 404) throw new Error('Playground not found')
    if (!res.ok) throw new Error(`Update failed (${res.status})`)

    const data = await res.json()
    const playground = (data.playground ?? data) as OnePlayground

    if (!isUndefined(patch.title)) currentTitle.value = playground.title
    currentMeta.value = {
      favorite: playground.favorite,
      pinned: playground.pinned,
      locked: playground.locked,
      visibility: playground.visibility,
    }

    return playground
  }

  /**
   * Delete the current playground and clear the association.
   * Throws if favorite or locked — caller must clear those first.
   */
  async function destroy (): Promise<void> {
    if (!IN_BROWSER) throw new Error('destroy is only available in the browser')
    if (!currentId.value) throw new Error('No playground linked')
    if (currentMeta.value.favorite) throw new Error('Cannot delete a favorited playground')
    if (currentMeta.value.locked) throw new Error('Cannot delete a locked playground')

    const res = await fetch(`${ONE_API}/one/playgrounds/${currentId.value}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (res.status === 401) throw new Error('Sign in required')
    if (res.status === 403) throw new Error('You do not own this playground')
    if (res.status === 404) throw new Error('Playground not found')
    if (!res.ok) throw new Error(`Delete failed (${res.status})`)

    clearCurrent()
    navigateToRoot()
  }

  /**
   * Create a copy of the current playground as an owned playground.
   * Sets defaults: favorite/pinned/locked false, visibility public.
   * Navigates to the new playground.
   */
  async function fork (getContent: () => string): Promise<OnePlayground> {
    if (!IN_BROWSER) throw new Error('fork is only available in the browser')
    if (!currentId.value) throw new Error('No playground linked')

    const content = getContent()
    const title = `${currentTitle.value} (fork)`

    const res = await fetch(`${ONE_API}/one/playgrounds`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playground: {
          title,
          content,
          favorite: false,
          pinned: false,
          locked: false,
          visibility: 'public',
        },
      }),
    })

    if (res.status === 401) throw new Error('Sign in required')
    if (!res.ok) throw new Error(`Fork failed (${res.status})`)

    const data = await res.json()
    const playground = (data.playground ?? data) as OnePlayground
    remember(playground)
    markSynced(content)
    navigateToPlayground(playground.id)
    return playground
  }

  /**
   * Navigate to the canonical playground URL `/playgrounds/:id`, preserving hash.
   * Use this for explicit navigation (e.g., opening from the gallery).
   */
  function navigateToPlayground (id: string) {
    if (!IN_BROWSER || !_router) return
    const hash = window.location.hash
    _router.push({ path: `/playgrounds/${id}`, hash })
  }

  /**
   * Navigate back to the root `/` when clearing a playground association.
   */
  function navigateToRoot () {
    if (!IN_BROWSER || !_router) return
    const hash = window.location.hash
    const currentPath = window.location.pathname
    if (currentPath !== '/') {
      _router.push({ path: '/', hash })
    }
  }

  return {
    currentId,
    currentTitle,
    currentMeta,
    currentOwner,
    isOwner,
    saving,
    error,
    autosaveEnabled,
    setAutosave,
    setCurrent,
    clearCurrent,
    create,
    update,
    save,
    patchMeta,
    destroy,
    fork,
    fetchById,
    scheduleAutosave,
    pauseAutosave,
    resumeAutosave,
    markSynced,
    navigateToPlayground,
    navigateToRoot,
  }
}
