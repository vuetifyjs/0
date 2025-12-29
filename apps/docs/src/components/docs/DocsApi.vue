<script lang="ts" setup>
  import { computed, ref, shallowReactive, useId } from 'vue'
  import { useRoute } from 'vue-router'
  import apiData from 'virtual:api'

  import { useHighlighter } from '@/composables/useHighlighter'

  import type { ApiData, ApiMethod, ApiProperty } from '../../../build/generate-api'

  type ExampleState = { html: string, code: string }

  const props = defineProps<{
    /** Override name (otherwise extracted from route) */
    name?: string
  }>()

  const route = useRoute()
  const data = apiData as ApiData
  const { highlighter, getHighlighter } = useHighlighter()
  const uid = useId()

  // Track expanded examples and their highlighted HTML + raw code
  const expandedExamples = ref<Set<string>>(new Set())
  const highlightedExamples = shallowReactive<Record<string, ExampleState>>({})

  // Detect page type from route
  const pageType = computed(() => {
    const path = route.path
    if (path.includes('/components/')) return 'component'
    if (path.includes('/composables/')) return 'composable'
    return null
  })

  // Extract name from route
  const itemName = computed(() => {
    if (props.name) return props.name

    const path = route.path
    const match = path.match(/\/(components|composables)\/[^/]+\/([^/]+)/)
    if (!match) return null

    const slug = match[2]

    // Components: kebab-case -> PascalCase (expansion-panel -> ExpansionPanel)
    // Composables: kebab-case -> camelCase (use-registry -> useRegistry)
    return match[1] === 'components'
      ? slug.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
      : slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  })

  // Get component APIs (handles compound components like Selection -> SelectionRoot, SelectionItem)
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

  // Get composable API
  const composableApi = computed(() => {
    if (pageType.value !== 'composable') return null

    const name = itemName.value
    if (!name) return null

    return data.composables[name] || null
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
      // Highlight on first expand
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

  // Format method signature for display
  function formatSignature (item: ApiMethod | ApiProperty): string {
    const type = item.type
    // For arrow functions, extract params and return type
    const arrowMatch = type.match(/^\((.*?)\)\s*=>\s*(.+)$/)
    if (arrowMatch) {
      const [, params, returnType] = arrowMatch
      // Simplify parameter types - just show names with basic types
      const simplifiedParams = params
        .split(',')
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => {
          const [name, pType] = p.split(':').map(s => s.trim())
          // Simplify complex types
          const simpleType = pType?.replace(/import\([^)]+\)\./g, '') || ''
          return simpleType ? `${name}: ${simpleType}` : name
        })
        .join(', ')
      return `(${simplifiedParams}) => ${returnType.replace(/import\([^)]+\)\./g, '')}`
    }
    // Remove import() references for cleaner display
    return type.replace(/import\([^)]+\)\./g, '')
  }
</script>

<template>
  <!-- Component API -->
  <div
    v-if="componentApis.length > 0"
    class="markdown-body mt-8 mb-12"
  >
    <h2 id="api-reference">
      <a
        class="header-anchor"
        href="#api-reference"
        @click.prevent="scrollToAnchor('api-reference')"
      >API Reference</a>
    </h2>

    <template
      v-for="api in componentApis"
      :key="api.name"
    >
      <h3 :id="toKebab(api.name)">
        <a
          class="header-anchor"
          :href="`#${toKebab(api.name)}`"
          @click.prevent="scrollToAnchor(toKebab(api.name))"
        >{{ api.name }}</a>
      </h3>

      <!-- Props -->
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

      <!-- Events -->
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

      <!-- Slots -->
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

  <!-- Composable API -->
  <div
    v-else-if="composableApi"
    class="markdown-body mt-8 mb-12"
  >
    <h2 id="api-reference">
      <a
        class="header-anchor"
        href="#api-reference"
        @click.prevent="scrollToAnchor('api-reference')"
      >API Reference</a>
    </h2>

    <!-- Options -->
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

    <!-- Properties -->
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

    <!-- Methods -->
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
  </div>
</template>
