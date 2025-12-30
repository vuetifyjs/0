<script setup lang="ts">
  import apiData from 'virtual:api'

  // Framework
  import { useStorage } from '@vuetify/v0'

  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'

  // Utilities
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { ApiData } from '../../../build/generate-api'

  const props = defineProps<{
    name?: string
  }>()

  const route = useRoute()
  const data = apiData as ApiData
  const storage = useStorage()
  const { toKebab } = useApiHelpers()

  const apiMode = storage.get<'inline' | 'links'>('api-display', 'inline')

  function toggleApiMode () {
    apiMode.value = apiMode.value === 'inline' ? 'links' : 'inline'
  }

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

  const propsColumns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'type' as const, label: 'Type', code: true },
    { key: 'default' as const, label: 'Default', code: true, fallback: '—' },
    { key: 'description' as const, label: 'Description', small: true },
  ]

  const eventsColumns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'type' as const, label: 'Payload', code: true },
    { key: 'description' as const, label: 'Description', small: true },
  ]

  const slotsColumns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'type' as const, label: 'Slot Props', code: true, fallback: '—' },
    { key: 'description' as const, label: 'Description', small: true },
  ]
</script>

<template>
  <div
    v-if="componentApis.length > 0"
    class="markdown-body mt-8 mb-12"
  >
    <div class="flex items-center justify-between gap-4">
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
        @click="toggleApiMode"
      >
        {{ apiMode === 'inline' ? 'View standalone →' : 'Show inline ↓' }}
      </button>
    </div>

    <DocsApiLinks
      v-if="apiMode === 'links'"
      :component-apis="componentApis"
    />

    <template
      v-for="api in componentApis"
      v-else
      :key="api.name"
    >
      <DocsHeaderAnchor :id="toKebab(api.name)">
        {{ api.name }}
      </DocsHeaderAnchor>

      <template v-if="api.props.length > 0">
        <h4>Props</h4>

        <DocsApiTable
          :columns="propsColumns"
          :items="api.props"
          show-required
        />
      </template>

      <template v-if="api.events.length > 0">
        <h4>Events</h4>

        <DocsApiTable
          :columns="eventsColumns"
          :items="api.events"
        />
      </template>

      <template v-if="api.slots.length > 0">
        <h4>Slots</h4>

        <DocsApiTable
          :columns="slotsColumns"
          :items="api.slots"
        />
      </template>
    </template>
  </div>

  <div
    v-else-if="composableApi"
    class="markdown-body mt-8 mb-12"
  >
    <div class="flex items-center justify-between gap-4">
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
        @click="toggleApiMode"
      >
        {{ apiMode === 'inline' ? 'View standalone →' : 'Show inline ↓' }}
      </button>
    </div>

    <DocsApiLinks
      v-if="apiMode === 'links'"
      :composable-api="composableApi"
    />

    <template v-else>
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
