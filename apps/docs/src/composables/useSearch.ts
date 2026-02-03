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
import { computed, nextTick, readonly, shallowRef, watch } from 'vue'

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

export interface SearchSelection {
  /** Currently selected result index */
  index: ShallowRef<number>
  /** Get the currently selected result */
  current: () => SearchResult | SavedResult | undefined
  /** Select previous result */
  prev: () => void
  /** Select next result */
  next: () => void
}

export interface UseSearchReturn {
  /** Whether the search modal is open */
  isOpen: Readonly<Ref<boolean>>
  /** Whether the search index is loading */
  isLoading: Readonly<Ref<boolean>>
  /** Error message if search index failed to load */
  error: Readonly<Ref<string | null>>
  /** Current search query text */
  text: ShallowRef<string>
  /** Results filtered by dismissed IDs, grouped by category */
  results: ComputedRef<GroupedResults[]>
  /** User's favorited pages */
  favorites: Readonly<Ref<SavedResult[]>>
  /** Recently visited pages from search */
  recents: Readonly<Ref<SavedResult[]>>
  /** Whether there's content to show in empty state (favorites or recents) */
  hasEmptyStateContent: ComputedRef<boolean>
  /** Keyboard selection state and controls */
  selection: SearchSelection
  /** Open the search modal */
  open: () => void
  /** Close the search modal */
  close: () => void
  /** Open and focus the search input */
  focus: () => Promise<void>
  /** Input element ref (bind with :ref="search.inputRef") */
  inputRef: ShallowRef<HTMLInputElement | null>
  /** Open search with a query */
  query: (text: string) => void
  /** Clear the search query */
  clear: () => void
  /** Toggle favorite status for an ID */
  favorite: (id: string) => void
  /** Remove from favorites */
  unfavorite: (id: string) => void
  /** Check if an ID is favorited */
  isFavorite: (id: string) => boolean
  /** Remove from favorites or recents */
  remove: (id: string) => void
  /** Dismiss a result temporarily (until query change or close) */
  dismiss: (id: string) => void
  /** Add to recent searches */
  addRecent: (result: SearchResult | SavedResult) => void
}

let miniSearch: MiniSearch<SearchDocument> | null = null
let indexPromise: Promise<void> | null = null
const inputRef = shallowRef<HTMLInputElement | null>(null)
const isOpen = shallowRef(false)
const isLoading = shallowRef(false)
const error = shallowRef<string | null>(null)
const text = shallowRef('')
const selectedIndex = shallowRef(0)
const logger = useLogger()

// Persistent state - loaded from storage on first use
const favorites = shallowRef<SavedResult[]>([])
const recents = shallowRef<SavedResult[]>([])
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
    recents.value = storedRecents.value
  }
}

/** Persist favorites to storage */
function persistFavorites (): void {
  storage?.set('search:favorites', favorites.value)
}

