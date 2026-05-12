<script setup lang="ts">
  import { computed, shallowRef } from 'vue'

  import { mdiArrowDown, mdiArrowUp, mdiChartLine, mdiPin, mdiPinOffOutline, mdiPinOutline, mdiRefresh } from '@mdi/js'

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
    if (col.pinned === 'left') grid.layout.pin(key, 'right')
    else if (col.pinned === 'right') grid.layout.pin(key, false)
    else grid.layout.pin(key, 'left')
  }

  function pinTitle (pinned: 'left' | 'right' | false) {
    if (pinned === 'left') return 'Pinned left — click to pin right'
    if (pinned === 'right') return 'Pinned right — click to unpin'
    return 'Click to pin left'
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

  const numericKeys = new Set(['price', 'change', 'volume', 'cap', 'pe', 'eps', 'dividend'])

  function isNumeric (key: string) {
    return numericKeys.has(key)
  }

  const stats = computed(() => {
    const items = grid.items.value
    const gainers = items.filter(s => s.change > 0).length
    const losers = items.filter(s => s.change < 0).length
    const volume = items.reduce((sum, s) => sum + s.volume, 0)
    return { gainers, losers, volume }
  })

  const pinnedSummary = computed(() => {
    const { left, scrollable, right } = grid.layout.pinned.value
    return { left: left.length, scrollable: scrollable.length, right: right.length }
  })
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div class="flex items-center gap-2 text-sm">
        <svg class="w-4 h-4 text-on-surface-variant" viewBox="0 0 24 24">
          <path :d="mdiChartLine" fill="currentColor" />
        </svg>

        <span class="font-medium">Market overview</span>

        <span class="text-xs text-on-surface-variant ml-2">
          <span class="tabular-nums text-success">{{ stats.gainers }}↑</span>
          ·
          <span class="tabular-nums text-error">{{ stats.losers }}↓</span>
          · Vol <span class="tabular-nums">{{ formatVolume(stats.volume) }}</span>
        </span>
      </div>

      <div class="flex items-center gap-2">
        <input
          class="px-3 py-1 text-xs border border-divider rounded bg-surface text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary w-44"
          placeholder="Filter ticker or company…"
          type="text"
          :value="grid.query.value"
          @input="grid.search(($event.target as HTMLInputElement).value)"
        >

        <button
          class="flex items-center gap-1 px-2 py-1 text-xs border border-divider rounded hover:bg-surface-tint"
          @click="grid.layout.reset()"
        >
          <svg class="w-3 h-3" viewBox="0 0 24 24">
            <path :d="mdiRefresh" fill="currentColor" />
          </svg>

          Reset
        </button>
      </div>
    </div>

    <div
      class="border border-divider rounded-lg overflow-x-auto"
      data-grid
    >
      <table class="w-full text-sm min-w-[1100px] table-fixed">
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
                isNumeric(col.key) ? 'text-right' : 'text-left',
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
                :class="isNumeric(col.key) ? 'justify-end' : ''"
              >
                <button
                  class="shrink-0 transition-opacity"
                  :class="col.pinned ? 'opacity-80 text-primary' : 'opacity-0 group-hover:opacity-60 hover:!opacity-100'"
                  :title="pinTitle(col.pinned)"
                  @click.stop="onPin(col.key)"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      :d="col.pinned === 'left' ? mdiPin : col.pinned === 'right' ? mdiPinOffOutline : mdiPinOutline"
                      fill="currentColor"
                    />
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
                isNumeric(col.key) ? 'text-right font-mono tabular-nums' : '',
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

    <div class="flex items-center gap-3 text-xs text-on-surface-variant">
      <span class="tabular-nums">{{ grid.items.value.length }} of {{ stocks.length }} stocks</span>

      <span class="text-divider">·</span>

      <span class="flex items-center gap-1">
        <svg class="w-3 h-3" viewBox="0 0 24 24">
          <path :d="mdiPin" fill="currentColor" />
        </svg>

        <span class="tabular-nums">{{ pinnedSummary.left }} left</span>
        <span>·</span>
        <span class="tabular-nums">{{ pinnedSummary.scrollable }} scrollable</span>
        <span>·</span>
        <span class="tabular-nums">{{ pinnedSummary.right }} right</span>
      </span>

      <span class="text-divider">·</span>

      <span>Hover headers to pin, drag handles to resize</span>
    </div>
  </div>
</template>
