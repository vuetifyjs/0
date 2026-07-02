<script setup lang="ts">
  import apiData from 'virtual:api'

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

  function group (entries: IndexEntry[]): [string, IndexEntry[]][] {
    const groups = new Map<string, IndexEntry[]>()
    for (const entry of entries) {
      const list = groups.get(entry.category) ?? []
      list.push(entry)
      groups.set(entry.category, list)
    }
    return [...groups.entries()].toSorted(([a], [b]) => a.localeCompare(b))
  }

  const componentGroups = computed(() => group(components.value))
  const composableGroups = computed(() => group(composables.value))
</script>

<template>
  <div>
    <template v-if="componentGroups.length > 0">
      <h2 class="text-3xl leading-9 mt-8 mb-3">Components</h2>

      <p>Detailed API reference for each component including props, events, and slots.</p>

      <template v-for="[category, entries] in componentGroups" :key="`c-${category}`">
        <h3 class="capitalize text-2xl leading-8 mt-6 mb-2">{{ category }}</h3>

        <div class="overflow-x-auto mb-4">
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
        </div>
      </template>
    </template>

    <template v-if="composableGroups.length > 0">
      <h2 class="text-3xl leading-9 mt-8 mb-3">Composables</h2>

      <p>Detailed API reference for each composable including options, properties, and methods.</p>

      <template v-for="[category, entries] in composableGroups" :key="`e-${category}`">
        <h3 class="capitalize text-2xl leading-8 mt-6 mb-2">{{ category }}</h3>

        <div class="overflow-x-auto mb-4">
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
        </div>
      </template>
    </template>
  </div>
</template>
