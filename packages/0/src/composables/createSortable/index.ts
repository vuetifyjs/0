/**
 * @module createSortable
 *
 * @see https://0.vuetifyjs.com/composables/data/create-sortable
 *
 * @remarks
 * Headless ordered-list primitive. Extends `createModel` with mutation primitives
 * (`swap`, `reorder`) and an enriched `move:ticket` event on the registry event
 * bus. Honors `disabled` as a real mutation gate at both root and per-ticket scope.
 *
 * Pure logical composable — no DnD, no DOM, no keyboard. Drag-and-drop integration
 * composes with `useDragDrop`; keyboard reorder composes with `useVirtualFocus`.
 *
 * @example
 * ```ts
 * import { createSortable } from '@vuetify/v0'
 * import type { SortableTicketInput } from '@vuetify/v0'
 *
 * interface TaskTicket extends SortableTicketInput {
 *   value: { id: number; label: string }
 * }
 *
 * const sortable = createSortable<TaskTicket>()
 * const a = sortable.register({ value: { id: 1, label: 'A' } })
 * const b = sortable.register({ value: { id: 2, label: 'B' } })
 *
 * sortable.move(a.id, 1)
 * sortable.on('move:ticket', ({ ticket, from, to }) => {
 *   console.log(`${ticket.value.label} moved ${from} → ${to}`)
 * })
 * ```
 */

// Composables
import { createModel } from '#v0/composables/createModel'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { toValue } from 'vue'

// Types
import type { ModelContext, ModelOptions, ModelTicket, ModelTicketInput } from '#v0/composables/createModel'
import type { RegistryEventCallback, RegistryEventName } from '#v0/composables/createRegistry'
import type { Extensible, ID } from '#v0/types'
import type { MaybeRefOrGetter } from 'vue'

/**
 * Input shape passed to `register` / `onboard`. Inherits all model fields.
 *
 * @template V Type of the per-ticket value.
 *
 * @example
 * ```ts
 * interface TaskTicket extends SortableTicketInput {
 *   value: { id: number; label: string }
 * }
 *
 * const sortable = createSortable<TaskTicket>()
 * sortable.register({ value: { id: 1, label: 'A' } })
 * ```
 */
export type SortableTicketInput<V = unknown> = ModelTicketInput<V>

/**
 * Output ticket returned by `register` / `onboard` / `get`.
 * Aliased to `ModelTicket<Z>` — sortable adds no per-ticket fields.
 *
 * @template Z The input ticket type (carries the value type V).
 */
export type SortableTicket<Z extends SortableTicketInput = SortableTicketInput> = ModelTicket<Z>

/**
 * Options accepted by `createSortable`.
 *
 * @example
 * ```ts
 * const sortable = createSortable({
 *   disabled: toRef(() => isReadOnlyMode.value),
 * })
 * ```
 */
export interface SortableOptions extends Omit<ModelOptions, 'events'> {
  /**
   * Mutation gate. When truthy, `move` / `swap` / `reorder` silently no-op.
   *
   * @default false
   * @remarks Per-ticket `disabled` is honored at the `move` and `swap` call sites
   * for that ticket. `reorder` **bypasses** per-ticket `disabled` — it's a bulk
   * operation declaring the canonical order, and applying that order may relocate
   * disabled tickets. `register` / `onboard` / `unregister` are NEVER gated —
   * those are composition, not user-driven reorder.
   *
   * @example
   * ```ts
   * const sortable = createSortable({ disabled: toRef(() => isSaving.value) })
   * ```
   */
  disabled?: MaybeRefOrGetter<boolean>
}

/**
 * Payload of the `move:ticket` event.
 *
 * @example
 * ```ts
 * sortable.on('move:ticket', ({ ticket, from, to }) => {
 *   console.log(ticket.id, from, to)
 * })
 * ```
 */
export interface SortableMovePayload<E extends SortableTicket = SortableTicket> {
  ticket: E
  from: number
  to: number
}

/**
 * Listener-binding signature for a sortable instance — a typed overload for
 * `move:ticket` plus the registry's generic event channel.
 *
 * @template E Output ticket type.
 */
export type SortableEventListener<E extends SortableTicket = SortableTicket> = {
  (event: 'move:ticket', cb: (data: SortableMovePayload<E>) => void): void
  <K extends Extensible<RegistryEventName>>(event: K, cb: RegistryEventCallback<E, K>): void
}

/**
 * Public API of a sortable instance.
 *
 * @template Z Input ticket type.
 * @template E Output ticket type.
 */
export interface SortableContext<
  Z extends SortableTicketInput = SortableTicketInput,
  E extends SortableTicket<Z> = SortableTicket<Z>,
