/**
 * @module createDataGrid/layout
 *
 * @remarks
 * Manages column layout state for data grids: sizing (percentages 0-100),
 * pinning (left/right/scrollable regions), delta-based resizing compatible
 * with the Splitter two-panel model, and column reordering.
 *
 * Column existence and display order live on the table's columns registry
 * (passed in as the first argument). The layout module reads from it and
 * adds layout-specific state (sizes, pin group, per-column extras) that
 * the column ticket does not carry. Late-registered columns pick up
 * defaults via register events; removed columns have their pin/size
 * state pruned via unregister events.
 *
 * Sizing uses percentages so it is compatible with the Splitter component.
 * Offsets are computed per-region (left, scrollable, right) independently.
 */

// Composables
import { extractLeaves } from '#v0/composables/createDataTable/columns'
import { createGroup } from '#v0/composables/createGroup'

// Utilities
import { clamp, isUndefined } from '#v0/utilities'
import { shallowReactive, toRef } from 'vue'

// Types
import type { DataTableColumnTicket, DataTableColumnTicketInput } from '#v0/composables/createDataTable'
import type { ColumnNode } from '#v0/composables/createDataTable/columns'
import type { RegistryContext } from '#v0/composables/createRegistry'
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
  id: string
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
  pin: (id: string, position: PinPosition) => void
  /**
   * Resize a column by delta percentage within its pin region.
   * The neighbor to the right absorbs the inverse delta.
   * No-op for the last column in its region or non-resizable columns.
   */
  resize: (id: string, delta: number) => void
  /** Move a column from one display-order index to another */
  reorder: (from: number, to: number) => void
  /** Replace all sizes at once and normalize to sum to 100 */
  distribute: (sizes: number[]) => void
  /** Restore initial sizes, order, and pins */
  reset: () => void
}

interface ColumnExtras {
  minSize: number
  maxSize: number
  resizable: boolean
  reorderable: boolean
}

const DEFAULT_EXTRAS: ColumnExtras = {
  minSize: 2,
  maxSize: 100,
  resizable: true,
  reorderable: true,
}

function distributeEven (leaves: readonly GridColumnDef[]): Map<string, number> {
  const map = new Map<string, number>()
  const explicit = leaves.filter(c => !isUndefined(c.size))
  const implicit = leaves.filter(c => isUndefined(c.size))

  const used = explicit.reduce((sum, c) => sum + c.size!, 0)
  const remainder = Math.max(0, 100 - used)
  const share = implicit.length > 0 ? remainder / implicit.length : 0

  for (const col of leaves) {
    map.set(col.id, isUndefined(col.size) ? share : col.size)
  }

  return map
}

function offsets (cols: ResolvedColumn[]): void {
  let offset = 0
  for (const col of cols) {
    col.offset = offset
    offset += col.size
  }
}

/**
 * Creates a column layout manager for a data grid.
 *
 * Reads column existence and display order from the table's columns
 * registry. Layout-specific state (sizes, pin group, per-column min/max
 * and resizable/reorderable flags) is kept locally and reconciled via
 * register / unregister / clear events.
 *
 * @param cols The table's columns registry — source of truth for which
 *             columns exist and in what order
 * @param defs Column definitions used to seed initial sizes, pins, and
 *             per-column extras (minSize, maxSize, resizable, reorderable)
 * @returns Column layout state and mutation methods
 */
