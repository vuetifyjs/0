<script setup lang="ts">
  // Components
  import BenchmarkSparkline from './BenchmarkSparkline.vue'

  // Composables
  import { useBenchmarkHistory } from '@/composables/useBenchmarkHistory'

  // Utilities
  import { toRef } from 'vue'

  const { composable } = defineProps<{
    composable: string
  }>()

  const { history } = useBenchmarkHistory(() => composable)

  const subtitle = toRef(() => {
    const h = history.value
    if (!h) return ''
    return `${h.versionsSpanned[0]} → current`
  })

  function deltaClass (delta: number): string {
    if (delta > 5) return 'text-success'
    if (delta < -5) return 'text-error'
    return 'text-on-surface-variant'
  }

  function deltaLabel (delta: number): string {
    const sign = delta > 0 ? '+' : (delta < 0 ? '' : '±')
    return `${sign}${delta.toFixed(1)}%`
  }
</script>

<template>
  <div v-if="history" class="markdown-body mt-8">
    <DocsHeaderAnchor id="benchmark-history" tag="h3">Performance over time</DocsHeaderAnchor>

    <p class="text-sm text-on-surface-variant">{{ subtitle }}</p>

    <div class="space-y-4">
      <div
        v-for="group in history.groups"
        :key="group.name"
        class="space-y-1"
      >
        <div class="text-xs uppercase tracking-wide text-on-surface-variant">
          {{ group.name }}
        </div>

        <div class="space-y-1">
          <div
            v-for="bench in group.benchmarks"
            :key="bench.name"
            class="flex items-center gap-3 py-1"
          >
            <span class="text-sm text-on-surface flex-1 truncate">{{ bench.name }}</span>

            <BenchmarkSparkline
              :points="bench.points.map(p => ({ label: p.version, value: p.hz, isCurrent: p.isCurrent }))"
              :tier="bench.points.at(-1)!.tier"
            />

            <code class="text-xs whitespace-nowrap w-16 text-right" :class="deltaClass(bench.delta)">
              {{ deltaLabel(bench.delta) }}
            </code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
