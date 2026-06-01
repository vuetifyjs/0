<script setup lang="ts">
  import { computed } from 'vue'

  import { mdiArrowDownThin, mdiArrowUpThin, mdiBank, mdiChartLine, mdiMinusThick } from '@mdi/js'

  import { createDataGrid } from '@vuetify/v0'

  import { columns } from './columns'
  import { holdings } from './data'
  import type { Holding } from './data'

  const grid = createDataGrid<Holding>({
    rowSpanning (item, column) {
      if (column !== 'account' && column !== 'assetClass') return 1

      const index = holdings.findIndex(h => h.id === item.id)
      let count = 1

      while (index + count < holdings.length) {
        const next = holdings[index + count]
        if (next.account !== item.account) break
        if (column === 'assetClass' && next.assetClass !== item.assetClass) break
        count++
      }

      return count
    },
  })

  grid.columns.onboard(columns)
  grid.onboard(holdings.map(value => ({ id: value.id, value })))

  function isAccountHead (id: number) {
    const span = grid.spans.value.get(id)?.get('account')
    return span && !span.hidden && span.rowSpan > 1
  }

  function isClassHead (id: number) {
    const span = grid.spans.value.get(id)?.get('assetClass')
    return span && !span.hidden
  }

  function money (value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  }

  function accountTotal (account: string) {
    return holdings.filter(h => h.account === account).reduce((sum, h) => sum + h.value, 0)
  }

  function classTotal (account: string, assetClass: string) {
    return holdings
      .filter(h => h.account === account && h.assetClass === assetClass)
      .reduce((sum, h) => sum + h.value, 0)
  }

  const portfolio = computed(() => holdings.reduce((sum, h) => sum + h.value, 0))
  const accountsCount = computed(() => new Set(holdings.map(h => h.account)).size)

  function changeIcon (change: number) {
    if (change > 0) return mdiArrowUpThin
    if (change < 0) return mdiArrowDownThin
    return mdiMinusThick
  }

  function changeColor (change: number) {
    if (change > 0) return 'text-success'
    if (change < 0) return 'text-error'
    return 'text-on-surface-variant'
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div class="flex items-center gap-2 text-sm">
        <svg class="w-4 h-4 text-on-surface-variant" viewBox="0 0 24 24">
          <path :d="mdiChartLine" fill="currentColor" />
        </svg>

        <span class="font-medium">Portfolio holdings</span>
      </div>

      <div class="flex items-center gap-4 text-xs">
        <div class="flex items-center gap-1.5">
          <span class="text-on-surface-variant">Accounts</span>
          <span class="tabular-nums font-medium">{{ accountsCount }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <span class="text-on-surface-variant">Positions</span>
          <span class="tabular-nums font-medium">{{ holdings.length }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <span class="text-on-surface-variant">Portfolio</span>
          <span class="tabular-nums font-medium">{{ money(portfolio) }}</span>
        </div>
      </div>
    </div>

    <div class="border border-divider rounded-lg overflow-x-auto">
      <table class="w-full text-sm min-w-[760px] table-fixed">
        <thead>
          <tr class="border-b border-divider bg-surface-tint">
            <th
              v-for="col in grid.layout.columns.value"
              :key="col.id"
              class="px-3 py-2.5 text-left font-medium text-xs uppercase tracking-wide text-on-surface-variant"
              :class="col.id === 'value' || col.id === 'change' ? 'text-right' : ''"
              :style="{ width: col.size + '%' }"
            >
              {{ columns.find(c => c.id === col.id)?.title }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in grid.items.value"
            :key="item.id"
            class="border-b border-divider/40 hover:bg-surface-tint/40 transition-colors"
            :class="index === 0 || isAccountHead(item.id as number) ? 'border-t border-divider' : ''"
          >
            <template v-for="col in grid.layout.columns.value" :key="col.id">
              <td
                v-if="!grid.spans.value.get(item.id as number)?.get(col.id)?.hidden"
                class="px-3 py-2"
                :class="[
                  col.id === 'value' || col.id === 'change' ? 'text-right tabular-nums' : '',
                  col.id === 'account' && isAccountHead(item.id as number)
                    ? 'align-top bg-primary/5 border-r border-divider'
                    : '',
                  col.id === 'assetClass' && isClassHead(item.id as number)
                    ? 'align-top bg-surface-tint/40 border-r border-divider/60'
                    : '',
                ]"
                :rowspan="grid.spans.value.get(item.id as number)?.get(col.id)?.rowSpan"
                :style="{ width: col.size + '%' }"
              >
                <template v-if="col.id === 'account'">
                  <div class="flex items-start gap-2">
                    <svg class="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" viewBox="0 0 24 24">
                      <path :d="mdiBank" fill="currentColor" />
                    </svg>

                    <div class="flex flex-col">
                      <span class="font-semibold text-sm">{{ item.account }}</span>
                      <span class="text-xs tabular-nums text-on-surface-variant">{{ money(accountTotal(item.account as string)) }}</span>
                    </div>
                  </div>
                </template>

                <template v-else-if="col.id === 'assetClass'">
                  <div class="flex flex-col">
                    <span class="font-medium text-xs uppercase tracking-wide">{{ item.assetClass }}</span>
                    <span class="text-[11px] tabular-nums text-on-surface-variant">{{ money(classTotal(item.account as string, item.assetClass as string)) }}</span>
                  </div>
                </template>

                <template v-else-if="col.id === 'ticker'">
                  <span class="font-mono text-xs px-1.5 py-0.5 rounded bg-surface-tint">{{ item.ticker }}</span>
                </template>

                <template v-else-if="col.id === 'name'">
                  <span class="text-on-surface">{{ item.name }}</span>
                </template>

                <template v-else-if="col.id === 'value'">
                  <span>{{ money(item.value as number) }}</span>
                </template>

                <template v-else-if="col.id === 'change'">
                  <span
                    class="inline-flex items-center justify-end gap-0.5 font-medium"
                    :class="changeColor(item.change as number)"
                  >
                    <svg class="w-3 h-3" viewBox="0 0 24 24">
                      <path :d="changeIcon(item.change as number)" fill="currentColor" />
                    </svg>

                    {{ (item.change as number).toFixed(1) }}%
                  </span>
                </template>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-xs text-on-surface-variant">
      The <span class="font-medium text-on-surface">Account</span> column spans every holding under that account; <span class="font-medium text-on-surface">Asset Class</span> spans every holding within the same account-and-class pair. The grid resolves both spans from a single <code class="text-[11px] px-1 rounded bg-surface-tint">rowSpanning</code> callback that walks the source order.
    </div>
  </div>
</template>
