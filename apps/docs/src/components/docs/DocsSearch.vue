<script setup lang="ts">
  // Framework
  import { useDocumentEventListener } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { SavedResult, SearchResult } from '@/composables/useSearch'

  const search = useSearch()

  const router = useRouter()
  const inputRef = useTemplateRef<HTMLInputElement>('input')
  const resultsRef = useTemplateRef<HTMLDivElement>('results')
  const triggerRef = shallowRef<HTMLElement | null>(null)
  const settings = useSettings()
  const ask = useAsk()
  const transition = toRef(() => settings.prefersReducedMotion.value ? undefined : 'fade')

  watch(search.isOpen, async opened => {
    if (opened) {
      triggerRef.value = document.activeElement as HTMLElement | null
      await nextTick()
      inputRef.value?.focus()
    } else {
      triggerRef.value?.focus()
      triggerRef.value = null
    }
  })

  watch(search.focusTrigger, async () => {
    if (search.isOpen.value) {
      await nextTick()
      inputRef.value?.focus()
    }
  })

  watch(search.selectedIndex, async () => {
    await nextTick()
    const container = resultsRef.value
    const selected = container?.querySelector('[data-selected="true"]') as HTMLElement | null
    if (selected) {
      selected.scrollIntoView({ block: 'nearest', behavior: settings.prefersReducedMotion.value ? 'auto' : 'smooth' })
    }
  })

  function navigate (result?: SearchResult | SavedResult) {
    const selected = result ?? search.getSelected()
    if (selected) {
      search.addRecent(selected)
      search.query.value = ''
      router.push(selected.path)
      search.close()
    }
  }

  function toggleFavorite (e: Event, result: SearchResult | SavedResult) {
    e.stopPropagation()
    if (search.isFavorite(result.id)) {
      search.removeFavorite(result.id)
    } else {
      search.addFavorite(result)
    }
  }

  function dismissResult (e: Event, id: string) {
    e.stopPropagation()
    search.dismiss(id)
  }

  function handleRemoveRecent (e: Event, id: string) {
    e.stopPropagation()
    search.removeRecent(id)
  }

  function handleRemoveFavorite (e: Event, id: string) {
    e.stopPropagation()
    search.removeFavorite(id)
  }

  async function askAbout (e: Event, result: SearchResult | SavedResult) {
    e.stopPropagation()
    search.addRecent(result)
    search.query.value = ''
    search.close()
    await router.push(result.path)
    ask.open()
    ask.ask(`Tell me about ${result.title}`)
  }

  /** Get flat index accounting for favorites + recents in empty state */
  function getEmptyStateIndex (section: 'favorites' | 'recents', itemIndex: number): number {
    if (section === 'favorites') {
      return itemIndex
    }
    return search.favorites.value.length + itemIndex
  }

  function onKeydown (e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      search.isOpen.value ? search.close() : search.open()
    }

    if (e.key === 'Enter' && search.isOpen.value) {
      e.preventDefault()
      navigate()
    }
  }

  useDocumentEventListener('keydown', onKeydown)

  function onHover (index: number) {
    search.selectedIndex.value = index
  }

  function getFlatIndex (groupIndex: number, itemIndex: number): number {
    let flat = 0
    for (let g = 0; g < groupIndex; g++) {
      flat += search.displayedResults.value[g]?.items.length ?? 0
    }
    return flat + itemIndex
  }

  /** Get the ID of the currently selected result for aria-activedescendant */
  function getActiveDescendantId (): string | undefined {
    const count = search.query.value.trim()
      ? search.displayedResults.value.reduce((sum, g) => sum + g.items.length, 0)
      : search.favorites.value.length + search.recentSearches.value.length

    if (count === 0 || search.selectedIndex.value < 0) return undefined
    return `search-result-${search.selectedIndex.value}`
  }

  /** Check if there are any results to show */
  function hasResults (): boolean {
    if (search.query.value.trim()) {
      return search.displayedResults.value.length > 0
    }
    return search.hasEmptyStateContent.value
  }
