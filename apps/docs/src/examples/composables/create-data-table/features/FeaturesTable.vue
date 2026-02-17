<script setup lang="ts">
  import { createDataTable } from '@vuetify/v0'
  import { columns } from './columns'
  import { employees } from './data'

  const table = createDataTable({
    items: employees,
    columns,
    groupBy: 'department',
    mandate: true,
    firstSortOrder: 'asc',
    selectStrategy: 'page',
    itemSelectable: 'active',
    pagination: { itemsPerPage: 20 },
  })

  // Open all groups initially
  table.grouping.openAll()

  function sortIcon (key: string) {
    const dir = table.sort.direction(key)
    if (dir === 'asc') return '\u25B2'
    if (dir === 'desc') return '\u25BC'
    return '\u25BD'
  }

  function formatSalary (value: number) {
    return `$${value.toLocaleString()}`
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-2 items-center flex-wrap">
      <input
        class="flex-1 min-w-48 px-3 py-2 border border-divider bg-surface text-on-surface rounded-lg focus:border-primary focus:outline-none"
        placeholder="Search... (try >100000 for salary)"
        type="text"
        :value="table.query.value"
        @input="table.search(($event.target as HTMLInputElement).value)"
      >

      <button
        class="px-3 py-1.5 border border-divider rounded-lg hover:bg-surface-tint text-sm"
        @click="table.grouping.openAll()"
      >
        Expand All
      </button>

      <button
        class="px-3 py-1.5 border border-divider rounded-lg hover:bg-surface-tint text-sm"
        @click="table.grouping.closeAll()"
      >
        Collapse All
      </button>
    </div>

    <div class="border border-divider rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-divider bg-surface-tint">
            <th class="w-10 px-4 py-3">
              <input
                :checked="table.selection.isAllSelected.value"
                class="accent-primary"
                :indeterminate="table.selection.isMixed.value"
                type="checkbox"
                @change="table.selection.toggleAll()"
              >
            </th>
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
          <template v-for="group in table.grouping.groups.value" :key="group.key">
            <tr
              class="bg-surface-tint cursor-pointer hover:bg-surface-variant transition-colors"
              @click="table.grouping.toggle(group.key)"
            >
              <td class="px-4 py-2 font-medium" :colspan="columns.length + 1">
                <span class="mr-2 text-xs">{{ table.grouping.opened(group.key) ? '\u25BC' : '\u25B6' }}</span>
                {{ group.key }}
                <span class="ml-2 text-xs opacity-50">({{ group.items.length }})</span>
              </td>
            </tr>

            <template v-if="table.grouping.opened(group.key)">
              <tr
                v-for="item in group.items"
                :key="item.id"
                class="hover:bg-surface-tint transition-colors"
                :class="{ 'opacity-40': !table.selection.isSelectable(item.id) }"
              >
                <td class="px-4 py-3">
                  <input
                    :checked="table.selection.isSelected(item.id)"
                    class="accent-primary"
                    :disabled="!table.selection.isSelectable(item.id)"
                    type="checkbox"
                    @change="table.selection.toggle(item.id)"
                  >
                </td>
                <td class="px-4 py-3">{{ item.name }}</td>
                <td class="px-4 py-3">{{ item.department }}</td>
                <td class="px-4 py-3 font-mono">{{ formatSalary(item.salary) }}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-0.5 rounded text-xs font-medium"
                    :class="item.active ? 'text-success' : 'text-error'"
                  >
                    {{ item.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <div class="text-sm opacity-60">
      {{ table.selection.selectedIds.size }} selected of {{ table.total.value }} total
    </div>
  </div>
</template>
