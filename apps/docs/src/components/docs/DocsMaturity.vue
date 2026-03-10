<script setup lang="ts">
  import maturityData from '#v0/maturity.json'

  // Framework
  import { createDataTable } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  // Types
  type Level = 'draft' | 'experimental' | 'stable' | 'mature' | 'deprecated'

  interface MaturityItem extends Record<string, unknown> {
    id: string
    name: string
    type: 'composable' | 'component'
    category: string
    level: Level
    since: string
    levelOrder: number
  }

  const levels: Record<Level, { icon: string, color: string, label: string, order: number }> = {
    draft: { icon: 'snowflake', color: '#60a5fa', label: 'Draft', order: 0 },
    experimental: { icon: 'flash', color: '#facc15', label: 'Experimental', order: 1 },
    stable: { icon: 'fire', color: '#f97316', label: 'Stable', order: 2 },
    mature: { icon: 'volcano', color: '#ef4444', label: 'Mature', order: 3 },
    deprecated: { icon: 'weather-fog', color: '#9ca3af', label: 'Deprecated', order: 4 },
  }

  const levelKeys: Level[] = ['draft', 'experimental', 'stable', 'mature', 'deprecated']

  // Flatten JSON into MaturityItem[]
  function flatten (): MaturityItem[] {
    const result: MaturityItem[] = []

    for (const [name, entry] of Object.entries(maturityData.composables)) {
      result.push({
        id: `composable-${name}`,
        name,
        type: 'composable',
        category: entry.category,
        level: entry.level,
        since: entry.since,
        levelOrder: levels[entry.level as Level]?.order ?? -1,
      })
    }

    for (const [name, entry] of Object.entries(maturityData.components)) {
      result.push({
        id: `component-${name}`,
        name,
        type: 'component',
        category: entry.category,
        level: entry.level,
        since: entry.since,
        levelOrder: levels[entry.level as Level]?.order ?? -1,
      })
    }

    return result
  }

  const allItems = flatten()

  // Filter chips state
  const activeFilters = shallowRef(new Set<Level>())

  function onToggleFilter (level: Level) {
    const next = new Set(activeFilters.value)
    if (next.has(level)) {
      next.delete(level)
    } else {
      next.add(level)
    }
    activeFilters.value = next
  }

  function onClearFilters () {
    activeFilters.value = new Set()
  }

  // Filtered items based on level chips
  const filtered = toRef(() => {
    if (activeFilters.value.size === 0) return allItems
    return allItems.filter(item => activeFilters.value.has(item.level))
  })

  const table = createDataTable<MaturityItem>({
    items: filtered,
    columns: [
      { key: 'name', title: 'Name', sortable: true, filterable: true },
      { key: 'type', title: 'Type', sortable: true, filterable: true },
      { key: 'category', title: 'Category', sortable: true, filterable: true },
      {
        key: 'levelOrder',
        title: 'Level',
        sortable: true,
        sort: (a, b) => (a as number) - (b as number),
      },
      { key: 'since', title: 'Since', sortable: true },
    ],
    groupBy: 'category',
    pagination: { itemsPerPage: 100 },
  })

  function onSearch (event: Event) {
    table.search((event.target as HTMLInputElement).value)
  }

  // Sort indicator
  function sortIcon (key: string): string {
    const dir = table.sort.direction(key)
    if (dir === 'asc') return '\u2191'
    if (dir === 'desc') return '\u2193'
    return ''
  }

  // Heat map segments for a group
  function heatmap (items: MaturityItem[]): { color: string, percent: number }[] {
    const counts: Record<Level, number> = { draft: 0, experimental: 0, stable: 0, mature: 0, deprecated: 0 }
    for (const item of items) {
      counts[item.level]++
    }
    const total = items.length
    const segments: { color: string, percent: number }[] = []
    for (const key of levelKeys) {
      if (counts[key] > 0) {
        segments.push({ color: levels[key].color, percent: (counts[key] / total) * 100 })
      }
    }
    return segments
  }

  // Summary counts
  const summary = toRef(() => {
    const counts: Record<string, number> = {}
    for (const level of Object.keys(levels)) {
      counts[level] = 0
    }
    for (const item of filtered.value) {
      counts[item.level] = (counts[item.level] ?? 0) + 1
    }
    return counts
  })

  // Graduation criteria
  const criteria = [
    {
      from: 'Draft',
      to: 'Experimental',
      requirements: 'Public API defined, basic tests, at least one working example.',
    },
    {
      from: 'Experimental',
      to: 'Stable',
      requirements: 'Full test coverage, documented API, no known breaking changes planned.',
    },
    {
      from: 'Stable',
      to: 'Mature',
      requirements: 'Used in production (e.g. Vuetify 4), battle-tested, performance benchmarked.',
    },
    {
      from: 'Any',
      to: 'Deprecated',
      requirements: 'Superseded by a better pattern, migration guide provided, removal timeline set.',
    },
  ]
</script>

