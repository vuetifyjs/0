<script setup lang="ts">
  // Framework
  import { useDocumentEventListener } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { SavedResult, SearchResult } from '@/composables/useSearch'

  const search = useSearch()
  const discovery = useDiscovery()

  const router = useRouter()
  const resultsRef = useTemplateRef<HTMLDivElement>('results')
  const triggerRef = shallowRef<HTMLElement | null>(null)
  const settings = useSettings()
  const ask = useAsk()
  const transition = toRef(() => settings.prefersReducedMotion.value ? undefined : 'fade')

  watch(search.isOpen, async opened => {
    if (opened) {
      triggerRef.value = document.activeElement as HTMLElement | null
    } else {
      triggerRef.value?.focus()
      triggerRef.value = null
    }
  })

  watch(search.selection.index, async () => {
    await nextTick()
    const container = resultsRef.value
    const selected = container?.querySelector('[data-selected="true"]') as HTMLElement | null
    if (selected) {
      selected.scrollIntoView({ block: 'nearest', behavior: settings.prefersReducedMotion.value ? 'auto' : 'smooth' })
    }
  })

  function navigate (result?: SearchResult | SavedResult) {
    const selected = result ?? search.selection.current()
    if (selected) {
      search.addRecent(selected)
      search.text.value = ''
      router.push(selected.path)
      search.close()
    }
  }

  function toggleFavorite (e: Event, id: string) {
    e.stopPropagation()
    search.favorite(id)
  }

  function dismissResult (e: Event, id: string) {
    e.stopPropagation()
    search.dismiss(id)
  }

  function handleRemove (e: Event, id: string) {
    e.stopPropagation()
    search.remove(id)
  }

  async function askAbout (e: Event, result: SearchResult | SavedResult) {
    e.stopPropagation()
    search.addRecent(result)
    search.text.value = ''
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
      search.isOpen.value ? search.close() : search.focus()
    }

    if (e.key === 'Enter' && search.isOpen.value) {
      e.preventDefault()
      navigate()
    }
  }

  useDocumentEventListener('keydown', onKeydown)

  function onHover (index: number) {
    search.selection.index.value = index
  }

  function getFlatIndex (groupIndex: number, itemIndex: number): number {
    let flat = 0
    for (let g = 0; g < groupIndex; g++) {
      flat += search.results.value[g]?.items.length ?? 0
    }
    return flat + itemIndex
  }

  /** Get the ID of the currently selected result for aria-activedescendant */
  function getActiveDescendantId (): string | undefined {
    const count = search.text.value.trim()
      ? search.results.value.reduce((sum, g) => sum + g.items.length, 0)
      : search.favorites.value.length + search.recents.value.length

    if (count === 0 || search.selection.index.value < 0) return undefined
    return `search-result-${search.selection.index.value}`
  }

  /** Check if there are any results to show */
  function hasResults (): boolean {
    if (search.text.value.trim()) {
      return search.results.value.length > 0
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
          step="search-input"
        >
          <AppIcon
            aria-hidden="true"
            class="text-on-surface-variant shrink-0"
            icon="search"
          />
          <input
            :ref="el => search.inputRef.value = el as HTMLInputElement"
            v-model="search.text.value"
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

        <Discovery.Activator
          class="block rounded-lg"
          step="select-result"
        >
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
                <div class="px-4 py-2 bg-surface-variant-50">
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
            <template v-else-if="!search.text.value.trim()">
              <!-- Favorites section -->
              <Discovery.Activator
                v-if="search.favorites.value.length > 0"
                aria-label="Favorites"
                as="div"
                class="rounded-lg"
                role="group"
                step="search-favorited"
              >
                <div class="px-4 py-2 section-label bg-surface-variant-50 flex items-center justify-between">
                  <span>Favorites</span>
                </div>
                <div
                  v-for="(result, itemIndex) in search.favorites.value"
                  :id="`search-result-${getEmptyStateIndex('favorites', itemIndex)}`"
                  :key="result.id"
                  :aria-selected="getEmptyStateIndex('favorites', itemIndex) === search.selection.index.value"
                  :class="[
                    'group w-full px-4 py-2 flex items-center gap-3 text-left transition-colors cursor-pointer',
                    getEmptyStateIndex('favorites', itemIndex) === search.selection.index.value
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-surface-variant text-on-surface',
                  ]"
                  :data-selected="getEmptyStateIndex('favorites', itemIndex) === search.selection.index.value"
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
                    class="btn-action text-on-surface/60 hover:text-on-surface-variant focus-visible:text-on-surface-variant opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                    role="button"
                    tabindex="0"
                    title="Remove from favorites"
                    @click="handleRemove($event, result.id)"
                    @keydown.enter.stop="handleRemove($event, result.id)"
                    @keydown.space.stop.prevent="handleRemove($event, result.id)"
                  >
                    <AppIcon aria-hidden="true" icon="close" size="16" />
                  </span>
                </div>
              </Discovery.Activator>

              <!-- Recents section -->
              <Discovery.Activator
                v-if="search.recents.value.length > 0"
                aria-label="Recent searches"
                as="div"
                class="rounded-lg"
                role="group"
                step="search-history"
              >
                <div class="px-4 py-2 section-label bg-surface-variant-50">
                  Recent
                </div>
                <div
                  v-for="(result, itemIndex) in search.recents.value"
                  :id="`search-result-${getEmptyStateIndex('recents', itemIndex)}`"
                  :key="result.id"
                  :aria-selected="getEmptyStateIndex('recents', itemIndex) === search.selection.index.value"
                  :class="[
                    'group w-full px-4 py-2 flex items-center gap-3 text-left transition-colors cursor-pointer',
                    getEmptyStateIndex('recents', itemIndex) === search.selection.index.value
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-surface-variant text-on-surface',
                  ]"
                  :data-selected="getEmptyStateIndex('recents', itemIndex) === search.selection.index.value"
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
                      class="btn-action text-on-surface/60 hover:text-warning focus-visible:text-warning opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                      role="button"
                      tabindex="0"
                      title="Add to favorites"
                      @click="toggleFavorite($event, result.id)"
                      @keydown.enter.stop="toggleFavorite($event, result.id)"
                      @keydown.space.stop.prevent="toggleFavorite($event, result.id)"
                    >
                      <AppIcon aria-hidden="true" icon="star-outline" size="16" />
                    </span>
                    <!-- Remove button -->
                    <span
                      aria-label="Remove from recent searches"
                      class="btn-action text-on-surface/60 hover:text-on-surface-variant focus-visible:text-on-surface-variant opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                      role="button"
                      tabindex="0"
                      title="Remove from recent"
                      @click="handleRemove($event, result.id)"
                      @keydown.enter.stop="handleRemove($event, result.id)"
                      @keydown.space.stop.prevent="handleRemove($event, result.id)"
                    >
                      <AppIcon aria-hidden="true" icon="close" size="16" />
                    </span>
                  </div>
                </div>
              </Discovery.Activator>

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
              v-else-if="search.results.value.length === 0"
              class="px-4 py-8 text-center text-on-surface-variant"
              role="status"
            >
              No results found for "{{ search.text.value }}"
            </div>

            <!-- Search results -->
            <template v-else>
              <div
                v-for="(group, groupIndex) in search.results.value"
                :key="group.category"
                :aria-label="group.category"
                role="group"
              >
                <Discovery.Activator
                  v-if="groupIndex === 0"
                  as="div"
                  class="px-4 py-2 section-label bg-surface-variant-50 rounded-lg"
                  step="search-categories"
                >
                  {{ group.category }}
                </Discovery.Activator>
                <div
                  v-else
                  class="px-4 py-2 section-label bg-surface-variant-50"
                >
                  {{ group.category }}
                </div>
                <!-- First result with nested activators for tour steps 4-6 -->
                <div
                  v-if="groupIndex === 0 && group.items[0]"
                  :id="`search-result-0`"
                  :aria-selected="0 === search.selection.index.value"
                  :class="[
                    'group w-full px-4 py-2 flex items-center gap-2 text-left transition-colors cursor-pointer',
                    0 === search.selection.index.value
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-surface-variant text-on-surface',
                  ]"
                  :data-selected="0 === search.selection.index.value"
                  role="option"
                  tabindex="-1"
                  @click="navigate(group.items[0])"
                  @mouseenter="onHover(0)"
                >
                  <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span class="font-medium">{{ group.items[0].title }}</span>
                    <span
                      v-if="group.items[0].headings.length > 0"
                      class="text-xs text-on-surface-variant truncate"
                    >
                      {{ group.items[0].headings.slice(0, 3).join(' → ') }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 shrink-0">
                    <!-- Favorite toggle -->
                    <Discovery.Activator
                      class="rounded-lg"
                      :padding="4"
                      step="search-favorite"
                    >
                      <span
                        :aria-label="search.isFavorite(group.items[0].id) ? 'Remove from favorites' : 'Add to favorites'"
                        :class="[
                          'btn-action cursor-pointer',
                          search.isFavorite(group.items[0].id) || discovery.isActive.value ? 'opacity-100 text-warning' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-on-surface/60 hover:text-warning focus-visible:text-warning',
                        ]"
                        role="button"
                        tabindex="0"
                        :title="search.isFavorite(group.items[0].id) ? 'Remove from favorites' : 'Add to favorites'"
                        @click="toggleFavorite($event, group.items[0].id)"
                        @keydown.enter.stop="toggleFavorite($event, group.items[0].id)"
                        @keydown.space.stop.prevent="toggleFavorite($event, group.items[0].id)"
                      >
                        <AppIcon
                          aria-hidden="true"
                          :icon="search.isFavorite(group.items[0].id) ? 'star' : 'star-outline'"
                          size="16"
                        />
                      </span>
                    </Discovery.Activator>

                    <!-- Ask AI button -->
                    <Discovery.Activator
                      class="rounded-lg"
                      :padding="4"
                      step="search-ask-ai"
                    >
                      <span
                        aria-label="Ask AI about this page"
                        :class="[
                          'btn-action text-on-surface/60 hover:text-primary focus-visible:text-primary cursor-pointer',
                          discovery.isActive.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
                        ]"
                        role="button"
                        tabindex="0"
                        title="Ask AI"
                        @click="askAbout($event, group.items[0])"
                        @keydown.enter.stop="askAbout($event, group.items[0])"
                        @keydown.space.stop.prevent="askAbout($event, group.items[0])"
                      >
                        <AppIcon aria-hidden="true" icon="create" size="16" />
                      </span>
                    </Discovery.Activator>

                    <!-- Dismiss button -->
                    <Discovery.Activator
                      class="rounded-lg"
                      :padding="4"
                      step="search-dismiss"
                    >
                      <span
                        aria-label="Dismiss result"
                        :class="[
                          'btn-action text-on-surface/60 hover:text-on-surface-variant focus-visible:text-on-surface-variant cursor-pointer',
                          discovery.isActive.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
                        ]"
                        role="button"
                        tabindex="0"
                        title="Dismiss result"
                        @click="dismissResult($event, group.items[0].id)"
                        @keydown.enter.stop="dismissResult($event, group.items[0].id)"
                        @keydown.space.stop.prevent="dismissResult($event, group.items[0].id)"
                      >
                        <AppIcon aria-hidden="true" icon="close" size="16" />
                      </span>
                    </Discovery.Activator>
                  </div>
                </div>
                <!-- Remaining results in first group (skip first) -->
                <div
                  v-for="(result, itemIndex) in groupIndex === 0 ? group.items.slice(1) : group.items"
                  :id="`search-result-${getFlatIndex(groupIndex, groupIndex === 0 ? itemIndex + 1 : itemIndex)}`"
                  :key="result.id"
                  :aria-selected="getFlatIndex(groupIndex, groupIndex === 0 ? itemIndex + 1 : itemIndex) === search.selection.index.value"
                  :class="[
                    'group w-full px-4 py-2 flex items-center gap-2 text-left transition-colors cursor-pointer',
                    getFlatIndex(groupIndex, groupIndex === 0 ? itemIndex + 1 : itemIndex) === search.selection.index.value
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-surface-variant text-on-surface',
                  ]"
                  :data-selected="getFlatIndex(groupIndex, groupIndex === 0 ? itemIndex + 1 : itemIndex) === search.selection.index.value"
                  role="option"
                  tabindex="-1"
                  @click="navigate(result)"
                  @mouseenter="onHover(getFlatIndex(groupIndex, groupIndex === 0 ? itemIndex + 1 : itemIndex))"
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
                        'btn-action cursor-pointer',
                        search.isFavorite(result.id) ? 'opacity-100 text-warning' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-on-surface/60 hover:text-warning focus-visible:text-warning',
                      ]"
                      role="button"
                      tabindex="0"
                      :title="search.isFavorite(result.id) ? 'Remove from favorites' : 'Add to favorites'"
                      @click="toggleFavorite($event, result.id)"
                      @keydown.enter.stop="toggleFavorite($event, result.id)"
                      @keydown.space.stop.prevent="toggleFavorite($event, result.id)"
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
                      class="btn-action text-on-surface/60 hover:text-primary focus-visible:text-primary opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
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
                      class="btn-action text-on-surface/60 hover:text-on-surface-variant focus-visible:text-on-surface-variant opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
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
        </Discovery.Activator>

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
