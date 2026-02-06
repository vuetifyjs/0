<script setup lang="ts">
  // Composables
  import { GROUP_DESCRIPTIONS, TIER_CONFIG, type NormalizedGroup, type Tier } from '@/composables/useBenchmarkData'

  // Utilities
  import { computed } from 'vue'

  const props = defineProps<{
    group: NormalizedGroup
    expanded: boolean
    tier: Tier
  }>()

  const emit = defineEmits<{
    'update:expanded': [value: boolean]
  }>()

  const tierConfig = computed(() => TIER_CONFIG[props.tier])
  const contentId = computed(() => `benchmark-group-${props.group.id}`)
  const description = computed(() => {
    const parts = props.group.name.split(' > ')
    const key = parts[parts.length - 1]!.toLowerCase()
    return GROUP_DESCRIPTIONS[key]
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
              :is-fastest="b.diffFromFastest === null"
              :tier="tier"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
