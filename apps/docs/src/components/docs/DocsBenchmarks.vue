<script setup lang="ts">
  // Utilities
  import { computed, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  import metrics from '@/data/metrics.json'

  const route = useRoute()

  // Extract composable name from route
  const itemName = computed(() => {
    const path = route.path
    const match = path.match(/\/(composables|components)\/[^/]+\/([^/]+)/)
    if (!match) return null

    const slug = match[2]
    if (match[1] === 'composables') {
      return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    }
    return slug
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  })

  const hasBenchmarks = computed(() => {
    const name = itemName.value
    if (!name) return false
    const m = (metrics as Record<string, { benchmarks?: Record<string, unknown> }>)[name]
    return !!m?.benchmarks
  })

  const githubLink = toRef(() => {
    const name = itemName.value
    if (!name || !hasBenchmarks.value) return null

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
    v-if="hasBenchmarks && itemName"
    class="markdown-body mt-8"
  >
    <DocsHeaderAnchor id="benchmarks" tag="h2">Benchmarks</DocsHeaderAnchor>

    <p v-if="githubLink" class="mb-4">
      <a
        class="v0-link"
        :href="githubLink"
        rel="noopener noreferrer"
        target="_blank"
      >View benchmark source↗</a>
    </p>

    <BenchmarkExplorer
      collapsed
      :composable="itemName"
      hide-summary
    />
  </div>
</template>
