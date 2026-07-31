<script setup lang="ts">
  import { mdiArrowLeft, mdiStar } from '@mdi/js'

  // Framework
  import { Button, Toggle } from '@vuetify/v0'

  import { recommendedFor, reasonsFor } from '@/data/component-recommendations'
  import { COMPONENTS } from '@/data/components'
  import { PLUGINS } from '@/data/plugins'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { ComponentEntry } from '@/data/components'

  interface CategoryGroup {
    id: string
    title: string
    components: ComponentEntry[]
  }

  // Above this share of the catalogue the "Recommended" list stops being a shortlist and
  // just mirrors the full picker below it, so it's hidden instead.
  const RECOMMENDED_MAX = 10

  const store = useBuilderStore()
  const router = useRouter()

  const CATEGORY_ORDER: Array<{ id: string, title: string }> = [
    { id: 'primitives', title: 'Primitives' },
    { id: 'providers', title: 'Providers' },
    { id: 'actions', title: 'Actions' },
    { id: 'forms', title: 'Forms' },
    { id: 'disclosure', title: 'Disclosure' },
    { id: 'data', title: 'Data' },
    { id: 'semantic', title: 'Semantic' },
  ]

  const components = toRef((): ComponentEntry[] => COMPONENTS)

  const groups = toRef((): CategoryGroup[] => {
    const map = new Map<string, ComponentEntry[]>()
    for (const c of components.value) {
      if (!map.has(c.category)) map.set(c.category, [])
      map.get(c.category)!.push(c)
    }
    const ordered: CategoryGroup[] = []
    for (const cat of CATEGORY_ORDER) {
      const items = map.get(cat.id)
      if (items?.length) ordered.push({ id: cat.id, title: cat.title, components: items })
    }
    // Append any uncategorized buckets we forgot
    for (const [id, items] of map) {
      if (CATEGORY_ORDER.some(c => c.id === id)) continue
      ordered.push({ id, title: id.charAt(0).toUpperCase() + id.slice(1), components: items })
    }
    return ordered
  })

  const recommendedIds = toRef(() => recommendedFor(store.selectedPlugins))

  // Ranked by how many of the selected plugins call for the component, so a shortlist
  // stays a shortlist as more plugins are added. Draft entries can't be selected, so they
  // never appear here.
  const recommendedList = toRef((): ComponentEntry[] => {
    const ids = recommendedIds.value
    if (ids.size === 0) return []

    const byId = new Map(components.value.map(c => [c.id, c]))
    const out: Array<{ entry: ComponentEntry, weight: number }> = []

    for (const id of ids) {
      const entry = byId.get(id)
      if (!entry?.selectable) continue
      out.push({ entry, weight: reasonsFor(id, store.selectedPlugins).length })
    }

    return out
      .toSorted((a, b) => b.weight - a.weight || a.entry.id.localeCompare(b.entry.id))
      .slice(0, RECOMMENDED_MAX)
      .map(row => row.entry)
  })

  const selectableCount = toRef(() => components.value.filter(c => c.selectable).length)

  // Hide the section when it would just restate most of the catalogue.
  const showRecommended = toRef(() =>
    store.selectedPlugins.size > 0
    && recommendedList.value.length > 0
    && recommendedIds.value.size <= selectableCount.value / 2,
  )

  const lastSelectedPlugin = toRef(() => {
    const selected = PLUGINS.filter(p => store.isPluginSelected(p.id))
    return selected.at(-1)
  })

  function reasonsLabel (id: string): string[] {
    return reasonsFor(id, store.selectedPlugins)
  }

  function onBack () {
    const plugin = lastSelectedPlugin.value
    if (plugin) router.push(`/builder/${plugin.slug}`)
    else router.push('/builder')
  }

  function onContinue () {
    router.push('/builder/review')
  }
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <Button.Root
      class="text-sm text-on-surface-variant hover:text-on-surface mb-6 inline-flex items-center gap-1"
      @click="onBack"
    >
      <Button.Icon>
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
      </Button.Icon>

      <Button.Content>
        <span v-if="lastSelectedPlugin">Prev: {{ lastSelectedPlugin.title }}</span>
        <span v-else>Back</span>
      </Button.Content>
    </Button.Root>

    <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
      Step 3
    </p>

    <h2 class="text-2xl font-bold mb-2">Pick components</h2>

    <p class="text-on-surface-variant mb-8">
      Add the headless components your library needs. Recommendations are based on the plugins you selected.
    </p>

    <div v-if="showRecommended" class="mb-10">
      <div class="mb-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide flex items-center gap-1.5">
          <svg class="w-4 h-4 text-primary" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg>
          Recommended
        </h3>

        <p class="text-xs text-on-surface-variant mt-0.5">Based on your plugins</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Toggle.Root
          v-for="component in recommendedList"
          :key="`rec-${component.id}`"
          :aria-label="component.id"
          class="p-3 rounded-lg border text-left transition-all"
          :class="store.isComponentSelected(component.id)
            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
            : 'border-divider bg-surface hover:border-on-surface-variant/40'"
          :model-value="store.isComponentSelected(component.id)"
          @update:model-value="store.toggleComponent(component.id)"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h4 class="font-semibold text-sm">{{ component.id }}</h4>

              <p v-if="reasonsLabel(component.id).length > 0" class="text-xs text-primary mt-1">
                Recommended for {{ reasonsLabel(component.id).join(', ') }}
              </p>
            </div>

            <div
              class="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors"
              :class="store.isComponentSelected(component.id) ? 'bg-primary' : 'border border-divider'"
            >
              <svg v-if="store.isComponentSelected(component.id)" class="w-3.5 h-3.5 text-on-primary" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </Toggle.Root>
      </div>
    </div>

    <div class="mb-3">
      <h3 class="text-sm font-semibold uppercase tracking-wide">All components</h3>
      <p class="text-xs text-on-surface-variant mt-0.5">Grouped by category</p>
    </div>

    <div class="flex flex-col gap-8">
      <div v-for="group in groups" :key="group.id">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2">{{ group.title }}</h4>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          <Toggle.Root
            v-for="component in group.components"
            :key="component.id"
            :aria-label="component.selectable ? component.id : `${component.id}, draft, not yet available`"
            class="px-3 py-2 rounded-lg border text-left transition-all flex items-center justify-between gap-2"
            :class="[
              !component.selectable
                ? 'border-divider bg-surface-variant/40 opacity-60 cursor-not-allowed'
                : store.isComponentSelected(component.id)
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-divider bg-surface hover:border-on-surface-variant/40',
            ]"
            :disabled="!component.selectable"
            :model-value="store.isComponentSelected(component.id)"
            :title="component.selectable ? undefined : `${component.id} is on the roadmap but is not exported from @vuetify/v0 yet`"
            @update:model-value="store.toggleComponent(component.id)"
          >
            <span class="text-sm font-medium truncate">{{ component.id }}</span>

            <span
              v-if="!component.selectable"
              class="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide border border-divider text-on-surface-variant flex-shrink-0"
            >
              draft
            </span>

            <div
              v-else
              class="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-colors"
              :class="store.isComponentSelected(component.id) ? 'bg-primary' : 'border border-divider'"
            >
              <svg v-if="store.isComponentSelected(component.id)" class="w-3 h-3 text-on-primary" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
              </svg>
            </div>
          </Toggle.Root>
        </div>
      </div>
    </div>

    <div class="mt-8 flex items-center justify-between">
      <span class="text-sm text-on-surface-variant">
        {{ store.selectedComponents.size }} {{ store.selectedComponents.size === 1 ? 'component' : 'components' }} selected
      </span>

      <Button.Root
        class="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
        @click="onContinue"
      >
        Continue to Review
      </Button.Root>
    </div>
  </div>
</template>