/** Persist recents to storage */
function persistRecents (): void {
  storage?.set('search:recents', recents.value)
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

// Category priority for search result boosting (lower = higher priority)
const CATEGORY_PRIORITY: Record<string, number> = {
  Component: 0,
  Components: 0,
  Composable: 0,
  Composables: 0,
  Factory: 0,
  Plugin: 1,
  Transformer: 1,
  Guide: 2,
  Introduction: 3,
  Utilities: 4,
  API: 5,
}

function search (query: string): SearchResult[] {
  if (!miniSearch || !query.trim()) {
    return []
  }

  const queryLower = query.toLowerCase().trim()
  const queryTerms = queryLower.split(/\s+/)
  const isMultiWord = queryTerms.length > 1
  const wantsApi = queryTerms.includes('api')
  // Extract non-"api" terms for matching
  const searchTerms = queryTerms.filter(t => t !== 'api')

  const results = miniSearch.search(query, {
    // Field importance
    boost: { title: 5, headings: 2, content: 1 },
    // Fuzzy/prefix matching
    fuzzy: 0.2,
    prefix: true,
    // Penalize fuzzy/prefix vs exact matches
    weights: { fuzzy: 0.4, prefix: 0.7 },
    // Require all terms for multi-word queries
    combineWith: isMultiWord ? 'AND' : 'OR',

    // Note: boostDocument is called per-term per-document, so boosts compound
    // for multi-term queries. We normalize by term count to maintain consistent ratios.
    boostDocument: (_, term, doc) => {
      const title = (doc?.title as string ?? '').toLowerCase()
      const category = doc?.category as string ?? ''
      const path = doc?.path as string ?? ''
      let boost = 1

      // === Exact/partial title match boosting ===
      // Exact title match gets highest priority
      if (title === queryLower) {
        boost *= 10
      // Title starts with query
      } else if (title.startsWith(queryLower)) {
        boost *= 5
      // Title contains full query
      } else if (title.includes(queryLower)) {
        boost *= 3
      // All search terms appear in title
      } else if (searchTerms.length > 0 && searchTerms.every(t => title.includes(t))) {
        boost *= 2
      }

      // === API-specific boosting ===
      if (wantsApi) {
        const isApiPage = category === 'API'
        if (isApiPage) {
          // API page with matching terms in title (e.g., "Tabs API" for query "tabs api")
          boost *= searchTerms.some(t => title.includes(t)) ? 4 : 2
        } else {
          // Penalize non-API results when explicitly searching for API
          boost *= 0.3
        }
      } else {
        // === Default category boosting (when not searching for API) ===
        const priority = CATEGORY_PRIORITY[category] ?? 6
        boost *= Math.max(0.5, 1 + (5 - priority) * 0.2)

        // Penalize index/overview pages (shallow paths like /components)
        const segments = path.split('/').filter(Boolean)
        if (segments.length <= 2) {
          boost *= 0.5
        }
      }

      // Normalize for multi-term queries to prevent excessive compounding
      return isMultiWord ? Math.pow(boost, 1 / queryTerms.length) : boost
    },
  })

  return results.slice(0, 20).map(result => ({
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

  // Sort groups by best score in each group (highest first)
  // This ensures the most relevant category appears first
  return Array.from(groups.entries())
    .map(([category, items]) => ({ category, items }))
    .toSorted((a, b) => {
      const bestScoreA = Math.max(...a.items.map(i => i.score))
      const bestScoreB = Math.max(...b.items.map(i => i.score))
      return bestScoreB - bestScoreA
    })
}

/** Find a result by ID from all available sources */
function findResult (id: string): SearchResult | SavedResult | undefined {
  // Check favorites first
  const fav = favorites.value.find(f => f.id === id)
  if (fav) return fav

  // Check recents
  const recent = recents.value.find(r => r.id === id)
  if (recent) return recent

  // Check current search results
  if (miniSearch && text.value.trim()) {
    const results = search(text.value)
    return results.find(r => r.id === id)
  }

  return undefined
}

// Depend on isLoading to re-run search after index loads
const rawResults = computed(() => isLoading.value ? [] : search(text.value))
const groupedResults = computed(() => groupByCategory(rawResults.value))

// Filter out dismissed results
const results = computed<GroupedResults[]>(() => {
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
  return favorites.value.length > 0 || recents.value.length > 0
})

/** Get total selectable items count (for keyboard navigation) */
function getSelectableCount (): number {
  if (text.value.trim()) {
    return results.value.reduce((sum, g) => sum + g.items.length, 0)
  }
  // In empty state, count favorites + recents
  return favorites.value.length + recents.value.length
}

function getCurrent (): SearchResult | SavedResult | undefined {
  const index = selectedIndex.value

  // If searching, get from displayed results
  if (text.value.trim()) {
    const flatResults = results.value.flatMap(g => g.items)
    return flatResults[index]
  }

  // In empty state, get from favorites first, then recents
  const favCount = favorites.value.length
  if (index < favCount) {
    return favorites.value[index]
  }
  return recents.value[index - favCount]
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

function clearDismissed () {
  if (dismissedIds.value.size > 0) {
    dismissedIds.value = new Set()
  }
}

function open () {
  if (!IN_BROWSER || isOpen.value) return

  isOpen.value = true
  text.value = ''
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

async function focus () {
  if (!IN_BROWSER) return

  open()
  // Wait for v-if to render the modal and ref to be bound
  await nextTick()
  await nextTick()
  inputRef.value?.focus()
}

function query (value: string) {
  if (!IN_BROWSER) return

  // Open if not already open
  if (!isOpen.value) {
    isOpen.value = true
    clearDismissed()

    // Load index lazily
    if (!miniSearch) {
      isLoading.value = true
      loadIndex().finally(() => {
        isLoading.value = false
      })
    }
  }

  text.value = value
  selectedIndex.value = 0
}

function clear () {
  text.value = ''
  selectedIndex.value = 0
}

// Favorites management
function favorite (id: string) {
  if (isFavorite(id)) {
    unfavorite(id)
  } else {
    const result = findResult(id)
    if (!result) return

    // Remove from recents if present
    if (recents.value.some(r => r.id === id)) {
      recents.value = recents.value.filter(r => r.id !== id)
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
}

function unfavorite (id: string) {
  const fav = favorites.value.find(f => f.id === id)
  if (fav) {
    // Move to recents when unfavoriting
    addRecent(fav)
  }
  favorites.value = favorites.value.filter(f => f.id !== id)
  persistFavorites()
}

function isFavorite (id: string): boolean {
  return favorites.value.some(f => f.id === id)
}

// Remove from favorites or recents
function remove (id: string) {
  if (isFavorite(id)) {
    favorites.value = favorites.value.filter(f => f.id !== id)
    persistFavorites()
  } else {
    recents.value = recents.value.filter(r => r.id !== id)
    persistRecents()
  }
}

// Recent searches management
function addRecent (result: SearchResult | SavedResult) {
  // Don't add if already in favorites
  if (favorites.value.some(f => f.id === result.id)) return

  // Remove if already exists (will be re-added at front)
  const filtered = recents.value.filter(r => r.id !== result.id)

  recents.value = [
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

// Dismiss management (session-only)
function dismiss (id: string) {
  const newSet = new Set(dismissedIds.value)
  newSet.add(id)
  dismissedIds.value = newSet
}

// Reset selection when results change
watch(rawResults, () => {
  selectedIndex.value = 0
})

// Clear dismissed results when text changes
watch(text, () => {
  if (dismissedIds.value.size > 0) {
    dismissedIds.value = new Set()
  }
})

// Reset selection when favorites or recents change (to avoid out-of-bounds)
watch([favorites, recents], () => {
  if (!text.value.trim()) {
    const total = getSelectableCount()
    if (selectedIndex.value >= total) {
      selectedIndex.value = Math.max(0, total - 1)
    }
  }
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
 *  const search = useSearch()
 *
 *  search.open()           // Open search modal
 *  search.query('Tabs')    // Open and search for "Tabs"
 *  search.favorite('id')   // Toggle favorite
 *  search.close()          // Close modal
 * </script>
 * ```
 */
export function useSearch (): UseSearchReturn {
  // Initialize storage on first use (requires component context)
  initStorage()

  return {
    isOpen: readonly(isOpen),
    isLoading: readonly(isLoading),
    error: readonly(error),
    text,
    results,
    favorites: readonly(favorites),
    recents: readonly(recents),
    hasEmptyStateContent,
    selection,
    open,
    close,
    focus,
    inputRef,
    query,
    clear,
    favorite,
    unfavorite,
    isFavorite,
    remove,
    dismiss,
    addRecent,
  }
}
