<script setup lang="ts">
  import apiData from 'virtual:api'

  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, shallowRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { ApiData } from '../../../build/generate-api'

  const props = defineProps<{
    name?: string
  }>()

  const route = useRoute()
  const data = apiData as ApiData
  const { showInlineApi: defaultInlineApi } = useSettings()
  const { toKebab } = useApiHelpers()

  // Local state initialized from global default, resets on navigation
  const showInlineApi = shallowRef(defaultInlineApi.value)

  watch(() => route.path, () => {
    showInlineApi.value = defaultInlineApi.value
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
    <div class="markdown-body flex items-center justify-between gap-4">
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

      <template v-if="api.props.length > 0">
        <DocsHeaderAnchor :id="`${toKebab(api.name)}-props`">
          Props
        </DocsHeaderAnchor>

        <div class="space-y-4">
          <DocsApiCard
            v-for="prop in api.props"
            :key="prop.name"
            :item="prop"
            kind="prop"
          />
        </div>
      </template>

      <template v-if="api.events.length > 0">
        <DocsHeaderAnchor
          :id="`${toKebab(api.name)}-events`"
          class="mt-8"
        >
          Events
        </DocsHeaderAnchor>

        <div class="space-y-4">
          <DocsApiCard
            v-for="event in api.events"
            :key="event.name"
            :item="event"
            kind="event"
          />
        </div>
      </template>

      <template v-if="api.slots.length > 0">
        <DocsHeaderAnchor
          :id="`${toKebab(api.name)}-slots`"
          class="mt-8"
        >
          Slots
        </DocsHeaderAnchor>

        <div class="space-y-4">
          <DocsApiCard
            v-for="slot in api.slots"
            :key="slot.name"
            :item="slot"
            kind="slot"
          />
        </div>
      </template>
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
      <template v-if="composableApi.functions.length > 0">
        <DocsHeaderAnchor
          id="functions"
          class="mt-8"
        >
          Functions
        </DocsHeaderAnchor>

        <div class="space-y-4">
          <DocsApiCard
            v-for="fn in composableApi.functions"
            :key="fn.name"
            :item="fn"
            kind="function"
          />
        </div>
      </template>

      <template v-if="composableApi.options.length > 0">
        <DocsHeaderAnchor
          id="options"
          class="mt-8"
        >
          Options
        </DocsHeaderAnchor>

        <div class="space-y-4">
          <DocsApiCard
            v-for="opt in composableApi.options"
            :key="opt.name"
            :item="opt"
            kind="option"
          />
        </div>
      </template>

      <template v-if="composableApi.properties.length > 0">
        <DocsHeaderAnchor
          id="properties"
          class="mt-8"
        >
          Properties
        </DocsHeaderAnchor>

        <div class="space-y-4">
          <DocsApiCard
            v-for="prop in composableApi.properties"
            :key="prop.name"
            :item="prop"
            kind="property"
          />
        </div>
      </template>

      <template v-if="composableApi.methods.length > 0">
        <DocsHeaderAnchor
          id="methods"
          class="mt-8"
        >
          Methods
        </DocsHeaderAnchor>

        <div class="space-y-4">
          <DocsApiCard
            v-for="method in composableApi.methods"
            :key="method.name"
            :item="method"
            kind="method"
          />
        </div>
      </template>
    </template>
  </div>
</template>
