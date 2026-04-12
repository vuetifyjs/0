<script setup lang="ts">
  import { createDataGrid } from '@vuetify/v0'
  import { reactive, ref } from 'vue'
  import { columns } from './columns'
  import { users } from './data'

  // Local copy so onEdit can persist commits in this example.
  const rows = reactive([...users])

  const grid = createDataGrid({
    items: rows,
    columns,
    pagination: { itemsPerPage: 5 },
    editing: {
      onEdit (rowId, columnKey, value) {
        const item = rows.find(r => r.id === rowId)
        if (item) (item as Record<string, unknown>)[columnKey] = value
      },
    },
  })

  const draft = ref<string>('')

  function startEdit (rowId: number, columnKey: string, current: unknown) {
    draft.value = String(current ?? '')
    grid.editing.edit(rowId, columnKey)
  }

  function commitEdit () {
    grid.editing.commit(draft.value)
  }

  function cancelEdit () {
    grid.editing.cancel()
  }

  function isEditing (rowId: number, columnKey: string) {
    const active = grid.editing.active.value
    return active?.row === rowId && active?.column === columnKey
  }

  function sortIcon (key: string) {
    const dir = grid.sort.direction(key)
    if (dir === 'asc') return '↑'
    if (dir === 'desc') return '↓'
    return ''
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <input
        class="px-3 py-2 border border-divider bg-surface text-on-surface rounded-lg focus:border-primary focus:outline-none flex-1"
        placeholder="Search..."
        type="text"
        :value="grid.query.value"
        @input="grid.search(($event.target as HTMLInputElement).value)"
      >
      <button
        class="px-3 py-2 border border-divider rounded-lg text-sm hover:bg-surface-tint"
        @click="grid.layout.pin('name', grid.layout.columns.value[0]?.pinned === 'left' ? false : 'left')"
      >
        Toggle pin Name
      </button>
    </div>

    <div class="border border-divider rounded-lg overflow-hidden">
      <table class="w-full text-sm table-fixed">
        <colgroup>
          <col
            v-for="col in grid.layout.columns.value"
            :key="col.key"
            :style="{ width: `${col.size}%` }"
          >
        </colgroup>

        <thead>
          <tr class="border-b border-divider bg-surface-tint">
            <th
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              class="px-4 py-3 text-left font-medium cursor-pointer select-none hover:text-primary transition-colors"
              :class="col.pinned === 'left' && 'border-r border-divider'"
              @click="grid.sort.toggle(col.key)"
            >
              {{ columns.find(c => c.key === col.key)?.title }}
              <span class="ml-1 text-xs opacity-50">{{ sortIcon(col.key) }}</span>
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
              class="px-4 py-3 truncate"
              :class="[
                col.pinned === 'left' && 'border-r border-divider',
                grid.editing.active.value?.column === col.key && 'cursor-text',
              ]"
              @dblclick="col.key === 'email' && startEdit(item.id, col.key, (item as Record<string, unknown>)[col.key])"
            >
              <input
                v-if="isEditing(item.id, col.key)"
                v-model="draft"
                autofocus
                class="w-full px-1 py-0.5 border border-primary bg-surface text-on-surface rounded outline-none"
                @blur="commitEdit"
                @keydown.enter.prevent="commitEdit"
                @keydown.esc.prevent="cancelEdit"
              >
              <template v-else>
                {{ (item as Record<string, unknown>)[col.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="grid.editing.error.value" class="text-xs text-error">
      {{ grid.editing.error.value }}
    </div>

    <div class="flex items-center justify-between text-sm">
      <span class="opacity-60">
        {{ grid.total.value }} total · double-click email to edit
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
