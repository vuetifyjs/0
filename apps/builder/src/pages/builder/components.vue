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
  <div class="max-w-4xl mx-auto px-6 py-10 sm:py-12">
    <Button.Root class="btn-quiet mb-8" @click="onBack">
      <Button.Icon>
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
      </Button.Icon>

      <Button.Content>
        <span v-if="lastSelectedPlugin">Prev: {{ lastSelectedPlugin.title }}</span>
        <span v-else>Back</span>
      </Button.Content>
    </Button.Root>

    <header class="mb-10">
      <p class="t-eyebrow text-primary mb-3">Step 3 · Select</p>

      <h2 class="t-title mb-3">Pick components</h2>

      <p class="t-body text-on-surface-variant max-w-2xl">
        Add the headless components your library needs. Recommendations come from the plugins
        you already selected.
      </p>
    </header>

    <section v-if="showRecommended" class="mb-10">
      <div class="flex items-baseline gap-3 mb-4 pb-2.5 border-b border-divider">
        <h3 class="t-eyebrow text-on-surface inline-flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg>
          Recommended
        </h3>

        <p class="t-meta text-on-surface-variant">Based on your plugins</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Toggle.Root
          v-for="component in recommendedList"
          :key="`rec-${component.id}`"
          :aria-label="component.id"
          class="pick p-3.5"
          :class="store.isComponentSelected(component.id) ? 'pick-on' : 'pick-off'"
          :model-value="store.isComponentSelected(component.id)"
          @update:model-value="store.toggleComponent(component.id)"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <h4 class="font-mono text-[0.8125rem] font-semibold">{{ component.id }}</h4>

              <p v-if="reasonsLabel(component.id).length > 0" class="t-meta text-primary mt-1.5">
                For {{ reasonsLabel(component.id).join(', ') }}
              </p>
            </div>

            <span
              class="pick-mark w-5 h-5"
              :class="store.isComponentSelected(component.id) ? 'pick-mark-on' : 'pick-mark-off'"
            >
              <svg v-if="store.isComponentSelected(component.id)" class="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
              </svg>
            </span>
          </div>
        </Toggle.Root>
      </div>
    </section>

    <div class="flex items-baseline gap-3 mb-4 pb-2.5 border-b border-divider">
      <h3 class="t-eyebrow text-on-surface">All components</h3>
      <p class="t-meta text-on-surface-variant">Grouped by category</p>
    </div>

    <div class="flex flex-col gap-7">
      <section v-for="group in groups" :key="group.id">
        <h4 class="t-eyebrow text-on-surface-variant mb-2.5">{{ group.title }}</h4>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          <Toggle.Root
            v-for="component in group.components"
            :key="component.id"
            :aria-label="component.selectable ? component.id : `${component.id}, draft, not yet available`"
            class="pick h-11 px-3 flex items-center justify-between gap-2"
            :class="[
              !component.selectable
                ? 'pick-disabled'
                : store.isComponentSelected(component.id)
                  ? 'pick-on'
                  : 'pick-off',
            ]"
            :disabled="!component.selectable"
            :model-value="store.isComponentSelected(component.id)"
            :title="component.selectable ? undefined : `${component.id} is on the roadmap but is not exported from @vuetify/v0 yet`"
            @update:model-value="store.toggleComponent(component.id)"
          >
            <span class="font-mono text-[0.8125rem] font-medium truncate">{{ component.id }}</span>

            <span v-if="!component.selectable" class="chip-quiet flex-shrink-0">draft</span>

            <span
              v-else
              class="pick-mark w-4 h-4"
              :class="store.isComponentSelected(component.id) ? 'pick-mark-on' : 'pick-mark-off'"
            >
              <svg v-if="store.isComponentSelected(component.id)" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
              </svg>
            </span>
          </Toggle.Root>
        </div>
      </section>
    </div>

    <div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-divider pt-6">
      <p class="t-index text-on-surface-variant">
        {{ store.selectedComponents.size }} {{ store.selectedComponents.size === 1 ? 'component' : 'components' }} selected
      </p>

      <Button.Root class="btn-primary" @click="onContinue">
        Continue to review
      </Button.Root>
    </div>
  </div>
</template>
