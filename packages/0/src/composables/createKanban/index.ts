/**
 * @module createKanban
 *
 * @see https://0.vuetifyjs.com/composables/data/create-kanban
 *
 * @remarks
 * Headless data-flow management for two-level sortable boards. Wraps a column
 * sortable; each column ticket carries its own inner sortable on `column.items`.
 * Adds a `transfer` primitive for cross-column moves with reused `disabled`
 * gating and a destination-side `accept` predicate. Pure logic — no DnD, no DOM.
 *
 * @example
 * ```ts
 * import { createKanban } from '@vuetify/v0'
 * import type { SortableTicketInput } from '@vuetify/v0'
 *
 * interface CardTicket extends SortableTicketInput {
 *   value: { title: string }
 * }
 *
 * const kanban = createKanban<CardTicket>()
 *
 * const todo = kanban.columns.register({ value: { title: 'Todo' } })
 * const done = kanban.columns.register({ value: { title: 'Done' } })
 *
 * const card = todo.items.register({ value: { title: 'Write spec' } })
 *
 * kanban.on('transfer:ticket', ({ ticket, from, to }) => {
 *   console.log(ticket.value.title, from, '→', to)
 * })
 *
 * kanban.transfer(card.id, done.id, 0)
 * ```
 */

// Composables
import { createRegistry } from '#v0/composables/createRegistry'
import { createSortable } from '#v0/composables/createSortable'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { isFunction, isObject, isUndefined } from '#v0/utilities'
import { toValue } from 'vue'

// Types
import type {
  RegistryEventCallback,
  RegistryEventName,
  RegistryTicketInput,
} from '#v0/composables/createRegistry'
import type {
  SortableContext,
  SortableOptions,
  SortableTicket,
  SortableTicketInput,
} from '#v0/composables/createSortable'
import type { Extensible, ID } from '#v0/types'
import type { MaybeRefOrGetter } from 'vue'

const REGISTRY_FIELDS = /* @__PURE__ */ new Set(['id', 'index', 'valueIsIndex', 'unregister', 'isSelected'])

/**
 * Options accepted by `createKanban`.
 *
 * @example
 * ```ts
 * import { createKanban } from '@vuetify/v0'
 * import { shallowRef, toRef } from 'vue'
 *
 * const isReadOnly = shallowRef(false)
 * const kanban = createKanban({ disabled: toRef(() => isReadOnly.value) })
 * ```
 */
export interface KanbanOptions extends Omit<SortableOptions, 'events'> {
  /**
   * Mutation gate. When truthy, `transfer` and column-level mutations no-op.
   *
   * @default false
   */
  disabled?: MaybeRefOrGetter<boolean>
}

/**
 * Input shape for a column ticket. Parameterized over the per-column inner
 * ticket type so `accept` is typed against the caller's domain.
 *
 * @template ItemZ The inner ticket input type (extends `SortableTicketInput`).
 * @template V The column's own value type.
 *
 * @example
 * ```ts
 * import type { KanbanColumnTicketInput, SortableTicketInput } from '@vuetify/v0'
 *
 * interface CardTicket extends SortableTicketInput {
 *   value: { title: string }
 * }
 *
 * interface BoardColumn extends KanbanColumnTicketInput<CardTicket> {
 *   value: { title: string; color: string }
 * }
 * ```
 */
export interface KanbanColumnTicketInput<
  ItemZ extends SortableTicketInput = SortableTicketInput,
  V = unknown,
> extends SortableTicketInput<V> {
  /**
   * Per-column mutation gate. When truthy, transfers into and out of this
   * column are blocked, and the column's inner `items` sortable is disabled
   * (move / swap / reorder no-op). Column-level operations on
   * `kanban.columns` are unaffected — those are gated by the kanban-level
   * `disabled`.
   *
   * @default false
   */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * Predicate veto for incoming transfers. Synchronous boolean return:
   * `true` accepts; `false` rejects (silent no-op). Async predicates are
   * rejected at runtime with a warning.
   *
   * @param ticket The item being transferred (from the source column).
   * @param from The source column id.
   * @param toIndex The target index inside this destination column.
   *
   * @example
   * ```ts
   * const review = kanban.columns.register({
   *   value: { title: 'Review' },
   *   accept: (ticket, from) => from !== archiveColumn.id,
   * })
   * ```
   */
  accept?: (ticket: SortableTicket<ItemZ>, from: ID, toIndex: number) => boolean
}

