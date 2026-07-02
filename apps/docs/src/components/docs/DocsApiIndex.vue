<script setup lang="ts">
  import apiData from 'virtual:api'

  // Context
  import DocsHeaderAnchor from './DocsHeaderAnchor.vue'

  // Utilities
  import { toKebab, toTitle } from '@/utilities/strings'
  import { computed, shallowRef } from 'vue'

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

  const DESCRIPTION_TRUNCATE_LENGTH = 180
  const expanded = shallowRef<Set<string>>(new Set())

  function isLong (entry: IndexEntry): boolean {
    return entry.description.length > DESCRIPTION_TRUNCATE_LENGTH
  }

  function toggle (entry: IndexEntry) {
    const key = `${entry.kind}-${entry.name}`
    const next = new Set(expanded.value)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    expanded.value = next
  }

  function isExpanded (entry: IndexEntry): boolean {
    return expanded.value.has(`${entry.kind}-${entry.name}`)
  }
</script>

<template>
  <div>
    <template v-if="componentGroups.length > 0">
      <DocsHeaderAnchor id="components" class="text-3xl leading-9 mt-8 mb-3" tag="h2">Components</DocsHeaderAnchor>

      <p>Detailed API reference for each component including props, events, and slots.</p>

      <template v-for="[category, entries] in componentGroups" :key="`c-${category}`">
        <DocsHeaderAnchor :id="`components-${toKebab(category)}`" class="text-2xl leading-8 mt-6 mb-2" tag="h3">{{ toTitle(category) }}</DocsHeaderAnchor>

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
                <td><router-link class="v0-link" :to="entry.href">{{ entry.name }}</router-link></td>

                <td>
                  <p :class="!isExpanded(entry) && isLong(entry) && 'line-clamp-2'">{{ entry.description }}</p>

                  <button
                    v-if="isLong(entry)"
                    class="text-sm text-primary hover:underline focus-visible:underline focus-visible:outline-none"
                    type="button"
                    @click="toggle(entry)"
                  >
                    {{ isExpanded(entry) ? 'Show less' : 'Show more' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>

    <template v-if="composableGroups.length > 0">
      <DocsHeaderAnchor id="composables" class="text-3xl leading-9 mt-8 mb-3" tag="h2">Composables</DocsHeaderAnchor>

      <p>Detailed API reference for each composable including options, properties, and methods.</p>

      <template v-for="[category, entries] in composableGroups" :key="`e-${category}`">
        <DocsHeaderAnchor :id="`composables-${toKebab(category)}`" class="text-2xl leading-8 mt-6 mb-2" tag="h3">{{ toTitle(category) }}</DocsHeaderAnchor>

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
                <td><router-link class="v0-link" :to="entry.href">{{ entry.name }}</router-link></td>

                <td>
                  <p :class="!isExpanded(entry) && isLong(entry) && 'line-clamp-2'">{{ entry.description }}</p>

                  <button
                    v-if="isLong(entry)"
                    class="text-sm text-primary hover:underline focus-visible:underline focus-visible:outline-none"
                    type="button"
                    @click="toggle(entry)"
                  >
                    {{ isExpanded(entry) ? 'Show less' : 'Show more' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>
  </div>
</template>
