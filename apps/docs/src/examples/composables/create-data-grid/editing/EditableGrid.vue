<script setup lang="ts">
  import { computed, nextTick, ref, shallowRef, useTemplateRef } from 'vue'

  import {
    mdiArrowDown,
    mdiArrowUp,
    mdiPackageVariantClosed,
    mdiPencilOutline,
    mdiRedo,
    mdiRefresh,
    mdiUndo,
  } from '@mdi/js'

  import {
    createDataGrid,
    createTimeline,
    useClickOutside,
    useHotkey,
    useToggleScope,
  } from '@vuetify/v0'
  import type { ID } from '@vuetify/v0'

  import { columns } from './columns'
  import { products } from './data'

  interface EditEntry {
    row: ID
    column: string
    from: unknown
    to: unknown
  }

  const input = ref('')
  const editRef = useTemplateRef<HTMLInputElement[]>('edit-input')
  const canRedo = shallowRef(false)

  const timeline = createTimeline<{ id?: ID, value: EditEntry }>({
    size: 50,
    reactive: true,
  })

  function applyValue (row: ID, column: string, value: unknown) {
    const item = products.find(p => p.id === row)
    if (!item) return
    const coerced = column === 'price' || column === 'quantity' ? Number(value) : value
    ;(item as Record<string, unknown>)[column] = coerced
  }

  const grid = createDataGrid({
    columns,
    editing: {
      onEdit (row, column, value, item) {
        const from = item ? item[column as keyof typeof item] : undefined
        timeline.register({ value: { row, column, from, to: value } })
        applyValue(row, column, value)
        canRedo.value = false
      },
    },
  })

  grid.onboard(products.map(value => ({ id: value.id, value })))

  const history = computed(() => [...timeline.values()].reverse())
  const editedCells = computed(
    () => new Set(timeline.values().map(t => `${t.value.row}:${t.value.column}`)),
  )

  function cellKey (row: ID, column: string) {
    return `${row}:${column}`
  }

  function isEditing (row: ID, column: string) {
    const cell = grid.editing.active.value
    return cell?.row === row && cell?.column === column
  }

  function isEdited (row: ID, column: string) {
    return editedCells.value.has(cellKey(row, column))
  }

  function isEditable (column: string) {
    return columns.find(c => c.id === column)?.editable === true
  }

  function isSortable (column: string) {
    const col = columns.find(c => c.id === column)
    return col?.sortable === true || col?.sort !== undefined
  }

  function onEdit (row: ID, column: string, value: unknown) {
    if (!isEditable(column)) return

    grid.editing.edit(row, column)
    input.value = String(value ?? '')

    nextTick(() => {
      const el = editRef.value?.[0]
      el?.focus()
      el?.select()
    })
  }

  function onCommit () {
    grid.editing.commit(input.value)
  }

  function onCancel () {
    grid.editing.cancel()
  }

  function onUndo () {
    const ticket = timeline.undo()
    if (!ticket) return
    applyValue(ticket.value.row, ticket.value.column, ticket.value.from)
    canRedo.value = true
  }

  function onRedo () {
    const ticket = timeline.redo()
    if (!ticket) return
    applyValue(ticket.value.row, ticket.value.column, ticket.value.to)
  }

  function onClear () {
    timeline.clear()
    canRedo.value = false
  }

  const cell = useTemplateRef<HTMLTableCellElement>('active-cell')

  useToggleScope(
    () => !!grid.editing.active.value,
    () => {
      useClickOutside(cell, () => onCancel())
      useHotkey('escape', () => onCancel(), { inputs: true })
    },
  )

  useHotkey('ctrl+z', () => onUndo())
  useHotkey('ctrl+shift+z', () => onRedo())
  useHotkey('ctrl+y', () => onRedo())

  function money (value: unknown) {
    return `$${Number(value).toFixed(2)}`
  }

  const total = computed(() => products.reduce((sum, p) => sum + p.price * p.quantity, 0))
  const low = computed(() => products.filter(p => p.quantity < 50).length)
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div class="flex items-center gap-4 text-xs">
        <div class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-on-surface-variant" viewBox="0 0 24 24">
            <path :d="mdiPackageVariantClosed" fill="currentColor" />
          </svg>

          <span class="text-on-surface-variant">Items</span>
          <span class="tabular-nums font-medium">{{ products.length }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <span class="text-on-surface-variant">Inventory value</span>
          <span class="tabular-nums font-medium">${{ total.toFixed(0) }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <span class="text-on-surface-variant">Low stock</span>

          <span
            class="tabular-nums font-medium px-1.5 rounded-full text-xs"
            :class="low > 0 ? 'bg-warning/15 text-warning' : 'text-on-surface-variant'"
          >
            {{ low }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div
          v-if="editedCells.size > 0"
          class="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24">
            <path :d="mdiPencilOutline" fill="currentColor" />
          </svg>

          <span class="tabular-nums">{{ editedCells.size }} edited</span>
        </div>

        <button
          class="flex items-center gap-1 px-2 py-1 text-xs border border-divider rounded hover:bg-surface-tint disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="timeline.size === 0"
          title="Undo last edit (Ctrl+Z)"
          @click="onUndo"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24">
            <path :d="mdiUndo" fill="currentColor" />
          </svg>

          Undo
        </button>

        <button
          class="flex items-center gap-1 px-2 py-1 text-xs border border-divider rounded hover:bg-surface-tint disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="!canRedo"
          title="Redo edit (Ctrl+Y)"
          @click="onRedo"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24">
            <path :d="mdiRedo" fill="currentColor" />
          </svg>

          Redo
        </button>

        <button
          class="flex items-center gap-1 px-2 py-1 text-xs border border-divider rounded hover:bg-surface-tint disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="timeline.size === 0"
          @click="onClear"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24">
            <path :d="mdiRefresh" fill="currentColor" />
          </svg>

          Clear log
        </button>
      </div>
    </div>

    <div class="border border-divider rounded-lg overflow-hidden">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="border-b border-divider bg-surface-tint">
            <th
              v-for="col in grid.layout.columns.value"
              :key="col.id"
              class="px-3 py-2 font-medium select-none"
              :class="[
                col.id === 'price' || col.id === 'quantity' ? 'text-right' : 'text-left',
                isSortable(col.id) ? 'cursor-pointer hover:bg-surface' : '',
              ]"
              :style="{ width: col.size + '%' }"
              @click="isSortable(col.id) && grid.sort.toggle(col.id)"
            >
              <div
                class="flex items-center gap-1"
                :class="col.id === 'price' || col.id === 'quantity' ? 'justify-end' : ''"
              >
                <span>{{ columns.find(c => c.id === col.id)?.title }}</span>

                <svg
                  v-if="isSortable(col.id) && grid.sort.direction(col.id) !== 'none'"
                  class="w-3 h-3"
                  viewBox="0 0 24 24"
                >
                  <path
                    :d="grid.sort.direction(col.id) === 'asc' ? mdiArrowUp : mdiArrowDown"
                    fill="currentColor"
                  />
                </svg>

                <span
                  v-if="isEditable(col.id)"
                  class="text-[10px] text-on-surface-variant"
                  title="Editable"
                >
                  <svg class="w-2.5 h-2.5" viewBox="0 0 24 24">
                    <path :d="mdiPencilOutline" fill="currentColor" />
                  </svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-divider">
          <tr
            v-for="item in grid.items.value"
            :key="item.id"
            class="hover:bg-surface-tint/40"
          >
            <td
              v-for="col in grid.layout.columns.value"
              :key="col.id"
              :ref="isEditing(item.id as ID, col.id) ? 'active-cell' : undefined"
              class="px-3 py-2 transition-colors"
              :class="[
                col.id === 'price' || col.id === 'quantity' ? 'text-right' : 'text-left',
                isEditing(item.id as ID, col.id) ? 'bg-primary/10 text-on-primary-container' : '',
                isEditable(col.id) && !isEditing(item.id as ID, col.id) ? 'cursor-text hover:bg-surface-tint' : '',
              ]"
              :style="{ width: col.size + '%' }"
              @click="onEdit(item.id as ID, col.id, item[col.id])"
            >
              <template v-if="isEditing(item.id as ID, col.id)">
                <div class="flex flex-col gap-1">
                  <input
                    ref="edit-input"
                    class="w-full bg-transparent outline-none border-none p-0 m-0 text-sm font-medium"
                    :class="col.id === 'price' || col.id === 'quantity' ? 'text-right' : 'text-left'"
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
                <span
                  class="inline-flex items-center gap-1"
                  :class="isEdited(item.id as ID, col.id) ? 'text-primary font-medium' : ''"
                >
                  <template v-if="col.id === 'price'">{{ money(item[col.id]) }}</template>
                  <template v-else-if="col.id === 'quantity'">{{ item[col.id] }}</template>
                  <template v-else>{{ item[col.id] }}</template>

                  <span
                    v-if="isEdited(item.id as ID, col.id)"
                    class="w-1 h-1 rounded-full bg-primary"
                  />
                </span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="timeline.size > 0"
      class="border border-divider rounded-lg overflow-hidden"
    >
      <div class="px-3 py-2 bg-surface-tint text-xs font-medium border-b border-divider flex items-center justify-between">
        <span>Edit history</span>
        <span class="text-on-surface-variant tabular-nums">{{ timeline.size }} / 50</span>
      </div>

      <div class="divide-y divide-divider text-xs max-h-40 overflow-y-auto">
        <div
          v-for="(entry, index) in history"
          :key="entry.id ?? index"
          class="px-3 py-2 flex items-center gap-3"
        >
          <span class="text-on-surface-variant w-16 truncate">{{ entry.value.column }}</span>
          <span class="text-on-surface-variant line-through tabular-nums">{{ entry.value.from }}</span>
          <span class="text-on-surface-variant">&rarr;</span>
          <span class="text-primary font-medium tabular-nums">{{ entry.value.to }}</span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-xs text-on-surface-variant flex items-center gap-1.5"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
        <path :d="mdiPencilOutline" fill="currentColor" />
      </svg>

      <span>Click an editable cell (Product, Price, Qty). Enter commits, Escape cancels, Ctrl+Z / Ctrl+Y to undo or redo.</span>
    </div>
  </div>
</template>
