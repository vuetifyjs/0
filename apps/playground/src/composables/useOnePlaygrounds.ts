/**
 * Vuetify One playgrounds API (create / update).
 * Content is the v0play share payload JSON (`snapshotContent` in usePlaygroundFiles).
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

const API = import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'

/** Module-level so Open dialog + Save share the same "current" association. */
const currentId = shallowRef<string>()
const currentTitle = shallowRef('Untitled')
const currentMeta = shallowRef<Pick<OnePlayground, 'favorite' | 'pinned' | 'locked' | 'visibility'>>({
  favorite: false,
  pinned: false,
  locked: false,
  visibility: 'public',
})

export function useOnePlaygrounds () {
  const saving = shallowRef(false)
  const error = shallowRef<string>()

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
  }

  function clearCurrent () {
    currentId.value = undefined
    currentTitle.value = 'Untitled'
    currentMeta.value = {
      favorite: false,
      pinned: false,
      locked: false,
      visibility: 'public',
    }
  }

  function remember (playground: OnePlayground) {
    setCurrent(playground.id, playground.title, {
      favorite: playground.favorite,
      pinned: playground.pinned,
      locked: playground.locked,
      visibility: playground.visibility,
    })
  }

  async function create (title: string, content: string): Promise<OnePlayground> {
    const res = await fetch(`${API}/one/playgrounds`, {
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
    return playground
  }

  async function update (id: string, title: string, content: string): Promise<OnePlayground> {
    const res = await fetch(`${API}/one/playgrounds/${id}`, {
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
    return playground
  }

  /**
   * Create or update. Pass `asNew: true` to always create (Save as).
   * Pass `title` to set/rename; otherwise reuses `currentTitle`.
   */
  async function save (
    content: string,
    options: { title?: string, asNew?: boolean } = {},
  ): Promise<OnePlayground> {
    if (!IN_BROWSER) throw new Error('Save is only available in the browser')

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
    }
  }

  return {
    currentId,
    currentTitle,
    saving,
    error,
    setCurrent,
    clearCurrent,
    create,
    update,
    save,
  }
}
