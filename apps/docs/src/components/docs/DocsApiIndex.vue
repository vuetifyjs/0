<script setup lang="ts">
  import apiData from 'virtual:api'

  // Context
  import DocsHeaderAnchor from './DocsHeaderAnchor.vue'

  import { MATURITY } from '@/constants/maturity'

  // Utilities
  import { renderInlineMarkdown } from '@/utilities/markdown'
  import { toKebab, toTitle } from '@/utilities/strings'
  import { computed } from 'vue'

  // Types
  import type { ApiData } from '@build/generate-api'

  type IndexEntry = {
    [key: string]: unknown
    name: string
    description: string
    href: string
    kind: 'component' | 'composable'
    category: string
  }

  const data = apiData as ApiData

  function categoryFor (name: string, kind: 'component' | 'composable'): string {
    const bucket = kind === 'component' ? MATURITY.components : MATURITY.composables
    return bucket?.[name]?.category ?? 'other'
  }

  const components = computed<IndexEntry[]>(() => {
    const seen = new Set<string>()
    const out: IndexEntry[] = []

    for (const fullName of Object.keys(data.components)) {
      const root = fullName.split('.')[0] ?? fullName
      if (seen.has(root)) continue
      seen.add(root)

      out.push({
        name: root,
        description: MATURITY.components?.[root]?.description ?? '',
        href: `/api/${toKebab(root)}`,
        kind: 'component',
        category: categoryFor(root, 'component'),
      })
    }

    return out.toSorted((a, b) => a.name.localeCompare(b.name))
  })

  const composables = computed<IndexEntry[]>(() => {
    return Object.keys(data.composables)
      .map(name => ({
        name,
        description: MATURITY.composables?.[name]?.description ?? '',
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
      <DocsHeaderAnchor id="components" class="text-3xl leading-9 mt-8 mb-3" tag="h2">Components</DocsHeaderAnchor>

      <p>Detailed API reference for each component including props, events, and slots.</p>

      <template v-for="[category, entries] in componentGroups" :key="`c-${category}`">
        <DocsHeaderAnchor :id="`components-${toKebab(category)}`" class="text-2xl leading-8 mt-6 mb-2" tag="h3">{{ toTitle(category) }}</DocsHeaderAnchor>

        <div class="docs-api-index docs-table overflow-x-auto mb-4">
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
                  <p v-html="renderInlineMarkdown(entry.description)" />
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

        <div class="docs-api-index docs-table overflow-x-auto mb-4">
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
                  <p v-html="renderInlineMarkdown(entry.description)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>
  </div>
</template>

<style>
  /* These index tables are two columns where the name is a single unbreakable
     token, so the phone-width max-content rule in App.vue parks the whole
     Description column off-screen. Squeeze back to container width — names
     keep their natural width and descriptions wrap beside them. The
     .markdown-body prefix outranks App.vue's nested rule structurally:
     (0,4,2) over (0,3,2), instead of by import order. */
  @media (max-width: 767px) {
    .markdown-body div.docs-api-index.docs-table.overflow-x-auto > table {
      width: 100%;
      max-width: none;
    }
  }
</style>
