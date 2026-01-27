<script setup lang="ts">
  import apiData from 'virtual:api'

  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'
  import { useParams } from '@/composables/useRoute'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { ApiData, ComponentApi, ComposableApi } from '@build/generate-api'

  const params = useParams<{ name: string }>()
  const data = apiData as ApiData
  const helpers = useApiHelpers()

  const itemName = computed(() => {
    const slug = params.value.name
    if (!slug) return null

    // Convert slug to PascalCase for component prefix matching
    // e.g., "popover" → "Popover", "expansion-panel" → "ExpansionPanel"
    const pascalName = slug.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')

    // Check if any component starts with this prefix (e.g., "Popover.Root", "Popover.Content")
    const hasComponentPrefix = Object.keys(data.components).some(name => name.startsWith(`${pascalName}.`) || name === pascalName)
    if (hasComponentPrefix) return pascalName

    // Check composables with camelCase name
    const camelName = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    if (camelName in data.composables) return camelName

    return null
  })

  const isComponent = computed(() => {
    if (!itemName.value) return false
    return Object.keys(data.components).some(name => name.startsWith(`${itemName.value}.`) || name === itemName.value)
  })
  const isComposable = computed(() => itemName.value && itemName.value in data.composables)

  const componentApis = computed<ComponentApi[]>(() => {
    if (!isComponent.value || !itemName.value) return []

    const prefix = itemName.value
    return Object.entries(data.components)
      .filter(([name]) => name.startsWith(prefix))
      .map(([, api]) => api)
      .toSorted((a, b) => {
        if (a.name.endsWith('Root')) return -1
        if (b.name.endsWith('Root')) return 1
        return a.name.localeCompare(b.name)
      })
  })

  const composableApi = computed<ComposableApi | null>(() => {
    if (!isComposable.value || !itemName.value) return null
    return data.composables[itemName.value] || null
  })

</script>

<template>
  <article>
    <template v-if="!itemName || (!isComponent && !isComposable)">
      <div class="text-center py-16">
        <div class="text-6xl font-bold opacity-10 mb-4">404</div>

        <h1 class="text-2xl font-bold mb-4">API Not Found</h1>

        <p class="text-on-surface-variant mb-8">
          No API documentation found for <code class="bg-surface-tint px-2 py-1 rounded">{{ params.name }}</code>
        </p>

        <router-link
          class="px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
          to="/api"
        >
          Browse All APIs
        </router-link>
      </div>
    </template>

    <template v-else-if="componentApis.length > 0">
      <div class="markdown-body">
        <h1>{{ itemName }} API</h1>

        <p class="lead">API reference for the {{ itemName }} component{{ componentApis.length > 1 ? 's' : '' }}.</p>

        <template
          v-for="api in componentApis"
          :key="api.name"
        >
          <DocsHeaderAnchor
            :id="helpers.toKebab(api.name)"
            tag="h2"
          >
            {{ api.name }}
          </DocsHeaderAnchor>

          <template v-if="api.props.length > 0">
            <DocsHeaderAnchor :id="`${helpers.toKebab(api.name)}-props`">
              Props
            </DocsHeaderAnchor>

            <div class="space-y-4">
              <DocsApiCard
                v-for="prop in api.props"
                :key="prop.name"
                heading-tag="h4"
                :item="prop"
                kind="prop"
              />
            </div>
          </template>

          <template v-if="api.events.length > 0">
            <DocsHeaderAnchor :id="`${helpers.toKebab(api.name)}-events`">
              Events
            </DocsHeaderAnchor>

            <div class="space-y-4">
              <DocsApiCard
                v-for="event in api.events"
                :key="event.name"
                heading-tag="h4"
                :item="event"
                kind="event"
              />
            </div>
          </template>

          <template v-if="api.slots.length > 0">
            <DocsHeaderAnchor :id="`${helpers.toKebab(api.name)}-slots`">
              Slots
            </DocsHeaderAnchor>

            <div class="space-y-4">
              <DocsApiCard
                v-for="slot in api.slots"
                :key="slot.name"
                heading-tag="h4"
                :item="slot"
                kind="slot"
              />
            </div>
          </template>
        </template>
      </div>
    </template>

    <template v-else-if="composableApi">
      <div class="markdown-body">
        <h1>{{ composableApi.name }} API</h1>

        <p class="lead">API reference for the {{ composableApi.name }} composable.</p>

        <template v-if="composableApi.functions?.length">
          <DocsHeaderAnchor
            id="functions"
            tag="h2"
          >
            Functions
          </DocsHeaderAnchor>

          <div class="space-y-4">
            <DocsApiCard
              v-for="fn in composableApi.functions"
              :key="fn.name"
              heading-tag="h3"
              :item="fn"
              kind="function"
            />
          </div>
        </template>

        <template v-if="composableApi.options?.length">
          <DocsHeaderAnchor
            id="options"
            tag="h2"
          >
            Options
          </DocsHeaderAnchor>

          <div class="space-y-4">
            <DocsApiCard
              v-for="opt in composableApi.options"
              :key="opt.name"
              heading-tag="h3"
              :item="opt"
              kind="option"
            />
          </div>
        </template>

        <template v-if="composableApi.properties?.length">
          <DocsHeaderAnchor
            id="properties"
            class="mt-8"
            tag="h2"
          >
            Properties
          </DocsHeaderAnchor>

          <div class="space-y-4">
            <DocsApiCard
              v-for="prop in composableApi.properties"
              :key="prop.name"
              heading-tag="h3"
              :item="prop"
              kind="property"
            />
          </div>
        </template>

        <template v-if="composableApi.methods?.length">
          <DocsHeaderAnchor
            id="methods"
            class="mt-8"
            tag="h2"
          >
            Methods
          </DocsHeaderAnchor>

          <div class="space-y-4">
            <DocsApiCard
              v-for="method in composableApi.methods"
              :key="method.name"
              heading-tag="h3"
              :item="method"
              kind="method"
            />
          </div>
        </template>
      </div>
    </template>
  </article>
</template>
