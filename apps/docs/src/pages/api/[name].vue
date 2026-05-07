<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import apiData from 'virtual:api'

  // Composables
  import { provideApiFilter } from '@/composables/useApiFilter'
  import { useApiHelpers } from '@/composables/useApiHelpers'
  import { useParams } from '@/composables/useRoute'

  // Utilities
  import { toCamel, toPascal } from '@/utilities/strings'
  import { computed, toRef } from 'vue'

  // Types
  import type { ApiData, ComponentApi, ComposableApi } from '@build/generate-api'

  const params = useParams<{ name: string }>()
  const data = apiData as ApiData
  const helpers = useApiHelpers()
  provideApiFilter()

  const itemName = computed(() => {
    const slug = params.value.name
    if (!slug) return null

    // Convert slug to PascalCase for component prefix matching
    // e.g., "popover" → "Popover", "expansion-panel" → "ExpansionPanel"
    const pascalName = toPascal(slug)

    // Check if any component starts with this prefix (e.g., "Popover.Root", "Popover.Content")
    const hasComponentPrefix = Object.keys(data.components).some(name => name.startsWith(`${pascalName}.`) || name === pascalName)
    if (hasComponentPrefix) return pascalName

    // Check composables with camelCase name
    const camelName = toCamel(slug)
    if (camelName in data.composables) return camelName

    return null
  })

  const isComponent = computed(() => {
    if (!itemName.value) return false
    return Object.keys(data.components).some(name => name.startsWith(`${itemName.value}.`) || name === itemName.value)
  })
  const isComposable = toRef(() => itemName.value && itemName.value in data.composables)

  const relatedFrontmatter = toRef(() => ({
    related: itemName.value ? data.related[itemName.value] ?? [] : [],
  }))

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

  const title = toRef(() => itemName.value ? `${itemName.value} API` : 'API Reference')
  const description = toRef(() => {
    if (!itemName.value) return undefined
    return isComponent.value
      ? `API reference for the ${itemName.value} component.`
      : `API reference for the ${itemName.value} composable.`
  })

  useHead({
    title,
    meta: toRef(() => description.value
      ? [{ key: 'description', name: 'description', content: description.value }]
      : [],
    ),
    script: toRef(() => itemName.value
      ? [{
        key: 'jsonld-api',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          'name': itemName.value,
          'description': description.value,
          'programmingLanguage': 'TypeScript',
          'runtimePlatform': 'Vue 3',
          'codeRepository': 'https://github.com/vuetifyjs/0',
          'license': 'https://opensource.org/licenses/MIT',
        }),
      }]
      : [],
    ),
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

        <DocsRelated :frontmatter="relatedFrontmatter" />

        <DocsApiSearch />

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
    </template>

    <template v-else-if="composableApi">
      <div class="markdown-body">
        <h1>{{ composableApi.name }} API</h1>

        <p class="lead">API reference for the {{ composableApi.name }} composable.</p>

        <DocsRelated :frontmatter="relatedFrontmatter" />

        <DocsApiSearch />

        <DocsApiSection
          anchor-id="functions"
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
      </div>
    </template>
  </article>
</template>