</script>

<template>
  <Transition :name="transition">
    <div
      v-if="search.isOpen.value"
      class="fixed inset-0 bg-black/30 z-50"
      @click="search.close"
    />
  </Transition>

  <Transition :name="transition">
    <div
      v-if="search.isOpen.value"
      aria-label="Search Documentation"
      aria-modal="true"
      class="fixed inset-x-0 top-[20%] mx-auto w-full max-w-2xl z-50 px-4"
      role="dialog"
    >
      <div :class="['rounded-lg shadow-xl border border-divider overflow-hidden', settings.showBgGlass.value ? 'bg-glass-surface' : 'bg-surface']">
        <Discovery.Activator
          class="flex-1 bg-transparent flex border-b border-divider outline-none text-on-surface rounded-lg rounded-b-0 items-center gap-3 px-4 py-3"
          step="search-tabs"
        >
          <AppIcon
            aria-hidden="true"
            class="text-on-surface-variant shrink-0"
            icon="search"
          />
          <input
            ref="input"
            v-model="search.query.value"
            :aria-activedescendant="getActiveDescendantId()"
            aria-autocomplete="list"
            aria-controls="search-listbox"
            :aria-expanded="hasResults()"
            aria-label="Search documentation"
            class="flex-1 bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-tint"
            placeholder="Search the docs..."
            role="combobox"
            type="search"
          >
          <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant text-xs font-mono">
            esc
          </kbd>
        </Discovery.Activator>

        <div
          id="search-listbox"
          ref="results"
          aria-label="Search results"
          class="max-h-96 overflow-y-auto"
          role="listbox"
        >
          <!-- Loading skeleton -->
          <div v-if="search.isLoading.value" role="status">
            <span class="sr-only">Loading search results...</span>
            <div
              v-for="group in 2"
              :key="group"
              aria-hidden="true"
            >
              <div class="px-4 py-2 bg-surface-variant/50">
                <div class="h-3 bg-surface-tint rounded animate-pulse w-20" />
              </div>
              <div
                v-for="item in 3"
                :key="item"
                class="px-4 py-2 flex flex-col gap-1.5"
              >
                <div class="h-4 bg-surface-tint rounded animate-pulse w-2/3" />
                <div class="h-3 bg-surface-tint rounded animate-pulse w-1/3" />
              </div>
            </div>
          </div>

          <!-- Error state -->
          <div
            v-else-if="search.error.value"
            class="px-4 py-8 text-center text-error"
            role="alert"
          >
            {{ search.error.value }}
          </div>

          <!-- Empty query state: show favorites and recents -->
          <template v-else-if="!search.query.value.trim()">
            <!-- Favorites section -->
            <div v-if="search.favorites.value.length > 0" aria-label="Favorites" role="group">
              <div class="px-4 py-2 text-xs font-medium text-on-surface-variant uppercase tracking-wide bg-surface-variant/50 flex items-center justify-between">
                <span>Favorites</span>
              </div>
              <div
                v-for="(result, itemIndex) in search.favorites.value"
                :id="`search-result-${getEmptyStateIndex('favorites', itemIndex)}`"
                :key="result.id"
                :aria-selected="getEmptyStateIndex('favorites', itemIndex) === search.selectedIndex.value"
                :class="[
                  'group w-full px-4 py-2 flex items-center gap-3 text-left transition-colors cursor-pointer',
                  getEmptyStateIndex('favorites', itemIndex) === search.selectedIndex.value
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-surface-variant text-on-surface',
                ]"
                :data-selected="getEmptyStateIndex('favorites', itemIndex) === selectedIndex"
                role="option"
                tabindex="-1"
                @click="navigate(result)"
                @mouseenter="onHover(getEmptyStateIndex('favorites', itemIndex))"
              >
                <AppIcon
                  aria-hidden="true"
                  class="text-warning shrink-0 size-4"
                  icon="star"
                />
                <div class="flex-1 min-w-0">
                  <span class="font-medium">{{ result.title }}</span>
                  <span class="text-xs text-on-surface-variant ml-2">{{ result.category }}</span>
                </div>
                <span
                  aria-label="Remove from favorites"
                  class="inline-flex p-1.5 rounded-lg hover:bg-surface-variant focus-visible:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface-variant focus-visible:text-on-surface-variant opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                  role="button"
                  tabindex="0"
                  title="Remove from favorites"
                  @click="handleRemoveFavorite($event, result.id)"
                  @keydown.enter.stop="handleRemoveFavorite($event, result.id)"
                  @keydown.space.stop.prevent="handleRemoveFavorite($event, result.id)"
                >
                  <AppIcon aria-hidden="true" icon="close" size="16" />
                </span>
              </div>
            </div>

            <!-- Recents section -->
            <div v-if="search.recentSearches.value.length > 0" aria-label="Recent searches" role="group">
              <div class="px-4 py-2 text-xs font-medium text-on-surface-variant uppercase tracking-wide bg-surface-variant/50">
                Recent
              </div>
              <div
                v-for="(result, itemIndex) in search.recentSearches.value"
                :id="`search-result-${getEmptyStateIndex('recents', itemIndex)}`"
                :key="result.id"
                :aria-selected="getEmptyStateIndex('recents', itemIndex) === search.selectedIndex.value"
                :class="[
                  'group w-full px-4 py-2 flex items-center gap-3 text-left transition-colors cursor-pointer',
                  getEmptyStateIndex('recents', itemIndex) === search.selectedIndex.value
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-surface-variant text-on-surface',
                ]"
                :data-selected="getEmptyStateIndex('recents', itemIndex) === selectedIndex"
                role="option"
                tabindex="-1"
                @click="navigate(result)"
                @mouseenter="onHover(getEmptyStateIndex('recents', itemIndex))"
              >
                <AppIcon
                  aria-hidden="true"
                  class="text-on-surface-variant shrink-0 size-4"
                  icon="history"
                />
                <div class="flex-1 min-w-0">
                  <span class="font-medium">{{ result.title }}</span>
                  <span class="text-xs text-on-surface-variant ml-2">{{ result.category }}</span>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <!-- Favorite toggle -->
                  <span
                    aria-label="Add to favorites"
                    class="inline-flex p-1.5 rounded-lg hover:bg-surface-variant focus-visible:bg-surface-variant transition-colors text-on-surface/60 hover:text-warning focus-visible:text-warning opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                    role="button"
                    tabindex="0"
                    title="Add to favorites"
                    @click="toggleFavorite($event, result)"
                    @keydown.enter.stop="toggleFavorite($event, result)"
                    @keydown.space.stop.prevent="toggleFavorite($event, result)"
                  >
                    <AppIcon aria-hidden="true" icon="star-outline" size="16" />
                  </span>
                  <!-- Remove button -->
                  <span
                    aria-label="Remove from recent searches"
                    class="inline-flex p-1.5 rounded-lg hover:bg-surface-variant focus-visible:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface-variant focus-visible:text-on-surface-variant opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                    role="button"
                    tabindex="0"
                    title="Remove from recent"
                    @click="handleRemoveRecent($event, result.id)"
                    @keydown.enter.stop="handleRemoveRecent($event, result.id)"
                    @keydown.space.stop.prevent="handleRemoveRecent($event, result.id)"
                  >
                    <AppIcon aria-hidden="true" icon="close" size="16" />
                  </span>
                </div>
              </div>
            </div>

            <!-- No content placeholder -->
            <div
              v-if="!search.hasEmptyStateContent.value"
              class="px-4 py-8 text-center text-on-surface-variant"
              role="status"
            >
              Start typing to search
            </div>
          </template>

          <!-- No results state -->
          <div
            v-else-if="search.displayedResults.value.length === 0"
            class="px-4 py-8 text-center text-on-surface-variant"
            role="status"
          >
            No results found for "{{ search.query.value }}"
          </div>

          <!-- Search results -->
          <template v-else>
            <div
              v-for="(group, groupIndex) in search.displayedResults.value"
              :key="group.category"
              :aria-label="group.category"
              role="group"
            >
              <div class="px-4 py-2 text-xs font-medium text-on-surface-variant uppercase tracking-wide bg-surface-variant/50">
                {{ group.category }}
              </div>
              <div
                v-for="(result, itemIndex) in group.items"
                :id="`search-result-${getFlatIndex(groupIndex, itemIndex)}`"
                :key="result.id"
                :aria-selected="getFlatIndex(groupIndex, itemIndex) === search.selectedIndex.value"
                :class="[
                  'group w-full px-4 py-2 flex items-center gap-2 text-left transition-colors cursor-pointer',
                  getFlatIndex(groupIndex, itemIndex) === search.selectedIndex.value
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-surface-variant text-on-surface',
                ]"
                :data-selected="getFlatIndex(groupIndex, itemIndex) === selectedIndex"
                role="option"
                tabindex="-1"
                @click="navigate(result)"
                @mouseenter="onHover(getFlatIndex(groupIndex, itemIndex))"
              >
                <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span class="font-medium">{{ result.title }}</span>
                  <span
                    v-if="result.headings.length > 0"
                    class="text-xs text-on-surface-variant truncate"
                  >
                    {{ result.headings.slice(0, 3).join(' → ') }}
                  </span>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <!-- Favorite toggle -->
                  <span
                    :aria-label="search.isFavorite(result.id) ? 'Remove from favorites' : 'Add to favorites'"
                    :class="[
                      'inline-flex p-1.5 rounded-lg hover:bg-surface-variant focus-visible:bg-surface-variant transition-colors cursor-pointer',
                      search.isFavorite(result.id) ? 'opacity-100 text-warning' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-on-surface/60 hover:text-warning focus-visible:text-warning',
                    ]"
                    role="button"
                    tabindex="0"
                    :title="search.isFavorite(result.id) ? 'Remove from favorites' : 'Add to favorites'"
                    @click="toggleFavorite($event, result)"
                    @keydown.enter.stop="toggleFavorite($event, result)"
                    @keydown.space.stop.prevent="toggleFavorite($event, result)"
                  >
                    <AppIcon
                      aria-hidden="true"
                      :icon="search.isFavorite(result.id) ? 'star' : 'star-outline'"
                      size="16"
                    />
                  </span>
                  <!-- Ask AI button -->
                  <span
                    aria-label="Ask AI about this page"
                    class="inline-flex p-1.5 rounded-lg hover:bg-surface-variant focus-visible:bg-surface-variant transition-colors text-on-surface/60 hover:text-primary focus-visible:text-primary opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                    role="button"
                    tabindex="0"
                    title="Ask AI"
                    @click="askAbout($event, result)"
                    @keydown.enter.stop="askAbout($event, result)"
                    @keydown.space.stop.prevent="askAbout($event, result)"
                  >
                    <AppIcon aria-hidden="true" icon="create" size="16" />
                  </span>
                  <!-- Dismiss button -->
                  <span
                    aria-label="Dismiss result"
                    class="inline-flex p-1.5 rounded-lg hover:bg-surface-variant focus-visible:bg-surface-variant transition-colors text-on-surface/60 hover:text-on-surface-variant focus-visible:text-on-surface-variant opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                    role="button"
                    tabindex="0"
                    title="Dismiss result"
                    @click="dismissResult($event, result.id)"
                    @keydown.enter.stop="dismissResult($event, result.id)"
                    @keydown.space.stop.prevent="dismissResult($event, result.id)"
                  >
                    <AppIcon aria-hidden="true" icon="close" size="16" />
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="flex items-center justify-between px-4 py-2 border-t border-divider text-xs text-on-surface-variant">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded bg-surface-variant font-mono">↑</kbd>
              <kbd class="px-1.5 py-0.5 rounded bg-surface-variant font-mono">↓</kbd>
              navigate
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded bg-surface-variant font-mono">↵</kbd>
              select
            </span>
          </div>
          <span>Powered by MiniSearch</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
