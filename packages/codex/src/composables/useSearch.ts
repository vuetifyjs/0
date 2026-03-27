/**
 * @module useSearch
 *
 * Generic client-side search composable.
 * Filters items by query matching title, description, and category.
 * Uses useHotkey for keyboard shortcut (default: ctrl+k).
 */

// Framework
import { useHotkey } from '@vuetify/v0'

// Utilities
import { computed, shallowRef, toValue } from 'vue'

// Types
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'

export interface SearchItem {
  id: string
  title: string
  description?: string
  category?: string
  href?: string
}

export interface UseSearchOptions {
  items: MaybeRefOrGetter<SearchItem[]>
  /** Keyboard shortcut to toggle search. @default 'ctrl+k' */
  hotkey?: string
}

export interface UseSearchReturn {
  /** Whether the search is open */
  isOpen: ShallowRef<boolean>
  /** Current search query */
  query: ShallowRef<string>
  /** Filtered search results */
  results: ComputedRef<SearchItem[]>
  /** Open the search */
  open: () => void
  /** Close the search */
  close: () => void
  /** Toggle the search */
  toggle: () => void
  /** Clear the query */
  clear: () => void
}

function matches (text: string | undefined, terms: string[]): boolean {
  if (!text) return false
  const lower = text.toLowerCase()
  return terms.some(term => lower.includes(term))
}

export function useSearch (options: UseSearchOptions): UseSearchReturn {
  const { hotkey = 'ctrl+k' } = options
  const isOpen = shallowRef(false)
  const query = shallowRef('')

  const results = computed(() => {
    const trimmed = query.value.trim().toLowerCase()
    if (!trimmed) return []

    const terms = trimmed.split(/\s+/)
    const items = toValue(options.items)

    return items.filter(item =>
      terms.every(term =>
        matches(item.title, [term])
        || matches(item.description, [term])
        || matches(item.category, [term]),
      ),
    )
  })

  function open () {
    isOpen.value = true
    query.value = ''
  }

  function close () {
    isOpen.value = false
    query.value = ''
  }

  function toggle () {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  function clear () {
    query.value = ''
  }

  useHotkey(hotkey, (e: KeyboardEvent) => {
    e.preventDefault()
    toggle()
  })

  return {
    isOpen,
    query,
    results,
    open,
    close,
    toggle,
    clear,
  }
}
