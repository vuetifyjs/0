import { computed } from 'vue'

import { mdiArrowDownThin, mdiArrowUpThin, mdiBank, mdiChartLine, mdiMinusThick } from '@mdi/js'

import { createDataGrid } from '@vuetify/v0'

import { columns } from './columns'
import { holdings } from './data'
import type { Holding } from './data'

export function useSpanningGrid () {
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

  return {
    grid,
    holdings,
    mdiBank,
    mdiChartLine,
    isAccountHead,
    isClassHead,
    money,
    accountTotal,
    classTotal,
    portfolio,
    accountsCount,
    changeIcon,
    changeColor,
  }
}
