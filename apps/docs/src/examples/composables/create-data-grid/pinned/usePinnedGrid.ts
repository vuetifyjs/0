import { computed, shallowRef, useTemplateRef } from 'vue'

import { createDataGrid, useDocumentEventListener, useResizeObserver, useToggleScope } from '@vuetify/v0'

import { columns } from './columns'
import { stocks } from './data'
import type { Stock } from './data'

export function usePinnedGrid () {
  const grid = createDataGrid<Stock>()

  grid.columns.onboard(columns)
  grid.onboard(stocks.map(value => ({ id: value.id, value })))

  const resizing = shallowRef<string | null>(null)
  let startX = 0
  let table: HTMLElement | null = null
  let resized = false

  // Sticky offsets must match the table's real pixel width: the layout offsets
  // are a percentage of the table, but a sticky `left`/`right` percentage
  // resolves against the scroll viewport, which is narrower once the table
  // overflows — so pinned columns past the first would drift. Resolve to px.
  const tableEl = useTemplateRef<HTMLTableElement>('table-el')
  const tableWidth = shallowRef(0)
  useResizeObserver(tableEl, ([entry]) => {
    tableWidth.value = entry.contentRect.width
  })

  function inset (offset: number) {
    return tableWidth.value * offset / 100 + 'px'
  }

  function onResizeStart (id: string, event: PointerEvent) {
    resizing.value = id
    startX = event.clientX
    table = (event.target as HTMLElement).closest('table')
  }

  function onSort (id: string) {
    if (resized) return
    grid.sort.toggle(id)
  }

  useToggleScope(
    () => !!resizing.value,
    () => {
      useDocumentEventListener('pointermove', (event: PointerEvent) => {
        if (!resizing.value || !table) return
        const delta = ((event.clientX - startX) / table.clientWidth) * 100
        startX = event.clientX
        grid.layout.resize(resizing.value, delta)
      })

      useDocumentEventListener('pointerup', () => {
        resizing.value = null
        table = null
        resized = true
        requestAnimationFrame(() => {
          resized = false
        })
      })
    },
  )

  function label (id: string) {
    return grid.columns.get(id)?.title ?? id
  }

  function canResize (id: string) {
    const cols = grid.layout.columns.value
    const index = cols.findIndex(c => c.id === id)
    return index !== -1 && index < cols.length - 1
  }

  function onPin (id: string) {
    const col = grid.layout.columns.value.find(c => c.id === id)
    if (!col) return
    if (col.pinned === 'left') grid.layout.pin(id, 'right')
    else if (col.pinned === 'right') grid.layout.pin(id, false)
    else grid.layout.pin(id, 'left')
  }

  function pinTitle (pinned: 'left' | 'right' | false) {
    if (pinned === 'left') return 'Pinned left — click to pin right'
    if (pinned === 'right') return 'Pinned right — click to unpin'
    return 'Click to pin left'
  }

  function volume (value: number) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return String(value)
  }

  function cap (value: number) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}T`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}B`
    return `$${value}M`
  }

  const numeric = new Set(['price', 'change', 'volume', 'cap', 'pe', 'eps', 'dividend'])

  function isNumeric (id: string) {
    return numeric.has(id)
  }

  const stats = computed(() => {
    const items = grid.items.value
    const up = items.filter(s => s.change > 0).length
    const down = items.filter(s => s.change < 0).length
    const vol = items.reduce((sum, s) => sum + s.volume, 0)
    return { up, down, vol }
  })

  const summary = computed(() => {
    const { left, scrollable, right } = grid.layout.pinned.value
    return { left: left.length, scrollable: scrollable.length, right: right.length }
  })

  return {
    grid,
    tableEl,
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
  }
}
