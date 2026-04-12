<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { mdiArrowUp, mdiArrowDown, mdiPinOutline, mdiPinOffOutline } from '@mdi/js'
  import { createDataGrid, useEventListener, useToggleScope } from '@vuetify/v0'
  import { columns } from './columns'
  import { stocks } from './data'

  const grid = createDataGrid({
    items: stocks,
    columns,
  })

  const resizing = shallowRef<string | null>(null)
  let startX = 0
  let table: HTMLElement | null = null
  let resized = false

  function onResizeStart (key: string, event: PointerEvent) {
    resizing.value = key
    startX = event.clientX
    table = (event.target as HTMLElement).closest('table')
  }

  function onSort (key: string) {
    if (resized) return
    grid.sort.toggle(key)
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

  function label (key: string) {
    return columns.find(c => c.key === key)?.title ?? key
  }

  function canResize (key: string) {
    const { left, scrollable, right } = grid.layout.pinned.value
    const region = left.some(c => c.key === key)
      ? left
      : (right.some(c => c.key === key)
        ? right
        : scrollable)
    const index = region.findIndex(c => c.key === key)
    return index !== -1 && index < region.length - 1
  }

  function onPin (key: string) {
    const col = grid.layout.columns.value.find(c => c.key === key)
    if (!col) return
    if (col.pinned === 'left') grid.layout.pin(key, false)
    else if (col.pinned === 'right') grid.layout.pin(key, false)
    else grid.layout.pin(key, 'left')
  }

  function formatVolume (value: number) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return String(value)
  }

  function formatCap (value: number) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}T`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}B`
    return `$${value}M`
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <input
        class="flex-1 px-3 py-1.5 text-sm border border-divider rounded bg-surface text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
        placeholder="Search stocks..."
        type="text"
        :value="grid.query.value"
        @input="grid.search(($event.target as HTMLInputElement).value)"
      >

      <button
        class="px-3 py-1.5 text-sm border border-divider rounded hover:bg-surface-tint"
        @click="grid.layout.reset()"
      >
        Reset Layout
      </button>
    </div>

    <div
      class="border border-divider rounded-lg overflow-x-auto"
      data-grid
    >
      <table class="w-full text-sm min-w-[900px] table-fixed">
        <thead>
          <tr class="border-b border-divider">
            <th
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              class="group relative px-3 py-2 font-medium select-none overflow-hidden"
              :class="[
                col.pinned ? 'bg-surface-tint' : 'bg-surface',
                col.pinned === 'left' ? 'border-r border-divider' : '',
                col.pinned === 'right' ? 'border-l border-divider' : '',
                ['price', 'change', 'volume', 'cap', 'pe', 'eps', 'dividend'].includes(col.key) ? 'text-right' : 'text-left',
              ]"
              :style="{
                width: col.size + '%',
                position: col.pinned ? 'sticky' : undefined,
                left: col.pinned === 'left' ? col.offset + '%' : undefined,
                right: col.pinned === 'right' ? col.offset + '%' : undefined,
                zIndex: col.pinned ? 10 : undefined,
              }"
              @click="onSort(col.key)"
            >
              <div
                class="flex items-center gap-1"
                :class="['price', 'change', 'volume', 'cap', 'pe', 'eps', 'dividend'].includes(col.key) ? 'justify-end' : ''"
              >
                <button
                  class="shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                  :title="col.pinned ? 'Unpin' : 'Pin left'"
                  @click.stop="onPin(col.key)"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path :d="col.pinned ? mdiPinOffOutline : mdiPinOutline" fill="currentColor" />
                  </svg>
                </button>

                <span class="truncate">{{ label(col.key) }}</span>

                <svg
                  v-if="grid.sort.direction(col.key) !== 'none'"
                  class="w-3.5 h-3.5 shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path
                    :d="grid.sort.direction(col.key) === 'asc' ? mdiArrowUp : mdiArrowDown"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div
                v-if="canResize(col.key)"
                class="absolute top-0 -right-1 w-2 h-full cursor-col-resize z-20 hover:bg-primary/50"
                @pointerdown.stop="onResizeStart(col.key, $event)"
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
              class="px-3 py-1.5 truncate"
              :class="[
                col.pinned ? 'bg-surface-tint' : 'bg-surface',
                col.pinned === 'left' ? 'border-r border-divider' : '',
                col.pinned === 'right' ? 'border-l border-divider' : '',
                ['price', 'change', 'volume', 'cap', 'pe', 'eps', 'dividend'].includes(col.key) ? 'text-right font-mono tabular-nums' : '',
              ]"
              :style="{
                width: col.size + '%',
                position: col.pinned ? 'sticky' : undefined,
                left: col.pinned === 'left' ? col.offset + '%' : undefined,
                right: col.pinned === 'right' ? col.offset + '%' : undefined,
                zIndex: col.pinned ? 10 : undefined,
              }"
            >
              <template v-if="col.key === 'ticker'">
                <span class="font-bold uppercase">{{ item.ticker }}</span>
              </template>

              <template v-else-if="col.key === 'price'">
                ${{ item.price.toFixed(2) }}
              </template>

              <template v-else-if="col.key === 'change'">
                <span :class="item.change >= 0 ? 'text-success' : 'text-error'">
                  {{ item.change >= 0 ? '+' : '' }}{{ item.change.toFixed(2) }}%
                </span>
              </template>

              <template v-else-if="col.key === 'volume'">
                {{ formatVolume(item.volume) }}
              </template>

              <template v-else-if="col.key === 'cap'">
                {{ formatCap(item.cap) }}
              </template>

              <template v-else-if="col.key === 'pe'">
                {{ item.pe.toFixed(1) }}
              </template>

              <template v-else-if="col.key === 'eps'">
                ${{ item.eps.toFixed(2) }}
              </template>

              <template v-else-if="col.key === 'dividend'">
                {{ item.dividend.toFixed(2) }}%
              </template>

              <template v-else>
                {{ item[col.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