export function createColumnLayout<T extends Record<string, unknown>> (
  cols: RegistryContext<DataTableColumnTicketInput<T>, DataTableColumnTicket<T>>,
  defs: readonly GridColumnDef[],
): ColumnLayout {
  const leaves = extractLeaves(defs)
  const initial = distributeEven(leaves)

  // Lookups built once from the initial defs. Late-registered columns
  // fall back to defaults via the register handler below.
  const initialPins = new Map<string, PinPosition>(
    leaves.map(c => [c.id, c.pinned ?? false]),
  )

  const extras = new Map<string, ColumnExtras>()
  for (const col of leaves) {
    extras.set(col.id, {
      minSize: col.minSize ?? DEFAULT_EXTRAS.minSize,
      maxSize: col.maxSize ?? DEFAULT_EXTRAS.maxSize,
      resizable: col.resizable ?? DEFAULT_EXTRAS.resizable,
      reorderable: col.reorderable ?? DEFAULT_EXTRAS.reorderable,
    })
  }

  // Initial snapshots for reset
  const snapshot = {
    sizes: new Map(initial),
    // Top-level column order — the registry holds top-level entries; nested
    // children move with their parent. `cols.reorder` operates on the top-
    // level id set.
    order: defs.map(c => c.id),
    pins: new Map(initialPins),
  }

  // Group manages pin state (selected=left, mixed=right, unselected=none)
  const group = createGroup({ multiple: true })

  // Sizes stored separately — they change too frequently for registry tickets
  const sizes = shallowReactive(new Map<string, number>())

  function seedLeaf (id: string) {
    if (!group.has(id)) group.register({ id, value: id })

    if (!extras.has(id)) extras.set(id, { ...DEFAULT_EXTRAS })

    if (!sizes.has(id)) {
      // Late registrations default to 0 — consumers can call `distribute`
      // to rebalance once the full column set is known.
      sizes.set(id, initial.get(id) ?? 0)
    }

    const pos = initialPins.get(id)
    if (pos === 'left') group.select(id)
    else if (pos === 'right') group.mix(id)
  }

  function dropLeaf (id: string) {
    group.unregister(id)
    extras.delete(id)
    sizes.delete(id)
  }

  function leavesOf (ticket: DataTableColumnTicket<T>): DataTableColumnTicket<T>[] {
    return extractLeaves([ticket])
  }

  // Seed for already-registered columns (table.columns.onboard runs before
  // createColumnLayout in createDataGrid).
  for (const leaf of extractLeaves(cols.values())) {
    seedLeaf(String(leaf.id))
  }

  cols.on('register:ticket', ticket => {
    for (const leaf of leavesOf(ticket)) seedLeaf(String(leaf.id))
  })

  cols.on('unregister:ticket', ticket => {
    for (const leaf of leavesOf(ticket)) dropLeaf(String(leaf.id))
  })

  cols.on('clear:registry', () => {
    group.clear()
    extras.clear()
    sizes.clear()
  })

  function position (id: string): PinPosition {
    if (group.selectedIds.has(id)) return 'left'
    if (group.mixed(id)) return 'right'
    return false
  }

  function resolve (): ResolvedColumn[] {
    return extractLeaves(cols.values()).map((ticket, index) => {
      const id = String(ticket.id)
      const meta = extras.get(id) ?? DEFAULT_EXTRAS
      return {
        id,
        index,
        size: sizes.get(id) ?? 0,
        offset: 0,
        pinned: position(id),
        resizable: meta.resizable,
        reorderable: meta.reorderable,
        minSize: meta.minSize,
        maxSize: meta.maxSize,
      }
    })
  }

  function split (resolved: ResolvedColumn[]): PinnedRegion {
    const left: ResolvedColumn[] = []
    const scrollable: ResolvedColumn[] = []
    const right: ResolvedColumn[] = []

    for (const col of resolved) {
      if (col.pinned === 'left') left.push(col)
      else if (col.pinned === 'right') right.push(col)
      else scrollable.push(col)
    }

    offsets(left)
    offsets(scrollable)
    offsets(right)

    return { left, scrollable, right }
  }

  const pinned = toRef((): PinnedRegion => split(resolve()))

  const columns = toRef((): ResolvedColumn[] => {
    const { left, scrollable, right } = pinned.value
    return [...left, ...scrollable, ...right]
  })

  function pin (id: string, pos: PinPosition) {
    if (!cols.has(id)) return
    group.unselect(id)
    group.unmix(id)
    if (pos === 'left') group.select(id)
    else if (pos === 'right') group.mix(id)
  }

  function resize (id: string, delta: number) {
    // Read from cached pinned.value instead of resolve() + split()
    const { left, scrollable, right } = pinned.value
    const all = [...left, ...scrollable, ...right]
    const target = all.find(c => c.id === id)
    if (!target || !target.resizable) return

    // Pick the neighbor in display order. Pinned columns at the trailing edge
    // of their region fall through to the first column of the next region so
    // they remain resizable.
    const allIndex = all.findIndex(c => c.id === id)
    if (allIndex === -1 || allIndex === all.length - 1) return

    const neighbor = all[allIndex + 1]!

    const total = target.size + neighbor.size
    const lower = Math.max(target.minSize, total - neighbor.maxSize)
    const upper = Math.min(target.maxSize, total - neighbor.minSize)

    const clamped = clamp(target.size + delta, lower, upper)
    sizes.set(id, clamped)
    sizes.set(neighbor.id, total - clamped)
  }

  function reorder (from: number, to: number) {
    if (from === to) return
    const id = cols.lookup(from)
    if (!id) return
    cols.move(id, to)
  }

  function distribute (incoming: number[]) {
    const tickets = extractLeaves(cols.values())
    if (incoming.length !== tickets.length) return

    for (const [i, ticket] of tickets.entries()) {
      const id = String(ticket.id)
      const meta = extras.get(id) ?? DEFAULT_EXTRAS
      sizes.set(id, clamp(incoming[i]!, meta.minSize, meta.maxSize))
    }

    let remainder = 100 - tickets.reduce((sum, t) => sum + (sizes.get(String(t.id)) ?? 0), 0)
    for (const ticket of tickets) {
      if (remainder === 0) break
      const id = String(ticket.id)
      const meta = extras.get(id) ?? DEFAULT_EXTRAS
      const current = sizes.get(id) ?? 0
      const room = remainder > 0 ? meta.maxSize - current : current - meta.minSize
      const adjust = remainder > 0 ? Math.min(remainder, room) : Math.max(remainder, -room)
      sizes.set(id, current + adjust)
      remainder -= adjust
    }
  }

  function reset () {
    for (const [id, size] of snapshot.sizes) {
      sizes.set(id, size)
    }

    // Restore original display order via the registry's bulk reorder.
    cols.reorder(snapshot.order)

    for (const ticket of cols.values()) {
      group.unselect(ticket.id)
      group.unmix(ticket.id)
    }
    for (const [id, pos] of snapshot.pins) {
      if (pos === 'left') group.select(id)
      else if (pos === 'right') group.mix(id)
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
