<script setup lang="ts">
  import { createDataTable } from '@vuetify/v0'
  import { columns } from './columns'
  import { users } from './data'

  const table = createDataTable({
    items: users,
    columns,
    pagination: { itemsPerPage: 5 },
  })

  function sortIcon (key: string) {
    const dir = table.sort.direction(key)
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
      :value="table.query.value"
      @input="table.search(($event.target as HTMLInputElement).value)"
    >

    <div class="border border-divider rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-divider bg-surface-tint">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-left font-medium cursor-pointer select-none hover:text-primary transition-colors"
              @click="table.sort.toggle(col.key)"
            >
              {{ col.title }}
              <span class="ml-1 text-xs opacity-50">{{ sortIcon(col.key) }}</span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-divider">
          <tr
            v-for="item in table.items.value"
            :key="item.id"
            class="hover:bg-surface-tint transition-colors"
          >
            <td class="px-4 py-3">{{ item.name }}</td>
            <td class="px-4 py-3 opacity-70">{{ item.email }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-0.5 rounded text-xs font-medium bg-surface-tint">
                {{ item.role }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-sm">
      <span class="opacity-60">
        {{ table.total.value }} total
      </span>

      <div class="flex gap-1">
        <button
          class="px-3 py-1 border border-divider rounded hover:bg-surface-tint disabled:opacity-30"
          :disabled="table.pagination.isFirst.value"
          @click="table.pagination.prev()"
        >
          Prev
        </button>

        <span class="px-3 py-1 text-on-surface">
          {{ table.pagination.page.value }} / {{ table.pagination.pages }}
        </span>

        <button
          class="px-3 py-1 border border-divider rounded hover:bg-surface-tint disabled:opacity-30"
          :disabled="table.pagination.isLast.value"
          @click="table.pagination.next()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