/**
 * Output ticket returned from `kanban.columns.register`. Extends `SortableTicket`
 * with the column's own inner sortable on `items`.
 *
 * @template ItemZ Inner ticket input type.
 * @template Z Column input type.
 *
 * @example
 * ```ts
 * import { createKanban } from '@vuetify/v0'
 *
 * const kanban = createKanban()
 * const todo = kanban.columns.register({ value: { title: 'Todo' } })
 * todo.items.register({ value: { title: 'Write spec' } })
 * console.log(todo.id, todo.value.title, todo.items.size)
 * ```
 */
export type KanbanColumnTicket<
  ItemZ extends SortableTicketInput = SortableTicketInput,
  Z extends KanbanColumnTicketInput<ItemZ> = KanbanColumnTicketInput<ItemZ>,
> = SortableTicket<Z> & { items: SortableContext<ItemZ> }

/**
 * Payload of the `transfer:ticket` event on the kanban bus.
 *
 * @example
 * ```ts
 * import { createKanban } from '@vuetify/v0'
 *
 * const kanban = createKanban()
 *
 * kanban.on('transfer:ticket', ({ ticket, from, to, toIndex }) => {
 *   console.log(ticket.id, from, '→', to, '@', toIndex)
 * })
 * ```
 */
export interface KanbanTransferPayload<
  ItemZ extends SortableTicketInput = SortableTicketInput,
> {
  ticket: SortableTicket<ItemZ>
  from: ID
  to: ID
  fromIndex: number
  toIndex: number
}

/**
 * Listener signature: typed overload for `transfer:ticket` plus the columns'
 * underlying registry event channel.
 *
 * @example
 * ```ts
 * import { createKanban } from '@vuetify/v0'
 *
 * const kanban = createKanban()
 *
 * kanban.on('transfer:ticket', ({ ticket, from, to, toIndex }) => {
 *   console.log(ticket.id, from, '→', to, '@', toIndex)
 * })
 *
 * kanban.on('register:ticket', column => {
 *   console.log('column registered:', column.id)
 * })
 * ```
 */
export type KanbanEventListener<
  ItemZ extends SortableTicketInput = SortableTicketInput,
  ColZ extends KanbanColumnTicketInput<ItemZ> = KanbanColumnTicketInput<ItemZ>,
> = {
  (event: 'transfer:ticket', cb: (data: KanbanTransferPayload<ItemZ>) => void): void
  <K extends Extensible<RegistryEventName>>(
    event: K,
    cb: RegistryEventCallback<KanbanColumnTicket<ItemZ, ColZ>, K>,
  ): void
}

/**
 * Public context returned by `createKanban`.
 *
 * @example
 * ```ts
 * import { createKanban } from '@vuetify/v0'
 * import type { KanbanColumnTicketInput, SortableTicketInput } from '@vuetify/v0'
 *
 * interface CardTicket extends SortableTicketInput {
 *   value: { title: string }
 * }
 *
 * interface BoardColumn extends KanbanColumnTicketInput<CardTicket> {
 *   value: { title: string }
 * }
 *
 * const kanban = createKanban<CardTicket, BoardColumn>()
 *
 * const [todo, done] = kanban.columns.onboard([
 *   { value: { title: 'Todo' } },
 *   { value: { title: 'Done' } },
 * ])
 *
 * const card = todo.items.register({ value: { title: 'Write spec' } })
 *
 * kanban.on('transfer:ticket', ({ ticket, from, to, toIndex }) => {
 *   console.log(`${ticket.id}: ${from} → ${to} @ ${toIndex}`)
 * })
 *
 * kanban.transfer(card.id, done.id, 0)
 * ```
 */
export interface KanbanContext<
  ItemZ extends SortableTicketInput = SortableTicketInput,
  ColZ extends KanbanColumnTicketInput<ItemZ> = KanbanColumnTicketInput<ItemZ>,
