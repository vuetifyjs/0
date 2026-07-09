<script setup lang="ts">
  // Composables
  import { TIER_CONFIG, type Tier } from '@/composables/useBenchmarkData'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ID } from '@vuetify/v0'

  const props = defineProps<{
    searchQuery: string
    selectedTiers: Set<ID>
    sortBy: 'hz' | 'mean' | 'rme'
    totalVisible: number
    totalAll: number
    allExpanded: boolean
    showExpand: boolean
  }>()

  const emit = defineEmits<{
    'update:searchQuery': [value: string]
    'toggle-tier': [tier: Tier]
    'update:sortBy': [value: 'hz' | 'mean' | 'rme']
    'clear-filters': []
    'toggle-expand': []
  }>()

  const tiers: Tier[] = ['blazing', 'fast', 'good', 'slow']

  const sortOptions: { value: 'hz' | 'mean' | 'rme', label: string }[] = [
    { value: 'hz', label: 'Throughput' },
    { value: 'mean', label: 'Latency' },
    { value: 'rme', label: 'Margin' },
  ]

  const hasActiveFilters = toRef(() =>
    props.searchQuery !== ''
    || props.selectedTiers.size > 0,
  )

  const isFiltered = toRef(() => props.totalVisible < props.totalAll)
</script>

<template>
  <div>
    <!-- Sort toggles -->
    <div aria-label="Sort by" class="flex flex-wrap items-center gap-2 mt-2 mb-3" role="radiogroup">
      <button
        v-for="opt in sortOptions"
        :key="opt.value"
        :aria-checked="sortBy === opt.value"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border cursor-pointer transition-all"
        :class="sortBy === opt.value
          ? 'border-primary text-primary bg-primary/10 opacity-100'
          : 'border-divider text-on-surface-variant opacity-70 hover:opacity-100'"
        role="radio"
        @click="emit('update:sortBy', opt.value)"
      >
        <AppIcon v-if="sortBy === opt.value" icon="sort" :size="12" />
        {{ opt.label }}
      </button>
    </div>

    <!-- Tier chips -->
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <button
        v-for="tier in tiers"
        :key="tier"
        :aria-pressed="selectedTiers.has(tier)"
        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border border-current cursor-pointer transition-all"
        :class="[
          TIER_CONFIG[tier].color,
          selectedTiers.size === 0 || selectedTiers.has(tier) ? 'opacity-100' : 'opacity-40',
          selectedTiers.has(tier) ? 'bg-current/10' : 'bg-transparent',
        ]"
        @click="emit('toggle-tier', tier)"
      >
        <AppIcon :icon="TIER_CONFIG[tier].icon" :size="14" />
        {{ TIER_CONFIG[tier].label }}
      </button>

      <button
        class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-divider text-on-surface-variant bg-transparent cursor-pointer transition-colors hover:bg-surface-variant"
        :class="hasActiveFilters ? 'visible' : 'invisible'"
        @click="emit('clear-filters')"
      >
        <AppIcon icon="close" :size="14" />
        Clear
      </button>

      <span
        v-if="isFiltered"
        aria-live="polite"
        class="ml-auto text-xs text-on-surface-variant"
      >
        {{ totalVisible }} of {{ totalAll }}
      </span>
    </div>

    <!-- Search + expand toggle -->
    <div class="flex items-center gap-2 mb-4">
      <input
        aria-label="Search benchmarks"
        class="flex-1 px-4 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm placeholder-on-surface-variant/50 outline-none transition-colors focus:border-primary"
        placeholder="Search benchmarks..."
        type="search"
        :value="searchQuery"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      >

      <button
        v-if="showExpand"
        class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-on-surface-variant bg-transparent border-0 cursor-pointer transition-colors hover:text-on-surface whitespace-nowrap"
        @click="emit('toggle-expand')"
      >
        <AppIcon :icon="allExpanded ? 'combine' : 'split'" :size="14" />
        {{ allExpanded ? 'Collapse all' : 'Expand all' }}
      </button>
    </div>
  </div>
</template>
