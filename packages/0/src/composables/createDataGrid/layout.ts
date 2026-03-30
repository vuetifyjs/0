/**
 * @module createDataGrid/layout
 *
 * @remarks
 * Manages column layout state for data grids: sizing (percentages 0-100),
 * pinning (left/right/scrollable regions), delta-based resizing compatible
 * with the Splitter two-panel model, and column reordering.
 *
 * Sizing uses percentages so it is compatible with the Splitter component.
 * Offsets are computed per-region (left, scrollable, right) independently.
 */

// Composables
import { extractLeaves } from '#v0/composables/createDataTable/columns'

// Utilities
import { clamp } from '#v0/utilities'
import { reactive, ref, shallowReactive, toRef } from 'vue'

// Types
import type { ColumnNode } from '#v0/composables/createDataTable/columns'
import type { Ref } from 'vue'

export type PinPosition = 'left' | 'right' | false

export interface GridColumnDef extends ColumnNode {
  /** Width as a percentage (0–100). Unset columns share remaining space equally. */
  readonly size?: number
  /** Minimum width as a percentage. @default 2 */
  readonly minSize?: number
  /** Maximum width as a percentage. @default 100 */
  readonly maxSize?: number
  /** Pin position. @default false */
  readonly pinned?: PinPosition
  /** Allow resizing. @default true */
  readonly resizable?: boolean
  /** Allow reordering. @default true */
  readonly reorderable?: boolean
  readonly children?: readonly GridColumnDef[]
}

export interface ResolvedColumn {
  key: string
  index: number
  /** Current size as a percentage */
  size: number
  /** Cumulative offset within the column's pin region */
  offset: number
  pinned: PinPosition
  resizable: boolean
  reorderable: boolean
  minSize: number
  maxSize: number
}

export interface PinnedRegion {
  left: ResolvedColumn[]
  scrollable: ResolvedColumn[]
  right: ResolvedColumn[]
}

export interface ColumnLayout {
  /** Resolved columns for each pin region */
  pinned: Readonly<Ref<PinnedRegion>>
  /** All resolved columns in display order */
  columns: Readonly<Ref<ResolvedColumn[]>>
  /** Pin a column to a region (or unpin with false) */
  pin: (key: string, position: PinPosition) => void
  /**
   * Resize a column by delta percentage within its pin region.
   * The neighbor to the right absorbs the inverse delta.
   * No-op for the last column in its region or non-resizable columns.
   */
  resize: (key: string, delta: number) => void
  /** Move a column from one display-order index to another */
  reorder: (from: number, to: number) => void
  /** Replace all sizes at once and normalize to sum to 100 */
  distribute: (sizes: number[]) => void
  /** Restore initial sizes, order, and pins */
  reset: () => void
}

function distributeEven (leaves: GridColumnDef[]): Map<string, number> {
  const map = new Map<string, number>()
  const explicit = leaves.filter(c => c.size !== undefined)
  const implicit = leaves.filter(c => c.size === undefined)

  const usedTotal = explicit.reduce((sum, c) => sum + c.size!, 0)
  const remainder = Math.max(0, 100 - usedTotal)
  const share = implicit.length > 0 ? remainder / implicit.length : 0

  for (const col of leaves) {
    map.set(col.key, col.size === undefined ? share : col.size)
  }

  return map
}

function computeOffsets (cols: ResolvedColumn[]): void {
  let offset = 0
  for (const col of cols) {
    col.offset = offset
    offset += col.size
  }
}

function splitRegions (keys: string[], resolved: Map<string, ResolvedColumn>): PinnedRegion {
  const left: ResolvedColumn[] = []
  const scrollable: ResolvedColumn[] = []
  const right: ResolvedColumn[] = []

  for (const key of keys) {
    const col = resolved.get(key)
    if (!col) continue
    if (col.pinned === 'left') left.push(col)
    else if (col.pinned === 'right') right.push(col)
    else scrollable.push(col)
  }

  computeOffsets(left)
  computeOffsets(scrollable)
  computeOffsets(right)

  return { left, scrollable, right }
}

/**
 * Creates a column layout manager for a data grid.
 *
 * @param defs Column definitions (may be nested; leaves are extracted)
 * @returns Column layout state and mutation methods
 */
