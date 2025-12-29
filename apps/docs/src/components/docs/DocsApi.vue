<script lang="ts" setup>
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
  const {
    uid,
    expandedExamples,
    highlightedExamples,
    scrollToAnchor,
    toKebab,
    toggleExample,
    formatSignature,
  } = useApiHelpers()

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

    const slug = match[2]
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
    class="markdown-body mt-8 mb-12"
  >
    <div class="flex items-center justify-between gap-4">
      <h2 id="api-reference" class="!mb-0">
        <a
          class="header-anchor"
          href="#api-reference"
          @click.prevent="scrollToAnchor('api-reference')"
        >API Reference</a>
      </h2>
      <button
        class="text-sm text-primary hover:underline whitespace-nowrap"
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
      <h3 :id="toKebab(api.name)">
        <a
          class="header-anchor"
          :href="`#${toKebab(api.name)}`"
          @click.prevent="scrollToAnchor(toKebab(api.name))"
        >{{ api.name }}</a>
      </h3>

      <template v-if="api.props.length > 0">
        <h4>Props</h4>
        <table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Type</th>
              <th class="text-left">Default</th>
              <th class="text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="prop in api.props"
              :key="prop.name"
            >
              <td>
                <code>{{ prop.name }}</code>
                <span
                  v-if="prop.required"
                  class="text-error text-xs ml-1"
                >*</span>
              </td>
              <td><code class="text-xs">{{ prop.type }}</code></td>
              <td>
                <code
                  v-if="prop.default"
                  class="text-xs"
                >{{ prop.default }}</code>
                <span
                  v-else
                  class="text-on-surface-variant"
                >—</span>
              </td>
              <td class="text-sm">{{ prop.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-if="api.events.length > 0">
        <h4>Events</h4>
        <table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Payload</th>
              <th class="text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="event in api.events"
              :key="event.name"
            >
              <td><code>{{ event.name }}</code></td>
              <td><code class="text-xs">{{ event.type }}</code></td>
              <td class="text-sm">{{ event.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-if="api.slots.length > 0">
        <h4>Slots</h4>
        <table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Slot Props</th>
              <th class="text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="slot in api.slots"
              :key="slot.name"
            >
              <td><code>{{ slot.name }}</code></td>
              <td>
                <code
                  v-if="slot.type"
                  class="text-xs"
                >{{ slot.type }}</code>
                <span
                  v-else
                  class="text-on-surface-variant"
                >—</span>
              </td>
              <td class="text-sm">{{ slot.description || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </template>
  </div>

  <div
    v-else-if="composableApi"
    class="markdown-body mt-8 mb-12"
  >
    <div class="flex items-center justify-between gap-4">
      <h2 id="api-reference" class="!mb-0">
        <a
          class="header-anchor"
          href="#api-reference"
          @click.prevent="scrollToAnchor('api-reference')"
        >API Reference</a>
      </h2>
      <button
        class="text-sm text-primary hover:underline whitespace-nowrap"
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
        <h3 id="options" class="mt-8">
          <a
            class="header-anchor"
            href="#options"
            @click.prevent="scrollToAnchor('options')"
          >Options</a>
        </h3>
        <div class="space-y-4">
          <div
            v-for="opt in composableApi.options"
            :key="opt.name"
            class="border border-divider rounded-lg overflow-hidden"
          >
            <div class="px-4 py-3 bg-surface-variant/30">
              <h4
                :id="opt.name"
                class="!my-0"
              >
                <a
                  class="header-anchor"
                  :href="`#${opt.name}`"
                  @click.prevent="scrollToAnchor(opt.name)"
                ><code class="text-sm font-semibold">{{ opt.name }}</code></a>
                <span
                  v-if="opt.required"
                  class="text-error text-xs ml-2"
                >required</span>
              </h4>
              <code class="text-xs text-primary mt-1 block font-mono">{{ opt.type }}</code>
              <p
                v-if="opt.description"
                class="text-sm text-on-surface-variant mt-1"
              >{{ opt.description }}</p>
              <p
                v-if="opt.default"
                class="text-xs text-on-surface-variant mt-1"
              >
                Default: <code class="text-xs">{{ opt.default }}</code>
              </p>
            </div>
          </div>
        </div>
      </template>

      <template v-if="composableApi.properties.length > 0">
        <h3 id="properties" class="mt-8">
          <a
            class="header-anchor"
            href="#properties"
            @click.prevent="scrollToAnchor('properties')"
          >Properties</a>
        </h3>
        <div class="space-y-4">
          <div
            v-for="prop in composableApi.properties"
            :key="prop.name"
            class="border border-divider rounded-lg overflow-hidden"
          >
            <div class="px-4 py-3 bg-surface-variant/30">
              <h4
                :id="prop.name"
                class="!my-0"
              >
                <a
                  class="header-anchor"
                  :href="`#${prop.name}`"
                  @click.prevent="scrollToAnchor(prop.name)"
                ><code class="text-sm font-semibold">{{ prop.name }}</code></a>
              </h4>
              <code class="text-xs text-primary mt-1 block font-mono">{{ formatSignature(prop) }}</code>
              <p
                v-if="prop.description"
                class="text-sm text-on-surface-variant mt-1"
              >{{ prop.description }}</p>
            </div>
            <div
              v-if="prop.example"
              class="border-t border-divider bg-surface-tint"
            >
              <button
                :aria-controls="`${uid}-prop-${prop.name}`"
                :aria-expanded="expandedExamples.has(`prop-${prop.name}`)"
                class="w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors hover:bg-surface"
                @click="toggleExample(`prop-${prop.name}`, prop.example)"
              >
                <span v-if="expandedExamples.has(`prop-${prop.name}`)">Hide code example</span>
                <span v-else>Show code example</span>
              </button>
            </div>
            <div
              v-if="expandedExamples.has(`prop-${prop.name}`) && highlightedExamples[`prop-${prop.name}`]"
              :id="`${uid}-prop-${prop.name}`"
              class="relative bg-pre"
            >
              <DocsCodeActions
                bin
                class="absolute top-3 right-3 z-10"
                :code="highlightedExamples[`prop-${prop.name}`].code"
                language="typescript"
                show-copy
                :title="prop.name"
              />
              <div
                class="[&_pre]:p-4 [&_pre]:pr-20 [&_pre]:leading-relaxed [&_pre]:overflow-x-auto [&_pre]:m-0 [&_pre]:border-0 [&_pre]:outline-0"
                v-html="highlightedExamples[`prop-${prop.name}`].html"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-if="composableApi.methods.length > 0">
        <h3 id="methods" class="mt-8">
          <a
            class="header-anchor"
            href="#methods"
            @click.prevent="scrollToAnchor('methods')"
          >Methods</a>
        </h3>
        <div class="space-y-4">
          <div
            v-for="method in composableApi.methods"
            :key="method.name"
            class="border border-divider rounded-lg overflow-hidden"
          >
            <div class="px-4 py-3 bg-surface-variant/30">
              <h4
                :id="method.name"
                class="!my-0"
              >
                <a
                  class="header-anchor"
                  :href="`#${method.name}`"
                  @click.prevent="scrollToAnchor(method.name)"
                ><code class="text-sm font-semibold">{{ method.name }}</code></a>
              </h4>
              <code class="text-xs text-primary mt-1 block font-mono">{{ formatSignature(method) }}</code>
              <p
                v-if="method.description"
                class="text-sm text-on-surface-variant mt-1"
              >{{ method.description }}</p>
            </div>
            <div
              v-if="method.example"
              class="border-t border-divider bg-surface-tint"
            >
              <button
                :aria-controls="`${uid}-method-${method.name}`"
                :aria-expanded="expandedExamples.has(`method-${method.name}`)"
                class="w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors hover:bg-surface"
                @click="toggleExample(`method-${method.name}`, method.example)"
              >
                <span v-if="expandedExamples.has(`method-${method.name}`)">Hide code example</span>
                <span v-else>Show code example</span>
              </button>
            </div>
            <div
              v-if="expandedExamples.has(`method-${method.name}`) && highlightedExamples[`method-${method.name}`]"
              :id="`${uid}-method-${method.name}`"
              class="relative bg-pre"
            >
              <DocsCodeActions
                bin
                class="absolute top-3 right-3 z-10"
                :code="highlightedExamples[`method-${method.name}`].code"
                language="typescript"
                show-copy
                :title="method.name"
              />
              <div
                class="[&_pre]:p-4 [&_pre]:pr-20 [&_pre]:leading-relaxed [&_pre]:overflow-x-auto [&_pre]:m-0 [&_pre]:border-0 [&_pre]:outline-0"
                v-html="highlightedExamples[`method-${method.name}`].html"
              />
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
