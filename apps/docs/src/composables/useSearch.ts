/**
 * @module useSearch
 *
 * @remarks
 * Client-side search using MiniSearch.
 * Loads search index lazily on first open.
 * Provides fuzzy matching with category grouping.
 *
 * Features:
 * - Favorites: persistent starred pages
 * - Recent searches: last 10 visited pages from search
 * - Dismissible results: temporarily hide results during search session
 *
 * Leverages @vuetify/v0 composables:
 * - useHotkey for keyboard navigation
 * - useToggleScope for conditional keyboard handler activation
 * - useStorage for persistent favorites and recents
 */

import MiniSearch from 'minisearch'

// Framework
import { IN_BROWSER, useHotkey, useLogger, useStorage, useToggleScope } from '@vuetify/v0'

// Utilities
import { computed, readonly, shallowRef, watch } from 'vue'

// Types
import type { SearchDocument } from '@build/generate-search-index'
import type { StorageContext } from '@vuetify/v0'
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

/** Minimal result data for favorites and recents */
export interface SavedResult {
  id: string
  title: string
  category: string
  path: string
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
  /** Results filtered by dismissed IDs, grouped by category */
  displayedResults: ComputedRef<GroupedResults[]>
  /** Currently selected result index */
  selectedIndex: ShallowRef<number>
  /** User's favorited pages */
  favorites: Readonly<Ref<SavedResult[]>>
  /** Recently visited pages from search */
  recentSearches: Readonly<Ref<SavedResult[]>>
  /** IDs of temporarily dismissed results */
  dismissedIds: Readonly<Ref<Set<string>>>
  /** Whether there's content to show in empty state (favorites or recents) */
  hasEmptyStateContent: ComputedRef<boolean>
  /** Open the search modal */
  open: () => void
  /** Close the search modal */
  close: () => void
  /** Toggle the search modal */
  toggle: () => void
  /** Clear the search query */
  clear: () => void
  /** Get the currently selected result */
  getSelected: () => SearchResult | SavedResult | undefined
  /** Add a result to favorites */
  addFavorite: (result: SearchResult | SavedResult) => void
  /** Remove a result from favorites */
  removeFavorite: (id: string) => void
  /** Check if a result is favorited */
  isFavorite: (id: string) => boolean
  /** Dismiss a result temporarily (until query change, close, or navigation) */
  dismiss: (id: string) => void
  /** Clear all dismissed results */
  clearDismissed: () => void
  /** Add to recent searches */
  addRecent: (result: SearchResult | SavedResult) => void
  /** Remove from recent searches */
  removeRecent: (id: string) => void
  /** Clear all recent searches */
  clearRecents: () => void
}

// Singleton state - shared across all instances
let miniSearch: MiniSearch<SearchDocument> | null = null
let indexPromise: Promise<void> | null = null
const isOpen = shallowRef(false)
const isLoading = shallowRef(false)
const error = shallowRef<string | null>(null)
const logger = useLogger()

// Persistent state - loaded from storage on first use
const favorites = shallowRef<SavedResult[]>([])
const recentSearches = shallowRef<SavedResult[]>([])
let storage: StorageContext | null = null
let storageInitialized = false

// Session-only state - not persisted, resets on page reload
const dismissedIds = shallowRef<Set<string>>(new Set())

const MAX_RECENTS = 10

/** Initialize storage and load persisted data */
function initStorage (): void {
  if (storageInitialized || !IN_BROWSER) return

  storageInitialized = true
  storage = useStorage()

  const storedFavorites = storage.get<SavedResult[]>('search:favorites')
  if (storedFavorites.value) {
    favorites.value = storedFavorites.value
  }

  const storedRecents = storage.get<SavedResult[]>('search:recents')
  if (storedRecents.value) {
    recentSearches.value = storedRecents.value
  }
}

/** Persist favorites to storage */
function persistFavorites (): void {
  storage?.set('search:favorites', favorites.value)
}

