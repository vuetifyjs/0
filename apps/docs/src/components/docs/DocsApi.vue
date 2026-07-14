<script setup lang="ts">
  import apiData from 'virtual:api'

  // Framework
  import { createFilter } from '@vuetify/v0'

  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'
  import { useSettings } from '@/composables/useSettings'
  import { useSyncedRef } from '@/composables/useSyncedRef'

  // Utilities
  import { resolveItemName } from '@/utilities/strings'
  import { computed, shallowRef, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { ApiData } from '@build/generate-api'

  const props = defineProps<{
    name?: string
  }>()

  const route = useRoute()
  const data = apiData as ApiData
  const settings = useSettings()
  const helpers = useApiHelpers()
  const showInlineApi = useSyncedRef(settings.showInlineApi)

  const pageType = toRef(() => {
    const path = route.path
    if (path.includes('/components/')) return 'component'
    if (path.includes('/composables/')) return 'composable'
    return null
  })

  const itemName = computed(() => props.name ?? resolveItemName(route.path))

  const componentApis = computed(() => {
    if (pageType.value !== 'component') return []

    const prefix = itemName.value
    if (!prefix) return []

    return Object.entries(data.components)
      .filter(([name]) => name.startsWith(prefix))
      .map(([, api]) => api)
      .toSorted((a, b) => {
        if (a.name.endsWith('Root')) return -1
        if (b.name.endsWith('Root')) return 1
        return a.name.localeCompare(b.name)
      })
  })

  const composableApi = toRef(() => {
    if (pageType.value !== 'composable') return null

    const name = itemName.value
    if (!name) return null

    return data.composables[name] || null
  })

  const search = shallowRef('')

  const items = toRef(() => {
    if (pageType.value === 'component') {
      return componentApis.value.flatMap(api => [
        ...api.props ?? [],
        ...api.events ?? [],
        ...api.slots ?? [],
      ])
    }

    const api = composableApi.value
    if (!api) return []

    return [
      ...api.functions ?? [],
      ...api.options ?? [],
      ...api.properties ?? [],
      ...api.methods ?? [],
    ]
  })

  const filter = createFilter({ keys: ['name', 'description'] })
  const { items: matches } = filter.apply(search, items)

  const matched = toRef(() => new Set(matches.value))

  const visibleApis = toRef(() => {
    if (!search.value) return componentApis.value

    return componentApis.value.filter(api =>
      [...api.props ?? [], ...api.events ?? [], ...api.slots ?? []].some(item => matched.value.has(item)),
    )
  })

  const placeholder = toRef(() =>
    pageType.value === 'component'
      ? 'Filter props, events, slots…'
      : 'Filter functions, options, methods…',
  )

  const empty = toRef(() => !!search.value && matches.value.length === 0)
</script>

<template>
  <div
    v-if="componentApis.length > 0"
    class="mt-8 mb-12 markdown-body"
  >
    <div class="markdown-body flex items-center justify-between gap-4 mb-3">
      <DocsHeaderAnchor
        id="api-reference"
        class="!my-0"
        tag="h2"
      >
        API Reference
      </DocsHeaderAnchor>

      <button
        class="text-sm text-primary hover:underline focus-visible:underline focus-visible:outline-none whitespace-nowrap"
        type="button"
        @click="showInlineApi = !showInlineApi"
      >
        {{ showInlineApi ? 'View standalone →' : 'Show inline ↓' }}
      </button>
    </div>

    The following API details are for all variations of the <strong>{{ itemName }}</strong> component.

    <DocsApiLinks
      v-if="!showInlineApi"
      :component-apis
    />

    <template v-if="showInlineApi">
      <div class="relative mt-4">
        <AppIcon
          class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          icon="search"
          :size="16"
        />

        <input
          v-model="search"
          class="w-full pl-9 pr-3 py-2 text-sm bg-surface-tint border border-divider rounded-lg outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant"
          :placeholder
          type="text"
        >
      </div>

      <template
        v-for="api in visibleApis"
        :key="api.name"
      >
        <DocsHeaderAnchor :id="helpers.toKebab(api.name)" class="mt-8">
          {{ api.name }}
        </DocsHeaderAnchor>

        <DocsApiSection
          :anchor-id="`${helpers.toKebab(api.name)}-props`"
          :items="api.props"
          kind="prop"
          :query="search"
          title="Props"
        />

        <DocsApiSection
          :anchor-id="`${helpers.toKebab(api.name)}-events`"
          class="mt-8"
          :items="api.events"
          kind="event"
          :query="search"
          title="Events"
        />

        <DocsApiSection
          :anchor-id="`${helpers.toKebab(api.name)}-slots`"
          class="mt-8"
          :items="api.slots"
          kind="slot"
          :query="search"
          title="Slots"
        />
      </template>

      <p v-if="empty" class="text-sm text-on-surface-variant mt-4">
        No API items match "{{ search }}".
      </p>
    </template>
  </div>

  <div
    v-else-if="composableApi"
    class="markdown-body mt-8 mb-12"
  >
    <div class="flex items-center justify-between gap-4 markdown-body">
      <DocsHeaderAnchor
        id="api-reference"
        class="!mb-0"
        tag="h2"
      >
        API Reference
      </DocsHeaderAnchor>

      <button
        class="text-sm text-primary hover:underline focus-visible:underline focus-visible:outline-none whitespace-nowrap"
        type="button"
        @click="showInlineApi = !showInlineApi"
      >
        {{ showInlineApi ? 'View standalone →' : 'Show inline ↓' }}
      </button>
    </div>

    The following API details are for the <strong>{{ itemName }}</strong> composable.

    <DocsApiLinks
      v-if="!showInlineApi"
      :composable-api
    />

    <template v-if="showInlineApi">
      <div class="relative mt-4">
        <AppIcon
          class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          icon="search"
          :size="16"
        />

        <input
          v-model="search"
          class="w-full pl-9 pr-3 py-2 text-sm bg-surface-tint border border-divider rounded-lg outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant"
          :placeholder
          type="text"
        >
      </div>

      <DocsApiSection
        anchor-id="functions"
        class="mt-8"
        :items="composableApi.functions"
        kind="function"
        :query="search"
        title="Functions"
      />

      <DocsApiSection
        anchor-id="options"
        class="mt-8"
        :items="composableApi.options"
        kind="option"
        :query="search"
        title="Options"
      />

      <DocsApiSection
        anchor-id="properties"
        class="mt-8"
        :items="composableApi.properties"
        kind="property"
        :query="search"
        title="Properties"
      />

      <DocsApiSection
        anchor-id="methods"
        class="mt-8"
        :items="composableApi.methods"
        kind="method"
        :query="search"
        title="Methods"
      />

      <p v-if="empty" class="text-sm text-on-surface-variant mt-4">
        No API items match "{{ search }}".
      </p>
    </template>
  </div>
</template>
