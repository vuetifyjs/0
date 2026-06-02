<script setup lang="ts">
  import { mdiArrowDown, mdiArrowUp, mdiPin, mdiPinOffOutline, mdiPinOutline } from '@mdi/js'

  import PinnedFooter from './PinnedFooter.vue'
  import PinnedToolbar from './PinnedToolbar.vue'
  import { stocks } from './data'
  import { usePinnedGrid } from './usePinnedGrid'

  const {
    grid,
    inset,
    onResizeStart,
    onSort,
    label,
    canResize,
    onPin,
    pinTitle,
    volume,
    cap,
    isNumeric,
    stats,
    summary,
  } = usePinnedGrid()
</script>

<template>
  <div class="flex flex-col gap-3">
    <PinnedToolbar :grid :stats :volume />

    <div
      class="border border-divider rounded-lg overflow-hidden"
      data-grid
    >
      <div class="overflow-x-auto">
        <table
          ref="table-el"
          class="w-full text-sm min-w-[1100px] table-fixed"
          style="overflow: visible"
        >
          <thead>
            <tr class="border-b border-divider">
              <th
                v-for="col in grid.layout.columns.value"
                :key="col.id"
                class="group relative px-3 py-2 font-medium select-none overflow-hidden"
                :class="[
                  col.pinned ? 'bg-surface-tint' : 'bg-surface',
                  col.pinned === 'left' ? 'border-r border-divider' : '',
                  col.pinned === 'right' ? 'border-l border-divider' : '',
                  isNumeric(col.id) ? 'text-right' : 'text-left',
                ]"
                :style="{
                  width: col.size + '%',
                  position: col.pinned ? 'sticky' : undefined,
                  left: col.pinned === 'left' ? inset(col.offset) : undefined,
                  right: col.pinned === 'right' ? inset(col.offset) : undefined,
                  zIndex: col.pinned ? 10 : undefined,
                }"
                @click="onSort(col.id)"
              >
                <div
                  class="flex items-center gap-1"
                  :class="isNumeric(col.id) ? 'justify-end' : ''"
                >
                  <button
                    class="shrink-0 transition-opacity"
                    :class="col.pinned ? 'opacity-80 text-primary' : 'opacity-0 group-hover:opacity-60 hover:!opacity-100'"
                    :title="pinTitle(col.pinned)"
                    @click.stop="onPin(col.id)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        :d="col.pinned === 'left' ? mdiPin : col.pinned === 'right' ? mdiPinOffOutline : mdiPinOutline"
                        fill="currentColor"
                      />
                    </svg>
                  </button>

                  <span class="truncate">{{ label(col.id) }}</span>

                  <svg
                    v-if="grid.sort.direction(col.id) !== 'none'"
                    class="w-3.5 h-3.5 shrink-0"
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

          <tbody class="divide-y divide-divider">
            <tr
              v-for="item in grid.items.value"
              :key="item.id"
              class="hover:bg-surface-tint transition-colors"
            >
              <td
                v-for="col in grid.layout.columns.value"
                :key="col.id"
                class="px-3 py-1.5 truncate"
                :class="[
                  col.pinned ? 'bg-surface-tint' : 'bg-surface',
                  col.pinned === 'left' ? 'border-r border-divider' : '',
                  col.pinned === 'right' ? 'border-l border-divider' : '',
                  isNumeric(col.id) ? 'text-right font-mono tabular-nums' : '',
                ]"
                :style="{
                  width: col.size + '%',
                  position: col.pinned ? 'sticky' : undefined,
                  left: col.pinned === 'left' ? inset(col.offset) : undefined,
                  right: col.pinned === 'right' ? inset(col.offset) : undefined,
                  zIndex: col.pinned ? 10 : undefined,
                }"
              >
                <template v-if="col.id === 'ticker'">
                  <span class="font-bold uppercase">{{ item.ticker }}</span>
                </template>

                <template v-else-if="col.id === 'price'">
                  ${{ item.price.toFixed(2) }}
                </template>

                <template v-else-if="col.id === 'change'">
                  <span :class="item.change >= 0 ? 'text-success' : 'text-error'">
                    {{ item.change >= 0 ? '+' : '' }}{{ item.change.toFixed(2) }}%
                  </span>
                </template>

                <template v-else-if="col.id === 'volume'">
                  {{ volume(item.volume) }}
                </template>

                <template v-else-if="col.id === 'cap'">
                  {{ cap(item.cap) }}
                </template>

                <template v-else-if="col.id === 'pe'">
                  {{ item.pe.toFixed(1) }}
                </template>

                <template v-else-if="col.id === 'eps'">
                  ${{ item.eps.toFixed(2) }}
                </template>

                <template v-else-if="col.id === 'dividend'">
                  {{ item.dividend.toFixed(2) }}%
                </template>

                <template v-else>
                  {{ item[col.id] }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <PinnedFooter
      :summary
      :total="stocks.length"
      :visible-count="grid.items.value.length"
    />
  </div>
</template>
