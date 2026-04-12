<script setup lang="ts">
  import { nextTick, ref, useTemplateRef } from 'vue'
  import { createDataGrid, useClickOutside, useHotkey, useToggleScope } from '@vuetify/v0'
  import type { ID } from '@vuetify/v0'
  import { columns } from './columns'
  import { products } from './data'

  type EditEntry = {
    row: ID
    column: string
    from: unknown
    to: unknown
  }

  const log = ref<EditEntry[]>([])
  const edits = ref<Map<string, unknown>>(new Map())
  const input = ref('')
  const editRef = useTemplateRef<HTMLInputElement>('edit-input')

  const grid = createDataGrid({
    items: products,
    columns,
    editing: {
      onEdit (row, column, value) {
        const item = products.find(p => p.id === row)
        const from = item ? item[column as keyof typeof item] : undefined

        edits.value.set(`${row}:${column}`, value)
        log.value.unshift({ row, column, from, to: value })

        if (item) {
          (item as Record<string, unknown>)[column] = column === 'price' || column === 'quantity'
            ? Number(value)
            : value
        }
      },
    },
  })

  function cellKey (row: ID, column: string) {
    return `${row}:${column}`
  }

  function isEditing (row: ID, column: string) {
    const cell = grid.editing.active.value
    return cell?.row === row && cell?.column === column
  }

  function isEdited (row: ID, column: string) {
    return edits.value.has(cellKey(row, column))
  }

  function isEditable (column: string) {
    return columns.find(c => c.key === column)?.editable === true
  }

  function onEdit (row: ID, column: string, value: unknown) {
    if (!isEditable(column)) return

    grid.editing.edit(row, column)
    input.value = String(value ?? '')

    nextTick(() => {
      editRef.value?.focus()
      editRef.value?.select()
    })
  }

  function onCommit () {
    grid.editing.commit(input.value)
  }

  function onCancel () {
    grid.editing.cancel()
  }

  const cell = useTemplateRef<HTMLTableCellElement>('active-cell')

  useToggleScope(
    () => !!grid.editing.active.value,
    () => {
      useClickOutside(cell, () => onCancel())
      useHotkey('escape', () => onCancel(), { inputs: true })
    },
  )

  function formatPrice (value: unknown) {
    return `$${Number(value).toFixed(2)}`
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="border border-divider rounded-lg overflow-hidden">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="border-b border-divider bg-surface-tint">
            <th
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              class="px-3 py-2 font-medium"
              :class="col.key === 'price' || col.key === 'quantity' ? 'text-right' : 'text-left'"
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
            <td
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              :ref="isEditing(item.id as ID, col.key) ? 'active-cell' : undefined"
              class="px-3 py-2"
              :class="[
                col.key === 'price' || col.key === 'quantity' ? 'text-right' : 'text-left',
                isEditable(col.key) && !isEditing(item.id as ID, col.key) ? 'cursor-pointer border-b border-dashed border-on-surface/20 hover:bg-surface-tint transition-colors' : '',
              ]"
              :style="[
                { width: col.size + '%' },
                isEditing(item.id as ID, col.key) ? 'outline: 2px solid var(--v0-color-primary); outline-offset: -2px; border-radius: 2px;' : '',
              ]"
              @click="onEdit(item.id as ID, col.key, item[col.key])"
            >
              <template v-if="isEditing(item.id as ID, col.key)">
                <div class="flex flex-col gap-1">
                  <input
                    ref="edit-input"
                    class="w-full bg-transparent outline-none border-none p-0 m-0 text-sm"
                    :class="col.key === 'price' || col.key === 'quantity' ? 'text-right' : 'text-left'"
                    :value="input"
                    @input="input = ($event.target as HTMLInputElement).value"
                    @keydown.enter="onCommit"
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
                <span :class="isEdited(item.id as ID, col.key) ? 'text-primary' : ''">
                  <template v-if="col.key === 'price'">{{ formatPrice(item[col.key]) }}</template>
                  <template v-else>{{ item[col.key] }}</template>
                </span>
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
      <div class="px-3 py-2 bg-surface-tint text-xs font-medium border-b border-divider">
        Edit History
      </div>

      <div class="divide-y divide-divider text-xs max-h-40 overflow-y-auto">
        <div
          v-for="(entry, index) in log"
          :key="index"
          class="px-3 py-2 flex items-center gap-3"
        >
          <span class="text-on-surface-variant">{{ entry.column }}</span>
          <span class="text-on-surface-variant line-through">{{ entry.from }}</span>
          <span class="text-on-surface-variant">&rarr;</span>
          <span class="text-primary font-medium">{{ entry.to }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
