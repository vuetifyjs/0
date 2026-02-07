<script setup lang="ts">
  // Composables
  import { TIER_CONFIG, useBenchmarkData } from '@/composables/useBenchmarkData'
  import { useCountUp } from '@/composables/useCountUp'

  // Utilities
  import { computed, shallowRef } from 'vue'

  const { composables, summary } = useBenchmarkData()

  const sectionRef = shallowRef<HTMLElement>()
  const { current: opsCount } = useCountUp(sectionRef, 100, { duration: 1500 })
  const benchmarkCount = computed(() => summary.value.totalBenchmarks)
  const { current: testCount } = useCountUp(sectionRef, 2600, { duration: 2000 })

  const composablePaths: Record<string, string> = {
    createFilter: '/composables/utilities/create-filter',
    createNested: '/composables/selection/create-nested',
    createRegistry: '/composables/registration/create-registry',
    createTokens: '/composables/registration/create-tokens',
    createVirtual: '/composables/utilities/create-virtual',
    useDate: '/composables/plugins/use-date',
  }

  const tierDescriptions: Record<string, string> = {
    blazing: '100K+ ops/s — handles massive datasets with zero perceptible delay',
    fast: '10K–100K ops/s — smooth performance for typical application workloads',
    good: '1K–10K ops/s — reliable for standard use cases and smaller datasets',
  }

  const showcaseComposables = computed(() =>
    composables.value.slice(0, 6),
  )
</script>

<template>
  <section ref="sectionRef" class="home-benchmarks py-20 md:py-28">
    <div class="text-center mb-12">
      <p class="section-overline mb-3">PERFORMANCE PROVEN</p>

      <h2 class="text-2xl md:text-4xl font-bold tracking-tight mb-4">
        We publish our benchmarks
      </h2>

      <p class="opacity-60 max-w-[640px] mx-auto leading-relaxed">
        Every composable is profiled across dataset sizes. Browse results in the interactive Benchmark Explorer.
      </p>
    </div>

    <!-- Stat cards -->
    <div
      class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
    >
      <div
        class="p-6 rounded-xl border bg-surface text-center"
        :style="{ '--reveal-index': 0 }"
      >
        <div class="stat-number">{{ opsCount }}K+</div>
        <div class="stat-label">ops/s peak</div>
      </div>

      <div
        class="p-6 rounded-xl border bg-surface text-center"
        :style="{ '--reveal-index': 1 }"
      >
        <div class="stat-number">{{ benchmarkCount }}</div>
        <div class="stat-label">benchmark scenarios</div>
      </div>

      <div
        class="relative overflow-hidden p-6 rounded-xl border bg-surface text-center"
        :style="{ '--reveal-index': 2 }"
      >
        <AppDotGrid :coverage="60" :density="12" />

        <div class="relative stat-number">{{ testCount }}+</div>
        <div class="relative stat-label">unit tests</div>
      </div>
    </div>

    <!-- Mini benchmark grid -->
    <div
      v-if="showcaseComposables.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
    >
      <router-link
        v-for="(comp, i) in showcaseComposables"
        :key="comp.name"
        class="p-6 rounded-xl border bg-surface hover:border-primary hover:bg-surface-tint hover:shadow-md transition-all duration-150 flex items-center justify-between"
        :style="{ '--reveal-index': i }"
        :to="`${composablePaths[comp.name] ?? '/guide/fundamentals/benchmarks'}#benchmarks`"
      >
        <div>
          <div class="font-mono text-sm font-semibold mb-1">{{ comp.name }}</div>
          <div class="text-xs opacity-60">{{ comp.fastest.hzLabel }}</div>
        </div>

        <BenchmarkTierBadge size="sm" :tier="comp.tier" />
      </router-link>
    </div>

    <!-- Tier legend + CTA -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-6 text-sm">
        <span
          v-for="(config, tier) in TIER_CONFIG"
          :key="tier"
          class="inline-flex items-center gap-1"
          :class="config.color"
          :title="tierDescriptions[tier]"
        >
          <AppIcon :icon="config.icon" :size="14" />
          {{ config.label }}
        </span>
      </div>

      <router-link
        class="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
        to="/guide/fundamentals/benchmarks"
      >
        Learn more about benchmarks
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </router-link>
    </div>
  </section>
</template>
