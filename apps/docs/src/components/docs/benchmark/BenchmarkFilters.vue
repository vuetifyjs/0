<script setup lang="ts">
  // Composables
  import { TIER_CONFIG, type Tier } from '@/composables/useBenchmarkData'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { ID } from '@vuetify/v0'

  const props = defineProps<{
    searchQuery: string
    selectedTiers: Set<ID>
    sortBy: 'hz' | 'mean' | 'rme'
    totalVisible: number
    totalAll: number
  }>()

  const emit = defineEmits<{
    'update:searchQuery': [value: string]
    'toggle-tier': [tier: Tier]
    'update:sortBy': [value: 'hz' | 'mean' | 'rme']
    'clear-filters': []
  }>()

  const tiers: Tier[] = ['blazing', 'fast', 'good']

  const sortOptions: { value: 'hz' | 'mean' | 'rme', label: string }[] = [
    { value: 'hz', label: 'Throughput' },
    { value: 'mean', label: 'Latency' },
    { value: 'rme', label: 'Margin' },
  ]

  const hasActiveFilters = computed(() =>
    props.searchQuery !== ''
    || props.selectedTiers.size > 0,
  )

  const isFiltered = computed(() => props.totalVisible < props.totalAll)
</script>

<template>
  <div class="space-y-3">
    <!-- Search + sort row -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Search -->
      <div class="relative flex-1 min-w-48">
        <AppIcon
          class="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
          icon="search"
          :size="16"
        />
        <input
          aria-label="Search benchmarks"
          class="w-full pl-8 pr-3 py-1.5 text-sm bg-surface border border-divider rounded-lg text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary transition-colors"
          placeholder="Search benchmarks..."
          type="search"
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        >
      </div>

      <!-- Sort options -->
      <div class="flex items-center gap-0.5 border border-divider rounded-lg p-0.5 bg-surface" role="radiogroup">
        <button
          v-for="opt in sortOptions"
          :key="opt.value"
          :aria-checked="sortBy === opt.value"
          class="px-2.5 py-1 text-xs font-medium rounded-md transition-colors"
          :class="sortBy === opt.value
            ? 'bg-primary text-on-primary'
            : 'text-on-surface-variant hover:text-on-surface'"
          role="radio"
          @click="emit('update:sortBy', opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Tier filters + status -->
    <div class="flex flex-wrap items-center gap-2">
      <!-- Tier chips -->
      <button
        v-for="tier in tiers"
        :key="tier"
        :aria-pressed="selectedTiers.has(tier)"
        class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border transition-colors"
        :class="selectedTiers.has(tier)
          ? `border-current ${TIER_CONFIG[tier].color} bg-current/10`
          : 'border-divider text-on-surface-variant hover:border-current hover:text-on-surface'"
        @click="emit('toggle-tier', tier)"
      >
        <AppIcon :icon="TIER_CONFIG[tier].icon" :size="12" />
        {{ TIER_CONFIG[tier].label }}
      </button>

      <!-- Status + clear -->
      <div class="ml-auto flex items-center gap-2">
        <span
          v-if="isFiltered"
          aria-live="polite"
          class="text-xs text-on-surface-variant"
        >
          {{ totalVisible }} of {{ totalAll }}
        </span>
        <button
          v-if="hasActiveFilters"
          class="text-xs text-primary hover:underline"
          @click="emit('clear-filters')"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>
