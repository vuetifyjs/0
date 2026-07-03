<script setup lang="ts">
  import { mdiChartLine, mdiRefresh } from '@mdi/js'

  import type { DataGridContext } from '@vuetify/v0'

  import type { Stock } from './data'

  const { grid, stats, volume } = defineProps<{
    grid: DataGridContext<Stock>
    stats: { up: number, down: number, vol: number }
    volume: (value: number) => string
  }>()
</script>

<template>
  <div class="flex items-center justify-between flex-wrap gap-2">
    <div class="flex items-center gap-2 text-sm">
      <svg class="w-4 h-4 text-on-surface-variant" viewBox="0 0 24 24">
        <path :d="mdiChartLine" fill="currentColor" />
      </svg>

      <span class="font-medium">Market overview</span>

      <span class="text-xs text-on-surface-variant ml-2">
        <span class="tabular-nums text-success">{{ stats.up }}↑</span>
        ·
        <span class="tabular-nums text-error">{{ stats.down }}↓</span>
        · Vol <span class="tabular-nums">{{ volume(stats.vol) }}</span>
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
</template>
