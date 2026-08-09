<script setup lang="ts">
  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppSkeleton from '@/components/app/AppSkeleton.vue'

  // Context
  import { usePlayground } from './PlaygroundApp.vue'

  // Data
  import { resolveFeatureAccent, resolveFeatureIcon } from '@/data/feature-icons'
  import { DEFAULT_REGISTRY, getRegistryIndex, getRegistryItem } from '@/data/registry'

  // Utilities
  import { computed, nextTick, onMounted, ref, shallowRef, useTemplateRef } from 'vue'

  // Types
  import type { RegistryExample, RegistryIndexEntry, RegistryItem } from '@/data/registry'

  interface VuetifyPlayground {
    id: string
    title: string
    content?: string
    createdAt: string
    updatedAt: string
  }

  type Rail = 'components' | 'composables' | 'plugins' | 'saved'

  interface RailItem {
    id: Rail
    label: string
  }

  const emit = defineEmits<{ close: [] }>()

  const playground = usePlayground()
  const rail = shallowRef<Rail>('components')

  // ── Saved playgrounds (API) ──────────────────────────────────────────
  const saved = ref<VuetifyPlayground[]>([])
  const savedLoading = shallowRef(false)
  const savedError = shallowRef<string>()
  const savedLoaded = shallowRef(false)

  // ── Docs registry examples ───────────────────────────────────────────
  const items = ref<RegistryIndexEntry[]>([])
  const examplesLoading = shallowRef(true)
  const examplesError = shallowRef<string>()
  const query = shallowRef('')
  const input = useTemplateRef<HTMLInputElement>('input')
  const opening = shallowRef(false)

  // Feature drill-in (example picker)
  const selected = shallowRef<RegistryIndexEntry>()
  const selectedItem = shallowRef<RegistryItem>()
  const itemLoading = shallowRef(false)
  const itemError = shallowRef<string>()

  const rails: RailItem[] = [
    { id: 'components', label: 'Components' },
    { id: 'composables', label: 'Composables' },
    { id: 'plugins', label: 'Plugins' },
  ]

  function bucketOf (entry: RegistryIndexEntry): Exclude<Rail, 'saved'> {
    if (entry.category === 'plugins') return 'plugins'
    if (entry.type === 'composables') return 'composables'
    return 'components'
  }

  const counts = computed(() => {
    const next = { components: 0, composables: 0, plugins: 0 }
    for (const item of items.value) {
      next[bucketOf(item)]++
    }
    return next
  })

  const railLabel = computed(() => {
    if (rail.value === 'saved') return 'Saved'
    return rails.find(r => r.id === rail.value)?.label ?? 'Examples'
  })

  const railItems = computed(() => {
    if (rail.value === 'saved') return []
    return items.value.filter(item => bucketOf(item) === rail.value)
  })

  const filtered = computed(() => {
    const q = query.value.toLowerCase().trim()
    if (!q) return railItems.value
    return railItems.value.filter(item =>
      item.name.includes(q)
      || item.title.toLowerCase().includes(q)
      || item.category.toLowerCase().includes(q)
      || item.description.toLowerCase().includes(q)
      || item.examples.some(id => id.includes(q)),
    )
  })

  const filteredSaved = computed(() => {
    const q = query.value.toLowerCase().trim()
    if (!q) return saved.value
    return saved.value.filter(item => (item.title || '').toLowerCase().includes(q))
  })

  const showSearch = computed(() => {
    if (selected.value) return false
    if (rail.value === 'saved') {
      return !savedLoading.value && !savedError.value && saved.value.length > 0
    }
    return !examplesLoading.value && !examplesError.value && railItems.value.length > 0
  })

  const subtitle = computed(() => {
    if (rail.value === 'saved') {
      if (savedLoading.value) return 'Loading…'
      if (savedError.value) return 'Could not load'
      const n = filteredSaved.value.length
      return n === 1 ? '1 playground' : `${n} playgrounds`
    }
    if (examplesLoading.value) return 'Loading…'
    if (examplesError.value) return 'Could not load registry'
    const n = filtered.value.length
    const total = railItems.value.length
    if (query.value.trim() && n !== total) {
      return `${n} of ${total} with examples`
    }
    return n === 1 ? '1 feature with examples' : `${n} features with examples`
  })

  onMounted(async () => {
    await loadExamples()
    nextTick(() => input.value?.focus())
  })

  async function loadExamples () {
    examplesLoading.value = true
    examplesError.value = undefined
    try {
      const index = await getRegistryIndex()
      items.value = index.items
        .filter(item => item.examples.length > 0)
        .toSorted((a, b) => a.title.localeCompare(b.title) || a.name.localeCompare(b.name))
    } catch (error) {
      examplesError.value = error instanceof Error
        ? error.message
        : `Failed to load registry from ${DEFAULT_REGISTRY}`
    } finally {
      examplesLoading.value = false
    }
  }

  async function loadSaved () {
    if (savedLoaded.value || savedLoading.value) return
    savedLoading.value = true
    savedError.value = undefined
    try {
      const res = await fetch('https://api.vuetifyjs.com/one/playgrounds', {
        credentials: 'include',
      })

      if (!res.ok) {
        savedError.value = res.status === 401
          ? 'Session expired. Please sign in again.'
          : `Failed to load playgrounds (${res.status})`
        return
      }

      const data = await res.json()
      saved.value = data.playgrounds ?? data
      savedLoaded.value = true
    } catch {
      savedError.value = 'Failed to load playgrounds'
    } finally {
      savedLoading.value = false
    }
  }

  async function onRail (next: Rail) {
    if (rail.value === next && !selected.value) return
    rail.value = next
    selected.value = undefined
    selectedItem.value = undefined
    itemError.value = undefined
    query.value = ''
    if (next === 'saved') await loadSaved()
    nextTick(() => input.value?.focus())
  }

  function onBack () {
    selected.value = undefined
    selectedItem.value = undefined
    itemError.value = undefined
    nextTick(() => input.value?.focus())
  }

  async function loadFeature (entry: RegistryIndexEntry) {
    selected.value = entry
    selectedItem.value = undefined
    itemError.value = undefined
    itemLoading.value = true
    try {
      selectedItem.value = await getRegistryItem(entry)
    } catch (error) {
      itemError.value = error instanceof Error ? error.message : String(error)
    } finally {
      itemLoading.value = false
    }
  }

  async function onSelectFeature (entry: RegistryIndexEntry) {
    // Single example → open immediately (card click is deliberate)
    if (entry.examples.length === 1) {
      selected.value = entry
      itemLoading.value = true
      itemError.value = undefined
      try {
        const item = await getRegistryItem(entry)
        selectedItem.value = item
        const example = item.examples[0]
        if (example) await openExample(example)
      } catch (error) {
        itemError.value = error instanceof Error ? error.message : String(error)
      } finally {
        itemLoading.value = false
      }
      return
    }

    await loadFeature(entry)
  }

  async function onRetryFeature () {
    if (!selected.value) return
    await loadFeature(selected.value)
  }

  async function openExample (example: RegistryExample) {
    if (!selected.value || opening.value) return
    opening.value = true
    try {
      await playground.openRegistryExample({
        item: selected.value.name,
        type: selected.value.type,
        example: example.id,
      })
      emit('close')
    } catch (error) {
      itemError.value = error instanceof Error ? error.message : String(error)
    } finally {
      opening.value = false
    }
  }

  function formatDate (iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  function exampleLabel (count: number) {
    return count === 1 ? '1 example' : `${count} examples`
  }

  function onClearQuery () {
    query.value = ''
    nextTick(() => input.value?.focus())
  }

  function blurb (text: string, max = 96) {
    const cleaned = text.replace(/\s+/g, ' ').trim()
    if (cleaned.length <= max) return cleaned
    return `${cleaned.slice(0, max - 1).trimEnd()}…`
  }

  function featureIcon (entry: RegistryIndexEntry) {
    return resolveFeatureIcon(entry.name, entry.category)
  }

  function featureAccent (entry: RegistryIndexEntry) {
    return resolveFeatureAccent(entry.type, entry.category)
  }

  async function openSaved (item: VuetifyPlayground) {
    let content = item.content
    if (!content) {
      const res = await fetch(`https://api.vuetifyjs.com/one/playgrounds/${item.id}`, {
        credentials: 'include',
      })
      if (!res.ok) return
      const data = await res.json()
      content = data.content ?? data.playground?.content
    }
    if (!content) return
    emit('close')
    await playground.openPlayground(content)
  }
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      tabindex="-1"
      @keydown.esc="selected ? onBack() : $emit('close')"
    >
      <div
        class="absolute inset-0 bg-black/50"
        @click="$emit('close')"
      />

      <div
        aria-labelledby="open-title"
        aria-modal="true"
        class="relative bg-surface border border-divider rounded-lg shadow-xl w-[900px] max-w-[calc(100vw-2rem)] h-[640px] max-h-[calc(100vh-2rem)] flex overflow-hidden"
        role="dialog"
      >
        <!-- Left rail -->
        <nav class="w-36 shrink-0 border-r border-divider flex flex-col py-2 bg-surface">
          <button
            v-for="item in rails"
            :key="item.id"
            class="mx-1.5 flex items-center justify-between gap-2 px-2.5 py-2 text-xs text-left rounded-md transition-colors"
            :class="rail === item.id && !selected
              ? 'bg-surface-tint text-on-surface font-medium'
              : rail === item.id && selected
                ? 'bg-surface-tint/60 text-on-surface font-medium'
                : 'text-on-surface-variant hover:bg-surface-tint/60 hover:text-on-surface'"
            type="button"
            @click="onRail(item.id)"
          >
            <span class="truncate">{{ item.label }}</span>

            <span
              v-if="!examplesLoading && !examplesError"
              class="tabular-nums text-[10px] text-on-surface-variant shrink-0"
            >
              {{ counts[item.id] }}
            </span>
          </button>

          <div class="mx-3 my-2 border-t border-divider" />

          <button
            class="mx-1.5 flex items-center justify-between gap-2 px-2.5 py-2 text-xs text-left rounded-md transition-colors"
            :class="rail === 'saved'
              ? 'bg-surface-tint text-on-surface font-medium'
              : 'text-on-surface-variant hover:bg-surface-tint/60 hover:text-on-surface'"
            type="button"
            @click="onRail('saved')"
          >
            <span>Saved</span>

            <span
              v-if="savedLoaded"
              class="tabular-nums text-[10px] text-on-surface-variant shrink-0"
            >
              {{ saved.length }}
            </span>
          </button>
        </nav>

        <!-- Main pane -->
        <div class="flex-1 flex flex-col min-w-0 min-h-0">
          <div class="flex items-start justify-between gap-3 px-4 py-3 border-b border-divider shrink-0">
            <div class="min-w-0 flex items-start gap-3">
              <div
                v-if="selected"
                class="w-9 h-9 rounded-md border border-divider/60 shrink-0 flex items-center justify-center"
                :style="{ background: featureAccent(selected).bg }"
              >
                <AppIcon
                  :icon="featureIcon(selected)"
                  :size="20"
                  :style="{ color: featureAccent(selected).fg, opacity: 1 }"
                />
              </div>

              <div class="min-w-0">
                <div v-if="selected" class="flex items-center gap-1.5 mb-0.5">
                  <button
                    class="text-[11px] text-on-surface-variant hover:text-primary transition-colors"
                    type="button"
                    @click="onBack"
                  >
                    {{ railLabel }}
                  </button>

                  <span class="text-[11px] text-on-surface-variant/50">/</span>

                  <span class="text-[11px] text-on-surface-variant truncate">
                    {{ selected.title || selected.name }}
                  </span>
                </div>

                <h2 id="open-title" class="text-sm font-medium truncate">
                  {{ selected ? (selected.title || selected.name) : railLabel }}
                </h2>

                <p class="text-[11px] text-on-surface-variant mt-0.5 truncate">
                  <template v-if="selected">
                    {{ selected.type }}/{{ selected.name }}
                    <template v-if="selectedItem">
                      · {{ exampleLabel(selectedItem.examples.length) }}
                    </template>
                  </template>

                  <template v-else>
                    {{ subtitle }}
                  </template>
                </p>
              </div>
            </div>

            <AppCloseButton @click="$emit('close')" />
          </div>

          <div
            v-if="showSearch"
            class="px-4 py-2.5 border-b border-divider shrink-0"
          >
            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-divider bg-surface-tint/40 focus-within:border-primary/50 transition-colors">
              <AppIcon class="shrink-0 text-on-surface-variant" icon="search" :size="16" />

              <input
                ref="input"
                v-model="query"
                class="flex-1 min-w-0 bg-transparent text-sm text-on-surface outline-none placeholder-on-surface-variant/50"
                :placeholder="rail === 'saved' ? 'Search saved…' : `Filter ${railLabel.toLowerCase()}…`"
                type="search"
              >

              <AppCloseButton
                v-if="query"
                label="Clear search"
                size="sm"
                @click="onClearQuery"
              />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto min-h-0">
            <!-- ── Feature drill-in (examples) ───────────────────────── -->
            <template v-if="selected">
              <div v-if="itemLoading" class="p-4">
                <AppSkeleton height="h-14" :lines="3" />
              </div>

              <div
                v-else-if="itemError"
                class="p-8 text-center flex flex-col gap-2 items-center"
              >
                <p class="text-sm text-on-surface-variant">{{ itemError }}</p>

                <button
                  class="text-xs font-medium text-primary hover:underline"
                  type="button"
                  @click="onRetryFeature"
                >
                  Retry
                </button>
              </div>

              <div v-else-if="selectedItem" class="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  v-for="example in selectedItem.examples"
                  :key="example.id"
                  class="text-left rounded-lg border border-divider bg-surface hover:border-primary/50 hover:bg-surface-tint/50 transition-colors p-3 disabled:opacity-50"
                  :class="opening ? 'cursor-wait' : ''"
                  :disabled="opening"
                  type="button"
                  @click="openExample(example)"
                >
                  <div class="h-12 rounded-md border border-divider bg-surface-tint/50 mb-2.5 flex items-center justify-center">
                    <span class="text-[10px] text-on-surface-variant/70 font-mono">
                      {{ example.id }}
                    </span>
                  </div>

                  <div class="text-sm font-medium text-on-surface truncate">
                    {{ example.title || example.id }}
                  </div>

                  <div class="text-[11px] text-on-surface-variant mt-0.5">
                    {{ example.files.length }} file{{ example.files.length === 1 ? '' : 's' }}
                  </div>
                </button>
              </div>
            </template>

            <!-- ── Saved list ────────────────────────────────────────── -->
            <template v-else-if="rail === 'saved'">
              <div v-if="savedLoading" class="p-4">
                <AppSkeleton height="h-12" :lines="4" />
              </div>

              <div
                v-else-if="savedError"
                class="p-8 text-center flex items-center justify-center h-full"
              >
                <p class="text-sm text-on-surface-variant">{{ savedError }}</p>
              </div>

              <div
                v-else-if="saved.length === 0"
                class="p-8 text-center flex items-center justify-center h-full"
              >
                <p class="text-sm text-on-surface-variant">No saved playgrounds</p>
              </div>

              <div
                v-else-if="filteredSaved.length === 0"
                class="p-8 text-center flex items-center justify-center h-full"
              >
                <p class="text-sm text-on-surface-variant">No matches for “{{ query }}”</p>
              </div>

              <div v-else class="p-2">
                <button
                  v-for="item in filteredSaved"
                  :key="item.id"
                  class="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left rounded-md hover:bg-surface-tint transition-colors"
                  type="button"
                  @click="openSaved(item)"
                >
                  <span class="text-sm text-on-surface truncate">{{ item.title || 'Untitled' }}</span>

                  <span class="text-xs text-on-surface-variant shrink-0">
                    {{ formatDate(item.updatedAt || item.createdAt) }}
                  </span>
                </button>
              </div>
            </template>

            <!-- ── Category gallery ──────────────────────────────────── -->
            <template v-else>
              <div v-if="examplesLoading" class="p-4">
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="i in 6"
                    :key="i"
                    class="h-28 rounded-lg bg-surface-tint animate-pulse"
                  />
                </div>
              </div>

              <div
                v-else-if="examplesError"
                class="p-8 text-center flex flex-col gap-2 items-center justify-center h-full"
              >
                <p class="text-sm text-on-surface-variant">{{ examplesError }}</p>

                <p class="text-xs text-on-surface-variant/70">
                  Origin: {{ DEFAULT_REGISTRY }}/registry
                </p>

                <button
                  class="text-xs font-medium text-primary hover:underline mt-1"
                  type="button"
                  @click="loadExamples"
                >
                  Retry
                </button>
              </div>

              <div
                v-else-if="railItems.length === 0"
                class="p-8 text-center flex items-center justify-center h-full"
              >
                <p class="text-sm text-on-surface-variant">
                  No {{ railLabel.toLowerCase() }} with examples
                </p>
              </div>

              <div
                v-else-if="filtered.length === 0"
                class="p-8 text-center flex items-center justify-center h-full"
              >
                <p class="text-sm text-on-surface-variant">No matches for “{{ query }}”</p>
              </div>

              <div v-else class="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  v-for="entry in filtered"
                  :key="`${entry.type}/${entry.name}`"
                  class="text-left rounded-lg border border-divider bg-surface hover:border-primary/50 hover:bg-surface-tint/40 transition-colors px-3 py-2.5 group"
                  type="button"
                  @click="onSelectFeature(entry)"
                >
                  <div class="flex items-start gap-2.5">
                    <div
                      class="w-8 h-8 rounded-md border border-divider/50 shrink-0 flex items-center justify-center mt-0.5"
                      :style="{ background: featureAccent(entry).bg }"
                    >
                      <AppIcon
                        :icon="featureIcon(entry)"
                        :size="16"
                        :style="{ color: featureAccent(entry).fg, opacity: 1 }"
                      />
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-medium text-on-surface truncate group-hover:text-primary transition-colors">
                        {{ entry.title || entry.name }}
                      </div>

                      <div
                        v-if="entry.description"
                        class="text-[11px] text-on-surface-variant mt-0.5 line-clamp-2 leading-snug"
                      >
                        {{ blurb(entry.description) }}
                      </div>

                      <div class="flex items-center justify-between gap-2 mt-1.5 text-[10px] text-on-surface-variant">
                        <span class="tabular-nums">{{ exampleLabel(entry.examples.length) }}</span>
                        <span class="truncate capitalize">{{ entry.category }}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
