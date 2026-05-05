<script setup lang="ts">
  import apiData from 'virtual:api'

  // Composables
  import { apiFilter, provideApiFilter } from '@/composables/useApiFilter'

  // Utilities
  import { toKebab } from '@/utilities/strings'
  import { computed } from 'vue'

  // Types
  import type { ApiData } from '@build/generate-api'

  // Maturity (relative path; #v0 alias also works)
  import maturity from '../../../../../packages/0/src/maturity.json'

  type IndexEntry = {
    [key: string]: unknown
    name: string
    description: string
    href: string
    kind: 'component' | 'composable'
    category: string
  }

  const data = apiData as ApiData
  const maturityRecord = maturity as {
    components?: Record<string, { category?: string }>
    composables?: Record<string, { category?: string }>
  }

  function categoryFor (name: string, kind: 'component' | 'composable'): string {
    const bucket = kind === 'component' ? maturityRecord.components : maturityRecord.composables
    return bucket?.[name]?.category ?? 'other'
  }

  const components = computed<IndexEntry[]>(() => {
    const seen = new Set<string>()
    const out: IndexEntry[] = []

    for (const fullName of Object.keys(data.components)) {
      const root = fullName.split('.')[0] ?? fullName
      if (seen.has(root)) continue
      seen.add(root)

      const api = data.components[fullName]
      out.push({
        name: root,
        description: api?.description ?? '',
        href: `/api/${toKebab(root)}`,
        kind: 'component',
        category: categoryFor(root, 'component'),
      })
    }

    return out.toSorted((a, b) => a.name.localeCompare(b.name))
  })

  const composables = computed<IndexEntry[]>(() => {
    return Object.entries(data.composables)
      .map(([name, api]) => ({
        name,
        description: api?.description ?? '',
        href: `/api/${toKebab(name)}`,
        kind: 'composable' as const,
        category: categoryFor(name, 'composable'),
      }))
      .toSorted((a, b) => a.name.localeCompare(b.name))
  })

  provideApiFilter()
  const filter = apiFilter

  const filteredComponents = filter.apply(filter.query, components)
  const filteredComposables = filter.apply(filter.query, composables)

  function group (entries: IndexEntry[]): [string, IndexEntry[]][] {
    const groups = new Map<string, IndexEntry[]>()
    for (const entry of entries) {
      const list = groups.get(entry.category) ?? []
      list.push(entry)
      groups.set(entry.category, list)
    }
    return [...groups.entries()].toSorted(([a], [b]) => a.localeCompare(b))
  }

  const componentGroups = computed(() => group(filteredComponents.items.value))
  const composableGroups = computed(() => group(filteredComposables.items.value))

  const hasResults = computed(() =>
    filteredComponents.items.value.length + filteredComposables.items.value.length > 0,
  )
</script>

<template>
  <div>
    <DocsApiSearch />

    <p v-if="!hasResults" class="text-on-surface-variant text-sm">No APIs match the current filter.</p>

    <template v-else>
      <template v-if="componentGroups.length > 0">
        <h2>Components</h2>

        <p>Detailed API reference for each component including props, events, and slots.</p>

        <template v-for="[category, entries] in componentGroups" :key="`c-${category}`">
          <h3 class="capitalize">{{ category }}</h3>

          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="entry in entries" :key="entry.name">
                <td><router-link :to="entry.href">{{ entry.name }}</router-link></td>
                <td>{{ entry.description }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </template>

      <template v-if="composableGroups.length > 0">
        <h2>Composables</h2>

        <p>Detailed API reference for each composable including options, properties, and methods.</p>

        <template v-for="[category, entries] in composableGroups" :key="`e-${category}`">
          <h3 class="capitalize">{{ category }}</h3>

          <table>
            <thead>
              <tr>
                <th>Composable</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="entry in entries" :key="entry.name">
                <td><router-link :to="entry.href">{{ entry.name }}</router-link></td>
                <td>{{ entry.description }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </template>
    </template>
  </div>
</template>
