<script setup lang="ts">
  import { nextTick, ref, shallowRef, useTemplateRef } from 'vue'
  import { mdiArrowUp, mdiArrowDown, mdiChevronUp, mdiChevronDown } from '@mdi/js'
  import {
    createDataGrid,
    useClickOutside,
    useEventListener,
    useHotkey,
    useToggleScope,
  } from '@vuetify/v0'
  import type { ID } from '@vuetify/v0'
  import { columns } from './columns'
  import { projects } from './data'

  const grid = createDataGrid({
    columns,
    rowReordering: true,
    editing: {
      onEdit (row, column, value) {
        const item = projects.find(p => p.id === row)
        if (item) {
          (item as Record<string, unknown>)[column] = column === 'budget'
            ? Number(value)
            : value
        }
      },
    },
  })

  grid.onboard(projects.map(value => ({ id: value.id, value })))

  // -- Resize --
  const resizing = shallowRef<string | null>(null)
  let startX = 0
  let table: HTMLElement | null = null
  let resized = false

  function onResizeStart (id: string, event: PointerEvent) {
    resizing.value = id
    startX = event.clientX
    table = (event.target as HTMLElement).closest('table')
  }

  useToggleScope(
    () => !!resizing.value,
    () => {
      useEventListener(document, 'pointermove', (event: PointerEvent) => {
        if (!resizing.value || !table) return
        const delta = ((event.clientX - startX) / table.clientWidth) * 100
        startX = event.clientX
        grid.layout.resize(resizing.value, delta)
      })
      useEventListener(document, 'pointerup', () => {
        resizing.value = null
        table = null
        resized = true
        requestAnimationFrame(() => {
          resized = false
        })
      })
    },
  )

  function canResize (id: string) {
    const { left, scrollable, right } = grid.layout.pinned.value
    const region = left.some(c => c.id === id)
      ? left
      : (right.some(c => c.id === id) ? right : scrollable)
    const index = region.findIndex(c => c.id === id)
    return index !== -1 && index < region.length - 1
  }

  // -- Sort --
  function onSort (id: string) {
    if (resized) return
    grid.sort.toggle(id)
  }

  // -- Editing --
  const input = ref('')
  const editRef = useTemplateRef<HTMLInputElement>('edit-input')
  const cell = useTemplateRef<HTMLTableCellElement>('active-cell')

  function onEdit (row: ID, column: string, value: unknown) {
    const col = columns.find(c => c.id === column)
    if (!col?.editable) return
    grid.editing.edit(row, column)
    input.value = String(value ?? '')
    nextTick(() => {
      editRef.value?.focus()
      editRef.value?.select()
    })
  }

  function isEditing (row: ID, column: string) {
    const a = grid.editing.active.value
    return a?.row === row && a?.column === column
  }

  useToggleScope(
    () => !!grid.editing.active.value,
    () => {
      useClickOutside(cell, () => grid.editing.cancel())
      useHotkey('escape', () => grid.editing.cancel(), { inputs: true })
    },
  )

  // -- Helpers --
  function label (id: string) {
    return columns.find(c => c.id === id)?.title ?? id
  }

  function tint (v: number) {
    if (v > 70) return 'bg-success'
    if (v >= 30) return 'bg-warning'
    return 'bg-error'
  }
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <input
        class="flex-1 px-3 py-1.5 text-sm border border-divider rounded bg-surface text-on-surface outline-none focus:border-primary"
        placeholder="Search..."
        type="text"
        :value="grid.query.value"
        @input="grid.search(($event.target as HTMLInputElement).value)"
      >

      <button
        class="px-3 py-1.5 text-xs border border-divider rounded hover:bg-surface-tint"
        @click="grid.layout.reset()"
      >
        Reset
      </button>
    </div>

    <div class="border border-divider rounded-lg overflow-x-auto">
      <table class="w-full text-xs table-fixed min-w-[700px]">
        <thead>
          <tr class="border-b border-divider">
            <th
              v-for="col in grid.layout.columns.value"
              :key="col.id"
              class="group relative px-3 py-2 font-semibold text-left select-none overflow-hidden uppercase tracking-wider text-on-surface/60"
              :class="[
                col.pinned ? 'bg-surface-tint border-r border-divider' : 'bg-surface',
              ]"
              :style="{
                width: col.size + '%',
                position: col.pinned ? 'sticky' : undefined,
                left: col.pinned === 'left' ? col.offset + '%' : undefined,
                zIndex: col.pinned ? 10 : undefined,
              }"
              @click="onSort(col.id)"
            >
              <div class="flex items-center gap-1">
                <span class="truncate">{{ label(col.id) }}</span>

                <svg
                  v-if="grid.sort.direction(col.id) !== 'none'"
                  class="w-3 h-3 shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path
                    :d="grid.sort.direction(col.id) === 'asc' ? mdiArrowUp : mdiArrowDown"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div
                v-if="canResize(col.id)"
                class="absolute top-0 -right-1 w-2 h-full cursor-col-resize z-20 hover:bg-primary/50"
                @pointerdown.stop="onResizeStart(col.id, $event)"
              />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in grid.items.value"
            :key="item.id"
            class="border-b border-divider/50 hover:bg-surface-tint/50 transition-colors"
          >
            <td
              v-for="col in grid.layout.columns.value"
              :key="col.id"
              :ref="isEditing(item.id as ID, col.id) ? 'active-cell' : undefined"
              class="px-3 py-1.5 truncate"
              :class="[
                col.pinned ? 'bg-surface-tint border-r border-divider' : '',
                columns.find(c => c.id === col.id)?.editable && !isEditing(item.id as ID, col.id)
                  ? 'cursor-pointer hover:bg-primary/5' : '',
              ]"
              :style="{
                width: col.size + '%',
                position: col.pinned ? 'sticky' : undefined,
                left: col.pinned === 'left' ? col.offset + '%' : undefined,
                zIndex: col.pinned ? 10 : undefined,
                outline: isEditing(item.id as ID, col.id) ? '2px solid var(--v0-color-primary)' : undefined,
                outlineOffset: isEditing(item.id as ID, col.id) ? '-2px' : undefined,
              }"
              @click="onEdit(item.id as ID, col.id, item[col.id])"
            >
              <!-- Editing -->
              <template v-if="isEditing(item.id as ID, col.id)">
                <div class="flex flex-col gap-0.5">
                  <input
                    ref="edit-input"
                    class="w-full bg-transparent outline-none border-none p-0 text-xs"
                    :class="col.id === 'budget' ? 'text-right' : ''"
                    :value="input"
                    @input="input = ($event.target as HTMLInputElement).value"
                    @keydown.enter="grid.editing.commit(input)"
                  >

                  <span v-if="grid.editing.error.value" class="text-[10px] text-error">
                    {{ grid.editing.error.value }}
                  </span>
                </div>
              </template>

              <!-- Progress bar -->
              <template v-else-if="col.id === 'progress'">
                <div class="flex items-center gap-1.5">
                  <div class="flex-1 h-1 bg-on-surface/10 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full"
                      :class="tint(item.progress)"
                      :style="{ width: item.progress + '%' }"
                    />
                  </div>

                  <span class="tabular-nums text-on-surface/50 w-6 text-right">{{ item.progress }}%</span>
                </div>
              </template>

              <!-- Budget -->
              <template v-else-if="col.id === 'budget'">
                <span class="block text-right tabular-nums">${{ (item.budget as number).toLocaleString() }}</span>
              </template>

              <!-- Status pill -->
              <template v-else-if="col.id === 'status'">
                <span
                  class="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                  :class="{
                    'bg-success/15 text-success': item.status === 'active',
                    'bg-warning/15 text-warning': item.status === 'paused',
                    'bg-on-surface/10 text-on-surface/60': item.status === 'done',
                  }"
                >
                  {{ item.status }}
                </span>
              </template>

              <!-- Row reorder (due column) -->
              <template v-else-if="col.id === 'due'">
                <div class="flex items-center gap-1">
                  <span class="tabular-nums">{{ item.due.slice(5) }}</span>

                  <div class="flex flex-col ml-auto">
                    <button
                      class="opacity-0 group-hover:opacity-40 hover:!opacity-100 disabled:!opacity-10"
                      :disabled="index === 0"
                      @click.stop="grid.rows.move(index, index - 1)"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24">
                        <path :d="mdiChevronUp" fill="currentColor" />
                      </svg>
                    </button>

                    <button
                      class="opacity-0 group-hover:opacity-40 hover:!opacity-100 disabled:!opacity-10"
                      :disabled="index === grid.items.value.length - 1"
                      @click.stop="grid.rows.move(index, index + 1)"
                    >
                      <svg class="w-3 h-3" viewBox="0 0 24 24">
                        <path :d="mdiChevronDown" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                </div>
              </template>

              <!-- Default -->
              <template v-else>
                {{ item[col.id] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-xs text-on-surface/60">
      <span>{{ grid.total.value }} projects</span>

      <div class="flex items-center gap-1">
        <button
          class="px-2 py-1 border border-divider rounded hover:bg-surface-tint disabled:op-30"
          :disabled="grid.pagination.isFirst.value"
          @click="grid.pagination.prev()"
        >
          Prev
        </button>

        <span class="px-2 tabular-nums">{{ grid.pagination.page.value }} / {{ grid.pagination.pages }}</span>

        <button
          class="px-2 py-1 border border-divider rounded hover:bg-surface-tint disabled:op-30"
          :disabled="grid.pagination.isLast.value"
          @click="grid.pagination.next()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
