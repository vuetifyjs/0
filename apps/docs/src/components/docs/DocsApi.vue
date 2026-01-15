<script setup lang="ts">
  import apiData from 'virtual:api'

  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, shallowRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { ApiData } from '@build/generate-api'

  const props = defineProps<{
    name?: string
  }>()

  const route = useRoute()
  const data = apiData as ApiData
  const { showInlineApi: defaultInlineApi } = useSettings()
  const { toKebab } = useApiHelpers()

  // Local state initialized from global default, syncs when global changes
  const showInlineApi = shallowRef(defaultInlineApi.value)

  watch(defaultInlineApi, val => {
    showInlineApi.value = val
  })

  const pageType = computed(() => {
    const path = route.path
    if (path.includes('/components/')) return 'component'
    if (path.includes('/composables/')) return 'composable'
    return null
  })

  const itemName = computed(() => {
    if (props.name) return props.name

    const path = route.path
    const match = path.match(/\/(components|composables)\/[^/]+\/([^/]+)/)
    if (!match) return null

    const slug = match[2] ?? ''
    return match[1] === 'components'
      ? slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
      : slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  })

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

  const composableApi = computed(() => {
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
      <DocsHeaderAnchor
        id="api-reference"
        class="!my-0"
        tag="h2"
      >
        API Reference
      </DocsHeaderAnchor>

      <button
        class="text-sm text-primary hover:underline whitespace-nowrap"
        type="button"
        @click="showInlineApi = !showInlineApi"
      >
        {{ showInlineApi ? 'View standalone →' : 'Show inline ↓' }}
      </button>
    </div>

    The following API details are for all variations of the <strong>{{ itemName }}</strong> component.

    <DocsApiLinks
      v-if="!showInlineApi"
      :component-apis="componentApis"
    />

    <template
      v-for="api in componentApis"
      v-else
      :key="api.name"
    >
      <DocsHeaderAnchor :id="toKebab(api.name)" class="mt-8">
        {{ api.name }}
      </DocsHeaderAnchor>

      <DocsApiSection
        :anchor-id="`${toKebab(api.name)}-props`"
        :items="api.props"
        kind="prop"
        title="Props"
      />

      <DocsApiSection
        :anchor-id="`${toKebab(api.name)}-events`"
        class="mt-8"
        :items="api.events"
        kind="event"
        title="Events"
      />

      <DocsApiSection
        :anchor-id="`${toKebab(api.name)}-slots`"
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
      <DocsHeaderAnchor
        id="api-reference"
        class="!mb-0"
        tag="h2"
      >
        API Reference
      </DocsHeaderAnchor>

      <button
        class="text-sm text-primary hover:underline whitespace-nowrap"
        type="button"
        @click="showInlineApi = !showInlineApi"
      >
        {{ showInlineApi ? 'View standalone →' : 'Show inline ↓' }}
      </button>
    </div>

    The following API details are for the <strong>{{ itemName }}</strong> composable.

    <DocsApiLinks
      v-if="!showInlineApi"
      :composable-api="composableApi"
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