export function createColumnLayout (defs: readonly GridColumnDef[]): ColumnLayout {
  const leaves = extractLeaves(defs)
  const initial = distributeEven(leaves)

  // Initial snapshots for reset
  const initialSizes = new Map(initial)
  const initialOrder = leaves.map(c => c.key)
  const initialPins = new Map<string, PinPosition>(
    leaves.map(c => [c.key, c.pinned ?? false]),
  )

  const sizes = shallowReactive(new Map(initial))
  const order = ref([...initialOrder])
  const pins = reactive(new Map(initialPins))

  const defMap = new Map<string, GridColumnDef>(leaves.map(c => [c.key, c]))

  function resolved (): Map<string, ResolvedColumn> {
    const map = new Map<string, ResolvedColumn>()
    let index = 0
    for (const key of order.value) {
      const def = defMap.get(key)!
      map.set(key, {
        key,
        index: index++,
        size: sizes.get(key) ?? 0,
        offset: 0,
        pinned: pins.get(key) ?? false,
        resizable: def.resizable ?? true,
        reorderable: def.reorderable ?? true,
        minSize: def.minSize ?? 2,
        maxSize: def.maxSize ?? 100,
      })
    }
    return map
  }

  const pinned = toRef((): PinnedRegion => {
    return splitRegions(order.value, resolved())
  })

  const columns = toRef((): ResolvedColumn[] => {
    const { left, scrollable, right } = pinned.value
    return [...left, ...scrollable, ...right]
  })

  function pin (key: string, position: PinPosition) {
    if (!defMap.has(key)) return
    pins.set(key, position)
  }

  function resize (key: string, delta: number) {
    const r = resolved()
    const col = r.get(key)
    if (!col || !col.resizable) return

    // Find the region this column belongs to
    const region = pinned.value
    let group: ResolvedColumn[]
    if (col.pinned === 'left') group = region.left
    else if (col.pinned === 'right') group = region.right
    else group = region.scrollable

    const regionIndex = group.findIndex(c => c.key === key)
    if (regionIndex === -1 || regionIndex === group.length - 1) return

    const target = group[regionIndex]!
    const neighbor = group[regionIndex + 1]!

    const total = target.size + neighbor.size
    const lower = Math.max(target.minSize, total - neighbor.maxSize)
    const upper = Math.min(target.maxSize, total - neighbor.minSize)

    const newSize = clamp(target.size + delta, lower, upper)
    sizes.set(key, newSize)
    sizes.set(neighbor.key, total - newSize)
  }

  function reorder (from: number, to: number) {
    const arr = [...order.value]
    const [item] = arr.splice(from, 1)
    if (item === undefined) return
    arr.splice(to, 0, item)
    order.value = arr
  }

  function distribute (incoming: number[]) {
    const keys = order.value
    if (incoming.length !== keys.length) return

    // Apply raw values first, clamped to min/max
    for (const [i, key_] of keys.entries()) {
      const key = key_!
      const def = defMap.get(key)!
      const min = def.minSize ?? 2
      const max = def.maxSize ?? 100
      sizes.set(key, clamp(incoming[i]!, min, max))
    }

    // Normalize so total sums to 100
    let remainder = 100 - keys.reduce((sum, k) => sum + (sizes.get(k) ?? 0), 0)
    for (const key of keys) {
      if (remainder === 0) break
      const def = defMap.get(key)!
      const min = def.minSize ?? 2
      const max = def.maxSize ?? 100
      const current = sizes.get(key) ?? 0
      const room = remainder > 0 ? max - current : current - min
      const adjust = remainder > 0 ? Math.min(remainder, room) : Math.max(remainder, -room)
      sizes.set(key, current + adjust)
      remainder -= adjust
    }
  }

  function reset () {
    for (const [key, size] of initialSizes) {
      sizes.set(key, size)
    }
    order.value = [...initialOrder]
    for (const [key, position] of initialPins) {
      pins.set(key, position)
    }
  }

  return {
    pinned,
    columns,
    pin,
    resize,
    reorder,
    distribute,
    reset,
  }
}
