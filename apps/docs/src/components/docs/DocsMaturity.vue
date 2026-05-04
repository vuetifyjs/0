<script setup lang="ts">
  // Framework
  import { createDataTable, createGroup, createSingle } from '@vuetify/v0'

  import maturityData from '#v0/maturity.json'

  // Utilities
  import { toRef } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  type Level = 'draft' | 'preview' | 'stable' | 'mature' | 'deprecated'
  type ItemType = 'composable' | 'component' | 'utility'

  interface MaturityItem extends Record<string, unknown> {
    id: string
    name: string
    type: ItemType
    category: string
    level: Level
    since?: string
    levelOrder: number
    path: string
  }

  function kebab (name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
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
        path: `/composables/${entry.category}/${kebab(name)}`,
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
        path: `/components/${entry.category}/${kebab(name)}`,
      })
    }

    for (const [name, entry] of Object.entries(maturityData.utilities)) {
      result.push({
        id: `utility-${name}`,
        name,
        type: 'utility',
        category: entry.category,
        level: entry.level,
        since: entry.since,
        levelOrder: levels[entry.level as Level]?.order ?? -1,
        path: '/utilities',
      })
    }

    return result
  }

  const allItems = flatten()

  // Type filter
  const typeConfig: Record<ItemType, { icon: string, active: string, label: string }> = {
    composable: { icon: 'code', active: 'border-primary bg-primary/15 text-primary', label: 'Composables' },
    component: { icon: 'puzzle', active: 'border-info bg-info/15 text-info', label: 'Components' },
    utility: { icon: 'typescript', active: 'border-success bg-success/15 text-success', label: 'Utilities' },
  }

  const typeFilter = createSingle()
  const typeTickets = typeFilter.onboard(
    (Object.keys(typeConfig) as ItemType[]).map(key => ({ id: key, value: key })),
  )

  // Level filter
  const levelFilter = createGroup()
  const levelTickets = levelFilter.onboard(
    levelKeys.map(key => ({ id: key, value: key })),
  )

  function onClearFilters () {
    typeFilter.selectedIds.clear()
    levelFilter.unselectAll()
  }

  // Filtered items based on type + level chips
  const filtered = toRef(() => {
    let result = allItems
    const type = typeFilter.selectedValue.value
    if (type) {
      result = result.filter(item => item.type === type)
    }
    if (!levelFilter.isNoneSelected.value) {
      result = result.filter(item => levelFilter.selectedIds.has(item.level))
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
      from: 'draft' as Level,
      to: 'preview' as Level,
      requirements: 'Has unit tests, has documentation page, at least one working example.',
    },
    {
      from: 'preview' as Level,
      to: 'stable' as Level,
      requirements: 'Edge-case test coverage, SSR safe or explicitly browser-only, accessibility reviewed, API unchanged for 2+ releases, benchmarked if performance-critical.',
    },
    {
      from: 'stable' as Level,
      to: 'mature' as Level,
      requirements: 'Used in production downstream (e.g. Vuetify 5), adapter ecosystem (if applicable), API frozen — breaking changes require major version.',
    },
    {
      from: null,
      to: 'deprecated' as Level,
      requirements: 'Superseded by a better pattern, migration guide provided, removal timeline set.',
    },
  ]
</script>

<template>
  <div>
    <!-- Type toggles -->
    <div class="flex flex-wrap items-center gap-2 mt-2 mb-3">
      <button
        v-for="ticket in typeTickets"
        :key="ticket.id"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border cursor-pointer transition-all"
        :class="ticket.isSelected.value
          ? typeConfig[ticket.id as ItemType].active + ' opacity-100'
          : 'border-divider text-on-surface-variant opacity-70 hover:opacity-100'"
        @click="ticket.toggle()"
      >
        <AppIcon :icon="typeConfig[ticket.id as ItemType].icon" :size="12" />
        {{ typeConfig[ticket.id as ItemType].label }}
      </button>
    </div>

    <!-- Level chips -->
    <div class="flex flex-wrap items-center gap-2 mb-5">
      <button
        v-for="ticket in levelTickets"
        :key="ticket.id"
        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer transition-all"
        :class="levelFilter.isNoneSelected.value || ticket.isSelected.value
          ? 'opacity-100'
          : 'opacity-40'"
        :style="{
          borderColor: levels[ticket.id as Level].color,
          backgroundColor: ticket.isSelected.value
            ? levels[ticket.id as Level].color + '22'
            : 'transparent',
          color: levels[ticket.id as Level].color,
        }"
        @click="ticket.toggle()"
      >
        <AppIcon :icon="levels[ticket.id as Level].icon" :size="14" />
        {{ levels[ticket.id as Level].label }}
      </button>

      <button
        class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border border-divider text-on-surface-variant bg-transparent cursor-pointer transition-colors hover:bg-surface-variant"
        :class="!levelFilter.isNoneSelected.value || typeFilter.selectedId.value ? 'visible' : 'invisible'"
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

    <!-- Mobile card view -->
    <div class="md:hidden mb-6">
      <template v-for="(group, index) in table.grouping.groups.value" :key="group.key">
        <hr v-if="index > 0" class="border-divider m-0">

        <!-- Group header -->
        <button
          class="w-full flex items-center gap-2 px-2 py-2 text-sm font-semibold text-on-surface cursor-pointer border-0 bg-transparent text-left"
          @click="table.grouping.toggle(group.key)"
        >
          <AppIcon
            class="transition-transform"
            :class="table.grouping.isOpen(group.key) ? 'rotate-90' : ''"
            icon="chevron-right"
            :size="14"
          />

          <span class="capitalize">{{ group.key }}</span>
          <span class="text-on-surface-variant font-normal">({{ group.items.length }})</span>
          <span class="flex-1" />

          <span
            class="inline-block size-2 min-w-2 rounded-[2px] shrink-0"
            :style="{ backgroundColor: blend(group.items) }"
          />
        </button>

        <!-- Cards -->
        <div v-if="table.grouping.isOpen(group.key)" class="grid gap-2 pl-2 mb-3">
          <component
            :is="(item as MaturityItem).level === 'draft' ? 'div' : RouterLink"
            v-for="item in group.items"
            :key="item.id"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-glass-surface no-underline transition-colors hover:bg-surface-variant/80"
            :to="(item as MaturityItem).level !== 'draft' ? String(item.path) : undefined"
          >
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-on-surface truncate">
                {{ item.name }}
              </div>

              <div class="flex items-center gap-2 mt-1">
                <span
                  class="inline-block px-1.5 py-0 rounded-full text-[10px] font-medium"
                  :class="[
                    item.type === 'composable' && 'bg-primary/15 text-primary',
                    item.type === 'component' && 'bg-info/15 text-info',
                    item.type === 'utility' && 'bg-success/15 text-success',
                  ]"
                >{{ item.type }}</span>

                <span v-if="item.since" class="text-[10px] text-on-surface-variant font-mono">
                  v{{ item.since }}
                </span>
              </div>
            </div>

            <span
              class="inline-flex items-center gap-1 shrink-0"
              :style="{ color: levels[item.level]?.color }"
            >
              <AppIcon :icon="levels[item.level]?.icon" :size="14" />
            </span>
          </component>
        </div>
      </template>

      <!-- Empty state -->
      <div
        v-if="table.grouping.groups.value.length === 0"
        class="px-4 py-8 text-center text-on-surface-variant text-sm"
      >
        No items match your search or filters.
      </div>

      <!-- Summary -->
      <div class="flex flex-wrap items-center gap-3 px-2 py-3 text-xs text-on-surface-variant">
        <span
          v-for="(config, key) in levels"
          :key
          class="inline-flex items-center gap-1"
          :style="{ color: config.color }"
        >
          <AppIcon :icon="config.icon" :size="12" />
          {{ summary[key] }} {{ config.label.toLowerCase() }}
        </span>

        <span class="flex-1" />
        <span class="font-semibold text-on-surface">{{ filtered.length }} total</span>
      </div>
    </div>

    <!-- Desktop table -->
    <div class="relative overflow-hidden mb-6 hidden md:block">
      <table class="w-full border-collapse table-fixed">
        <colgroup>
          <col class="w-[30%]">
          <col class="w-[18%]">
          <col class="w-[20%]">
          <col class="w-[20%]">
          <col class="w-[12%]">
        </colgroup>

        <thead>
          <tr v-if="anyOpen" class="relative z-1 bg-background">
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

          <tr v-else class="relative z-1 bg-background">
            <th class="py-2 px-4 text-left text-xs font-normal text-on-surface-variant/50 italic" :colspan="table.columns.length">
              <div class="flex items-center gap-2">
                Select a group to see individual items
                <span class="flex-1" />

                <span
                  class="inline-block size-2 min-w-2 rounded-[2px] shrink-0"
                  :style="{ backgroundColor: blend(filtered) }"
                />
              </div>
            </th>
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
                    class="inline-block size-2 min-w-2 rounded-[2px] shrink-0"
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
              <td class="!pl-[34px] pr-4 py-2.5 text-sm font-medium truncate">
                <component
                  :is="(item as MaturityItem).level === 'draft' ? 'span' : RouterLink"
                  :class="(item as MaturityItem).level === 'draft' ? 'text-on-surface-variant' : 'text-primary no-underline hover:underline transition-colors'"
                  :to="(item as MaturityItem).level !== 'draft' ? item.path : undefined"
                >{{ item.name }}</component>
              </td>

              <!-- Type badge -->
              <td class="px-4 py-2.5">
                <span
                  class="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="[
                    item.type === 'composable' && 'bg-primary/15 text-primary',
                    item.type === 'component' && 'bg-info/15 text-info',
                    item.type === 'utility' && 'bg-success/15 text-success',
                  ]"
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
                  v-if="item.since"
                  class="text-primary no-underline hover:underline whitespace-nowrap"
                  :href="`/releases/?version=v${item.since}`"
                  target="_blank"
                >v{{ item.since }} ↗</a>

                <span v-else class="text-on-surface-variant/50">—</span>
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
                  :key
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

      <AppDotGrid :coverage="65" :density="18" />
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
          <template v-if="item.from">
            <AppIcon
              :icon="levels[item.from].icon"
              :size="14"
              :style="{ color: levels[item.from].color }"
            />

            <span
              class="text-sm font-semibold"
              :style="{ color: levels[item.from].color }"
            >
              {{ levels[item.from].label }}
            </span>
          </template>

          <span v-else class="text-sm font-semibold text-on-surface-variant">Any</span>

          <AppIcon
            class="text-on-surface-variant"
            icon="chevron-right"
            :size="14"
          />

          <AppIcon
            :icon="levels[item.to].icon"
            :size="14"
            :style="{ color: levels[item.to].color }"
          />

          <span
            class="text-sm font-semibold"
            :style="{ color: levels[item.to].color }"
          >
            {{ levels[item.to].label }}
          </span>
        </div>

        <p class="text-sm text-on-surface-variant m-0 leading-relaxed">
          {{ item.requirements }}
        </p>
      </div>
    </div>
  </div>
</template>
