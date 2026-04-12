<script setup lang="ts">
  import { ref } from 'vue'
  import { createDataGrid } from '@vuetify/v0'
  import type { ID } from '@vuetify/v0'
  import { columns } from './columns'
  import { employees } from './data'

  interface EditLog {
    row: ID
    column: string
    value: unknown
    timestamp: number
  }

  const log = ref<EditLog[]>([])

  const grid = createDataGrid({
    items: employees,
    columns,
    editing: {
      onEdit (row, column, value) {
        log.value.unshift({ row, column, value, timestamp: Date.now() })
      },
    },
  })

  const input = ref('')

  function onEdit (row: ID, column: string, value: unknown) {
    grid.editing.edit(row, column)
    input.value = String(value ?? '')
  }

  function onCommit () {
    grid.editing.commit(input.value)
  }

  function onCancel () {
    grid.editing.cancel()
  }

  function isEditing (row: ID, column: string) {
    const cell = grid.editing.active.value
    return cell?.row === row && cell?.column === column
  }
</script>

<template>
  <div class="flex flex-col gap-3">
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
            class="hover:bg-surface-tint transition-colors"
          >
            <td
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              class="px-4 py-3"
              :style="{ width: col.size + '%' }"
              @click="onEdit(item.id as ID, col.key, item[col.key])"
            >
              <template v-if="isEditing(item.id as ID, col.key)">
                <div class="flex flex-col gap-1">
                  <input
                    class="w-full px-2 py-1 border border-primary bg-surface text-on-surface rounded focus:outline-none"
                    :value="input"
                    @input="input = ($event.target as HTMLInputElement).value"
                    @keydown.enter="onCommit"
                    @keydown.escape="onCancel"
                  >

                  <span
                    v-if="grid.editing.error.value"
                    class="text-xs text-error"
                  >
                    {{ grid.editing.error.value }}
                  </span>
                </div>
              </template>

              <template v-else>
                <template v-if="col.key === 'salary'">${{ (item[col.key] as number).toLocaleString() }}</template>
                <template v-else>{{ item[col.key] }}</template>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="log.length > 0"
      class="border border-divider rounded-lg overflow-hidden"
    >
      <div class="px-4 py-2 bg-surface-tint text-xs font-medium border-b border-divider">
        Edit Log
      </div>

      <div class="divide-y divide-divider text-xs max-h-40 overflow-y-auto">
        <div
          v-for="(entry, index) in log"
          :key="index"
          class="px-4 py-2 flex gap-3"
        >
          <span class="text-on-surface-variant">Row {{ entry.row }}</span>
          <span class="font-medium">{{ entry.column }}</span>
          <span class="text-primary">{{ entry.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
