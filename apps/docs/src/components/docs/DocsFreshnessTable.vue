<script setup lang="ts">
  // Framework
  import { createDataTable, useDate } from '@vuetify/v0'

  // Composables
  import { useFreshness, scoreToColor } from '@/composables/useFreshness'

  // Utilities
  import { computed, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { PageFreshness } from '@/composables/useFreshness'

  const DAY_MS = 24 * 60 * 60 * 1000
  const route = useRoute()
  const date = useDate()
  const { pages } = useFreshness()

  const activeCategory = toRef(() => {
    const q = route.query.category
    if (typeof q !== 'string') return null
    // accept "guides" alias for internal category key "guide"
    if (q === 'guides') return 'guide'
    return q
  })

  const filtered = computed(() => {
    const list = pages.value
    const cat = activeCategory.value
    if (!cat) return list
    return list.filter(p => p.category === cat)
  })

  const table = createDataTable<PageFreshness>({
    items: filtered,
    columns: [
      { key: 'path', title: 'Page', sortable: true },
      { key: 'category', title: 'Category', sortable: true },
      { key: 'updated', title: 'Last updated', sortable: true },
      { key: 'ageMs', title: 'Age', sortable: true },
    ],
    itemValue: 'path',
    firstSortOrder: 'desc',
  })

  // Apply initial sort: age descending (stalest at top)
  table.sort.toggle('ageMs')

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
  <section class="w-full max-w-5xl mx-auto my-12">
    <header class="flex items-baseline justify-between mb-4">
      <h2 class="text-xl font-semibold">Pages</h2>

      <span class="text-xs text-on-surface-variant">
        {{ filtered.length }} {{ activeCategory ? activeCategory : 'total' }}
      </span>
    </header>

    <div class="overflow-x-auto border border-divider rounded">
      <table class="w-full text-sm">
        <thead class="bg-surface-variant-50 text-left">
          <tr>
            <th
              v-for="col in table.columns"
              :key="col.key"
              class="px-3 py-2 font-medium text-on-surface-variant cursor-pointer select-none"
              @click="col.sortable && table.sort.toggle(col.key)"
            >
              {{ col.title }}
              <span
                v-if="table.sort.columns.value[0]?.key === col.key"
                aria-hidden="true"
                class="inline-block w-2 h-2 ms-1 border-b-2 border-e-2 border-current"
                :class="table.sort.columns.value[0]?.direction === 'asc' ? 'rotate-[225deg]' : 'rotate-[45deg]'"
              />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in table.items.value" :key="row.path" class="border-t border-divider">
            <td class="px-3 py-2">
              <router-link class="text-primary hover:underline" :to="row.path">{{ row.path }}</router-link>
            </td>

            <td class="px-3 py-2 text-on-surface-variant">{{ row.category }}</td>
            <td class="px-3 py-2 font-mono text-xs">{{ formatDate(row.updated) }}</td>

            <td class="px-3 py-2 font-mono text-xs" :style="{ backgroundColor: scoreToColor(row.score) }">
              {{ formatAge(row.ageMs) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
