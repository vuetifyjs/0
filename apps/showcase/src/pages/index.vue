<script setup lang="ts">
  import { CxCard, CxBadge, CxProgressBar } from '@paper/codex'

  // Composables
  import { useCoverage } from '../composables/useCoverage'
  import { useShowcase } from '../composables/useShowcase'

  const { designSystems } = useShowcase()
  const { score } = useCoverage()

  function coverage (slug: string) {
    return score(slug)
  }

  function coverageColor (value: number): 'success' | 'warning' | 'error' {
    if (value >= 80) return 'success'
    if (value >= 50) return 'warning'
    return 'error'
  }
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="mb-10">
      <h1 class="text-3xl font-bold mb-2">Paper Showcase</h1>
      <p class="text-on-surface-variant">Design system showcase and comparison tool.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="ds in designSystems"
        :key="ds.slug"
        class="no-underline text-on-surface"
        :to="`/${ds.slug}`"
      >
        <CxCard class="p-6 h-full flex flex-col gap-4" hoverable>
          <div class="flex items-start justify-between gap-2">
            <h2 class="text-xl font-semibold leading-tight">{{ ds.name }}</h2>
            <CxBadge color="primary" variant="outlined">{{ ds.prefix }}</CxBadge>
          </div>

          <p v-if="ds.description" class="text-on-surface-variant text-sm flex-1">
            {{ ds.description }}
          </p>
          <div v-else class="flex-1" />

          <div class="flex flex-wrap gap-2">
            <CxBadge color="info" variant="subtle">
              {{ ds.components.length }} components
            </CxBadge>
            <CxBadge v-if="ds.composables?.length" color="info" variant="subtle">
              {{ ds.composables.length }} composables
            </CxBadge>
          </div>

          <div class="flex flex-col gap-1">
            <div class="flex justify-between text-xs text-on-surface-variant">
              <span>Coverage</span>
              <span>{{ coverage(ds.slug) }}%</span>
            </div>
            <CxProgressBar
              :color="coverageColor(coverage(ds.slug))"
              :value="coverage(ds.slug)"
            />
          </div>
        </CxCard>
      </router-link>
    </div>
  </div>
</template>
