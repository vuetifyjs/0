<script setup lang="ts">
  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'

  // Context
  import { usePlayground } from './PlaygroundApp.vue'

  // Data
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

  type Tab = 'examples' | 'saved'

  const emit = defineEmits<{ close: [] }>()

  const playground = usePlayground()
  const tab = shallowRef<Tab>('examples')

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
  const selected = shallowRef<RegistryIndexEntry>()
  const selectedItem = shallowRef<RegistryItem>()
  const itemLoading = shallowRef(false)

  const filtered = computed(() => {
    const q = query.value.toLowerCase().trim()
    if (!q) return items.value
    return items.value.filter(item =>
      item.name.includes(q)
      || item.title.toLowerCase().includes(q)
      || item.category.toLowerCase().includes(q)
      || item.examples.some(id => id.includes(q)),
    )
  })

  const filteredSaved = computed(() => {
    const q = query.value.toLowerCase().trim()
    if (!q) return saved.value
    return saved.value.filter(item => (item.title || '').toLowerCase().includes(q))
  })

  /** Group filtered items for scannable headers. */
  const groups = computed(() => {
    const order = ['components', 'plugins', 'composables', 'other'] as const
    const buckets = new Map<string, RegistryIndexEntry[]>()

    for (const item of filtered.value) {
      let key: string
      if (item.category === 'plugins') key = 'plugins'
      else if (item.type === 'components') key = 'components'
      else if (item.type === 'composables') key = 'composables'
      else key = 'other'

      const list = buckets.get(key) ?? []
      list.push(item)
      buckets.set(key, list)
    }

    return order
      .filter(key => (buckets.get(key)?.length ?? 0) > 0)
      .map(key => ({
        key,
        label: key === 'other' ? 'Other' : key[0]!.toUpperCase() + key.slice(1),
        items: buckets.get(key)!,
      }))
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

  async function onTab (next: Tab) {
    tab.value = next
    selected.value = undefined
    selectedItem.value = undefined
    if (next === 'saved') await loadSaved()
    nextTick(() => input.value?.focus())
  }

  async function onSelectFeature (entry: RegistryIndexEntry) {
    if (selected.value?.name === entry.name && selected.value?.type === entry.type) {
      // Single example → open immediately on second click
      if (selectedItem.value?.examples.length === 1) {
        await openExample(selectedItem.value.examples[0]!)
      }
      return
    }

    selected.value = entry
    selectedItem.value = undefined
    itemLoading.value = true
    try {
      selectedItem.value = await getRegistryItem(entry)
      // Auto-open features that only ship one example
      if (selectedItem.value.examples.length === 1) {
        await openExample(selectedItem.value.examples[0]!)
      }
    } catch (error) {
      examplesError.value = error instanceof Error ? error.message : String(error)
      selected.value = undefined
    } finally {
      itemLoading.value = false
    }
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
      examplesError.value = error instanceof Error ? error.message : String(error)
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
      @keydown.esc="$emit('close')"
    >
      <div
        class="absolute inset-0 bg-black/50"
        @click="$emit('close')"
      />

      <div
        aria-labelledby="open-title"
        aria-modal="true"
        class="relative bg-surface border border-divider rounded-lg shadow-xl w-[560px] max-h-[560px] flex flex-col overflow-hidden"
        role="dialog"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-divider">
          <h2 id="open-title" class="text-sm font-medium">
            Open
          </h2>

          <AppCloseButton @click="$emit('close')" />
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 px-3 pt-2 border-b border-divider">
          <button
            class="px-3 py-1.5 text-xs rounded-t transition-colors"
            :class="tab === 'examples'
              ? 'text-primary border-b-2 border-primary font-medium'
              : 'text-on-surface-variant hover:text-on-surface'"
            type="button"
            @click="onTab('examples')"
          >
            Docs examples
          </button>

          <button
            class="px-3 py-1.5 text-xs rounded-t transition-colors"
            :class="tab === 'saved'
              ? 'text-primary border-b-2 border-primary font-medium'
              : 'text-on-surface-variant hover:text-on-surface'"
            type="button"
            @click="onTab('saved')"
          >
            Saved
          </button>
        </div>

        <div
          v-if="(tab === 'examples' && !examplesLoading && !examplesError && items.length > 0)
            || (tab === 'saved' && !savedLoading && !savedError && saved.length > 0)"
          class="px-4 py-2 border-b border-divider"
        >
          <input
            ref="input"
            v-model="query"
            class="w-full bg-transparent text-sm text-on-surface outline-none placeholder-on-surface-variant/50"
            :placeholder="tab === 'examples' ? 'Search features…' : 'Search…'"
            type="text"
          >
        </div>

        <div class="flex-1 overflow-y-auto min-h-0">
          <!-- ── Docs examples ──────────────────────────────────────── -->
          <template v-if="tab === 'examples'">
            <div v-if="examplesLoading" class="p-4 flex flex-col gap-3">
              <div v-for="i in 5" :key="i" class="h-10 rounded bg-surface-tint animate-pulse" />
            </div>

            <div v-else-if="examplesError" class="p-6 text-center flex flex-col gap-2">
              <p class="text-sm text-on-surface-variant">{{ examplesError }}</p>

              <p class="text-xs text-on-surface-variant/70">
                Origin: {{ DEFAULT_REGISTRY }}/registry
              </p>

              <button
                class="text-xs text-primary self-center mt-1"
                type="button"
                @click="loadExamples"
              >
                Retry
              </button>
            </div>

            <div v-else-if="items.length === 0" class="p-6 text-center">
              <p class="text-sm text-on-surface-variant">No examples in the registry</p>
            </div>

            <div v-else-if="filtered.length === 0" class="p-6 text-center">
              <p class="text-sm text-on-surface-variant">No matches</p>
            </div>

            <div v-else class="flex min-h-0">
              <!-- Feature list -->
              <div
                class="flex-1 overflow-y-auto border-r border-divider max-h-[380px]"
                :class="selected ? 'max-w-[55%]' : ''"
              >
                <template v-for="group in groups" :key="group.key">
                  <div class="px-4 py-1.5 text-2.5 uppercase tracking-wide text-on-surface-variant/60 sticky top-0 bg-surface">
                    {{ group.label }}
                  </div>

                  <button
                    v-for="entry in group.items"
                    :key="`${entry.type}/${entry.name}`"
                    class="w-full flex items-center justify-between px-4 py-2 text-left transition-colors border-b border-divider/60"
                    :class="selected?.name === entry.name && selected?.type === entry.type
                      ? 'bg-surface-tint'
                      : 'hover:bg-surface-tint/60'"
                    type="button"
                    @click="onSelectFeature(entry)"
                  >
                    <span class="text-sm text-on-surface truncate">{{ entry.title || entry.name }}</span>

                    <span class="text-xs text-on-surface-variant shrink-0 ml-3">
                      {{ entry.examples.length }}
                    </span>
                  </button>
                </template>
              </div>

              <!-- Example list for selected feature -->
              <div
                v-if="selected"
                class="w-[45%] overflow-y-auto max-h-[380px] bg-surface-tint/30"
              >
                <div class="px-3 py-2 border-b border-divider">
                  <div class="text-xs font-medium text-on-surface truncate">
                    {{ selected.title || selected.name }}
                  </div>

                  <div class="text-2.5 text-on-surface-variant truncate">
                    {{ selected.type }}/{{ selected.name }}
                  </div>
                </div>

                <div v-if="itemLoading" class="p-3 flex flex-col gap-2">
                  <div v-for="i in 3" :key="i" class="h-8 rounded bg-surface-tint animate-pulse" />
                </div>

                <template v-else-if="selectedItem">
                  <button
                    v-for="example in selectedItem.examples"
                    :key="example.id"
                    class="w-full px-3 py-2.5 text-left hover:bg-surface-tint transition-colors border-b border-divider/60 last:border-b-0 disabled:opacity-50"
                    :disabled="opening"
                    type="button"
                    @click="openExample(example)"
                  >
                    <div class="text-sm text-on-surface">{{ example.title || example.id }}</div>

                    <div class="text-2.5 text-on-surface-variant mt-0.5">
                      {{ example.files.length }} file{{ example.files.length === 1 ? '' : 's' }}
                    </div>
                  </button>
                </template>
              </div>
            </div>
          </template>

          <!-- ── Saved playgrounds ──────────────────────────────────── -->
          <template v-else>
            <div v-if="savedLoading" class="p-4 flex flex-col gap-3">
              <div v-for="i in 4" :key="i" class="h-12 rounded bg-surface-tint animate-pulse" />
            </div>

            <div v-else-if="savedError" class="p-6 text-center">
              <p class="text-sm text-on-surface-variant">{{ savedError }}</p>
            </div>

            <div v-else-if="saved.length === 0" class="p-6 text-center">
              <p class="text-sm text-on-surface-variant">No playgrounds found</p>
            </div>

            <div v-else-if="filteredSaved.length === 0" class="p-6 text-center">
              <p class="text-sm text-on-surface-variant">No matches</p>
            </div>

            <template v-else>
              <button
                v-for="item in filteredSaved"
                :key="item.id"
                class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-tint transition-colors border-b border-divider last:border-b-0"
                type="button"
                @click="openSaved(item)"
              >
                <span class="text-sm text-on-surface truncate">{{ item.title || 'Untitled' }}</span>

                <span class="text-xs text-on-surface-variant shrink-0 ml-4">
                  {{ formatDate(item.updatedAt || item.createdAt) }}
                </span>
              </button>
            </template>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>
