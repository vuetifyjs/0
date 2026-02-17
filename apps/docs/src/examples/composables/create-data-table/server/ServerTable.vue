<script setup lang="ts">
  import { createDataTable, ServerAdapter } from '@vuetify/v0'
  import { shallowRef, watch } from 'vue'
  import { fetchUsers } from './api'
  import { columns } from './columns'

  import type { User } from './api'

  const serverItems = shallowRef<User[]>([])
  const totalCount = shallowRef(0)
  const isLoading = shallowRef(false)

  const table = createDataTable({
    items: serverItems,
    columns,
    pagination: { itemsPerPage: 5 },
    adapter: new ServerAdapter({
      total: totalCount,
      loading: isLoading,
    }),
  })

  async function loadData () {
    isLoading.value = true

    const result = await fetchUsers(
      table.query.value,
      table.sort.columns.value,
      table.pagination.pageStart.value,
      table.pagination.pageStop.value,
    )

    totalCount.value = result.total
    serverItems.value = result.items
    isLoading.value = false
  }

  watch(
    [table.query, table.sort.columns, table.pagination.page],
    () => loadData(),
    { immediate: true },
  )

  function sortIcon (key: string) {
    const dir = table.sort.direction(key)
    if (dir === 'asc') return '\u25B2'
    if (dir === 'desc') return '\u25BC'
    return '\u25BD'
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-2 items-center">
      <input
        class="flex-1 px-3 py-2 border border-divider bg-surface text-on-surface rounded-lg focus:border-primary focus:outline-none"
        placeholder="Search (server-side)..."
        type="text"
        :value="table.query.value"
        @input="table.search(($event.target as HTMLInputElement).value)"
      >

      <span
        v-if="table.loading.value"
        class="text-sm text-primary animate-pulse"
      >
        Loading...
      </span>
    </div>

    <div
      class="border border-divider rounded-lg overflow-hidden"
      :class="{ 'opacity-50': table.loading.value }"
    >
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
            <td class="px-4 py-3">{{ item.department }}</td>
          </tr>

          <tr v-if="table.items.value.length === 0 && !table.loading.value">
            <td class="px-4 py-8 text-center opacity-50" colspan="3">
              No results found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-sm">
      <span class="opacity-60">
        {{ totalCount }} total
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