> {
  /**
   * Column registry. Use this for column register / unregister / move / swap / reorder.
   *
   * @remarks
   * Unregistering a column disposes its `items` sortable — all of the column's
   * tickets are dropped and any subscribers attached to `column.items` are
   * cleared. The internal cleanup runs before consumer-registered
   * `unregister:ticket` handlers, so you cannot rescue items from inside that
   * callback. To preserve items, move them before calling `unregister`.
   *
   * @example
   * ```ts
   * import { createKanban } from '@vuetify/v0'
   *
   * const kanban = createKanban<CardTicket, BoardColumn>()
   * const todo = kanban.columns.register({ value: { title: 'Todo' } })
   * todo.items.register({ value: { title: 'Write spec' } })
   * kanban.columns.move(todo.id, 1)
   * ```
   *
   * @example
   * ```ts
   * // Reflow items into a fallback column before disposing the source column.
   * for (const item of todo.items.values()) {
   *   trash.items.register({ id: item.id, value: item.value })
   * }
   * todo.unregister()
   * ```
   */
  columns: SortableContext<ColZ, KanbanColumnTicket<ItemZ, ColZ>>
  /**
   * Move an item across columns. Same-column transfer (`toColumnId === source`)
   * collapses to `column.items.move` and does not emit `transfer:ticket`.
   *
   * Returns the moved ticket, or `undefined` when gated (kanban / source / dest /
   * item disabled, dest.accept rejected, unknown id, duplicate dest id).
   *
   * @example
   * ```ts
   * import { createKanban } from '@vuetify/v0'
   *
   * const kanban = createKanban()
   * const [todo, done] = kanban.columns.onboard([{ value: 'Todo' }, { value: 'Done' }])
   * const card = todo.items.register({ value: 'Write spec' })
   *
   * const moved = kanban.transfer(card.id, done.id, 0)
   * if (moved) console.log('landed at', moved.index)
   *
   * // Returns undefined when gated by disabled, accept, or unknown ids:
   * kanban.transfer(card.id, 'no-such-column', 0) // → undefined
   * ```
   */
  transfer: (id: ID, toColumnId: ID, toIndex: number) => SortableTicket<ItemZ> | undefined
  /**
   * Subscribe to kanban-level events such as `transfer:ticket`. Registry events
   * from the columns registry (e.g. `register:ticket`, `unregister:ticket`)
   * are also reachable through this listener.
   *
   * @example
   * ```ts
   * import { createKanban } from '@vuetify/v0'
   *
   * const kanban = createKanban()
   *
   * kanban.on('transfer:ticket', ({ ticket, from, to, fromIndex, toIndex }) => {
   *   console.log(ticket.id, from, '→', to, '@', toIndex)
   * })
   * ```
   */
  on: KanbanEventListener<ItemZ, ColZ>
  /**
   * Unsubscribe from a kanban-level event. Must be called with the same callback
   * reference used to subscribe.
   *
   * @example
   * ```ts
   * import { createKanban } from '@vuetify/v0'
   * import type { KanbanTransferPayload } from '@vuetify/v0'
   *
   * const kanban = createKanban<CardTicket>()
   *
   * function onTransfer (data: KanbanTransferPayload<CardTicket>) {
   *   console.log(data.ticket.id)
   * }
   *
   * kanban.on('transfer:ticket', onTransfer)
   * // later
   * kanban.off('transfer:ticket', onTransfer)
   * ```
   */
  off: KanbanEventListener<ItemZ, ColZ>
}

/**
 * Create a headless two-level sortable orchestrator.
 *
 * @param options Kanban options (currently only `disabled`).
 * @returns A {@link KanbanContext}.
 *
 * @example
 * ```ts
 * import { createKanban } from '@vuetify/v0'
 * import type { KanbanColumnTicketInput, SortableTicketInput } from '@vuetify/v0'
 *
 * interface CardTicket extends SortableTicketInput {
 *   value: { title: string }
 * }
 *
 * interface BoardColumn extends KanbanColumnTicketInput<CardTicket> {
 *   value: { title: string }
 * }
 *
 * const kanban = createKanban<CardTicket, BoardColumn>()
 *
 * const todo = kanban.columns.register({ value: { title: 'Todo' } })
 * const review = kanban.columns.register({
 *   value: { title: 'Review' },
 *   accept: card => card.value.title.length > 0,
 * })
 *
 * const spec = todo.items.register({ value: { title: 'Write spec' } })
 * kanban.transfer(spec.id, review.id, 0)
 * ```
 */
export function createKanban<
  ItemZ extends SortableTicketInput = SortableTicketInput,
  ColZ extends KanbanColumnTicketInput<ItemZ> = KanbanColumnTicketInput<ItemZ>,
