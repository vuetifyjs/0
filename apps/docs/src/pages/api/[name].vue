<script lang="ts" setup>
  import apiData from 'virtual:api'

  // Composables
  import { useHighlighter } from '@/composables/useHighlighter'

  // Utilities
  import { computed, ref, shallowReactive, useId } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { ApiData, ApiMethod, ApiProperty, ComponentApi, ComposableApi } from '../../../build/generate-api'

  type ExampleState = { html: string, code: string }

  const route = useRoute()
  const data = apiData as ApiData
  const { highlighter, getHighlighter } = useHighlighter()
  const uid = useId()

  // Track expanded examples and their highlighted HTML + raw code
  const expandedExamples = ref<Set<string>>(new Set())
  const highlightedExamples = shallowReactive<Record<string, ExampleState>>({})

  // Convert kebab-case slug to name
  const itemName = computed(() => {
    const slug = route.params.name as string
    if (!slug) return null

    // Try PascalCase first (for components)
    const pascalName = slug.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
    if (pascalName in data.components) return pascalName

    // Try camelCase (for composables like use-registry -> useRegistry)
    const camelName = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    if (camelName in data.composables) return camelName

    // Check if it matches any component that starts with this prefix
    const matchingComponent = Object.keys(data.components).find(name =>
      name.toLowerCase() === slug.replace(/-/g, '').toLowerCase(),
    )
    if (matchingComponent) return matchingComponent

    return null
  })

  // Determine if this is a component or composable
  const isComponent = computed(() => itemName.value && itemName.value in data.components)
  const isComposable = computed(() => itemName.value && itemName.value in data.composables)

  // Get component APIs (handles compound components)
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

  // Get composable API
  const composableApi = computed<ComposableApi | null>(() => {
    if (!isComposable.value || !itemName.value) return null
    return data.composables[itemName.value] || null
  })

  function scrollToAnchor (id: string) {
    const el = document.querySelector(`#${id}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  function toKebab (str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  async function toggleExample (key: string, code?: string) {
    if (expandedExamples.value.has(key)) {
      expandedExamples.value.delete(key)
    } else {
      expandedExamples.value.add(key)
      if (code && !highlightedExamples[key]) {
        const hl = highlighter.value ?? await getHighlighter()
        highlightedExamples[key] = {
          code,
          html: hl.codeToHtml(code, {
            lang: 'typescript',
            themes: {
              light: 'github-light-default',
              dark: 'github-dark-default',
            },
            defaultColor: false,
          }),
        }
      }
    }
  }

  function formatSignature (item: ApiMethod | ApiProperty): string {
    const type = item.type
    const arrowMatch = type.match(/^\((.*?)\)\s*=>\s*(.+)$/)
    if (arrowMatch) {
      const [, params, returnType] = arrowMatch
      const simplifiedParams = params
        .split(',')
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => {
          const [name, pType] = p.split(':').map(s => s.trim())
          const simpleType = pType?.replace(/import\([^)]+\)\./g, '') || ''
          return simpleType ? `${name}: ${simpleType}` : name
        })
        .join(', ')
      return `(${simplifiedParams}) => ${returnType.replace(/import\([^)]+\)\./g, '')}`
    }
    return type.replace(/import\([^)]+\)\./g, '')
  }
</script>

<template>
  <article>
    <!-- Not Found -->
    <template v-if="!itemName || (!isComponent && !isComposable)">
      <div class="text-center py-16">
        <div class="text-6xl font-bold opacity-10 mb-4">404</div>
        <h1 class="text-2xl font-bold mb-4">API Not Found</h1>
        <p class="text-on-surface-variant mb-8">
          No API documentation found for <code class="bg-surface-tint px-2 py-1 rounded">{{ route.params.name }}</code>
        </p>
        <router-link
          class="px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
          to="/api"
        >
          Browse All APIs
        </router-link>
      </div>
    </template>

    <!-- Component API -->
    <template v-else-if="componentApis.length > 0">
      <div class="markdown-body">
        <h1>{{ itemName }} API</h1>
        <p class="lead">API reference for the {{ itemName }} component{{ componentApis.length > 1 ? 's' : '' }}.</p>
        <template
          v-for="api in componentApis"
          :key="api.name"
        >
          <h2 :id="toKebab(api.name)">
            <a
              class="header-anchor"
              :href="`#${toKebab(api.name)}`"
              @click.prevent="scrollToAnchor(toKebab(api.name))"
            >{{ api.name }}</a>
          </h2>

          <!-- Props -->
          <template v-if="api.props.length > 0">
            <h3 :id="`${toKebab(api.name)}-props`">
              <a
                class="header-anchor"
                :href="`#${toKebab(api.name)}-props`"
                @click.prevent="scrollToAnchor(`${toKebab(api.name)}-props`)"
              >Props</a>
            </h3>
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

          <!-- Events -->
          <template v-if="api.events.length > 0">
            <h3 :id="`${toKebab(api.name)}-events`">
              <a
                class="header-anchor"
                :href="`#${toKebab(api.name)}-events`"
                @click.prevent="scrollToAnchor(`${toKebab(api.name)}-events`)"
              >Events</a>
            </h3>
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

          <!-- Slots -->
          <template v-if="api.slots.length > 0">
            <h3 :id="`${toKebab(api.name)}-slots`">
              <a
                class="header-anchor"
                :href="`#${toKebab(api.name)}-slots`"
                @click.prevent="scrollToAnchor(`${toKebab(api.name)}-slots`)"
              >Slots</a>
            </h3>
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
    </template>

    <!-- Composable API -->
    <template v-else-if="composableApi">
      <div class="markdown-body">
        <h1>{{ composableApi.name }} API</h1>
        <p class="lead">API reference for the {{ composableApi.name }} composable.</p>
        <!-- Options -->
        <template v-if="composableApi.options.length > 0">
          <h2 id="options">
            <a
              class="header-anchor"
              href="#options"
              @click.prevent="scrollToAnchor('options')"
            >Options</a>
          </h2>
          <div class="space-y-4">
            <div
              v-for="opt in composableApi.options"
              :key="opt.name"
              class="border border-divider rounded-lg overflow-hidden"
            >
              <div class="px-4 py-3 bg-surface-variant/30">
                <h3
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
                </h3>
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

        <!-- Properties -->
        <template v-if="composableApi.properties.length > 0">
          <h2 id="properties" class="mt-8">
            <a
              class="header-anchor"
              href="#properties"
              @click.prevent="scrollToAnchor('properties')"
            >Properties</a>
          </h2>
          <div class="space-y-4">
            <div
              v-for="prop in composableApi.properties"
              :key="prop.name"
              class="border border-divider rounded-lg overflow-hidden"
            >
              <div class="px-4 py-3 bg-surface-variant/30">
                <h3
                  :id="prop.name"
                  class="!my-0"
                >
                  <a
                    class="header-anchor"
                    :href="`#${prop.name}`"
                    @click.prevent="scrollToAnchor(prop.name)"
                  ><code class="text-sm font-semibold">{{ prop.name }}</code></a>
                </h3>
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

        <!-- Methods -->
        <template v-if="composableApi.methods.length > 0">
          <h2 id="methods" class="mt-8">
            <a
              class="header-anchor"
              href="#methods"
              @click.prevent="scrollToAnchor('methods')"
            >Methods</a>
          </h2>
          <div class="space-y-4">
            <div
              v-for="method in composableApi.methods"
              :key="method.name"
              class="border border-divider rounded-lg overflow-hidden"
            >
              <div class="px-4 py-3 bg-surface-variant/30">
                <h3
                  :id="method.name"
                  class="!my-0"
                >
                  <a
                    class="header-anchor"
                    :href="`#${method.name}`"
                    @click.prevent="scrollToAnchor(method.name)"
                  ><code class="text-sm font-semibold">{{ method.name }}</code></a>
                </h3>
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
      </div>
    </template>
  </article>
</template>
