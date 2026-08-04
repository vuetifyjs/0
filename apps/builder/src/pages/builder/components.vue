<script setup lang="ts">
  import { mdiChevronLeft } from '@mdi/js'

  // Framework
  import { Button, Toggle } from '@vuetify/v0'

  // Components
  import StepBar from '@/components/app/StepBar.vue'
  import ComponentInfo from '@/components/ComponentInfo.vue'

  // Composables
  import { wizardProgress } from '@/composables/useWizardProgress'

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

  const recommendedIds = toRef(() => recommendedFor(store.selectedPlugins))

  function isRecommended (component: ComponentEntry): boolean {
    return component.selectable && recommendedIds.value.has(component.id)
  }

  // Recommended entries sort to the front of their own category rather than into a
  // separate list — one grid, with the recommendation carried on the card itself.
  const groups = toRef((): CategoryGroup[] => {
    const map = new Map<string, ComponentEntry[]>()
    for (const c of components.value) {
      if (!map.has(c.category)) map.set(c.category, [])
      map.get(c.category)!.push(c)
    }

    function rank (items: ComponentEntry[]) {
      return items.toSorted((a, b) =>
        Number(isRecommended(b)) - Number(isRecommended(a)) || a.id.localeCompare(b.id),
      )
    }

    const ordered: CategoryGroup[] = []
    for (const cat of CATEGORY_ORDER) {
      const items = map.get(cat.id)
      if (items?.length) ordered.push({ id: cat.id, title: cat.title, components: rank(items) })
    }
    // Append any uncategorized buckets we forgot
    for (const [id, items] of map) {
      if (CATEGORY_ORDER.some(c => c.id === id)) continue
      ordered.push({ id, title: id.charAt(0).toUpperCase() + id.slice(1), components: rank(items) })
    }
    return ordered
  })

  const recommendedCount = toRef(() => components.value.filter(c => isRecommended(c)).length)

  const lastSelectedPlugin = toRef(() => {
    const selected = PLUGINS.filter(p => store.isPluginSelected(p.id))
    return selected.at(-1)
  })

  function reasonsLabel (id: string): string[] {
    return reasonsFor(id, store.selectedPlugins)
  }

  // The `rec` chip is aria-hidden, so the recommendation rides on the card's own name
  // instead — a screen reader hears it without the marker being announced twice.
  function ariaLabel (component: ComponentEntry): string {
    if (!component.selectable) return `${component.id}, draft, not yet available`
    if (!isRecommended(component)) return component.id

    return `${component.id}, recommended for ${reasonsLabel(component.id).join(', ')}`
  }

  function hint (component: ComponentEntry): string | undefined {
    if (!component.selectable) {
      return `${component.id} is on the roadmap but is not exported from @vuetify/v0 yet`
    }
    if (!isRecommended(component)) return undefined

    return `Recommended for ${reasonsLabel(component.id).join(', ')}`
  }

  function onBack () {
    const plugin = lastSelectedPlugin.value
    if (plugin) router.push(`/builder/${plugin.slug}`)
    else router.push('/builder')
  }

  function onContinue () {
    router.push('/builder/review')
  }

  const progress = toRef(() => wizardProgress(store.selectedPlugins.size, store.selectedPlugins.size + 2))
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 pt-5 sm:pt-6 pb-24">
    <header class="mb-10">
      <h2 class="t-title mb-3">Pick components</h2>

      <p class="t-body text-on-surface-variant max-w-2xl">
        Add the headless components your library needs.
        <!-- Sorting is the claim that holds at every width; the marker itself only exists
             from sm up, so it is mentioned there and nowhere else. -->
        <template v-if="recommendedCount > 0">
          The {{ recommendedCount }} that pair with the plugins you already selected sort
          first in each category<span class="hidden sm:inline">, marked
            <span class="chip-on align-middle">rec</span></span>.
        </template>

        <template v-else>
          Select plugins first and the ones that pair with them are flagged here.
        </template>
      </p>
    </header>

    <div class="flex items-baseline gap-3 mb-4 pb-2.5 border-b border-divider">
      <h3 class="t-eyebrow text-on-surface">All components</h3>
      <p class="t-meta text-on-surface-variant">Grouped by category</p>
    </div>

    <div class="flex flex-col gap-7">
      <section v-for="group in groups" :key="group.id">
        <h4 class="t-eyebrow text-on-surface-variant mb-2.5">{{ group.title }}</h4>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          <!-- The info affordance sits outside the toggle: a button inside a button is
               invalid, and nesting it would make the whole card announce as "about". -->
          <div
            v-for="component in group.components"
            :key="component.id"
            class="group relative"
          >
            <Toggle.Root
              :aria-label="ariaLabel(component)"
              class="pick h-11 w-full pl-3 pr-9 flex items-center justify-between gap-2"
              :class="[
                !component.selectable
                  ? 'pick-disabled'
                  : store.isComponentSelected(component.id)
                    ? 'pick-on'
                    : 'pick-off',
              ]"
              :disabled="!component.selectable"
              :model-value="store.isComponentSelected(component.id)"
              :title="hint(component)"
              @update:model-value="store.toggleComponent(component.id)"
            >
              <span class="font-mono text-[0.8125rem] font-medium truncate">{{ component.id }}</span>

              <span v-if="!component.selectable" class="chip-quiet flex-shrink-0">draft</span>

              <template v-else>
                <!-- Hidden on phones: the info affordance takes the width this chip used
                     to have, and the name matters more than a marker that is already
                     carried by the sort order and the card's own label. -->
                <span
                  v-if="isRecommended(component)"
                  aria-hidden="true"
                  class="chip-on flex-shrink-0 ml-auto hidden sm:inline-flex"
                >
                  rec
                </span>

                <span
                  class="pick-mark w-4 h-4"
                  :class="store.isComponentSelected(component.id) ? 'pick-mark-on' : 'pick-mark-off'"
                >
                  <svg v-if="store.isComponentSelected(component.id)" class="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                  </svg>
                </span>
              </template>
            </Toggle.Root>

            <ComponentInfo :component />
          </div>
        </div>
      </section>
    </div>

  </div>

  <StepBar :progress="progress.percent" :progress-label="progress.label">
    <!-- The noun drops below sm so the count and the action stay on one row; a fixed bar
         that wraps eats a second row of phone screen for no added meaning. -->
    <p class="t-index text-on-surface-variant">
      <span class="sm:hidden">{{ store.selectedComponents.size }} selected</span>

      <span class="hidden sm:inline">
        {{ store.selectedComponents.size }} {{ store.selectedComponents.size === 1 ? 'component' : 'components' }} selected
      </span>
    </p>

    <div class="flex items-center gap-2">
      <Button.Root aria-label="Back" class="btn-quiet h-10 w-10 px-0" @click="onBack">
        <Button.Icon>
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronLeft" fill="currentColor" /></svg>
        </Button.Icon>
      </Button.Root>

      <Button.Root class="btn-primary" @click="onContinue">
        Continue to review
      </Button.Root>
    </div>
  </StepBar>
</template>