> extends Omit<ModelContext<Z, E>, 'on' | 'off' | 'move'> {
  /**
   * Subscribe to the typed `move:ticket` event with a strongly-typed payload.
   *
   * @example
   * ```ts
   * sortable.on('move:ticket', ({ ticket, from, to }) => {
   *   console.log(ticket.id, from, to)
   * })
   * ```
   */
  on: SortableEventListener<E>
  off: SortableEventListener<E>
  /**
   * Move a ticket to a target index. Other tickets shift to fill.
   * Emits `move:ticket` once when the index actually changes — a move whose
   * `toIndex` already equals the ticket's current index is a no-op.
   * No-ops when the root sortable is disabled or when the ticket is disabled.
   *
   * @param id Ticket id to move.
   * @param toIndex Target index (zero-based).
   * @returns The moved ticket, or `undefined` when the move was gated or the id is unknown.
   *
   * @example
   * ```ts
   * sortable.move(ticket.id, 2)
   * ```
   */
  move: (id: ID, toIndex: number) => E | undefined
  /**
   * Swap two tickets' positions. Emits `move:ticket` twice — once per ticket.
   * No-ops when the root sortable is disabled or when either ticket is disabled.
   *
   * @param a Ticket id at one position.
   * @param b Ticket id at the other position.
   *
   * @example
   * ```ts
   * sortable.swap(a.id, b.id)
   * ```
   */
  swap: (a: ID, b: ID) => void
  /**
   * Set the canonical order in one shot.
   *
   * @param ids Permutation of currently-registered ticket ids.
   *
   * @remarks
   * Validates `ids.length === registry.size` and that every id is unique and known.
   * Logs a warning via `useLogger()` and silently no-ops if any check fails — drag
   * handlers that race against concurrent unregisters won't crash.
   *
   * Honors root `disabled` (whole call no-ops). Per-ticket `disabled` is **ignored** —
   * `reorder` is a bulk operation declaring the canonical order, and applying that
   * order may move disabled tickets. If you want disabled tickets pinned, exclude
   * them from the ids you pass.
   *
   * @example
   * ```ts
   * sortable.reorder([c.id, a.id, b.id])
   * ```
   */
  reorder: (ids: ID[]) => void
}

/**
 * Create an ordered-list state primitive.
 *
 * @param options Sortable options.
 * @returns A {@link SortableContext} that extends {@link ModelContext}.
 *
 * @example
 * ```ts
 * const sortable = createSortable<Todo>()
 * sortable.onboard(todos.value.map(value => ({ value })))
 * ```
 */
export function createSortable<
  Z extends SortableTicketInput = SortableTicketInput,
  E extends SortableTicket<Z> = SortableTicket<Z>,
> (_options: SortableOptions = {}): SortableContext<Z, E> {
  const { disabled, ...options } = _options
  const model = createModel<Z, E>({ ...options, events: true, disabled })
  const logger = useLogger()

  function move (id: ID, toIndex: number): E | undefined {
    if (toValue(disabled)) return undefined
    const ticket = model.get(id)
    if (!ticket) return undefined
    if (toValue(ticket.disabled)) return undefined
    const from = ticket.index
    const result = model.move(id, toIndex)
    if (result && result.index !== from) {
      model.emit('move:ticket', { ticket: result, from, to: result.index })
    }
    return result
  }

  function swap (a: ID, b: ID): void {
    if (toValue(disabled)) return
    if (a === b) return
    const ta = model.get(a)
    const tb = model.get(b)
    if (!ta || !tb) return
    if (toValue(ta.disabled) || toValue(tb.disabled)) return
    const indexA = ta.index
    const indexB = tb.index
    model.batch(() => {
      const ra = model.move(a, indexB)
      if (ra && ra.index !== indexA) {
        model.emit('move:ticket', { ticket: ra, from: indexA, to: ra.index })
      }
      const rb = model.move(b, indexA)
      if (rb && rb.index !== indexB) {
        model.emit('move:ticket', { ticket: rb, from: indexB, to: rb.index })
      }
    })
  }

  function reorder (ids: ID[]): void {
    if (toValue(disabled)) return
    const currentSize = model.size
    if (ids.length !== currentSize) {
      logger.warn(`Reorder expected ${currentSize} ids, got ${ids.length}.`)
      return
    }
    const known = new Set(model.keys())
    const seen = new Set<ID>()
    for (const id of ids) {
      if (!known.has(id)) {
        logger.warn(`Reorder contains unknown id "${String(id)}".`)
        return
      }
      if (seen.has(id)) {
        logger.warn(`Reorder contains duplicate id "${String(id)}".`)
        return
      }
      seen.add(id)
    }
    // Capture initial indices so emits reflect the bulk semantic — every ticket
    // whose final position differs from where it started gets a move:ticket,
    // independent of registry-side reindex displacement during the loop.
    const froms = new Map<ID, number>()
    for (const id of ids) {
      const ticket = model.get(id)
      if (ticket) froms.set(id, ticket.index)
    }
    model.batch(() => {
      for (const [index, id] of ids.entries()) {
        const from = froms.get(id)!
        const result = model.move(id, index)
        if (result && result.index !== from) {
          model.emit('move:ticket', { ticket: result, from, to: result.index })
        }
      }
    })
  }

  return {
    ...model,
    move,
    swap,
    reorder,
    get size () {
      return model.size
    },
  } as SortableContext<Z, E>
}
