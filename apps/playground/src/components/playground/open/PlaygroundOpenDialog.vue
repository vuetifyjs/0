<script setup lang="ts">
  // Framework
  import { createFilter } from '@vuetify/v0'

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
  import { getVuetifyComponents, VUETIFY_EXAMPLES, vuetifyDocsUrl } from '@/data/vuetify-examples'

  // Local
  import { readOpenSession, touchOpenSession, writeOpenSession } from './open-session'
  import {
    bucketOf,
    exampleLabel,
    type OpenRail,
    type OpenRailItem,
    type VuetifyPlayground,
  } from './types'

  // Utilities
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from 'vue'

  // Types
  import type { RegistryExample, RegistryIndexEntry, RegistryItem } from '@/data/registry'
  import type { VuetifyComponentEntry, VuetifyExampleMeta } from '@/data/vuetify-examples'

  const emit = defineEmits<{ close: [] }>()

  const playground = usePlayground()
  const restored = readOpenSession()
  const rail = shallowRef<OpenRail>(restored?.rail ?? 'components')
  const query = shallowRef(restored?.query ?? '')
  const pendingScroll = shallowRef(restored?.scrollTop ?? 0)

  // ── Saved playgrounds (API) ──────────────────────────────────────────
  const saved = ref<VuetifyPlayground[]>([])
  const savedLoading = shallowRef(false)
  const savedError = shallowRef<string>()
  const savedLoaded = shallowRef(false)

  // ── Docs registry examples (v0) ──────────────────────────────────────
  const items = ref<RegistryIndexEntry[]>([])
  const examplesLoading = shallowRef(true)
  const examplesError = shallowRef<string>()
  const input = useTemplateRef<HTMLInputElement>('input')
  const pane = useTemplateRef<HTMLElement>('pane')
  const opening = shallowRef(false)
  let scrollTimer = 0
  let touchTimer = 0

  // ── Vuetify 4 docs examples (path manifest + raw git) ───────────────
  const vuetifyItems = getVuetifyComponents()

  // Feature drill-in (example picker)
  const selected = shallowRef<RegistryIndexEntry>()
  const selectedItem = shallowRef<RegistryItem>()
  const selectedVuetify = shallowRef<VuetifyComponentEntry>()
  /** Last Vuetify example open attempt — Retry re-runs this. */
  const lastVuetifyMeta = shallowRef<VuetifyExampleMeta>()
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
    if (rail.value === 'vuetify') return 'Vuetify 4'
    return rails.find(r => r.id === rail.value)?.label ?? 'Examples'
  })

  const railItems = computed(() => {
    if (rail.value === 'saved' || rail.value === 'vuetify') return []
    return items.value.filter(item => bucketOf(item) === rail.value)
  })

  // Flatten searchable text so createFilter can match example ids without a custom fn.
  const filterableV0 = computed(() =>
    railItems.value.map(item => ({
      ...item,
      exampleSearch: item.examples.join(' '),
    })),
  )

  const filterableVuetify = computed(() =>
    vuetifyItems.map(item => ({
      ...item,
      exampleSearch: item.examples.map(e => `${e.id} ${e.title}`).join(' '),
      docs: vuetifyDocsUrl(item.name),
      category: 'Component',
      type: 'components' as const,
      level: 'stable',
      description: `${item.examples.length} docs example${item.examples.length === 1 ? '' : 's'}`,
      examples: item.examples.map(e => e.id),
    })),
  )

  const filterableSaved = computed(() =>
    saved.value.map(item => ({
      ...item,
      title: item.title || '',
    })),
  )

  const galleryFilter = createFilter({
    keys: ['name', 'title', 'description', 'category', 'exampleSearch'],
    mode: 'some',
  })

  const savedFilter = createFilter({
    keys: ['title', 'id'],
    mode: 'some',
  })

  const { items: filtered } = galleryFilter.apply(() => query.value, filterableV0)
  const { items: filteredVuetifyEntries } = galleryFilter.apply(() => query.value, filterableVuetify)
  const { items: filteredSaved } = savedFilter.apply(() => query.value, filterableSaved)

  /** Full Vuetify component entries after search (keeps example meta for drill-in). */
  const filteredVuetify = computed(() => {
    const names = new Set(filteredVuetifyEntries.value.map(e => e.name))
    return vuetifyItems.filter(c => names.has(c.name))
  })

  /** Registry-shaped view of the selected Vuetify component for the examples pane. */
  const selectedVuetifyAsItem = computed((): RegistryItem | undefined => {
    const entry = selectedVuetify.value
    if (!entry) return undefined
    return {
      name: entry.name,
      type: 'components',
      category: 'Component',
      level: 'stable',
      title: entry.title,
      description: `Vuetify 4 docs examples for ${entry.name}`,
      docs: vuetifyDocsUrl(entry.name),
      examples: entry.examples.map(example => ({
        id: example.id,
        title: example.title,
        description: example.path,
        dir: entry.name,
        files: [{ path: example.path, name: `${example.id}.vue`, entry: true, content: '' }],
        dependencies: ['vuetify'],
        tokens: [],
        icons: { collections: [], classes: [] },
      })),
    }
  })

  const selectedDocsHref = computed(() => {
    if (selectedVuetify.value) return vuetifyDocsUrl(selectedVuetify.value.name)
    const docs = selected.value?.docs?.trim() || selectedItem.value?.docs?.trim()
    return docs || undefined
  })

  const searchPlaceholder = computed(() => {
    if (rail.value === 'saved') return 'Search saved…'
    if (rail.value === 'vuetify') return 'Filter Vuetify 4…'
    return `Filter ${railLabel.value.toLowerCase()}…`
  })

  const showSearch = computed(() => {
    if (selected.value || selectedVuetify.value) return false
    if (rail.value === 'saved') {
      return !savedLoading.value && !savedError.value && saved.value.length > 0
    }
    if (rail.value === 'vuetify') return vuetifyItems.length > 0
    return !examplesLoading.value && !examplesError.value && railItems.value.length > 0
  })

  const subtitle = computed(() => {
    if (rail.value === 'saved') {
      if (savedLoading.value) return 'Loading…'
      if (savedError.value) return 'Could not load'
      const n = filteredSaved.value.length
      return n === 1 ? '1 playground' : `${n} playgrounds`
    }
    if (rail.value === 'vuetify') {
      const n = filteredVuetify.value.length
      const total = vuetifyItems.length
      const examples = filteredVuetify.value.reduce((sum, c) => sum + c.examples.length, 0)
      if (query.value.trim() && n !== total) {
        return `${n} of ${total} components · ${examples} examples`
      }
      return `${total} components · ${examples} examples`
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
    if (selectedVuetify.value) return 'vuetify'
    if (!selected.value) return undefined
    return resolveFeatureIcon(selected.value.name, selected.value.category)
  })

  const selectedAccent = computed(() => {
    if (selectedVuetify.value) return resolveFeatureAccent('components', 'Component')
    if (!selected.value) return undefined
    return resolveFeatureAccent(selected.value.type, selected.value.category)
  })

  onMounted(async () => {
    // Warm saved list when restoring that rail so the pane isn't empty flash.
    if (rail.value === 'saved') await loadSaved()
    await loadExamples()
    await nextTick()
    restoreScroll()
    input.value?.focus()
    // Keep the 2-minute window alive while the dialog stays open.
    touchTimer = window.setInterval(() => touchOpenSession(), 30_000)
  })

  onBeforeUnmount(() => {
    window.clearTimeout(scrollTimer)
    window.clearInterval(touchTimer)
    persistSession()
  })

  function persistSession () {
    writeOpenSession({
      rail: rail.value,
      scrollTop: pane.value?.scrollTop ?? pendingScroll.value,
      query: query.value,
    })
  }

  /**
   * Re-apply pendingScroll after layout paints. Gallery content often arrives
   * after first mount (registry fetch), so a single assignment is not enough.
   */
  function restoreScroll () {
    const top = pendingScroll.value
    if (!pane.value || top <= 0) return

    function apply () {
      if (!pane.value) return
      pane.value.scrollTop = top
    }

    apply()
    requestAnimationFrame(() => {
      apply()
      requestAnimationFrame(apply)
    })
    window.setTimeout(apply, 50)
    window.setTimeout(apply, 150)
    window.setTimeout(apply, 400)
  }

  function onPaneScroll () {
    // Only remember gallery/list scroll — drill-in example lists use the same
    // pane and shouldn't overwrite the tab's list position.
    if (selected.value || selectedVuetify.value) return
    window.clearTimeout(scrollTimer)
    scrollTimer = window.setTimeout(() => {
      pendingScroll.value = pane.value?.scrollTop ?? 0
      persistSession()
    }, 100)
  }

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
      await nextTick()
      restoreScroll()
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
      await nextTick()
      restoreScroll()
    }
  }

  async function onRail (next: OpenRail) {
    if (rail.value === next && !selected.value && !selectedVuetify.value) return
    rail.value = next
    selected.value = undefined
    selectedItem.value = undefined
    selectedVuetify.value = undefined
    itemError.value = undefined
    query.value = ''
    pendingScroll.value = 0
    if (pane.value) pane.value.scrollTop = 0
    persistSession()
    if (next === 'saved') await loadSaved()
    nextTick(() => input.value?.focus())
  }

  function onBack () {
    selected.value = undefined
    selectedItem.value = undefined
    selectedVuetify.value = undefined
    itemError.value = undefined
    nextTick(() => {
      restoreScroll()
      input.value?.focus()
    })
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
    if (opening.value) return

    // Vuetify 4 path: content is not in the registry item — fetch raw git.
    if (selectedVuetify.value) {
      const meta = selectedVuetify.value.examples.find(e => e.id === example.id)
      if (!meta) return
      await openVuetifyMeta(meta)
      return
    }

    if (!selected.value) return
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

  async function onSelectVuetify (entry: VuetifyComponentEntry) {
    if (entry.examples.length === 1) {
      selectedVuetify.value = entry
      const only = entry.examples[0]
      if (only) await openVuetifyMeta(only)
      return
    }
    selectedVuetify.value = entry
    selected.value = undefined
    selectedItem.value = undefined
    itemError.value = undefined
  }

  async function openVuetifyMeta (meta: VuetifyExampleMeta) {
    if (opening.value) return
    opening.value = true
    lastVuetifyMeta.value = meta
    itemError.value = undefined
    try {
      await playground.openVuetifyExample({ path: meta.path })
      emit('close')
    } catch (error) {
      itemError.value = error instanceof Error ? error.message : String(error)
    } finally {
      opening.value = false
    }
  }

  async function onRetryVuetify () {
    const meta = lastVuetifyMeta.value
    if (meta) {
      await openVuetifyMeta(meta)
      return
    }
    // Single-example drill-in with no prior meta: back to gallery.
    selectedVuetify.value = undefined
    itemError.value = undefined
  }

  function onClearQuery () {
    query.value = ''
    persistSession()
    nextTick(() => input.value?.focus())
  }

  function onSelectGallery (entry: RegistryIndexEntry) {
    if (rail.value === 'vuetify') {
      const hit = vuetifyItems.find(c => c.name === entry.name)
      if (hit) void onSelectVuetify(hit)
      return
    }
    void onSelectFeature(entry)
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
      @keydown.esc="selected || selectedVuetify ? onBack() : $emit('close')"
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
        <nav class="w-36 shrink-0 border-r border-divider flex flex-col gap-1 py-2 bg-surface">
          <button
            v-for="item in rails"
            :key="item.id"
            class="mx-1.5 flex items-center justify-between gap-2 px-2.5 py-2 text-xs text-left rounded-md transition-colors"
            :class="rail === item.id && !selected && !selectedVuetify
              ? 'bg-surface-tint text-on-surface font-medium'
              : rail === item.id && (selected || selectedVuetify)
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
            :class="rail === 'vuetify' && !selectedVuetify
              ? 'bg-surface-tint text-on-surface font-medium'
              : rail === 'vuetify' && selectedVuetify
                ? 'bg-surface-tint/60 text-on-surface font-medium'
                : 'text-on-surface-variant hover:bg-surface-tint/60 hover:text-on-surface'"
            type="button"
            @click="onRail('vuetify')"
          >
            <span class="truncate">Vuetify 4</span>

            <span class="tabular-nums text-[10px] text-on-surface-variant shrink-0">
              {{ vuetifyItems.length }}
            </span>
          </button>

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
                v-if="(selected || selectedVuetify) && selectedAccent"
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
                <div v-if="selected || selectedVuetify" class="flex items-center gap-1.5 mb-0.5">
                  <button
                    class="text-[11px] text-on-surface-variant hover:text-primary transition-colors"
                    type="button"
                    @click="onBack"
                  >
                    {{ railLabel }}
                  </button>

                  <span class="text-[11px] text-on-surface-variant/50">/</span>

                  <span class="text-[11px] text-on-surface-variant truncate">
                    {{ selectedVuetify?.title || selectedVuetify?.name || selected?.title || selected?.name }}
                  </span>
                </div>

                <h2 id="open-title" class="text-sm font-medium truncate">
                  {{ selectedVuetify
                    ? (selectedVuetify.title || selectedVuetify.name)
                    : selected
                      ? (selected.title || selected.name)
                      : railLabel }}
                </h2>

                <p class="text-[11px] text-on-surface-variant mt-0.5 truncate">
                  <template v-if="selectedVuetify">
                    {{ selectedVuetify.name }}
                    · {{ exampleLabel(selectedVuetify.examples.length) }}
                    · {{ VUETIFY_EXAMPLES.repo }}@{{ VUETIFY_EXAMPLES.ref }}
                  </template>

                  <template v-else-if="selected">
                    {{ selected.type }}/{{ selected.name }}
                    <template v-if="selectedItem">
                      · {{ exampleLabel(selectedItem.examples.length) }}
                    </template>
                  </template>

                  <template v-else>
                    {{ subtitle }}
                  </template>
                </p>

                <a
                  v-if="selectedDocsHref"
                  class="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1"
                  :href="selectedDocsHref"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View docs ↗
                </a>
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
                :placeholder="searchPlaceholder"
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

          <div
            ref="pane"
            class="flex-1 overflow-y-auto min-h-0"
            @scroll.passive="onPaneScroll"
          >
            <PlaygroundOpenExamples
              v-if="selectedVuetify"
              :error="itemError"
              :item="selectedVuetifyAsItem"
              :loading="false"
              :opening
              @open="openExample"
              @retry="onRetryVuetify"
            />

            <PlaygroundOpenExamples
              v-else-if="selected"
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
              v-else-if="rail === 'vuetify'"
              :error="undefined"
              :items="filteredVuetifyEntries"
              :loading="false"
              :query
              :rail-label
              :total="vuetifyItems.length"
              @retry="() => {}"
              @select="onSelectGallery"
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
              @select="onSelectGallery"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
