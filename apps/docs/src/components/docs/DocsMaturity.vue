<script setup lang="ts">
  import maturityData from '#v0/maturity.json'

  // Framework
  import { createDataTable } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  // Types
  type Level = 'draft' | 'preview' | 'stable' | 'mature' | 'deprecated'

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
    draft: { icon: 'circle-outline', color: '#9ca3af', label: 'Draft', order: 0 },
    preview: { icon: 'beaker', color: '#f59e0b', label: 'Preview', order: 1 },
    stable: { icon: 'shield', color: '#3b82f6', label: 'Stable', order: 2 },
    mature: { icon: 'check-decagram', color: '#22c55e', label: 'Mature', order: 3 },
    deprecated: { icon: 'alert-circle', color: '#ef4444', label: 'Deprecated', order: 4 },
  }

  const levelKeys: Level[] = ['draft', 'preview', 'stable', 'mature', 'deprecated']

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

  // Type filter
  type ItemType = 'composable' | 'component'
  const activeType = shallowRef<ItemType | null>(null)

  function onToggleType (type: ItemType) {
    activeType.value = activeType.value === type ? null : type
  }

  // Level filter chips state
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
    activeType.value = null
  }

  // Filtered items based on type + level chips
  const filtered = toRef(() => {
    let result = allItems
    if (activeType.value) {
      result = result.filter(item => item.type === activeType.value)
    }
    if (activeFilters.value.size > 0) {
      result = result.filter(item => activeFilters.value.has(item.level))
    }
    return result
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

  const anyOpen = toRef(() => {
    return table.grouping.groups.value.some(g => table.grouping.isOpen(g.key))
  })

  const expanded = toRef(() => {
    const groups = table.grouping.groups.value
    return groups.length > 0 && groups.every(g => table.grouping.isOpen(g.key))
  })

  function onToggleAll () {
    if (expanded.value) {
      table.grouping.closeAll()
    } else {
      table.grouping.openAll()
    }
  }

  // Sort indicator
  function sortIcon (key: string): string {
    const dir = table.sort.direction(key)
    if (dir === 'asc') return '\u2191'
    if (dir === 'desc') return '\u2193'
    return ''
  }

  // Weighted color blend for a group
  function blend (items: Record<string, unknown>[]): string {
    const counts: Record<Level, number> = { draft: 0, preview: 0, stable: 0, mature: 0, deprecated: 0 }
    for (const item of items) counts[(item as MaturityItem).level]++
    const total = items.length
    let r = 0
    let g = 0
    let b = 0
    for (const key of levelKeys) {
      if (counts[key] === 0) continue
      const weight = counts[key] / total
      const hex = levels[key].color
      r += Number.parseInt(hex.slice(1, 3), 16) * weight
      g += Number.parseInt(hex.slice(3, 5), 16) * weight
      b += Number.parseInt(hex.slice(5, 7), 16) * weight
    }
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
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
      to: 'Preview',
      requirements: 'Has unit tests, has documentation page, at least one working example.',
    },
    {
      from: 'Preview',
      to: 'Stable',
      requirements: 'Edge-case test coverage, SSR safe or explicitly browser-only, accessibility reviewed, API unchanged for 2+ releases, benchmarked if performance-critical.',
    },
    {
      from: 'Stable',
      to: 'Mature',
      requirements: 'Used in production downstream (e.g. Vuetify 4), adapter ecosystem (if applicable), API frozen — breaking changes require major version.',
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
    <!-- Type toggles -->
    <div class="flex flex-wrap items-center gap-2 mt-2 mb-3">
      <button
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border cursor-pointer transition-all"
        :class="activeType === 'composable'
          ? 'border-primary bg-primary/15 text-primary opacity-100'
          : 'border-divider text-on-surface-variant opacity-70 hover:opacity-100'"
        @click="onToggleType('composable')"
      >
        <AppIcon icon="code" :size="12" />
        Composables
      </button>

      <button
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border cursor-pointer transition-all"
        :class="activeType === 'component'
          ? 'border-info bg-info/15 text-info opacity-100'
          : 'border-divider text-on-surface-variant opacity-70 hover:opacity-100'"
        @click="onToggleType('component')"
      >
        <AppIcon icon="puzzle" :size="12" />
        Components
      </button>
    </div>

    <!-- Level chips -->
    <div class="flex flex-wrap items-center gap-2 mb-5">
      <button
        v-for="(config, key) in levels"
        :key="key"
        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer transition-all"
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
        <AppIcon :icon="config.icon" :size="14" />
        {{ config.label }}
      </button>

      <button
        class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-divider text-on-surface-variant bg-transparent cursor-pointer transition-colors hover:bg-surface-variant"
        :class="activeFilters.size > 0 || activeType ? 'visible' : 'invisible'"
        @click="onClearFilters"
      >
        <AppIcon icon="close" :size="14" />
        Clear
      </button>
    </div>

    <!-- Search + expand toggle -->
    <div class="flex items-center gap-2 mb-4">
      <input
        class="flex-1 px-4 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm placeholder-on-surface-variant/50 outline-none transition-colors focus:border-primary"
        placeholder="Search by name, type, or category..."
        type="text"
        :value="table.query.value"
        @input="onSearch"
      >

      <button
        class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-on-surface-variant bg-transparent border-0 cursor-pointer transition-colors hover:text-on-surface whitespace-nowrap"
        @click="onToggleAll"
      >
        <AppIcon :icon="expanded ? 'combine' : 'split'" :size="14" />
        {{ expanded ? 'Collapse all' : 'Expand all' }}
      </button>
    </div>

    <!-- Data table -->
    <div class="relative mb-6">
      <AppDotGrid :coverage="30" :density="20" origin="top right" />

      <table class="relative z-1 w-full border-collapse table-fixed">
        <colgroup>
          <col class="w-[30%]">
          <col class="w-[18%]">
          <col class="w-[20%]">
          <col class="w-[20%]">
          <col class="w-[12%]">
        </colgroup>

        <thead>
          <tr v-if="anyOpen">
            <th
              v-for="col in table.columns"
              :key="col.key"
              class="py-2 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide cursor-pointer select-none hover:text-on-surface transition-colors"
              :class="col.key === 'name' ? '!pl-[34px] pr-4' : 'px-4'"
              @click="col.sortable ? table.sort.toggle(col.key) : undefined"
            >
              {{ col.title }}
              <span v-if="col.sortable" class="ml-0.5 text-primary">{{ sortIcon(col.key) }}</span>
            </th>
          </tr>
          <tr v-else>
            <td class="py-2 px-4 text-xs text-on-surface-variant/50 italic" :colspan="table.columns.length">
              <div class="flex items-center gap-2">
                Select a group to see individual items
                <span class="flex-1" />
                <span
                  class="inline-block size-2.5 min-w-2.5 rounded-full shrink-0"
                  :style="{ backgroundColor: blend(filtered) }"
                />
              </div>
            </td>
          </tr>
        </thead>

        <template v-for="(group, index) in table.grouping.groups.value" :key="group.key">
          <!-- Group divider -->
          <tbody v-if="index > 0">
            <tr>
              <td class="!p-0" :colspan="table.columns.length">
                <hr class="border-divider m-0">
              </td>
            </tr>
          </tbody>

          <!-- Group header row -->
          <tbody>
            <tr
              class="cursor-pointer transition-colors hover:bg-surface-variant/30"
              @click="table.grouping.toggle(group.key)"
            >
              <td class="px-4 py-2.5" :colspan="table.columns.length">
                <div class="flex items-center gap-2 text-sm font-semibold text-on-surface">
                  <AppIcon
                    class="transition-transform"
                    :class="table.grouping.isOpen(group.key) ? 'rotate-90' : ''"
                    icon="chevron-right"
                    :size="14"
                  />

                  <span class="capitalize">{{ group.key }}</span>

                  <span class="text-on-surface-variant font-normal">({{ group.items.length }})</span>

                  <span class="flex-1" />

                  <!-- Blended readiness dot -->
                  <span
                    class="inline-block size-2.5 min-w-2.5 rounded-full shrink-0"
                    :style="{ backgroundColor: blend(group.items) }"
                  />
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Group items -->
          <tbody v-if="table.grouping.isOpen(group.key)">
            <tr
              v-for="item in group.items"
              :key="item.id"
              class="bg-glass-surface transition-colors hover:bg-surface-variant/80"
            >
              <!-- Name -->
              <td class="!pl-[34px] pr-4 py-2.5 text-sm font-medium text-on-surface truncate">
                {{ item.name }}
              </td>

              <!-- Type badge -->
              <td class="px-4 py-2.5">
                <span
                  class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="item.type === 'composable'
                    ? 'bg-primary/15 text-primary'
                    : 'bg-info/15 text-info'"
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
              <td class="px-4 py-2.5 text-sm font-mono">
                <a
                  class="text-primary no-underline hover:underline"
                  :href="`/releases/?version=v${item.since}`"
                >v{{ item.since }}</a>
              </td>
            </tr>
          </tbody>
        </template>

        <!-- Empty state -->
        <tbody v-if="table.grouping.groups.value.length === 0">
          <tr>
            <td class="px-4 py-8 text-center text-on-surface-variant text-sm" :colspan="table.columns.length">
              No items match your search or filters.
            </td>
          </tr>
        </tbody>

        <!-- Total row -->
        <tfoot>
          <tr class="bg-surface-tint">
            <td class="px-4 py-3" :colspan="table.columns.length">
              <div class="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                <span
                  v-for="(config, key) in levels"
                  :key="key"
                  class="inline-flex items-center gap-1"
                  :style="{ color: config.color }"
                >
                  <AppIcon :icon="config.icon" :size="12" />
                  {{ summary[key] }} {{ config.label.toLowerCase() }}
                </span>

                <span class="flex-1" />

                <span class="font-semibold text-on-surface">
                  {{ filtered.length }} total
                </span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
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
