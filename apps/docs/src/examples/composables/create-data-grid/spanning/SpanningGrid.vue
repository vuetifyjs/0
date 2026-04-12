<script setup lang="ts">
  import { createDataGrid } from '@vuetify/v0'
  import { columns } from './columns'
  import { employees } from './data'

  const grid = createDataGrid({
    items: employees,
    columns,
    rowSpanning: (item, column) => {
      if (column !== 'department') return 1

      const index = employees.findIndex(e => e.id === item.id)
      let count = 1

      while (index + count < employees.length && employees[index + count].department === item.department) {
        count++
      }

      return count
    },
  })
</script>

<template>
  <div class="border border-divider rounded-lg overflow-hidden">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-divider bg-surface-tint">
          <th
            v-for="col in grid.layout.columns.value"
            :key="col.key"
            class="px-4 py-3 text-left font-medium"
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
              class="px-4 py-3"
              :class="col.key === 'department' && (grid.spans.value.get(item.id as number)?.get(col.key)?.rowSpan ?? 1) > 1 ? 'bg-surface-tint font-medium' : ''"
              :rowspan="grid.spans.value.get(item.id as number)?.get(col.key)?.rowSpan"
              :style="{ width: col.size + '%' }"
            >
              {{ item[col.key] }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
