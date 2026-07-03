/**
 * @module createDataGrid/layout
 *
 * @remarks
 * Manages column layout state for data grids: sizing (percentages 0-100),
 * pinning (left/right/scrollable regions), delta-based resizing compatible
 * with the Splitter two-panel model, column reordering, and visibility.
 *
 * Column existence, display order, AND grid layout config (size, pin,
 * min/max, resizable, reorderable) all live on the table's columns registry
 * (passed in as the only argument). `createRegistry` preserves the extra
 * grid fields on each ticket, so layout reads its config straight off the
 * registered ticket — there is no separate defs array. Columns onboarded
 * before OR after the layout is built are picked up identically: an initial
 * loop seeds the already-registered set and a `register:ticket` handler seeds
 * the rest. Removed columns have their pin/size/visibility state pruned via
 * unregister events.
 *
 * Sizing uses percentages so it is compatible with the Splitter component.
 * Offsets are computed per-region (left, scrollable, right) independently
 * and over visible columns only — hidden columns are excluded from the
 * render set without auto-redistribution (headless: the consumer rebalances
 * via `distribute()` or CSS).
 *
 * @internal Private sibling of `createDataGrid`, and intentionally NOT a
 * promotion candidate: it is bound to the table's `DataTableColumnTicket`
 * types, so it is parent-specific glue rather than a reusable primitive. See
 * `.claude/rules/composables.md` §"Sub-modules: inline, private sibling, or
 * promote".
 */

// Composables
import { extractLeaves } from '#v0/composables/createDataTable/columns'
import { createGroup } from '#v0/composables/createGroup'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { clamp, isUndefined } from '#v0/utilities'
import { computed, shallowReactive } from 'vue'

// Types
import type { ColumnNode } from '#v0/composables/createDataTable/columns'
import type { RegistryContext, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
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
  /** Distance from the column's pinning edge — left edge for left/scrollable, right edge for right. Apply directly as the CSS `left` / `right` value for sticky positioning. */
  offset: number
  pinned: PinPosition
  resizable: boolean
  reorderable: boolean
  minSize: number
  maxSize: number
  /** Whether the column is part of the render set. Always `true` for render-set entries; meaningful on `all`, where hidden columns surface as `false`. */
  visible: boolean
}

export interface PinnedRegion {
  left: ResolvedColumn[]
  scrollable: ResolvedColumn[]
  right: ResolvedColumn[]
}

export interface ColumnLayout {
  /** Resolved columns for each pin region (hidden columns excluded) */
  pinned: Readonly<Ref<PinnedRegion>>
  /** All visible resolved columns in display order (hidden columns excluded) */
  columns: Readonly<Ref<ResolvedColumn[]>>
  /** Every column in display order, including hidden ones, each carrying a `visible` flag — for a column chooser. */
  all: Readonly<Ref<ResolvedColumn[]>>
  /** Pin a column to a region (or unpin with false) */
  pin: (id: string, position: PinPosition) => void
  /**
   * Resize a column by delta percentage within its pin region.
   * The neighbor to the right absorbs the inverse delta.
   * No-op for the last column in its region or non-resizable columns.
   */
  resize: (id: string, delta: number) => void
  /**
   * Move a column from one display-order index to another. Indices address
   * the visible display set (matching `columns`), so hidden columns are not
   * counted. No-op if the resolved top-level group has `reorderable: false`.
   */
  reorder: (from: number, to: number) => void
  /** Replace all sizes at once and normalize to sum to 100 */
  distribute: (sizes: number[]) => void
  /** Show a previously hidden column */
  show: (id: string) => void
  /** Hide a column — excludes it from the render set without redistributing */
  hide: (id: string) => void
  /** Toggle a column's visibility */
  toggle: (id: string) => void
  /** Restore initial sizes, order, and pins */
  reset: () => void
}

interface ColumnConfig {
  size?: number
  minSize: number
  maxSize: number
  resizable: boolean
  reorderable: boolean
  pinned: PinPosition
}

