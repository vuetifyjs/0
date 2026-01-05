/**
 * @module useSearch
 *
 * @remarks
 * Client-side search using MiniSearch.
 * Loads search index lazily on first open.
 * Provides fuzzy matching with category grouping.
 *
 * Leverages @vuetify/v0 composables:
 * - useHotkey for keyboard navigation
 * - useToggleScope for conditional keyboard handler activation
 */

import MiniSearch from 'minisearch'

// Framework
import { IN_BROWSER, useHotkey, useToggleScope } from '@vuetify/v0'

// Utilities
import { computed, readonly, shallowRef, watch } from 'vue'

// Types
import type { SearchDocument } from '../../build/generate-search-index'
import type { ComputedRef, Ref, ShallowRef } from 'vue'

export interface SearchResult {
  id: string
  title: string
  category: string
  path: string
  headings: string[]
  score: number
}

export interface GroupedResults {
  category: string
  items: SearchResult[]
}

export interface UseSearchReturn {
  /** Whether the search modal is open */
  isOpen: Readonly<Ref<boolean>>
  /** Whether the search index is loading */
  isLoading: Readonly<Ref<boolean>>
  /** Error message if search index failed to load */
  error: Readonly<Ref<string | null>>
  /** Current search query */
  query: ShallowRef<string>
  /** Search results */
  results: ComputedRef<SearchResult[]>
  /** Results grouped by category */
  groupedResults: ComputedRef<GroupedResults[]>
  /** Currently selected result index */
  selectedIndex: ShallowRef<number>
  /** Open the search modal */
  open: () => void
  /** Close the search modal */
  close: () => void
  /** Toggle the search modal */
  toggle: () => void
  /** Clear the search query */
  clear: () => void
  /** Get the currently selected result */
  getSelected: () => SearchResult | undefined
}

// Singleton state - shared across all instances
let miniSearch: MiniSearch<SearchDocument> | null = null
let indexPromise: Promise<void> | null = null
const isOpen = shallowRef(false)
const isLoading = shallowRef(false)
const error = shallowRef<string | null>(null)

async function loadIndex (): Promise<void> {
  if (miniSearch) return
  if (indexPromise) return indexPromise

  indexPromise = (async () => {
    try {
      error.value = null
      const response = await fetch('/search-index.json')
      if (!response.ok) {
        throw new Error('Failed to load search index')
      }

      const docs: SearchDocument[] = await response.json()

      miniSearch = new MiniSearch({
        fields: ['title', 'headings', 'content'],
        storeFields: ['title', 'category', 'path', 'headings'],
        searchOptions: {
          boost: { title: 3, headings: 2 },
          fuzzy: 0.2,
          prefix: true,
        },
      })

      miniSearch.addAll(docs)
    } catch (error_) {
      console.error('[useSearch] Failed to load index:', error_)
      error.value = 'Failed to load search index. Please try again.'
      miniSearch = null
    }
  })()

  return indexPromise
}

function search (query: string): SearchResult[] {
  if (!miniSearch || !query.trim()) {
    return []
  }

  const results = miniSearch.search(query, { limit: 20 })

  return results.map(result => ({
    id: result.id,
    title: result.title as string,
    category: result.category as string,
    path: result.path as string,
    headings: (result.headings ?? []) as string[],
    score: result.score,
  }))
}

function groupByCategory (results: SearchResult[]): GroupedResults[] {
  const groups = new Map<string, SearchResult[]>()

  for (const result of results) {
    const items = groups.get(result.category) ?? []
    items.push(result)
    groups.set(result.category, items)
  }

  return Array.from(groups.entries())
    .map(([category, items]) => ({ category, items }))
    .toSorted((a, b) => {
      if (a.category === 'Guide') return -1
      if (b.category === 'Guide') return 1
      return a.category.localeCompare(b.category)
    })
}

/**
 * Creates a search instance for documentation.
 *
 * @returns Search state and controls
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *  import { useSearch } from '@/composables/useSearch'
 *
 *  const { isOpen, query, results, open, close } = useSearch()
 * </script>
 * ```
 */
export function useSearch (): UseSearchReturn {
  const query = shallowRef('')
  const selectedIndex = shallowRef(0)

  const results = computed(() => search(query.value))
  const groupedResults = computed(() => groupByCategory(results.value))

  // Reset selection when results change
  watch(results, () => {
    selectedIndex.value = 0
  })

  function open () {
    if (!IN_BROWSER) return

    isOpen.value = true
    query.value = ''
    selectedIndex.value = 0

    // Load index lazily
    if (!miniSearch) {
      isLoading.value = true
      loadIndex().finally(() => {
        isLoading.value = false
      })
    }
  }

  function close () {
    isOpen.value = false
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

  function getSelected (): SearchResult | undefined {
    return groupedResults.value.flatMap(g => g.items)[selectedIndex.value]
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

  // Keyboard navigation - only active when modal is open
  useToggleScope(() => isOpen.value, () => {
    useHotkey('escape', close, { inputs: true })
    useHotkey('up', selectPrev, { inputs: true })
    useHotkey('down', selectNext, { inputs: true })
  })

  return {
    isOpen: readonly(isOpen),
    isLoading: readonly(isLoading),
    error: readonly(error),
    query,
    results,
    groupedResults,
    selectedIndex,
    open,
    close,
    toggle,
    clear,
    getSelected,
  }
}
