<script setup lang="ts">
  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'
  import AppIcon from '@/components/app/AppIcon.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Context
  import PlaygroundOpenExamples from './PlaygroundOpenExamples.vue'
  import PlaygroundOpenGallery from './PlaygroundOpenGallery.vue'
  import PlaygroundOpenSaved from './PlaygroundOpenSaved.vue'

  // Data
  import { resolveFeatureAccent, resolveFeatureIcon } from '@/data/feature-icons'
  import { DEFAULT_REGISTRY, getRegistryIndex, getRegistryItem } from '@/data/registry'

  // Local
  import {
    bucketOf,
    exampleLabel,
    type OpenRail,
    type OpenRailItem,
    type VuetifyPlayground,
  } from './types'

  // Utilities
  import { computed, nextTick, onMounted, ref, shallowRef, useTemplateRef } from 'vue'

  // Types
  import type { RegistryExample, RegistryIndexEntry, RegistryItem } from '@/data/registry'

  const emit = defineEmits<{ close: [] }>()

  const playground = usePlayground()
  const rail = shallowRef<OpenRail>('components')

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

  const rails: OpenRailItem[] = [
    { id: 'components', label: 'Components' },
    { id: 'composables', label: 'Composables' },
    { id: 'plugins', label: 'Plugins' },
  ]

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

  const selectedIcon = computed(() => {
    if (!selected.value) return undefined
    return resolveFeatureIcon(selected.value.name, selected.value.category)
  })

  const selectedAccent = computed(() => {
    if (!selected.value) return undefined
    return resolveFeatureAccent(selected.value.type, selected.value.category)
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

  async function onRail (next: OpenRail) {
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

  function onClearQuery () {
    query.value = ''
    nextTick(() => input.value?.focus())
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
                v-if="selected && selectedAccent"
                class="w-9 h-9 rounded-md border border-divider/60 shrink-0 flex items-center justify-center"
                :style="{ background: selectedAccent.bg }"
              >
                <AppIcon
                  :icon="selectedIcon!"
                  :size="20"
                  :style="{ color: selectedAccent.fg, opacity: 1 }"
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
            <PlaygroundOpenExamples
              v-if="selected"
              :error="itemError"
              :item="selectedItem"
              :loading="itemLoading"
              :opening
              @open="openExample"
              @retry="onRetryFeature"
            />

            <PlaygroundOpenSaved
              v-else-if="rail === 'saved'"
              :error="savedError"
              :items="filteredSaved"
              :loading="savedLoading"
              :query
              :total="saved.length"
              @open="openSaved"
            />

            <PlaygroundOpenGallery
              v-else
              :error="examplesError"
              :items="filtered"
              :loading="examplesLoading"
              :query
              :rail-label
              :total="railItems.length"
              @retry="loadExamples"
              @select="onSelectFeature"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
