<script setup lang="ts">
  // Framework
  import { isUndefined } from '@vuetify/v0'

  // Composables
  import { GROUP_DESCRIPTIONS, TIER_CONFIG, type NormalizedGroup, type TierState } from '@/composables/useBenchmarkData'
  import { significant, useBenchmarkHistory } from '@/composables/useBenchmarkHistory'

  // Utilities
  import { computed, toRef } from 'vue'

  // Types
  import type { HistoryPoint } from '@/composables/useBenchmarkHistory'

  const props = defineProps<{
    group: NormalizedGroup
    expanded: boolean
    tier: TierState
  }>()

  const emit = defineEmits<{
    'update:expanded': [value: boolean]
  }>()

  const tierConfig = toRef(() => TIER_CONFIG[props.tier])
  const contentId = toRef(() => `benchmark-group-${props.group.id}`)
  const description = computed(() => {
    const parts = props.group.name.split(' > ')
    const key = parts.at(-1)!.toLowerCase()
    return GROUP_DESCRIPTIONS[key]
  })

  const { history } = useBenchmarkHistory(() => props.group.composable)

  const historyByBench = toRef(() => {
    const h = history.value
    if (!h) return null
    const match = h.groups.find(g => g.name === props.group.name.split(' > ').pop())
    if (!match) return null
    const map = new Map<string, { points: HistoryPoint[], delta: number }>()
    for (const bench of match.benchmarks) {
      map.set(bench.name, { points: bench.points, delta: bench.delta })
    }
    return map
  })

  /**
   * Benchmarks whose trend clears their own error bars, split by direction.
   * Null when nothing in the group moved — a badge that renders "0 changes" is
   * noise, and the collapsed header should stay quiet when there is no news.
   */
  const changes = computed(() => {
    const map = historyByBench.value
    if (!map) return null

    let up = 0
    let down = 0

    for (const bench of props.group.benchmarks) {
      const delta = map.get(bench.name)?.delta
      if (isUndefined(delta) || !significant(delta, bench.rme)) continue
      if (delta > 0) up++
      else down++
    }

    return up || down ? { up, down } : null
  })

  const since = toRef(() => history.value?.versionsSpanned[0])

  const label = toRef(() => {
    const c = changes.value
    if (!c) return undefined
    const parts: string[] = []
    if (c.up) parts.push(`${c.up} faster`)
    if (c.down) parts.push(`${c.down} slower`)
    return `${parts.join(', ')} beyond measurement variance since ${since.value ?? 'the first recorded run'}`
  })
</script>

<template>
  <div class="border border-divider rounded-lg overflow-hidden">
    <!-- Group header -->
    <button
      :aria-controls="contentId"
      :aria-expanded="expanded"
      class="w-full flex items-center gap-3 px-4 py-3 text-left bg-surface hover:bg-surface-tint transition-colors"
      @click="emit('update:expanded', !expanded)"
    >
      <AppIcon
        class="text-on-surface-variant shrink-0 transition-transform duration-200"
        :class="expanded ? 'rotate-90' : ''"
        icon="chevron-right"
        :size="16"
      />

      <div class="flex-1 min-w-0">
        <span class="font-medium text-sm text-on-surface">{{ group.name }}</span>
        <span class="ml-2 text-xs text-on-surface-variant">{{ group.benchmarks.length }}</span>
      </div>

      <span
        v-if="changes"
        :aria-label="label"
        class="flex items-center gap-1.5 shrink-0"
        role="img"
        :title="label"
      >
        <span v-if="changes.up" class="inline-flex items-center gap-0.5 text-xs text-success">
          <AppIcon icon="trending-up" :size="14" />{{ changes.up }}
        </span>

        <span v-if="changes.down" class="inline-flex items-center gap-0.5 text-xs text-error">
          <AppIcon icon="trending-down" :size="14" />{{ changes.down }}
        </span>
      </span>

      <code class="text-xs text-on-surface-variant shrink-0 hidden sm:inline">
        {{ group.fastest.hzLabel }}
      </code>

      <span class="hidden sm:inline-flex items-center gap-1.5 shrink-0" :class="tierConfig.color">
        <AppIcon :icon="tierConfig.icon" :size="14" />
      </span>
    </button>

    <!-- Group content -->
    <div
      v-if="expanded"
      :id="contentId"
      aria-label="Benchmark results"
      role="region"
    >
      <div v-if="description" class="px-4 py-2.5 text-sm text-on-surface-variant bg-surface-variant/20">
        {{ description }}
      </div>

      <div class="overflow-x-auto">
        <table class="w-full !rounded-0 !border-none">
          <thead>
            <tr class="bg-surface-variant/30">
              <th class="text-left text-xs font-medium text-on-surface-variant px-4 py-2" scope="col">
                Operation
              </th>

              <th class="text-left text-xs font-medium text-on-surface-variant px-4 py-2 min-w-48" scope="col">
                Throughput
              </th>

              <th class="text-right text-xs font-medium text-on-surface-variant px-4 py-2 hidden md:table-cell" scope="col">
                Latency
              </th>

              <th class="text-right text-xs font-medium text-on-surface-variant px-4 py-2 hidden lg:table-cell" scope="col">
                vs Fastest
              </th>

              <th
                v-if="historyByBench"
                class="text-right text-xs font-medium text-on-surface-variant px-4 py-2 hidden lg:table-cell"
                scope="col"
              >
                Trend
              </th>

              <th class="text-right text-xs font-medium text-on-surface-variant px-4 py-2 hidden md:table-cell" scope="col">
                Margin
              </th>
            </tr>
          </thead>

          <tbody>
            <BenchmarkRow
              v-for="b in group.benchmarks"
              :key="b.id"
              :benchmark="b"
              class="px-4"
              :history-delta="historyByBench?.get(b.name)?.delta"
              :history-points="historyByBench?.get(b.name)?.points"
              :is-fastest="b.diffFromFastest === null"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
