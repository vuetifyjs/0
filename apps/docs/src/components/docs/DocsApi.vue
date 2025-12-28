<script lang="ts" setup>
  import { computed, onMounted, shallowRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  interface ApiProp {
    name: string
    type: string
    required: boolean
    default?: string
    description?: string
  }

  interface ApiEvent {
    name: string
    type: string
    description?: string
  }

  interface ApiSlot {
    name: string
    type?: string
    description?: string
  }

  interface ComponentApi {
    name: string
    description?: string
    props: ApiProp[]
    events: ApiEvent[]
    slots: ApiSlot[]
  }

  const props = defineProps<{
    /** Override component name prefix (otherwise extracted from route) */
    name?: string
  }>()

  const route = useRoute()
  const apis = shallowRef<ComponentApi[]>([])
  const loading = shallowRef(false)

  // Extract component name from route: /components/{category}/{slug} -> PascalCase
  const componentPrefix = computed(() => {
    if (props.name) return props.name

    const path = route.path
    const match = path.match(/\/components\/[^/]+\/([^/]+)/)
    if (!match) return null

    // Convert kebab-case to PascalCase: expansion-panel -> ExpansionPanel
    return match[1]
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  })

  async function fetchApis () {
    const prefix = componentPrefix.value
    if (!prefix) return

    loading.value = true

    try {
      const response = await fetch('/api/components.json')
      if (!response.ok) {
        apis.value = []
        return
      }

      const allApis: Record<string, ComponentApi> = await response.json()

      // Find all components matching prefix (e.g., Selection -> SelectionRoot, SelectionItem)
      const matching = Object.entries(allApis)
        .filter(([name]) => name.startsWith(prefix))
        .map(([, api]) => api)
        .toSorted((a, b) => {
          // Sort: Root first, then alphabetically
          if (a.name.endsWith('Root')) return -1
          if (b.name.endsWith('Root')) return 1
          return a.name.localeCompare(b.name)
        })

      apis.value = matching
    } catch {
      apis.value = []
    } finally {
      loading.value = false
    }
  }

  // Fetch on mount and when component name changes
  onMounted(fetchApis)
  watch(componentPrefix, fetchApis)

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
</script>

<template>
  <div
    v-if="apis.length > 0"
    class="markdown-body mt-8"
  >
    <h2 id="api-reference">
      <a
        class="header-anchor"
        href="#api-reference"
        @click.prevent="scrollToAnchor('api-reference')"
      >API Reference</a>
    </h2>

    <template
      v-for="api in apis"
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
</template>
