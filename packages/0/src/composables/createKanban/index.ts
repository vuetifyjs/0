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
 *
 * const kanban = createKanban()
 * const todo = kanban.columns.register({ value: { title: 'Todo' } })
 * const ticket = todo.items.register({ value: { title: 'Write spec' } })
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

/**
 * Options accepted by `createKanban`.
 *
 * @example
 * ```ts
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
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * Predicate veto for incoming transfers. Synchronous boolean return:
   * `true` accepts; `false` rejects (silent no-op). Async predicates are
   * rejected at runtime with a warning.
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
 * const kanban = createKanban<CardTicket, BoardColumn>()
 *
 * const todo = kanban.columns.register({ value: { title: 'Todo' } })
 * todo.items.register({ value: { title: 'Write spec' } })
 *
 * kanban.transfer(ticketId, doneColumnId, 0)
 * kanban.on('transfer:ticket', payload => console.log(payload))
 * ```
 */
export interface KanbanContext<
  ItemZ extends SortableTicketInput = SortableTicketInput,
  ColZ extends KanbanColumnTicketInput<ItemZ> = KanbanColumnTicketInput<ItemZ>,
> {
  /** Column registry. Use this for column register / unregister / move / swap / reorder. */
  columns: SortableContext<ColZ, KanbanColumnTicket<ItemZ, ColZ>>
  /**
   * Move an item across columns. Same-column transfer (`toColumnId === source`)
   * collapses to `column.items.move` and does not emit `transfer:ticket`.
   */
  transfer: (id: ID, toColumnId: ID, toIndex: number) => SortableTicket<ItemZ> | undefined
  /** Subscribe to kanban-level events. Today: `transfer:ticket`. */
  on: KanbanEventListener<ItemZ, ColZ>
  /** Unsubscribe from a kanban-level event. */
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
 * const kanban = createKanban<CardTicket, BoardColumn>()
 * const todo = kanban.columns.register({ value: { title: 'Todo' } })
 * todo.items.register({ value: { title: 'Write spec' } })
 * ```
 */
export function createKanban<
  ItemZ extends SortableTicketInput = SortableTicketInput,
  ColZ extends KanbanColumnTicketInput<ItemZ> = KanbanColumnTicketInput<ItemZ>,
> (_options: KanbanOptions = {}): KanbanContext<ItemZ, ColZ> {
  const { disabled, ...options } = _options

  const logger = useLogger()

  const _columns = createSortable<ColZ, KanbanColumnTicket<ItemZ, ColZ>>({ ...options, disabled })

  // Internal: id → columnId. Maintained by subscribing to each column's items bus.
  const lookup = createRegistry<RegistryTicketInput<ID>>({ events: true })

  // Kanban-level event bus. Used for transfer:ticket.
  const bus = createRegistry({ events: true })

  const on = ((event: string, cb: (data: unknown) => void) => bus.on(event, cb)) as KanbanEventListener<ItemZ, ColZ>
  const off = ((event: string, cb: (data: unknown) => void) => bus.off(event, cb)) as KanbanEventListener<ItemZ, ColZ>

  // Per-column subscription cleanups, keyed by column id.
  const cleanups = new Map<ID, () => void>()

  const columns: SortableContext<ColZ, KanbanColumnTicket<ItemZ, ColZ>> = {
    ..._columns,
    register (registration?: Partial<ColZ>): KanbanColumnTicket<ItemZ, ColZ> {
      // Declared up front so the items disabled closure can reference the live ticket.
      let ticket!: KanbanColumnTicket<ItemZ, ColZ>

      const items = createSortable<ItemZ>({
        disabled: () => !!toValue(disabled) || !!toValue(ticket?.disabled),
      })

      function onItemRegister (t: SortableTicket<ItemZ>): void {
        if (!isUndefined(lookup.get(t.id))) lookup.unregister(t.id)
        lookup.register({ id: t.id, value: ticket.id })
      }
      function onItemUnregister (t: SortableTicket<ItemZ>): void {
        if (!isUndefined(lookup.get(t.id))) lookup.unregister(t.id)
      }
      items.on('register:ticket', onItemRegister)
      items.on('unregister:ticket', onItemUnregister)

      ticket = _columns.register({ ...registration, items } as unknown as Partial<ColZ>) as KanbanColumnTicket<ItemZ, ColZ>

      cleanups.set(ticket.id, () => {
        items.off('register:ticket', onItemRegister)
        items.off('unregister:ticket', onItemUnregister)
      })

      return ticket
    },
    onboard (registrations: Partial<ColZ>[]): KanbanColumnTicket<ItemZ, ColZ>[] {
      return _columns.batch(() => registrations.map(reg => columns.register(reg)))
    },
    upsert (id: ID, patch: Partial<ColZ> = {}, event?: string): KanbanColumnTicket<ItemZ, ColZ> {
      if (isUndefined(_columns.get(id))) {
        return columns.register({ ...patch, id } as Partial<ColZ>)
      }
      return _columns.upsert(id, patch, event) as KanbanColumnTicket<ItemZ, ColZ>
    },
    // size is a getter; the `..._columns` spread above evaluates the getter once
    // at construction time. Re-declare it here so reads track _columns.size live.
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
      if (isObject(result) && isFunction((result as { then?: unknown }).then)) {
        logger.warn('createKanban accept predicate returned a thenable; async predicates are not supported — treating as reject')
        return false
      }
      return Boolean(result)
    } catch (error) {
      logger.error('createKanban accept predicate threw; treating as reject', error)
      return false
    }
  }

  columns.on('unregister:ticket', column => {
    const cleanup = cleanups.get(column.id)
    if (!isUndefined(cleanup)) {
      cleanup()
      cleanups.delete(column.id)
    }
    // Drain any lookup entries still pointing at this column.
    // Snapshot first to avoid mutation-during-iteration.
    const entries = lookup.values()
    for (const t of entries) {
      if (t.value === column.id) lookup.unregister(t.id)
    }
  })

  function transfer (id: ID, toColumnId: ID, toIndex: number): SortableTicket<ItemZ> | undefined {
    const fromColumnId = lookup.get(id)?.value
    if (isUndefined(fromColumnId)) {
      logger.warn(`createKanban.transfer: unknown ticket id "${String(id)}"`)
      return undefined
    }

    const source = columns.get(fromColumnId)
    if (!source) {
      logger.warn(`createKanban.transfer: unknown source column id "${String(fromColumnId)}"`)
      return undefined
    }

    const dest = columns.get(toColumnId)
    if (!dest) {
      logger.warn(`createKanban.transfer: unknown destination column id "${String(toColumnId)}"`)
      return undefined
    }

    const ticket = source.items.get(id)
    if (!ticket) {
      logger.warn(`createKanban.transfer: ticket "${String(id)}" missing from source column "${String(fromColumnId)}"`)
      return undefined
    }

    const fromIndex = ticket.index

    if (toColumnId === fromColumnId) {
      return source.items.move(id, toIndex)
    }

    if (toValue(disabled)) return undefined
    if (toValue(source.disabled)) return undefined
    if (toValue(dest.disabled)) return undefined
    if (toValue(ticket.disabled)) return undefined

    if (!safeAccept(dest.accept, ticket, fromColumnId, toIndex)) return undefined

    // Guard against corrupted-lookup state (duplicate id in two columns).
    if (!isUndefined(dest.items.get(id))) {
      logger.warn(`createKanban.transfer: id "${String(id)}" already exists in destination column "${String(toColumnId)}"`)
      return undefined
    }

    const REGISTRY_FIELDS = new Set(['id', 'index', 'valueIsIndex', 'unregister', 'isSelected'])
    const captured: Partial<ItemZ> = {} as Partial<ItemZ>
    for (const key of Object.keys(ticket as object)) {
      if (REGISTRY_FIELDS.has(key)) continue
      ;(captured as Record<string, unknown>)[key] = (ticket as unknown as Record<string, unknown>)[key]
    }

    let reg: SortableTicket<ItemZ> | undefined
    let result: SortableTicket<ItemZ> | undefined

    dest.items.batch(() => {
      source.items.unregister(id)
      reg = dest.items.register({ ...captured, id } as Partial<ItemZ>)
      result = reg.index === toIndex ? reg : dest.items.move(reg.id, toIndex)
    })

    // Move-correction may no-op (e.g., reactive disabled flipped); fall back to
    // the registered ticket since the transfer landed regardless.
    const final = result ?? reg
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