const DEFAULT_EXTRAS = {
  minSize: 2,
  maxSize: 100,
  resizable: true,
  reorderable: true,
} as const

function offsets (cols: ResolvedColumn[], reverse = false): void {
  let offset = 0
  const start = reverse ? cols.length - 1 : 0
  const step = reverse ? -1 : 1
  const end = reverse ? -1 : cols.length
  for (let i = start; i !== end; i += step) {
    cols[i]!.offset = offset
    offset += cols[i]!.size
  }
}

/**
 * Creates a column layout manager for a data grid.
 *
 * Reads column existence, display order, AND grid layout config (size, pin,
 * min/max, resizable, reorderable) from the table's columns registry. The
 * grid fields ride on each ticket — `createRegistry` preserves them — so
 * there is no separate defs array. Visibility is layout-local view state
 * (not a ticket field) kept here and reconciled via register / unregister /
 * clear events.
 *
 * Generic over the registry's input/output ticket types so the caller's
 * concrete grid column ticket (`DataGridColumnTicket`) flows through. Layout
 * only ever reads from the registry (`values`, `keys`, `on`, `reorder`,
 * `move`, `lookup`) — it never registers — so the output ticket need only be
 * readable as a {@link GridColumnDef}.
 *
 * @param cols The table's columns registry — source of truth for which
 *             columns exist, in what order, and their layout config
 * @returns Column layout state and mutation methods
 */
export function createColumnLayout<
  Z extends RegistryTicketInput = GridColumnDef,
  E extends RegistryTicket & GridColumnDef & Z = RegistryTicket & GridColumnDef & Z,
