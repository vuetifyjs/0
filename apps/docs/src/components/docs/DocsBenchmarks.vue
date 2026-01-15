<script setup lang="ts">
  // Utilities
  import { computed, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  import metrics from '@/data/metrics.json'

  interface BenchmarkEntry {
    name: string
    hz: number
    hzLabel: string
    mean: number
    meanLabel: string
    rme?: number
    tier?: 'blazing' | 'fast' | 'good'
  }

  const route = useRoute()

  // Extract item name from github path in frontmatter or route
  const itemName = computed(() => {
    const path = route.path
    // Match patterns like /composables/registration/use-registry or /components/primitives/atom
    const match = path.match(/\/(composables|components)\/[^/]+\/([^/]+)/)
    if (!match) return null

    // Convert kebab-case to camelCase/PascalCase
    const slug = match[2]
    // For composables: use-registry -> useRegistry
    if (match[1] === 'composables') {
      return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    }
    // For components: atom -> Atom, expansion-panel -> ExpansionPanel
    return slug
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  })

  const benchmarks = computed(() => {
    const name = itemName.value
    if (!name) return null
    const m = (metrics as Record<string, { benchmarks?: Record<string, BenchmarkEntry> }>)[name]
    return m?.benchmarks || null
  })

  // All benchmarks except _fastest, sorted by hz desc
  const entries = computed(() => {
    const b = benchmarks.value
    if (!b) return []
    return Object.entries(b)
      .filter(([key]) => key !== '_fastest')
      .map(([key, value]) => ({ key, ...value }))
      .toSorted((a, b) => b.hz - a.hz)
  })

  const githubLink = toRef(() => {
    const name = itemName.value
    if (!name || !benchmarks.value) return null

    // Determine if composable or component from route
    const path = route.path
    const isComposable = path.includes('/composables/')

    if (isComposable) {
      return `https://github.com/vuetifyjs/0/blob/master/packages/0/src/composables/${name}/index.bench.ts`
    }
    return `https://github.com/vuetifyjs/0/blob/master/packages/0/src/components/${name}/index.bench.ts`
  })
</script>

<template>
  <div
    v-if="benchmarks && entries.length > 0"
    class="markdown-body mt-8"
  >
    <DocsHeaderAnchor id="benchmarks" tag="h2">Benchmarks</DocsHeaderAnchor>

    <p v-if="githubLink">
      <a
        class="v0-link"
        :href="githubLink"
        rel="noopener noreferrer"
        target="_blank"
      >View benchmark source↗</a>
    </p>

    <table>
      <thead>
        <tr>
          <th class="text-left" scope="col">Operation</th>
          <th class="text-right" scope="col">Throughput</th>
          <th class="text-right" scope="col">Latency</th>
          <th class="text-right" scope="col">Margin</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="entry in entries"
          :key="entry.key"
        >
          <td>{{ entry.name }}</td>
          <td class="text-right"><code>{{ entry.hzLabel }}</code></td>
          <td class="text-right"><code>{{ entry.meanLabel }}</code></td>
          <td class="text-right">± {{ entry.rme?.toFixed(1) ?? '-' }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
