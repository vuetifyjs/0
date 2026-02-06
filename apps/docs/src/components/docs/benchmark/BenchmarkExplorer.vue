<script setup lang="ts">
  // Composables
  import { useBenchmarkData, type Tier } from '@/composables/useBenchmarkData'

  // Utilities
  import { computed, toRef, watch } from 'vue'

  const props = withDefaults(defineProps<{
    /** Restrict to a single composable (embed mode) */
    composable?: string
    /** Hide the filter bar */
    hideFilters?: boolean
    /** Hide summary cards */
    hideSummary?: boolean
    /** Start with groups collapsed */
    collapsed?: boolean
  }>(), {
    collapsed: undefined,
  })

  const {
    isLoading,
    composables,
    filteredGroups,
    summary,
    filter,
    composableSelection,
    tierSelection,
    expandedGroups,
    sortBy,
    expandAll,
    collapseAll,
    clearFilters,
  } = useBenchmarkData({ composable: props.composable })

  // Default expand behavior: expand all when not collapsed
  const shouldCollapse = computed(() => props.collapsed ?? !!props.composable)

  // Auto-expand groups when search is active
  watch(toRef(() => filter.query.value), query => {
    if (query) {
      expandAll()
    }
  })

  // Auto-expand all groups when not in collapsed mode and data loads
  watch(filteredGroups, groups => {
    if (!shouldCollapse.value && groups.length > 0 && expandedGroups.selectedIds.size === 0) {
      expandAll()
    }
  }, { once: true })

  // Composable tier lookup
  const composableTiers = computed(() => {
    const map = new Map<string, Tier>()
    for (const c of composables.value) {
      map.set(c.name, c.tier)
    }
    return map
  })

  function getGroupTier (composableName: string): Tier {
    return composableTiers.value.get(composableName) ?? 'good'
  }

  // Visible benchmark count for filter status
  const visibleBenchmarkCount = computed(() =>
    filteredGroups.value.reduce((sum, g) => sum + g.benchmarks.length, 0),
  )

  const allExpanded = computed(() =>
    filteredGroups.value.length > 0
    && filteredGroups.value.every(g => expandedGroups.selected(g.id)),
  )

  // Composable selection: register items and use toggle
  function handleComposableSelect (name: string) {
    if (!composableSelection.has(name)) {
      composableSelection.register({ id: name })
    }
    composableSelection.toggle(name)
  }

  // Tier selection: register items and use toggle
  function handleTierToggle (tier: string) {
    if (!tierSelection.has(tier)) {
      tierSelection.register({ id: tier })
    }
    tierSelection.toggle(tier)
  }

  // Expand/collapse: register group and toggle
  function handleGroupToggle (id: string) {
    if (!expandedGroups.has(id)) {
      expandedGroups.register({ id })
    }
    expandedGroups.toggle(id)
  }

  // Derive selected composable names from group selectedIds
  const selectedComposableNames = computed(() => Array.from(composableSelection.selectedIds))
</script>

<template>
  <div aria-label="Benchmark explorer" class="space-y-4" role="region">
    <!-- Loading state -->
    <DocsSkeleton v-if="isLoading" class="h-48" />

    <template v-else-if="composables.length > 0">
      <!-- Summary cards -->
      <BenchmarkSummaryCards
        v-if="!hideSummary && composables.length > 1"
        :composables="composables"
        :selected-composables="selectedComposableNames"
        @select="handleComposableSelect"
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

      <!-- Filters (commented out for now)
      <BenchmarkFilters
        v-if="!hideFilters"
        :search-query="String(filter.query.value)"
        :selected-tiers="tierSelection.selectedIds"
        :sort-by="sortBy"
        :total-all="summary.totalBenchmarks"
        :total-visible="visibleBenchmarkCount"
        @clear-filters="clearFilters"
        @toggle-tier="handleTierToggle"
        @update:search-query="filter.query.value = $event"
        @update:sort-by="sortBy = $event"
      />
      -->

      <!-- Expand/collapse toggle -->
      <div v-if="filteredGroups.length > 1" class="flex items-center justify-end">
        <button
          class="text-xs text-on-surface-variant hover:text-primary transition-colors"
          @click="allExpanded ? collapseAll() : expandAll()"
        >
          {{ allExpanded ? 'Collapse all' : 'Expand all' }}
        </button>
      </div>

      <!-- Groups -->
      <div class="space-y-2">
        <BenchmarkGroup
          v-for="group in filteredGroups"
          :key="group.id"
          :expanded="expandedGroups.selected(group.id)"
          :group="group"
          :tier="getGroupTier(group.composable)"
          @update:expanded="handleGroupToggle(group.id)"
        />
      </div>

      <!-- Empty filter state (commented out with filters)
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
      -->
    </template>
  </div>
</template>