/** Persist recents to storage */
function persistRecents (): void {
  storage?.set('search:recents', recentSearches.value)
}

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
      logger.error('Failed to load search index', error_)
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
 *  const { isOpen, query, displayedResults, open, close } = useSearch()
 * </script>
 * ```
 */
export function useSearch (): UseSearchReturn {
  // Initialize storage on first use
  initStorage()

  const query = shallowRef('')
  const selectedIndex = shallowRef(0)

  const results = computed(() => search(query.value))
  const groupedResults = computed(() => groupByCategory(results.value))

  // Filter out dismissed results
  const displayedResults = computed<GroupedResults[]>(() => {
    if (dismissedIds.value.size === 0) {
      return groupedResults.value
    }

    return groupedResults.value
      .map(group => ({
        category: group.category,
        items: group.items.filter(item => !dismissedIds.value.has(item.id)),
      }))
      .filter(group => group.items.length > 0)
  })

  // Check if we have content to show in empty state
  const hasEmptyStateContent = computed(() => {
    return favorites.value.length > 0 || recentSearches.value.length > 0
  })

  // Get total selectable items count (for keyboard navigation)
  function getSelectableCount (): number {
    if (query.value.trim()) {
      return displayedResults.value.reduce((sum, g) => sum + g.items.length, 0)
    }
    // In empty state, count favorites + recents
    return favorites.value.length + recentSearches.value.length
  }

  // Reset selection when results change
  watch(results, () => {
    selectedIndex.value = 0
  })

  // Clear dismissed results when query changes
  watch(query, () => {
    if (dismissedIds.value.size > 0) {
      dismissedIds.value = new Set()
    }
  })

  // Reset selection when favorites or recents change (to avoid out-of-bounds)
  watch([favorites, recentSearches], () => {
    if (!query.value.trim()) {
      const total = getSelectableCount()
      if (selectedIndex.value >= total) {
        selectedIndex.value = Math.max(0, total - 1)
      }
    }
  })

  function open () {
    if (!IN_BROWSER) return

    isOpen.value = true
    query.value = ''
    selectedIndex.value = 0
    clearDismissed()

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
    clearDismissed()
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

  function getSelected (): SearchResult | SavedResult | undefined {
    const index = selectedIndex.value

    // If searching, get from displayed results
    if (query.value.trim()) {
      const flatResults = displayedResults.value.flatMap(g => g.items)
      return flatResults[index]
    }

    // In empty state, get from favorites first, then recents
    const favCount = favorites.value.length
    if (index < favCount) {
      return favorites.value[index]
    }
    return recentSearches.value[index - favCount]
  }

  function selectPrev () {
    const total = getSelectableCount()
    if (total === 0) return
    selectedIndex.value = (selectedIndex.value - 1 + total) % total
  }

  function selectNext () {
    const total = getSelectableCount()
    if (total === 0) return
    selectedIndex.value = (selectedIndex.value + 1) % total
  }

  // Favorites management
  function addFavorite (result: SearchResult | SavedResult) {
    // Don't add duplicates
    if (favorites.value.some(f => f.id === result.id)) return

    // Remove from recents if present
    if (recentSearches.value.some(r => r.id === result.id)) {
      recentSearches.value = recentSearches.value.filter(r => r.id !== result.id)
      persistRecents()
    }

    favorites.value = [
      {
        id: result.id,
        title: result.title,
        category: result.category,
        path: result.path,
      },
      ...favorites.value,
    ]
    persistFavorites()
  }

  function removeFavorite (id: string) {
    const favorite = favorites.value.find(f => f.id === id)
    if (favorite) {
      addRecent(favorite)
    }
    favorites.value = favorites.value.filter(f => f.id !== id)
    persistFavorites()
  }

  function isFavorite (id: string): boolean {
    return favorites.value.some(f => f.id === id)
  }

  // Recent searches management
  function addRecent (result: SearchResult | SavedResult) {
    // Don't add if already in favorites
    if (favorites.value.some(f => f.id === result.id)) return

    // Remove if already exists (will be re-added at front)
    const filtered = recentSearches.value.filter(r => r.id !== result.id)

    recentSearches.value = [
      {
        id: result.id,
        title: result.title,
        category: result.category,
        path: result.path,
      },
      ...filtered,
    ].slice(0, MAX_RECENTS)
    persistRecents()
  }

  function removeRecent (id: string) {
    recentSearches.value = recentSearches.value.filter(r => r.id !== id)
    persistRecents()
  }

  function clearRecents () {
    recentSearches.value = []
    persistRecents()
  }

  // Dismiss management (session-only)
  function dismiss (id: string) {
    const newSet = new Set(dismissedIds.value)
    newSet.add(id)
    dismissedIds.value = newSet
  }

  function clearDismissed () {
    if (dismissedIds.value.size > 0) {
      dismissedIds.value = new Set()
    }
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
    displayedResults,
    selectedIndex,
    favorites: readonly(favorites),
    recentSearches: readonly(recentSearches),
    dismissedIds: readonly(dismissedIds),
    hasEmptyStateContent,
    open,
    close,
    toggle,
    clear,
    getSelected,
    addFavorite,
    removeFavorite,
    isFavorite,
    dismiss,
    clearDismissed,
    addRecent,
    removeRecent,
    clearRecents,
  }
}
