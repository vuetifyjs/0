/**
 * @module useSearch
 *
 * Generic client-side search composable.
 * Filters items by query matching title, description, and category.
 * Uses useHotkey for keyboard shortcut (default: ctrl+k).
 * Includes keyboard selection for navigating results.
 */

// Framework
import { useHotkey, useToggleScope } from '@vuetify/v0'

// Utilities
import { computed, shallowRef, toValue, watch } from 'vue'

// Types
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'

export interface SearchItem {
  id: string
  title: string
  description?: string
  category?: string
  href?: string
}

export interface SearchSelection {
  /** Currently selected result index */
  index: ShallowRef<number>
  /** Get the currently selected result */
  current: () => SearchItem | undefined
  /** Select previous result */
  prev: () => void
  /** Select next result */
  next: () => void
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
  /** Keyboard selection state and controls */
  selection: SearchSelection
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
  const selectedIndex = shallowRef(0)

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

  // Reset selection when results change
  watch(results, () => {
    selectedIndex.value = 0
  })

  function getCurrent (): SearchItem | undefined {
    return results.value[selectedIndex.value]
  }

  function selectPrev () {
    const total = results.value.length
    if (total === 0) return
    selectedIndex.value = (selectedIndex.value - 1 + total) % total
  }

  function selectNext () {
    const total = results.value.length
    if (total === 0) return
    selectedIndex.value = (selectedIndex.value + 1) % total
  }

  function open () {
    isOpen.value = true
    query.value = ''
    selectedIndex.value = 0
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
    selectedIndex.value = 0
  }

  useHotkey(hotkey, (e: KeyboardEvent) => {
    e.preventDefault()
    toggle()
  })

  // Keyboard navigation - only active when modal is open
  useToggleScope(() => isOpen.value, () => {
    useHotkey('escape', close, { inputs: true })
    useHotkey('up', selectPrev, { inputs: true })
    useHotkey('down', selectNext, { inputs: true })
  })

  const selection: SearchSelection = {
    index: selectedIndex,
    current: getCurrent,
    prev: selectPrev,
    next: selectNext,
  }

  return {
    isOpen,
    query,
    results,
    selection,
    open,
    close,
    toggle,
    clear,
  }
}
