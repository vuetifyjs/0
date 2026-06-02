<script setup lang="ts">
  import {
    mdiArrowDown,
    mdiArrowUp,
    mdiPencilOutline,
  } from '@mdi/js'

  import type { ID } from '@vuetify/v0'

  import EditHistory from './EditHistory.vue'
  import EditToolbar from './EditToolbar.vue'
  import { products } from './data'
  import { useEditableGrid } from './useEditableGrid'

  const {
    grid,
    timeline,
    input,
    canRedo,
    history,
    editedCells,
    isEditing,
    isEdited,
    isEditable,
    isSortable,
    onEdit,
    onCommit,
    onUndo,
    onRedo,
    onClear,
    money,
    total,
    low,
  } = useEditableGrid()
</script>

<template>
  <div class="flex flex-col gap-3">
    <EditToolbar
      :can-redo
      :edited-count="editedCells.size"
      :item-count="products.length"
      :low
      :timeline-size="timeline.size"
      :total
      @clear="onClear"
      @redo="onRedo"
      @undo="onUndo"
    />

    <div class="border border-divider rounded-lg overflow-hidden" data-grid>
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
                <span>{{ grid.columns.get(col.id)?.title }}</span>

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

    <EditHistory :history :size="timeline.size" />
  </div>
</template>
