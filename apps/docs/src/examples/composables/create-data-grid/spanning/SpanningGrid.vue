<script setup lang="ts">
  import { createDataGrid } from '@vuetify/v0'
  import { columns } from './columns'
  import { schedule } from './data'

  const grid = createDataGrid({
    items: schedule,
    columns,
    rowSpanning: (item, column) => {
      if (column !== 'department') return 1

      const index = schedule.findIndex(s => s.id === item.id)
      let count = 1

      while (index + count < schedule.length && schedule[index + count].department === item.department) {
        count++
      }

      return count
    },
  })

  function statusClass (status: string) {
    if (status === 'available') return 'bg-success/10 text-success'
    if (status === 'busy') return 'bg-warning/10 text-warning'
    return 'bg-surface-variant/50 text-on-surface-variant'
  }

  function dotClass (status: string) {
    if (status === 'available') return 'bg-success'
    if (status === 'busy') return 'bg-warning'
    return 'bg-on-surface-variant/40'
  }
</script>

<template>
  <div class="border border-divider rounded-lg overflow-hidden">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-divider bg-surface-tint">
          <th
            v-for="col in grid.layout.columns.value"
            :key="col.key"
            class="px-4 py-2.5 text-left font-medium text-xs uppercase tracking-wide"
            :style="{ width: col.size + '%' }"
          >
            {{ columns.find(c => c.key === col.key)?.title }}
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-divider">
        <tr
          v-for="item in grid.items.value"
          :key="item.id"
        >
          <template v-for="col in grid.layout.columns.value" :key="col.key">
            <td
              v-if="!grid.spans.value.get(item.id as number)?.get(col.key)?.hidden"
              class="px-4 py-2"
              :class="{
                'bg-surface-tint font-medium align-middle border-r border-divider': col.key === 'department' && (grid.spans.value.get(item.id as number)?.get(col.key)?.rowSpan ?? 1) > 1,
              }"
              :rowspan="grid.spans.value.get(item.id as number)?.get(col.key)?.rowSpan"
              :style="{ width: col.size + '%' }"
            >
              <template v-if="col.key === 'department' || col.key === 'member'">
                {{ item[col.key] }}
              </template>

              <template v-else>
                <span
                  class="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full"
                  :class="statusClass(item[col.key] as string)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="dotClass(item[col.key] as string)" />
                  {{ item[col.key] }}
                </span>
              </template>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