> (
  cols: RegistryContext<Z, E>,
): ColumnLayout {
  const logger = useLogger()

  // Per-id config snapshot captured at register time. Drives `reset` and the
  // resolved per-column metadata. Order is derived from the registered order,
  // never a defs array.
  const configs = new Map<string, ColumnConfig>()

  // Group manages pin state (selected=left, mixed=right, unselected=none)
  const group = createGroup({ multiple: true })

  // Sizes stored separately — they change too frequently for registry tickets
  const sizes = shallowReactive(new Map<string, number>())

  // Visibility is layout-local view state. Membership = hidden; absence =
  // visible. All columns start visible.
  const hidden = shallowReactive(new Set<string>())

  // Top-level column ids in first-registration order, captured as columns
  // register. `reset` restores this order (nested children travel with their
  // parent, so only top-level ids are tracked). No defs array involved.
  const order: string[] = []

  function record (id: string) {
    if (!order.includes(id)) order.push(id)
  }

  /** Even share over the currently-registered leaves: explicit sizes are
   *  honored, unsized columns split the remaining percentage. */
  function share (id: string): number {
    const leaves = extractLeaves(cols.values())
    let used = 0
    let unsized = 0
    for (const leaf of leaves) {
      const size = configs.get(String(leaf.id))?.size
      if (isUndefined(size)) unsized++
      else used += size
    }
    const own = configs.get(id)?.size
    if (!isUndefined(own)) return own
    const remainder = Math.max(0, 100 - used)
    return unsized > 0 ? remainder / unsized : 0
  }

  function seedLeaf (leaf: GridColumnDef) {
    const id = String(leaf.id)

    if (!configs.has(id)) {
      configs.set(id, {
        size: leaf.size,
        minSize: leaf.minSize ?? DEFAULT_EXTRAS.minSize,
        maxSize: leaf.maxSize ?? DEFAULT_EXTRAS.maxSize,
        resizable: leaf.resizable ?? DEFAULT_EXTRAS.resizable,
        reorderable: leaf.reorderable ?? DEFAULT_EXTRAS.reorderable,
        pinned: leaf.pinned ?? false,
      })
    }

    if (!group.has(id)) group.register({ id, value: id })

    if (!sizes.has(id)) sizes.set(id, share(id))

    // Rebalance already-seeded auto-sized leaves so a late unsized column
    // re-splits the remainder. Skip leaves not yet in `configs` (still mid-seed
    // during construction/incremental registration) — pre-empting them with a
    // share() snapshot would block their real size from ever landing.
    for (const other of extractLeaves(cols.values())) {
      const otherId = String(other.id)
      if (configs.has(otherId) && isUndefined(configs.get(otherId)?.size)) sizes.set(otherId, share(otherId))
    }

    const config = configs.get(id)!
    if (config.pinned === 'left') group.select(id)
    else if (config.pinned === 'right') group.mix(id)
  }

  function dropLeaf (id: string) {
    group.unregister(id)
    configs.delete(id)
    sizes.delete(id)
    hidden.delete(id)
  }

  function leavesOf (ticket: GridColumnDef): GridColumnDef[] {
    return extractLeaves([ticket])
  }

  // Seed for already-registered columns. The registry may be empty at
  // construction (columns onboarded later) — this loop tolerates that and the
  // register:ticket handler picks up the rest.
  for (const ticket of cols.values()) {
    record(String(ticket.id))
    for (const leaf of leavesOf(ticket)) seedLeaf(leaf)
  }

  cols.on('register:ticket', ticket => {
    record(String(ticket.id))
    for (const leaf of leavesOf(ticket)) seedLeaf(leaf)
  })

  cols.on('unregister:ticket', ticket => {
    const top = order.indexOf(String(ticket.id))
    if (top !== -1) order.splice(top, 1)
    for (const leaf of leavesOf(ticket)) dropLeaf(String(leaf.id))
  })

  cols.on('clear:registry', () => {
    group.clear()
    configs.clear()
    sizes.clear()
    hidden.clear()
    order.length = 0
  })

  function position (id: string): PinPosition {
    if (group.selectedIds.has(id)) return 'left'
    if (group.mixed(id)) return 'right'
    return false
  }

  function resolve (includeHidden: boolean): ResolvedColumn[] {
    const resolved: ResolvedColumn[] = []
    let index = 0
    for (const ticket of extractLeaves(cols.values())) {
      const id = String(ticket.id)
      const visible = !hidden.has(id)
      if (!includeHidden && !visible) continue
      const meta = configs.get(id) ?? DEFAULT_EXTRAS
      resolved.push({
        id,
        index: index++,
        size: sizes.get(id) ?? 0,
        offset: 0,
        pinned: position(id),
        resizable: meta.resizable,
        reorderable: meta.reorderable,
        minSize: meta.minSize,
        maxSize: meta.maxSize,
        visible,
      })
    }
    return resolved
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
    offsets(right, true)

    return { left, scrollable, right }
  }

  // Render set: visible columns only, offsets over visible.
  const pinned = computed((): PinnedRegion => split(resolve(false)))

  const columns = computed((): ResolvedColumn[] => {
    const { left, scrollable, right } = pinned.value
    return [...left, ...scrollable, ...right]
  })

  // Full set incl. hidden, each carrying `visible` — for a column chooser.
  const allColumns = computed((): ResolvedColumn[] => resolve(true))

  function pin (id: string, pos: PinPosition) {
    if (!group.has(id)) return
    group.unselect(id)
    group.unmix(id)
    if (pos === 'left') group.select(id)
    else if (pos === 'right') group.mix(id)
  }

  function resize (id: string, delta: number) {
    // Read from the cached `pinned` computed rather than recomputing resolve() + split()
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

    // Build the ordered full leaf-id list alongside a map from each leaf's
    // full index to its top-level column group, so reordering moves whole
    // groups (nested children travel with their parent).
    const tops = [...cols.values()]
    const ids: string[] = []
    const leafToTop: number[] = []
    for (const [top, ticket] of tops.entries()) {
      for (const leaf of extractLeaves([ticket])) {
        ids.push(String(leaf.id))
        leafToTop.push(top)
      }
    }

    // from/to index the visible display set (what `columns` exposes), not the
    // full leaf list — translate through the visible subset before mapping to
    // top-level groups. With nothing hidden, visible === ids, so this is a
    // no-op translation and behaves identically to indexing the leaf list.
    const visible = ids.filter(id => !hidden.has(id))
    const fromId = visible[from]
    const toId = visible[to]
    if (isUndefined(fromId) || isUndefined(toId)) return

    const fromTop = leafToTop[ids.indexOf(fromId)]
    const toTop = leafToTop[ids.indexOf(toId)]
    if (isUndefined(fromTop) || isUndefined(toTop) || fromTop === toTop) return

    // Gate on the TOP-LEVEL group's reorderable: for flat columns that is the
    // column itself; for a group the header's config governs the whole move.
    if (tops[fromTop]?.reorderable === false) return

    const id = cols.lookup(fromTop)
    if (isUndefined(id)) return
    cols.move(id, toTop)
  }

  function distribute (incoming: number[]) {
    const tickets = extractLeaves(cols.values())
    if (incoming.length !== tickets.length) {
      logger.warn(`createDataGrid: distribute() expected ${tickets.length} sizes but received ${incoming.length}; ignoring.`)
      return
    }

    const sum = incoming.reduce((acc, value) => acc + value, 0)
    if (sum <= 0) {
      logger.warn(`createDataGrid: distribute() received sizes summing to ${sum}; expected a positive total.`)
      return
    }

    // Normalize proportionally to sum 100, then clamp each to its constraints.
    const metas = tickets.map(ticket => configs.get(String(ticket.id)) ?? DEFAULT_EXTRAS)
    let current = incoming.map((value, i) => clamp(value / sum * 100, metas[i]!.minSize, metas[i]!.maxSize))

    // Redistribute the residual proportionally across columns that still have
    // room in the residual's direction. Bounded loop guards against constraints
    // that make 100 unreachable.
    let residual = 100 - current.reduce((acc, value) => acc + value, 0)
    const max = tickets.length * 2
    for (let pass = 0; pass < max && Math.abs(residual) >= 1e-6; pass++) {
      const room = current.map((value, i) => residual > 0 ? metas[i]!.maxSize - value : value - metas[i]!.minSize)
      const available = room.reduce((acc, value) => acc + Math.max(0, value), 0)
      if (available <= 0) break

      current = current.map((value, i) => room[i]! <= 0 ? value : value + residual * (room[i]! / available))

      residual = 100 - current.reduce((acc, value) => acc + value, 0)
    }

    if (Math.abs(residual) >= 1e-6) {
      logger.warn(`createDataGrid: distribute() could not reach 100 within min/max constraints (off by ${residual.toFixed(2)})`)
    }

    for (const [i, ticket] of tickets.entries()) {
      sizes.set(String(ticket.id), current[i]!)
    }
  }

  function show (id: string) {
    hidden.delete(id)
  }

  function hide (id: string) {
    hidden.add(id)
  }

  function toggle (id: string) {
    if (hidden.has(id)) hidden.delete(id)
    else hidden.add(id)
  }

  function reset () {
    // Restore sizes from the per-id config snapshot, deriving order from the
    // registered order (not a defs array).
    for (const ticket of extractLeaves(cols.values())) {
      const id = String(ticket.id)
      sizes.set(id, share(id))
    }

    // Restore original display order via the registry's bulk reorder. Order is
    // the first-registration order captured at register time, never a defs array.
    cols.reorder([...order])

    hidden.clear()

    for (const ticket of extractLeaves(cols.values())) {
      const id = String(ticket.id)
      group.unselect(id)
      group.unmix(id)
    }
    for (const [id, config] of configs) {
      if (config.pinned === 'left') group.select(id)
      else if (config.pinned === 'right') group.mix(id)
    }
  }

  return {
    pinned,
    columns,
    all: allColumns,
    pin,
    resize,
    reorder,
    distribute,
    show,
    hide,
    toggle,
    reset,
  }
}
