<script setup lang="ts">
  // Framework
  import { Pagination } from '@vuetify/v0'

  // Composables
  import { sortControlName, TIER_BG, type BenchmarkSortField, type FlatBenchmark } from '@/composables/useBenchmarkData'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  const props = defineProps<{
    rows: FlatBenchmark[]
    sortBy: BenchmarkSortField
    sortDesc: boolean
  }>()

  const emit = defineEmits<{
    sort: [field: BenchmarkSortField]
  }>()

  const perPage = 50
  const page = shallowRef(1)

  const maxHz = toRef(() => {
    let max = 0
    for (const row of props.rows) {
      if (row.hz > max) max = row.hz
    }
    return max
  })

  const start = toRef(() => (page.value - 1) * perPage)

  const pageRows = toRef(() => props.rows.slice(start.value, start.value + perPage))

  watch(
    () => `${props.sortBy}:${props.sortDesc}:${props.rows.length}:${props.rows[0]?.id ?? ''}`,
    () => {
      page.value = 1
    },
  )

  function ariaSort (field: BenchmarkSortField): 'ascending' | 'descending' | 'none' {
    if (props.sortBy !== field) return 'none'
    return props.sortDesc ? 'descending' : 'ascending'
  }

  function barWidth (hz: number): string {
    if (maxHz.value <= 0) return '0%'
    return `${(hz / maxHz.value) * 100}%`
  }
</script>

<template>
  <div>
    <div class="overflow-x-auto border border-divider rounded-lg">
      <table class="w-full !rounded-0 !border-none">
        <thead>
          <tr class="bg-surface-variant/30">
            <th class="text-left text-xs font-medium text-on-surface-variant px-4 py-2" scope="col">
              Operation
            </th>

            <th class="text-left text-xs font-medium text-on-surface-variant px-4 py-2" scope="col">
              Tier
            </th>

            <th :aria-sort="ariaSort('hz')" class="text-left text-xs font-medium text-on-surface-variant px-4 py-2" scope="col">
              <button :aria-label="sortControlName('Throughput', sortBy === 'hz', sortDesc)" class="inline-flex items-center gap-1 cursor-pointer" type="button" @click="emit('sort', 'hz')">
                Throughput
                <AppIcon
                  v-if="sortBy === 'hz'"
                  class="transition-transform"
                  :class="sortDesc ? 'rotate-90' : '-rotate-90'"
                  icon="chevron-right"
                  :size="12"
                />
              </button>
            </th>

            <th :aria-sort="ariaSort('mean')" class="text-right text-xs font-medium text-on-surface-variant px-4 py-2 hidden md:table-cell" scope="col">
              <button :aria-label="sortControlName('Latency', sortBy === 'mean', sortDesc)" class="inline-flex items-center gap-1 ml-auto cursor-pointer" type="button" @click="emit('sort', 'mean')">
                Latency
                <AppIcon
                  v-if="sortBy === 'mean'"
                  class="transition-transform"
                  :class="sortDesc ? 'rotate-90' : '-rotate-90'"
                  icon="chevron-right"
                  :size="12"
                />
              </button>
            </th>

            <th :aria-sort="ariaSort('rme')" class="text-right text-xs font-medium text-on-surface-variant px-4 py-2 hidden lg:table-cell" scope="col">
              <button :aria-label="sortControlName('Margin', sortBy === 'rme', sortDesc)" class="inline-flex items-center gap-1 ml-auto cursor-pointer" type="button" @click="emit('sort', 'rme')">
                Margin
                <AppIcon
                  v-if="sortBy === 'rme'"
                  class="transition-transform"
                  :class="sortDesc ? 'rotate-90' : '-rotate-90'"
                  icon="chevron-right"
                  :size="12"
                />
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in pageRows"
            :key="row.id"
            class="border-b border-divider/50 last:border-b-0"
          >
            <td class="py-2 pl-4 pr-3 text-sm text-on-surface">
              {{ row.name }}
              <div class="text-xs text-on-surface-variant">{{ row.composable }} · {{ row.group }}</div>
            </td>

            <td class="py-2 px-4">
              <BenchmarkTierBadge size="sm" :tier="row.tier" />
            </td>

            <td class="py-2 pr-3">
              <div class="flex items-center gap-2">
                <div class="hidden sm:block w-24 h-1.5 bg-surface-variant/50 rounded-full overflow-hidden shrink-0">
                  <div
                    aria-label="Relative throughput"
                    aria-valuemax="100"
                    aria-valuemin="0"
                    :aria-valuenow="maxHz > 0 ? Math.round((row.hz / maxHz) * 100) : 0"
                    class="h-full rounded-full"
                    :class="TIER_BG[row.tier]"
                    role="meter"
                    :style="{ width: barWidth(row.hz) }"
                  />
                </div>

                <code class="text-xs whitespace-nowrap">{{ row.hzLabel }}</code>
              </div>
            </td>

            <td class="py-2 pr-4 text-right hidden md:table-cell">
              <code class="text-xs">{{ row.meanLabel }}</code>
            </td>

            <td class="py-2 pr-4 text-right hidden lg:table-cell">
              <span class="text-xs text-on-surface-variant">±{{ row.rme.toFixed(1) }}%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="rows.length > perPage"
      class="flex flex-wrap items-center justify-between gap-3 mt-3 text-sm"
    >
      <span class="text-on-surface-variant text-xs">
        {{ start + 1 }}–{{ Math.min(start + perPage, rows.length) }} of {{ rows.length }}
      </span>

      <Pagination.Root
        v-slot="{ items }"
        v-model="page"
        class="flex items-center gap-1"
        :items-per-page="perPage"
        :size="rows.length"
        :total-visible="5"
      >
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
            class="w-8 h-8 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:border-primary"
            :value="item.value as number"
          >
            {{ item.value }}
          </Pagination.Item>
        </template>

        <Pagination.Next class="w-8 h-8 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed">
          ›
        </Pagination.Next>
      </Pagination.Root>
    </div>
  </div>
</template>
