<script setup lang="ts">
  // Composables
  import { TIER_CONFIG } from '@/composables/useBenchmarkData'

  // Utilities
  import { computed, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  import metrics from '@/data/metrics.json'

  const tiers = (['good', 'fast', 'blazing', 'slow'] as const).map(t => [t, TIER_CONFIG[t]] as const)

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

    <p>
      Every operation is profiled across multiple dataset sizes to measure real-world throughput.
      Each benchmark is assigned a performance tier&mdash;<template
        v-for="([tier, config], i) in tiers"
        :key="tier"
      ><span class="inline-flex items-center gap-0.5 align-baseline" :class="config.color"><AppIcon
        :icon="config.icon"
        :size="14"
      />{{ config.label.toLowerCase() }}</span><template v-if="i < tiers.length - 2">, </template><template v-else-if="i === tiers.length - 2">, or </template></template>&mdash;and
      groups are scored by averaging their individual results so you can spot bottlenecks at a glance.
      This transparency helps you make informed decisions about which patterns scale for your use case.
      Learn more in the <router-link class="v0-link" to="/guide/fundamentals/benchmarks">benchmarks guide</router-link>.
    </p>

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
