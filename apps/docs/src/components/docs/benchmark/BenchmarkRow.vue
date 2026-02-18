<script setup lang="ts">
  // Composables
  import { TIER_BG, type NormalizedBenchmark } from '@/composables/useBenchmarkData'

  // Utilities
  import { computed } from 'vue'

  const props = defineProps<{
    benchmark: NormalizedBenchmark
    isFastest: boolean
  }>()

  const barColor = computed(() => TIER_BG[props.benchmark.tier])
</script>

<template>
  <tr class="group border-b border-divider/50 last:border-b-0">
    <!-- Operation name -->
    <td class="py-2 pl-4 pr-3">
      <span class="flex items-center gap-1.5">
        <AppIcon
          v-if="isFastest"
          aria-label="Fastest in group"
          class="text-error shrink-0"
          icon="fire"
          :size="14"
        />
        <span
          class="text-sm"
          :class="isFastest ? 'font-medium text-on-surface' : 'text-on-surface-variant'"
        >{{ benchmark.name }}</span>
      </span>
    </td>

    <!-- Performance bar + throughput -->
    <td class="py-2 pr-3">
      <div class="flex items-center gap-2">
        <div class="flex-1 h-1.5 bg-surface-variant/50 rounded-full overflow-hidden">
          <div
            aria-label="Relative throughput"
            aria-valuemax="100"
            aria-valuemin="0"
            :aria-valuenow="Math.round(benchmark.relativeHz)"
            class="h-full rounded-full transition-all duration-300"
            :class="[barColor, isFastest ? 'opacity-100' : 'opacity-70']"
            role="meter"
            :style="{ width: `${benchmark.relativeHz}%` }"
          />
        </div>
        <code class="text-xs whitespace-nowrap shrink-0 w-24 text-right">{{ benchmark.hzLabel }}</code>
      </div>
    </td>

    <!-- Latency -->
    <td class="py-2 pr-3 text-right hidden md:table-cell">
      <code class="text-xs">{{ benchmark.meanLabel }}</code>
    </td>

    <!-- vs Fastest -->
    <td class="py-2 pr-3 text-right hidden lg:table-cell">
      <span v-if="benchmark.diffFromFastest === null" class="text-xs text-on-surface-variant">—</span>
      <span v-else class="text-xs text-on-surface-variant">-{{ benchmark.diffFromFastest.toFixed(1) }}%</span>
    </td>

    <!-- Margin -->
    <td class="py-2 pr-4 text-right hidden md:table-cell">
      <span class="text-xs text-on-surface-variant">±{{ benchmark.rme.toFixed(1) }}%</span>
    </td>
  </tr>
</template>
