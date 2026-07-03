<script setup lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

  // Composables
  import { TIER_BG, formatHz, type NormalizedBenchmark } from '@/composables/useBenchmarkData'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { HistoryPoint } from '@/composables/useBenchmarkHistory'

  const props = defineProps<{
    benchmark: NormalizedBenchmark
    isFastest: boolean
    historyPoints?: HistoryPoint[]
    historyDelta?: number
  }>()

  const barColor = toRef(() => TIER_BG[props.benchmark.tier])

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

    <!-- Trend -->
    <td v-if="historyPoints" class="py-2 pr-3 text-right hidden lg:table-cell">
      <div class="inline-flex items-center gap-2 justify-end">
        <Tooltip.Root :close-delay="100" :open-delay="300">
          <Tooltip.Activator as="span" class="inline-flex cursor-help">
            <BenchmarkSparkline
              :height="18"
              :points="historyPoints.map(p => ({ label: p.version, value: p.hz, isCurrent: p.isCurrent }))"
              :tier="benchmark.tier"
              :width="64"
            />
          </Tooltip.Activator>

          <Tooltip.Content
            class="bg-surface text-on-surface border border-divider rounded shadow-lg px-3 py-2 text-xs text-left"
            :style="{ margin: '6px 0' }"
          >
            <div class="flex flex-col gap-1">
              <div
                v-for="p in historyPoints"
                :key="p.version"
                class="flex items-center justify-between gap-4"
              >
                <span :class="p.isCurrent ? 'font-medium text-on-surface' : 'text-on-surface-variant'">{{ p.version }}</span>
                <code class="text-on-surface">{{ formatHz(p.hz) }}</code>
              </div>

              <div
                v-if="historyDelta !== undefined"
                class="flex items-center justify-between gap-4 mt-1 pt-1 border-t border-divider"
              >
                <span class="text-on-surface-variant">Trend</span>
                <span :class="deltaClass(historyDelta)">{{ deltaLabel(historyDelta) }}</span>
              </div>
            </div>
          </Tooltip.Content>
        </Tooltip.Root>

        <span v-if="historyDelta !== undefined" class="text-xs whitespace-nowrap" :class="deltaClass(historyDelta)">
          {{ deltaLabel(historyDelta) }}
        </span>
      </div>
    </td>

    <td v-else-if="historyDelta !== undefined" class="py-2 pr-3 text-right hidden lg:table-cell">
      <span class="text-xs text-on-surface-variant">—</span>
    </td>

    <!-- Margin -->
    <td class="py-2 pr-4 text-right hidden md:table-cell">
      <span class="text-xs text-on-surface-variant">±{{ benchmark.rme.toFixed(1) }}%</span>
    </td>
  </tr>
</template>
