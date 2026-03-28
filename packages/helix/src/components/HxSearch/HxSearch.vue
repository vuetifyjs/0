<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { Dialog } from '@vuetify/v0'

  // Sub-components
  import HxSearchEmpty from './HxSearchEmpty.vue'
  import HxSearchFooter from './HxSearchFooter.vue'
  import HxSearchInput from './HxSearchInput.vue'
  import HxSearchResult from './HxSearchResult.vue'

  // Composables
  import { useSearch } from '#helix/composables/useSearch'

  // Types
  import type { SearchItem } from '#helix/composables/useSearch'
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxSearchGroupedResults {
    category: string
    items: SearchItem[]
  }

  export interface HxSearchProps extends V0PaperProps {
    /** Search items — when provided, component handles filtering internally */
    items?: SearchItem[]
    /** Externally provided grouped results (overrides internal filtering) */
    groups?: HxSearchGroupedResults[]
    /** Keyboard shortcut to toggle search. @default 'ctrl+k' */
    hotkey?: string
    /** Whether search is loading */
    loading?: boolean
    /** Error message to display */
    error?: string
    /** Placeholder text for search input */
    placeholder?: string
  }
</script>

<script setup lang="ts">
  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'HxSearch' })

  const {
    items,
    groups,
    hotkey = 'ctrl+k',
    loading = false,
    error,
    placeholder = 'Search...',
    ...paperProps
  } = defineProps<HxSearchProps>()

  const emit = defineEmits<{
    /** Fired when a result is selected (Enter or click) */
    'select': [item: SearchItem]
    /** Fired when the query changes */
    'update:query': [value: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })
  const query = defineModel<string>('query', { default: '' })

  const resultsRef = useTemplateRef<HTMLDivElement>('results')
  const triggerRef = shallowRef<HTMLElement | null>(null)
  const inputRef = shallowRef<HTMLInputElement | null>(null)

  // When items are provided, use internal search composable
  const search = items
    ? useSearch({ items: () => items, hotkey })
    : undefined

  // Sync composable's isOpen with the v-model
  if (search) {
    watch(search.isOpen, value => {
      open.value = value
    })
    watch(open, value => {
      if (value !== search.isOpen.value) {
        value ? search.open() : search.close()
      }
    })
    // Sync query
    watch(search.query, value => {
      query.value = value
    })
    watch(query, value => {
      if (value !== search.query.value) {
        search.query.value = value
      }
    })
  }

  // Determine which results to render
  const displayResults = toRef(() => {
    if (groups) return groups
    if (search) {
      // Group internal results by category
      const map = new Map<string, SearchItem[]>()
      for (const item of search.results.value) {
        const cat = item.category ?? ''
        const arr = map.get(cat) ?? []
        arr.push(item)
        map.set(cat, arr)
      }
      return Array.from(map.entries()).map(([category, grouped]) => ({ category, items: grouped }))
    }
    return []
  })

  // Selection index for keyboard navigation
  const selectedIndex = toRef(() => search?.selection.index.value ?? 0)

  // Flat item count for selection
  const flatCount = toRef(() => displayResults.value.reduce((sum, g) => sum + g.items.length, 0))

  function getFlatIndex (groupIndex: number, itemIndex: number): number {
    let flat = 0
    for (let g = 0; g < groupIndex; g++) {
      flat += displayResults.value[g]?.items.length ?? 0
    }
    return flat + itemIndex
  }

  function getActiveDescendantId (): string | undefined {
    if (flatCount.value === 0 || selectedIndex.value < 0) return undefined
    return `helix-search-result-${selectedIndex.value}`
  }

  // Focus management: save and restore trigger element
  watch(open, async opened => {
    if (opened) {
      triggerRef.value = document.activeElement as HTMLElement | null
      await nextTick()
      await nextTick()
      inputRef.value?.focus()
    } else {
      triggerRef.value?.focus()
      triggerRef.value = null
    }
  })

  // Scroll selected result into view
  watch(selectedIndex, async () => {
    await nextTick()
    const container = resultsRef.value
    const selected = container?.querySelector('[data-selected="true"]') as HTMLElement | null
    selected?.scrollIntoView({ block: 'nearest' })
  })

  function onSelect (item: SearchItem) {
    emit('select', item)
  }

  function onHover (index: number) {
    if (search) {
      search.selection.index.value = index
    }
  }

  function onEnter () {
    const current = search?.selection.current()
    if (current) {
      emit('select', current)
    }
  }

  function onInputRef (el: HTMLInputElement | null) {
    inputRef.value = el
  }
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Content v-slot="{ attrs }">
      <V0Paper
        v-bind="{ ...paperProps, ...attrs }"
        as="div"
        class="helix-search"
        @keydown.enter.prevent="onEnter"
      >
        <span class="sr-only">Search</span>

        <slot name="input" :query :set-input-ref="onInputRef">
          <HxSearchInput
            :ref="el => { if (el?.$el) inputRef = el.$el.querySelector('input') }"
            v-model:query="query"
            :active-descendant="getActiveDescendantId()"
            :expanded="flatCount > 0"
            :placeholder
          />
        </slot>

        <div
          id="helix-search-listbox"
          ref="results"
          aria-label="Search results"
          class="helix-search__results"
          role="listbox"
        >
          <!-- Loading skeleton -->
          <slot v-if="loading" name="loading">
            <div role="status">
              <span class="sr-only">Loading search results...</span>
              <div v-for="group in 2" :key="group" aria-hidden="true">
                <div class="helix-search__skeleton-header" />
                <div v-for="item in 3" :key="item" class="helix-search__skeleton-item">
                  <div class="helix-search__skeleton-title" />
                  <div class="helix-search__skeleton-subtitle" />
                </div>
              </div>
            </div>
          </slot>

          <!-- Error state -->
          <slot v-else-if="error" :message="error" name="error">
            <div class="helix-search__error" role="alert">
              {{ error }}
            </div>
          </slot>

          <!-- Empty query state -->
          <slot v-else-if="!query.trim()" name="empty">
            <HxSearchEmpty />
          </slot>

          <!-- No results state -->
          <slot v-else-if="flatCount === 0" name="no-results" :query>
            <HxSearchEmpty :query />
          </slot>

          <!-- Grouped search results -->
          <template v-else>
            <div
              v-for="(group, groupIndex) in displayResults"
              :key="group.category"
              :aria-label="group.category"
              role="group"
            >
              <div class="helix-search__group-header">
                {{ group.category }}
              </div>

              <slot
                v-for="(item, itemIndex) in group.items"
                :key="item.id"
                :flat-index="getFlatIndex(groupIndex, itemIndex)"
                :group-index
                :item
                :item-index
                name="result"
                :selected="getFlatIndex(groupIndex, itemIndex) === selectedIndex"
              >
                <HxSearchResult
                  :result-id="`helix-search-result-${getFlatIndex(groupIndex, itemIndex)}`"
                  :selected="getFlatIndex(groupIndex, itemIndex) === selectedIndex"
                  :title="item.title"
                  @hover="onHover(getFlatIndex(groupIndex, itemIndex))"
                  @select="onSelect(item)"
                />
              </slot>
            </div>
          </template>
        </div>

        <slot name="footer">
          <HxSearchFooter />
        </slot>
      </V0Paper>
    </Dialog.Content>
  </Dialog.Root>
</template>

<style scoped>
  .helix-search {
    display: flex;
    flex-direction: column;
  }

  .helix-search__results {
    flex: 1;
    overflow-y: auto;
    max-height: 24rem;
  }

  .helix-search__group-header {
    padding: 0.5rem 1rem;
    font-size: 0.75em;
    font-weight: 600;
    opacity: 0.6;
  }

  .helix-search__error {
    padding: 2rem 1rem;
    text-align: center;
  }

  .helix-search__skeleton-header {
    padding: 0.5rem 1rem;
    height: 0.75rem;
    width: 5rem;
    border-radius: 0.25rem;
    opacity: 0.2;
  }

  .helix-search__skeleton-item {
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .helix-search__skeleton-title {
    height: 1rem;
    width: 66%;
    border-radius: 0.25rem;
    opacity: 0.15;
  }

  .helix-search__skeleton-subtitle {
    height: 0.75rem;
    width: 33%;
    border-radius: 0.25rem;
    opacity: 0.1;
  }
</style>
