<script setup lang="ts">
  // Composables
  import { useBenchmarkData } from '@/composables/useBenchmarkData'

  // Utilities
  import { computed, toRef, watch } from 'vue'

  const {
    composable,
    hideFilters,
    hideSummary,
  } = defineProps<{
    /** Restrict to a single composable (embed mode) */
    composable?: string
    /** Hide the filter bar */
    hideFilters?: boolean
    /** Hide summary cards */
    hideSummary?: boolean
  }>()

  const {
    isLoading,
    composables,
    filteredGroups,
    summary,
    filter,
    composableSelection,
    tierSelection,
    sortBy,
    expandedGroups,
    expandAll,
    collapseAll,
    clearFilters,
  } = useBenchmarkData({ composable: () => composable })

  // Groups start collapsed; expand on demand or when a search is active
  watch(toRef(() => filter.query.value), query => {
    if (query) {
      expandAll()
    }
  })

  const allExpanded = computed(() =>
    filteredGroups.value.length > 0
    && filteredGroups.value.every(g => expandedGroups.selected(g.id)),
  )

  // Composable selection: register items and use toggle
  function onComposableSelect (name: string) {
    if (!composableSelection.has(name)) {
      composableSelection.register({ id: name })
    }
    composableSelection.toggle(name)
  }

  // Expand/collapse: register group and toggle
  function onGroupToggle (id: string) {
    if (!expandedGroups.has(id)) {
      expandedGroups.register({ id })
    }
    expandedGroups.toggle(id)
  }

  // Tier facet: register tier and toggle
  function onTierToggle (tier: string) {
    if (!tierSelection.has(tier)) {
      tierSelection.register({ id: tier })
    }
    tierSelection.toggle(tier)
  }

  // Derive selected composable names from group selectedIds
  const selectedComposableNames = toRef(() => Array.from(composableSelection.selectedIds) as string[])

  // Count benchmarks currently passing all filters (for the "N of M" status)
  const visibleBenchmarkCount = toRef(() =>
    filteredGroups.value.reduce((sum, group) => sum + group.benchmarks.length, 0),
  )
</script>

<template>
  <div aria-label="Benchmark explorer" class="space-y-4" role="region">
    <!-- Loading state -->
    <DocsSkeleton v-if="isLoading" class="h-48" />

    <template v-else-if="composables.length > 0">
      <!-- Summary cards -->
      <BenchmarkSummaryCards
        v-if="!hideSummary && composables.length > 1"
        :composables
        :selected-composables="selectedComposableNames"
        @select="onComposableSelect"
      />

      <!-- Aggregate stat -->
      <div
        v-if="!hideSummary && composables.length > 1"
        class="flex items-center gap-3 text-xs text-on-surface-variant"
      >
        <span>{{ summary.totalBenchmarks }} benchmarks</span>
        <span class="text-divider">&middot;</span>
        <span>{{ summary.totalGroups }} groups</span>
        <span class="text-divider">&middot;</span>
        <span>{{ summary.composableCount }} composables</span>
      </div>

      <!-- Filters -->
      <BenchmarkFilters
        v-if="!hideFilters"
        :all-expanded
        :search-query="String(filter.query.value)"
        :selected-tiers="tierSelection.selectedIds"
        :show-expand="filteredGroups.length > 1"
        :sort-by
        :total-all="summary.totalBenchmarks"
        :total-visible="visibleBenchmarkCount"
        @clear-filters="clearFilters"
        @toggle-expand="allExpanded ? collapseAll() : expandAll()"
        @toggle-tier="onTierToggle"
        @update:search-query="filter.query.value = $event"
        @update:sort-by="sortBy = $event"
      />

      <!-- Groups -->
      <div class="space-y-2">
        <BenchmarkGroup
          v-for="group in filteredGroups"
          :key="group.id"
          :expanded="expandedGroups.selected(group.id)"
          :group
          :tier="group.tier"
          @update:expanded="onGroupToggle(group.id)"
        />
      </div>

      <!-- Empty filter state -->
      <div
        v-if="filteredGroups.length === 0"
        class="py-12 text-center"
      >
        <p class="text-sm text-on-surface-variant">No benchmarks match your filters.</p>

        <button
          class="mt-2 text-sm text-primary hover:underline"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>
    </template>
  </div>
</template>