> (_options: KanbanOptions = {}): KanbanContext<ItemZ, ColZ> {
  const { disabled, ...options } = _options

  const logger = useLogger()

  const _columns = createSortable<ColZ, KanbanColumnTicket<ItemZ, ColZ>>({ ...options, disabled })

  // id → columnId mapping. Maintained by subscribing to each column's items bus.
  const lookup = createRegistry<RegistryTicketInput<ID>>({ events: true })

  const bus = createRegistry({ events: true })

  const on = bus.on as unknown as KanbanEventListener<ItemZ, ColZ>
  const off = bus.off as unknown as KanbanEventListener<ItemZ, ColZ>

  const columns: SortableContext<ColZ, KanbanColumnTicket<ItemZ, ColZ>> = {
    ..._columns,
    register (registration?: Partial<ColZ>): KanbanColumnTicket<ItemZ, ColZ> {
      // Declared up front so the items disabled closure can reference the live ticket.
      let ticket!: KanbanColumnTicket<ItemZ, ColZ>

      const items = createSortable<ItemZ>({
        disabled: () => !!toValue(disabled) || !!toValue(ticket?.disabled),
      })

      items.on('register:ticket', t => {
        lookup.get(t.id)?.unregister()
        lookup.register({ id: t.id, value: ticket.id })
      })

      items.on('unregister:ticket', t => {
        lookup.get(t.id)?.unregister()
      })

      ticket = _columns.register({ ...registration, items } as unknown as Partial<ColZ>)

      return ticket
    },
    onboard (registrations: Partial<ColZ>[]): KanbanColumnTicket<ItemZ, ColZ>[] {
      return _columns.batch(() => registrations.map(reg => columns.register(reg)))
    },
    upsert (id: ID, patch: Partial<ColZ> = {}, event?: string): KanbanColumnTicket<ItemZ, ColZ> {
      return isUndefined(_columns.get(id))
        ? columns.register({ ...patch, id } as Partial<ColZ>)
        : _columns.upsert(id, patch, event)
    },
    // Re-declared so reads track _columns.size live; the spread above froze the value.
    get size () {
      return _columns.size
    },
  }

  function safeAccept (
    accept: ColZ['accept'],
    ticket: SortableTicket<ItemZ>,
    from: ID,
    toIndex: number,
  ): boolean {
    if (isUndefined(accept)) return true
    try {
      const result: unknown = accept(ticket, from, toIndex)
      if (isObject(result) && 'then' in result && isFunction(result.then)) {
        logger.warn('accept predicate returned a thenable; async predicates are not supported — treating as reject')
        return false
      }
      return Boolean(result)
    } catch (error) {
      logger.error('accept predicate threw; treating as reject', error)
      return false
    }
  }

  columns.on('unregister:ticket', column => {
    column.items.dispose()
    // Snapshot before iterating: lookup.unregister mutates the underlying collection.
    const entries = lookup.values()
    for (const t of entries) {
      if (t.value === column.id) lookup.unregister(t.id)
    }
  })

  function transfer (id: ID, toColumnId: ID, toIndex: number): SortableTicket<ItemZ> | undefined {
    const fromColumnId = lookup.get(id)?.value
    if (isUndefined(fromColumnId)) {
      logger.warn(`unknown ticket id "${String(id)}"`)
      return undefined
    }

    const source = columns.get(fromColumnId)
    if (!source) {
      logger.warn(`unknown source column id "${String(fromColumnId)}"`)
      return undefined
    }

    const destination = columns.get(toColumnId)
    if (!destination) {
      logger.warn(`unknown destination column id "${String(toColumnId)}"`)
      return undefined
    }

    const ticket = source.items.get(id)
    if (!ticket) {
      logger.warn(`ticket "${String(id)}" missing from source column "${String(fromColumnId)}"`)
      return undefined
    }

    const fromIndex = ticket.index

    if (toColumnId === fromColumnId) {
      return source.items.move(id, toIndex)
    }

    if (toValue(disabled) || toValue(source.disabled) || toValue(destination.disabled) || toValue(ticket.disabled)) {
      return undefined
    }

    if (!safeAccept(destination.accept, ticket, fromColumnId, toIndex)) return undefined

    // Guard against corrupted-lookup state (duplicate id in two columns).
    if (!isUndefined(destination.items.get(id))) {
      logger.warn(`id "${String(id)}" already exists in destination column "${String(toColumnId)}"`)
      return undefined
    }

    // See memory/createKanban-registry-field-denylist.md — escalate to a registry primitive when a second consumer needs this pattern.
    const captured = Object.fromEntries(
      Object.entries(ticket).filter(([key]) => !REGISTRY_FIELDS.has(key)),
    ) as Partial<ItemZ>

    let registered: SortableTicket<ItemZ> | undefined
    let moved: SortableTicket<ItemZ> | undefined

    destination.items.batch(() => {
      source.items.unregister(id)
      registered = destination.items.register({ ...captured, id } as Partial<ItemZ>)
      moved = registered.index === toIndex ? registered : destination.items.move(registered.id, toIndex)
    })

    // Move-correction may no-op (e.g., reactive disabled flipped); fall back to
    // the registered ticket since the transfer landed regardless.
    const final = moved ?? registered
    if (final) {
      bus.emit('transfer:ticket', {
        ticket: final,
        from: fromColumnId,
        to: toColumnId,
        fromIndex,
        toIndex: final.index,
      } satisfies KanbanTransferPayload<ItemZ>)
    }

    return final
  }

  return {
    columns,
    transfer,
    on,
    off,
  }
}
