<script setup lang="ts">
  // Framework
  import { createDataTable, Pagination, Select, useDate } from '@vuetify/v0'

  // Composables
  import { useFreshness, scoreToColor } from '@/composables/useFreshness'

  // Utilities
  import { shallowRef, watch } from 'vue'

  // Types
  import type { PageFreshness } from '@/composables/useFreshness'

  const DAY_MS = 24 * 60 * 60 * 1000
  const date = useDate()
  const { pages } = useFreshness()

  const pageSize = shallowRef<number>(25)

  const pageSizeOptions = [
    { id: 10, label: '10 / page' },
    { id: 25, label: '25 / page' },
    { id: 50, label: '50 / page' },
    { id: 100, label: '100 / page' },
  ]

  const table = createDataTable<PageFreshness>({
    items: pages,
    columns: [
      { key: 'path', title: 'Page', sortable: true, filterable: true },
      { key: 'category', title: 'Category', sortable: true, filterable: true },
      { key: 'updated', title: 'Last updated', sortable: true },
      { key: 'ageMs', title: 'Age', sortable: true },
    ],
    itemValue: 'path',
    firstSortOrder: 'desc',
    pagination: { itemsPerPage: pageSize.value },
  })

  table.sort.toggle('ageMs')

  watch(pageSize, value => {
    table.pagination.itemsPerPage = value
    table.pagination.first()
  })

  function onSearch (event: Event) {
    table.search((event.target as HTMLInputElement).value)
  }

  function formatAge (ms: number): string {
    const days = Math.round(ms / DAY_MS)
    if (days <= 0) return 'today'
    if (days < 30) return `${days}d`
    if (days < 365) return `${Math.round(days / 30)}mo`
    return `${Math.round(days / 365)}y`
  }

  function formatDate (iso: string): string {
    if (!iso) return '—'
    const d = date.adapter.date(iso)
    if (!date.adapter.isValid(d)) return '—'
    return date.adapter.format(d, 'normalDate')
  }
</script>

<template>
  <section class="w-full max-w-5xl mx-auto mb-12">
    <header class="flex items-baseline justify-between mb-4">
      <h2 class="text-xl font-semibold">Pages</h2>

      <span class="text-xs text-on-surface-variant">
        {{ table.filteredItems.value.length }} total
      </span>
    </header>

    <div class="flex items-center gap-2 mb-4">
      <input
        class="flex-1 px-4 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm placeholder-on-surface-variant/50 outline-none transition-colors focus:border-primary"
        placeholder="Search by page or category..."
        type="text"
        :value="table.query.value"
        @input="onSearch"
      >

      <Select.Root v-model="pageSize">
        <Select.Activator class="flex items-center gap-2 min-w-[140px] px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
          <Select.Value v-slot="{ selectedValue }" class="flex-1 text-left">
            {{ selectedValue }}
          </Select.Value>

          <Select.Cue v-slot="{ isOpen }" class="inline-flex items-center opacity-60">
            <AppIcon
              class="transition-transform"
              :class="isOpen ? '-rotate-90' : 'rotate-90'"
              icon="chevron-right"
              :size="14"
            />
          </Select.Cue>
        </Select.Activator>

        <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
          <Select.Item
            v-for="option in pageSizeOptions"
            :id="option.id"
            :key="option.id"
            :value="option.label"
          >
            <template #default="{ isSelected, isHighlighted }">
              <div
                class="px-3 py-2 rounded-md cursor-default select-none text-sm"
                :class="[
                  isHighlighted
                    ? 'bg-primary text-on-primary'
                    : isSelected
                      ? 'text-primary font-medium'
                      : 'text-on-surface hover:bg-surface-variant',
                ]"
              >
                {{ option.label }}
              </div>
            </template>
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>

    <div class="rounded overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-surface-variant-50 text-left">
            <tr>
              <th
                v-for="col in table.columns"
                :key="col.key"
                class="px-3 py-2 font-medium text-on-surface-variant cursor-pointer select-none"
                @click="col.sortable && table.sort.toggle(col.key)"
              >
                <span class="inline-flex items-center gap-1">
                  {{ col.title }}
                  <AppIcon
                    v-if="table.sort.columns.value[0]?.key === col.key"
                    aria-hidden="true"
                    class="transition-transform"
                    :class="table.sort.columns.value[0]?.direction === 'asc' ? '-rotate-90' : 'rotate-90'"
                    icon="chevron-right"
                    :size="14"
                  />
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="row in table.items.value"
              :key="row.path"
              class="border-t border-divider"
            >
              <td class="px-3 py-2">
                <router-link class="text-primary hover:underline" :to="row.path">{{ row.path }}</router-link>
              </td>

              <td class="px-3 py-2 text-on-surface-variant">{{ row.category }}</td>
              <td class="px-3 py-2 font-mono text-xs">{{ formatDate(row.updated) }}</td>

              <td class="px-3 py-2 font-mono text-xs" :style="{ backgroundColor: scoreToColor(row.score) }">
                {{ formatAge(row.ageMs) }}
              </td>
            </tr>

            <tr v-if="table.items.value.length === 0">
              <td class="px-3 py-6 text-center text-on-surface-variant" colspan="4">
                No pages match your filter.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="table.pagination.pages > 1"
      class="flex items-center justify-between gap-3 mt-4 text-sm"
    >
      <span class="text-on-surface-variant text-xs">
        Showing
        {{ table.pagination.pageStart.value + 1 }}–{{ Math.min(table.pagination.pageStop.value, table.filteredItems.value.length) }}
        of {{ table.filteredItems.value.length }}
      </span>

      <Pagination.Root
        v-slot="{ items }"
        v-model="table.pagination.page.value"
        class="flex items-center gap-1"
        :items-per-page="table.pagination.itemsPerPage"
        :size="table.filteredItems.value.length"
        :total-visible="5"
      >
        <Pagination.First class="w-8 h-8 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed">
          «
        </Pagination.First>

        <Pagination.Prev class="w-8 h-8 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed">
          ‹
        </Pagination.Prev>

        <template v-for="(item, index) in items" :key="index">
          <Pagination.Ellipsis
            v-if="item.type === 'ellipsis'"
            class="w-8 h-8 flex items-center justify-center text-on-surface-variant opacity-60"
          />

          <Pagination.Item
            v-else
            class="w-8 h-8 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:border-primary data-[selected]:hover:bg-primary"
            :value="item.value as number"
          >
            {{ item.value }}
          </Pagination.Item>
        </template>

        <Pagination.Next class="w-8 h-8 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed">
          ›
        </Pagination.Next>

        <Pagination.Last class="w-8 h-8 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed">
          »
        </Pagination.Last>
      </Pagination.Root>
    </div>
  </section>
</template>
