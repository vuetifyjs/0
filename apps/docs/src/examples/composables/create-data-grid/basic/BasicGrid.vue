<script setup lang="ts">
  import { createDataGrid } from '@vuetify/v0'
  import { columns } from './columns'
  import { employees } from './data'

  const grid = createDataGrid({
    items: employees,
    columns,
    pagination: { itemsPerPage: 5 },
  })

  function icon (key: string) {
    const dir = grid.sort.direction(key)
    if (dir === 'asc') return '↑'
    if (dir === 'desc') return '↓'
    return ''
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <input
      class="px-3 py-2 border border-divider bg-surface text-on-surface rounded-lg focus:border-primary focus:outline-none"
      placeholder="Search..."
      type="text"
      :value="grid.query.value"
      @input="grid.search(($event.target as HTMLInputElement).value)"
    >

    <div class="border border-divider rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-divider bg-surface-tint">
            <th
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              class="px-4 py-3 text-left font-medium cursor-pointer select-none hover:text-primary transition-colors"
              :style="{ width: col.size + '%' }"
              @click="grid.sort.toggle(col.key)"
            >
              {{ columns.find(c => c.key === col.key)?.title }}
              <span class="ml-1 text-xs opacity-50">{{ icon(col.key) }}</span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-divider">
          <tr
            v-for="item in grid.items.value"
            :key="item.id"
            class="hover:bg-surface-tint transition-colors"
          >
            <td
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              class="px-4 py-3"
              :style="{ width: col.size + '%' }"
            >
              <template v-if="col.key === 'salary'">${{ (item[col.key] as number).toLocaleString() }}</template>
              <template v-else>{{ item[col.key] }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-sm">
      <span class="opacity-60">
        {{ grid.total.value }} total
      </span>

      <div class="flex gap-1">
        <button
          class="px-3 py-1 border border-divider rounded hover:bg-surface-tint disabled:opacity-30"
          :disabled="grid.pagination.isFirst.value"
          @click="grid.pagination.prev()"
        >
          Prev
        </button>

        <span class="px-3 py-1 text-on-surface">
          {{ grid.pagination.page.value }} / {{ grid.pagination.pages }}
        </span>

        <button
          class="px-3 py-1 border border-divider rounded hover:bg-surface-tint disabled:opacity-30"
          :disabled="grid.pagination.isLast.value"
          @click="grid.pagination.next()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
