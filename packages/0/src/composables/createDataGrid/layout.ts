/**
 * @module createDataGrid/layout
 *
 * @remarks
 * Manages column layout state for data grids: sizing (percentages 0-100),
 * pinning (left/right/scrollable regions), delta-based resizing compatible
 * with the Splitter two-panel model, and column reordering.
 *
 * Built on v0 primitives:
 * - createRegistry for column collection and ordering
 * - createGroup for pin state (tri-state: selected=left, mixed=right, unselected=none)
 *
 * Sizing uses percentages so it is compatible with the Splitter component.
 * Offsets are computed per-region (left, scrollable, right) independently.
 */

// Composables
import { extractLeaves } from '#v0/composables/createDataTable/columns'
import { createGroup } from '#v0/composables/createGroup'
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { clamp, isUndefined } from '#v0/utilities'
import { shallowReactive, toRef } from 'vue'

// Types
import type { ColumnNode } from '#v0/composables/createDataTable/columns'
import type { RegistryTicketInput } from '#v0/composables/createRegistry'
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

interface ColumnTicketInput extends RegistryTicketInput {
  minSize: number
  maxSize: number
  resizable: boolean
  reorderable: boolean
}

function distributeEven (leaves: GridColumnDef[]): Map<string, number> {
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
 * @param defs Column definitions (may be nested; leaves are extracted)
 * @returns Column layout state and mutation methods
 */
export function createColumnLayout (defs: readonly GridColumnDef[]): ColumnLayout {
  const leaves = extractLeaves(defs)
  const initial = distributeEven(leaves)

  // Initial snapshots for reset
  const snapshot = {
    sizes: new Map(initial),
    order: leaves.map(c => c.id),
    pins: new Map<string, PinPosition>(
      leaves.map(c => [c.id, c.pinned ?? false]),
    ),
  }

  // Registry manages column collection and ordering
  const registry = createRegistry<ColumnTicketInput>({ reactive: true })
  registry.onboard(
    leaves.map(col => ({
      id: col.id,
      value: col.id,
      minSize: col.minSize ?? 2,
      maxSize: col.maxSize ?? 100,
      resizable: col.resizable ?? true,
      reorderable: col.reorderable ?? true,
    })),
  )

  // Group manages pin state (selected=left, mixed=right, unselected=none)
  const group = createGroup({ multiple: true })
  group.onboard(leaves.map(col => ({ id: col.id, value: col.id })))

  for (const col of leaves) {
    if (col.pinned === 'left') group.select(col.id)
    else if (col.pinned === 'right') group.mix(col.id)
  }

  // Sizes stored separately — they change too frequently for registry tickets
  const sizes = shallowReactive(new Map(initial))

  function position (id: string): PinPosition {
    if (group.selectedIds.has(id)) return 'left'
    if (group.mixed(id)) return 'right'
    return false
  }

  function resolve (): ResolvedColumn[] {
    return registry.values().map((ticket, index) => {
      const id = String(ticket.id)
      return {
        id,
        index,
        size: sizes.get(id) ?? 0,
        offset: 0,
        pinned: position(id),
        resizable: ticket.resizable,
        reorderable: ticket.reorderable,
        minSize: ticket.minSize,
        maxSize: ticket.maxSize,
      }
    })
  }

  function split (cols: ResolvedColumn[]): PinnedRegion {
    const left: ResolvedColumn[] = []
    const scrollable: ResolvedColumn[] = []
    const right: ResolvedColumn[] = []

    for (const col of cols) {
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
    if (!registry.has(id)) return
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
    const id = registry.lookup(from)
    if (!id) return
    registry.move(id, to)
  }

  function distribute (incoming: number[]) {
    const tickets = registry.values()
    if (incoming.length !== tickets.length) return

    for (const [i, ticket] of tickets.entries()) {
      const id = String(ticket.id)
      sizes.set(id, clamp(incoming[i]!, ticket.minSize, ticket.maxSize))
    }

    let remainder = 100 - tickets.reduce((sum, t) => sum + (sizes.get(String(t.id)) ?? 0), 0)
    for (const ticket of tickets) {
      if (remainder === 0) break
      const id = String(ticket.id)
      const current = sizes.get(id) ?? 0
      const room = remainder > 0 ? ticket.maxSize - current : current - ticket.minSize
      const adjust = remainder > 0 ? Math.min(remainder, room) : Math.max(remainder, -room)
      sizes.set(id, current + adjust)
      remainder -= adjust
    }
  }

  function reset () {
    for (const [id, size] of snapshot.sizes) {
      sizes.set(id, size)
    }

    for (const [index, id] of snapshot.order.entries()) {
      registry.move(id, index)
    }

    for (const ticket of registry.values()) {
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
