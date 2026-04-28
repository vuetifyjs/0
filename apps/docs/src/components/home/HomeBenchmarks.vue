<script setup lang="ts">
  import testCountData from 'virtual:test-count'

  // Framework
  import { useIntersectionObserver } from '@vuetify/v0'

  // Composables
  import { TIER_CONFIG, useBenchmarkData } from '@/composables/useBenchmarkData'
  import { useCountUp } from '@/composables/useCountUp'

  // Utilities
  import { computed, shallowRef } from 'vue'

  const sectionRef = shallowRef<HTMLElement>()
  const visible = shallowRef(false)
  const { stop } = useIntersectionObserver(sectionRef, entries => {
    if (entries[0]?.isIntersecting) {
      visible.value = true
      stop()
    }
  })

  const { composables, summary } = useBenchmarkData({ trigger: visible })

  const peakOps = computed(() => {
    let max = 0
    for (const c of composables.value) {
      if (c.fastest.hz > max) max = c.fastest.hz
    }
    return Math.floor(max / 1_000_000)
  })

  const { current: opsCount } = useCountUp(sectionRef, peakOps, { duration: 1500 })
  const { current: benchmarkCount } = useCountUp(sectionRef, () => summary.value.totalBenchmarks, { duration: 1800 })
  const flooredTestCount = Math.floor(testCountData.tests / 100) * 100
  const { current: testCount } = useCountUp(sectionRef, flooredTestCount, { duration: 2000 })

  const composablePaths: Record<string, string> = {
    createFilter: '/composables/data/create-filter',
    createNested: '/composables/selection/create-nested',
    createRegistry: '/composables/registration/create-registry',
    createTokens: '/composables/registration/create-tokens',
    createVirtual: '/composables/data/create-virtual',
    useDate: '/composables/plugins/use-date',
  }

  const tierDescriptions: Record<string, string> = {
    blazing: '100K+ ops/s — handles massive datasets with zero perceptible delay',
    fast: '10K–100K ops/s — smooth performance for typical application workloads',
    good: '1K–10K ops/s — reliable for standard use cases and smaller datasets',
    slow: '<1K ops/s — performance bottleneck, needs investigation',
  }

  const showcaseComposables = computed(() => composables.value.filter(c => c.name in composablePaths).slice(0, 6))
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
        class="relative overflow-hidden p-6 rounded-xl border bg-surface text-center"
        :style="{ '--reveal-index': 0 }"
      >
        <AppDotGrid :coverage="60" :density="12" origin="top left" />

        <div class="relative stat-number">{{ opsCount }}M+</div>
        <div class="relative stat-label">ops/s peak</div>
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
        <AppIcon icon="right" :size="12" />
      </router-link>
    </div>
  </section>
</template>
