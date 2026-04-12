<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { createDataGrid } from '@vuetify/v0'
  import { columns } from './columns'
  import { employees } from './data'

  const grid = createDataGrid({
    items: employees,
    columns,
  })

  const resizing = shallowRef<{ key: string, startX: number } | null>(null)

  function onResizeStart (key: string, event: PointerEvent) {
    resizing.value = { key, startX: event.clientX }
    ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
  }

  function onResizeMove (event: PointerEvent) {
    if (!resizing.value) return
    const container = (event.target as HTMLElement).closest('[data-grid]')
    if (!container) return
    const width = container.clientWidth
    const delta = ((event.clientX - resizing.value.startX) / width) * 100
    grid.layout.resize(resizing.value.key, delta)
    resizing.value.startX = event.clientX
  }

  function onResizeEnd () {
    resizing.value = null
  }

  function onPin (key: string, position: 'left' | 'right' | false) {
    grid.layout.pin(key, position)
  }

  function label (key: string) {
    return columns.find(c => c.key === key)?.title ?? key
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex justify-end">
      <button
        class="px-3 py-1 text-sm border border-divider rounded hover:bg-surface-tint"
        @click="grid.layout.reset()"
      >
        Reset Layout
      </button>
    </div>

    <div
      class="border border-divider rounded-lg overflow-x-auto"
      data-grid
    >
      <table class="w-full text-sm" style="min-width: 700px">
        <thead>
          <tr class="border-b border-divider">
            <th
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              class="relative px-4 py-3 text-left font-medium select-none"
              :class="col.pinned ? 'bg-surface-tint' : 'bg-surface'"
              :style="{
                width: col.size + '%',
                position: col.pinned ? 'sticky' : undefined,
                left: col.pinned === 'left' ? col.offset + '%' : undefined,
                right: col.pinned === 'right' ? col.offset + '%' : undefined,
                zIndex: col.pinned ? 1 : undefined,
              }"
            >
              <div class="flex items-center gap-1">
                <span class="truncate">{{ label(col.key) }}</span>

                <button
                  v-if="col.pinned !== 'left'"
                  class="text-xs opacity-40 hover:opacity-100"
                  title="Pin left"
                  @click="onPin(col.key, 'left')"
                >
                  ◀
                </button>

                <button
                  v-if="col.pinned"
                  class="text-xs opacity-40 hover:opacity-100"
                  title="Unpin"
                  @click="onPin(col.key, false)"
                >
                  ✕
                </button>

                <button
                  v-if="col.pinned !== 'right'"
                  class="text-xs opacity-40 hover:opacity-100"
                  title="Pin right"
                  @click="onPin(col.key, 'right')"
                >
                  ▶
                </button>
              </div>

              <div
                v-if="col.index < grid.layout.columns.value.length - 1"
                class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary"
                @pointerdown="onResizeStart(col.key, $event)"
                @pointermove="onResizeMove"
                @pointerup="onResizeEnd"
              />
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
              :class="col.pinned ? 'bg-surface-tint' : 'bg-surface'"
              :style="{
                width: col.size + '%',
                position: col.pinned ? 'sticky' : undefined,
                left: col.pinned === 'left' ? col.offset + '%' : undefined,
                right: col.pinned === 'right' ? col.offset + '%' : undefined,
                zIndex: col.pinned ? 1 : undefined,
              }"
            >
              <template v-if="col.key === 'salary'">${{ (item[col.key] as number).toLocaleString() }}</template>
              <template v-else>{{ item[col.key] }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
