<script setup lang="ts">
  import apiData from 'virtual:api'

  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'
  import { useSettings } from '@/composables/useSettings'
  import { useSyncedRef } from '@/composables/useSyncedRef'

  // Utilities
  import { resolveItemName } from '@/utilities/strings'
  import { computed, toRef } from 'vue'
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

</script>

<template>
  <div
    v-if="componentApis.length > 0"
    class="mt-8 mb-12 markdown-body"
  >
    <div class="markdown-body flex items-center justify-between gap-4 mb-3">
      <HxHeaderAnchor
        id="api-reference"
        class="!my-0"
        tag="h2"
      >
        API Reference
      </HxHeaderAnchor>

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

    <template
      v-for="api in componentApis"
      v-else
      :key="api.name"
    >
      <HxHeaderAnchor :id="helpers.toKebab(api.name)" class="mt-8">
        {{ api.name }}
      </HxHeaderAnchor>

      <DocsApiSection
        :anchor-id="`${helpers.toKebab(api.name)}-props`"
        :items="api.props"
        kind="prop"
        title="Props"
      />

      <DocsApiSection
        :anchor-id="`${helpers.toKebab(api.name)}-events`"
        class="mt-8"
        :items="api.events"
        kind="event"
        title="Events"
      />

      <DocsApiSection
        :anchor-id="`${helpers.toKebab(api.name)}-slots`"
        class="mt-8"
        :items="api.slots"
        kind="slot"
        title="Slots"
      />
    </template>
  </div>

  <div
    v-else-if="composableApi"
    class="markdown-body mt-8 mb-12"
  >
    <div class="flex items-center justify-between gap-4 markdown-body">
      <HxHeaderAnchor
        id="api-reference"
        class="!mb-0"
        tag="h2"
      >
        API Reference
      </HxHeaderAnchor>

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

    <template v-else>
      <DocsApiSection
        anchor-id="functions"
        class="mt-8"
        :items="composableApi.functions"
        kind="function"
        title="Functions"
      />

      <DocsApiSection
        anchor-id="options"
        class="mt-8"
        :items="composableApi.options"
        kind="option"
        title="Options"
      />

      <DocsApiSection
        anchor-id="properties"
        class="mt-8"
        :items="composableApi.properties"
        kind="property"
        title="Properties"
      />

      <DocsApiSection
        anchor-id="methods"
        class="mt-8"
        :items="composableApi.methods"
        kind="method"
        title="Methods"
      />
    </template>
  </div>
</template>