<template>
  <div>
    <!-- Filter chips -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <button
        v-for="(config, key) in levels"
        :key="key"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border cursor-pointer transition-all"
        :class="activeFilters.size === 0 || activeFilters.has(key as Level)
          ? 'opacity-100'
          : 'opacity-40'"
        :style="{
          borderColor: config.color,
          backgroundColor: activeFilters.has(key as Level)
            ? config.color + '22'
            : 'transparent',
          color: config.color,
        }"
        @click="onToggleFilter(key as Level)"
      >
        <AppIcon :icon="config.icon" :size="16" />
        {{ config.label }}
      </button>

      <button
        v-if="activeFilters.size > 0"
        class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-divider text-on-surface-variant bg-transparent cursor-pointer transition-colors hover:bg-surface-variant"
        @click="onClearFilters"
      >
        <AppIcon icon="close" :size="14" />
        Clear
      </button>
    </div>

    <!-- Search input -->
    <div class="mb-6">
      <input
        class="w-full px-4 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm placeholder-on-surface-variant/50 outline-none transition-colors focus:border-primary"
        placeholder="Search by name, type, or category..."
        type="text"
        :value="table.query.value"
        @input="onSearch"
      >
    </div>

    <!-- Data table -->
    <div class="overflow-hidden mb-6">
      <template v-for="group in table.grouping.groups.value" :key="group.key">
        <!-- Group header -->
        <button
          class="w-full flex items-center gap-2 px-4 py-2.5 bg-surface-variant text-on-surface font-semibold text-sm cursor-pointer border-0 text-left transition-colors hover:bg-surface-variant/80"
          @click="table.grouping.toggle(group.key)"
        >
          <AppIcon
            class="transition-transform"
            :class="table.grouping.isOpen(group.key) ? 'rotate-90' : ''"
            icon="chevron-right"
            :size="14"
          />

          <span class="capitalize">{{ group.key }}</span>

          <span class="text-on-surface-variant font-normal ml-1">({{ group.items.length }})</span>

          <!-- Heat map bar -->
          <span class="flex-1 flex items-center h-1.5 rounded-full overflow-hidden ml-2">
            <span
              v-for="(segment, index) in heatmap(group.items as MaturityItem[])"
              :key="index"
              class="h-full"
              :class="index === 0 ? 'rounded-l-full' : index === heatmap(group.items as MaturityItem[]).length - 1 ? 'rounded-r-full' : ''"
              :style="{ backgroundColor: segment.color, width: segment.percent + '%' }"
            />
          </span>
        </button>

        <!-- Group items -->
        <table
          v-if="table.grouping.isOpen(group.key)"
          class="w-full border-collapse table-fixed"
        >
          <colgroup>
            <col class="w-[30%]">
            <col class="w-[18%]">
            <col class="w-[20%]">
            <col class="w-[20%]">
            <col class="w-[12%]">
          </colgroup>

          <thead>
            <tr class="border-b border-divider">
              <th
                v-for="col in table.columns"
                :key="col.key"
                class="px-4 py-2 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide cursor-pointer select-none hover:text-on-surface transition-colors"
                @click="col.sortable ? table.sort.toggle(col.key) : undefined"
              >
                {{ col.title }}
                <span v-if="col.sortable" class="ml-0.5 text-primary">{{ sortIcon(col.key) }}</span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in group.items"
              :key="item.id"
              class="border-b border-divider last:border-b-0 transition-colors hover:bg-surface-variant/30"
            >
              <!-- Name -->
              <td class="px-4 py-2.5 text-sm font-medium text-on-surface truncate">
                {{ item.name }}
              </td>

              <!-- Type badge -->
              <td class="px-4 py-2.5">
                <span
                  class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="item.type === 'composable'
                    ? 'bg-primary/15 text-primary'
                    : 'bg-accent/15 text-accent'"
                >
                  {{ item.type }}
                </span>
              </td>

              <!-- Category -->
              <td class="px-4 py-2.5 text-sm text-on-surface-variant capitalize">
                {{ item.category }}
              </td>

              <!-- Level badge -->
              <td class="px-4 py-2.5">
                <span
                  class="inline-flex items-center gap-1"
                  :style="{ color: levels[item.level]?.color }"
                >
                  <AppIcon :icon="levels[item.level]?.icon" :size="16" />
                  <span class="text-xs font-medium">{{ levels[item.level]?.label }}</span>
                </span>
              </td>

              <!-- Since -->
              <td class="px-4 py-2.5 text-sm text-on-surface-variant font-mono">
                {{ item.since }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- Empty state -->
      <div
        v-if="table.grouping.groups.value.length === 0"
        class="px-4 py-8 text-center text-on-surface-variant text-sm"
      >
        No items match your search or filters.
      </div>
    </div>

    <!-- Summary bar -->
    <div class="flex flex-wrap items-center gap-4 px-4 py-3 rounded-lg bg-surface-variant/50 mb-8 text-sm">
      <span class="font-semibold text-on-surface">
        {{ filtered.length }} total
      </span>

      <span
        v-for="(config, key) in levels"
        :key="key"
        class="inline-flex items-center gap-1"
        :style="{ color: config.color }"
      >
        <AppIcon :icon="config.icon" :size="14" />
        {{ config.label }}: {{ summary[key] }}
      </span>
    </div>

    <!-- Graduation criteria -->
    <h2 class="text-xl font-bold m-0 mb-4 text-on-surface">Graduation Criteria</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div
        v-for="(item, index) in criteria"
        :key="index"
        class="border border-divider rounded-xl p-4"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm font-semibold text-on-surface-variant">{{ item.from }}</span>
          <AppIcon class="text-on-surface-variant" icon="chevron-right" :size="14" />
          <span class="text-sm font-semibold text-on-surface">{{ item.to }}</span>
        </div>

        <p class="text-sm text-on-surface-variant m-0 leading-relaxed">
          {{ item.requirements }}
        </p>
      </div>
    </div>
  </div>
</template>
