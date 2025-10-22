/**
 * @module useRegistry
 *
 * @remarks
 * A foundational composable for managing collections of items (tickets) with:
 * - Unique ID-based access
 * - Index-based ordering
 * - Value-based reverse lookup
 * - Automatic reindexing
 * - Optional event emission
 * - Performance-optimized caching
 *
 * The registry serves as the base for many other composables in the system,
 * including useSelection, useForm, useTimeline, and more.
 */

// Factories
import { createContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { genId, isArray, isUndefined } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App } from 'vue'

export interface RegistryTicket {
  /** The unique identifier. Is randomly generated if not provided. */
  id: ID
  /**
   * The index of the ticket in the registry.
   *
   * @remarks Automatically managed by the registry. Updated during reindexing. It's not recommended to manually set this.
   */
  index: number
  /** The value associated with the ticket. If not provided, it defaults to the index. */
  value: unknown
  /**
   * Whether the value is derived from index.
   *
   * @remarks Set to true when no explicit value is provided during registration. It's not recommended to manually set this.
   */
  valueIsIndex: boolean
}

export interface RegistryContext<Z extends RegistryTicket = RegistryTicket> {
  /**
   * The collection of tickets in the registry
   *
   * @template ID The type of the ticket ID.
   * @template Z The type of the registry ticket.
   *
   * @remarks Exposed for read-only access and advanced use cases. **Warning:** Direct mutation may cause inconsistencies in indexes, catalogs, and caches. Always prefer using the provided methods (`register`, `unregister`, etc.) to maintain internal consistency.
   */
  collection: Map<ID, Z>
  /**
   * Clear the entire registry
   *
   * @remarks Removes all tickets from the registry. This operation invalidates cached results from `keys()`, `values()`, and `entries()`.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#clear
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-1' })
   * registry.register({ id: 'ticket-2' })
   *
   * console.log(registry.size) // 2
   *
   * registry.clear()
   *
   * console.log(registry.size) // 0
   * ```
   */
  clear: () => void
  /**
   * Check if a ticket exists by ID
   *
   * @param id The ID of the ticket to check.
   * @remarks Calls `collection.has` internally.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#has
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-id' })
   *
   * const exists = registry.has('ticket-id') // true
   * ```
   */
  has: (id: ID) => boolean
  /**
   * Get all registered IDs
   *
   * @remarks Calls `collection.keys` internally with caching. First call is O(n), subsequent calls are O(1) until cache invalidation.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#keys
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-1' })
   * registry.register({ id: 'ticket-2' })
   *
   * const ids = registry.keys() // ['ticket-1', 'ticket-2']
   * ```
   */
  keys: () => ID[]
  /**
   * Browse for an ID(s) by value
   *
   * @param value The value to browse for.
   * @remarks Returns a single ID or an array of IDs if multiple tickets share the same value.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#browse
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-1', value: 'common-value' })
   * registry.register({ id: 'ticket-2', value: 'common-value' })
   * registry.register({ id: 'ticket-3', value: 'unique-value' })
   *
   * const common = registry.browse('common-value') // ['ticket-1', 'ticket-2']
   * const unique = registry.browse('unique-value') // 'ticket-3'
   * ```
   */
  browse: (value: unknown) => ID | ID[] | undefined
  /**
   * lookup a ticket by index number
   *
   * @param index The index number to lookup.
   * @remarks Maps do not support indexing by default, this method provides a way to retrieve an ID based on its index in the registry.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#lookup
   *
   * @example
   * ```ts
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-1' })
   * registry.register({ id: 'ticket-2' })
   *
   * const ticket1 = registry.lookup(0) // 'ticket-1'
   * const ticket2 = registry.lookup(1) // 'ticket-2'
   * ```
   */
  lookup: (index: number) => ID | undefined
  /**
   * Get a ticket by ID
   *
   * @param id The ID of the ticket to retrieve.
   * @remarks Calls `collection.get` internally.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#get
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-id', value: 'some-value' })
   *
   * const ticket = registry.get('ticket-id') // { id: 'ticket-id', index: 0, value: 'some-value', ... }
   * ```
   */
  get: (id: ID) => Z | undefined
  /**
   * Update or insert a ticket by ID
   *
   * @param id The ID of the ticket to upsert.
   * @param ticket The partial ticket data to update or insert.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#upsert
   *
   * @remarks If the ticket exists, it will be updated with the provided data. If it doesn't exist, a new ticket will be created with the given ID and data. This operation invalidates cached results from `keys()`, `values()`, and `entries()`.
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * // Insert a new ticket
   * const ticket = registry.upsert('ticket-id', { value: 'initial-value' })
   *
   * // Update the existing ticket
   * const patched = registry.upsert('ticket-id', { value: 'updated-value' })
   * ```
  */
  upsert: (id: ID, ticket?: Partial<Z>) => Z
  /**
   * Get all values of registered tickets
   *
   * @remarks Calls `collection.values` internally with caching. First call is O(n), subsequent calls are O(1) until cache invalidation.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#values
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-1', value: 'value-1' })
   * registry.register({ id: 'ticket-2', value: 'value-2' })
   *
   * const values = registry.values() // [{ id: 'ticket-1', ... }, { id: 'ticket-2', ... }]
   * ```
   */
  values: () => Z[]
  /**
   * Get all entries of registered tickets
   *
   * @remarks Calls `collection.entries` internally with caching. First call is O(n), subsequent calls are O(1) until cache invalidation.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#entries
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-1', value: 'value-1' })
   * registry.register({ id: 'ticket-2', value: 'value-2' })
   *
   * const entries = registry.entries() // [['ticket-1', { id: 'ticket-1', ... }], ['ticket-2', { id: 'ticket-2', ... }]]
   * ```
  */
  entries: () => [ID, Z][]
  /**
   * Register a new ticket
   *
   * @param ticket The partial ticket data to register.
   * @remarks If no ID is provided, a unique ID will be generated automatically. If no value is provided, it defaults to the ticket's index. This operation invalidates cached results from `keys()`, `values()`, and `entries()`.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#register
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * const ticket = registry.register()
   *
   * console.log(ticket) // { id: 'generated-id', index: 0, value: 0, valueIsIndex: true }
   * ```
  */
  register: (ticket?: Partial<Z>) => Z
  /**
   * Unregister an ticket by ID
   *
   * @param id The ID of the ticket to unregister.
   * @remarks Removes the ticket from the registry and reindexes the remaining tickets. This operation invalidates cached results from `keys()`, `values()`, and `entries()`.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#unregister
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-id' })
   *
   * registry.unregister('ticket-id')
   * ```
  */
  unregister: (id: ID) => void
  /**
   * Reset the index directory and update all tickets
   *
   * @remarks Rebuilds the internal index mapping and ensures all tickets have correct index values. This operation invalidates cached results from `keys()`, `values()`, and `entries()`.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#reindex
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-1' })
   * registry.register({ id: 'ticket-2' })
   *
   * // After some operations that may affect indexing
   * registry.reindex()
   * ```
  */
  reindex: () => void
  /**
   * Seek for a ticket based on direction and optional predicate
   *
   * @param direction The direction to seek ('first' or 'last'). Defaults to 'first'.
   * @param from The index to start seeking from. Defaults to the beginning or end based on direction.
   * @param predicate An optional function to test each ticket. The first ticket that satisfies the predicate will be returned.
   * @remarks This method allows for flexible searching within the registry, either from the start or end, and can filter tickets based on custom criteria.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#seek
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-1', value: 'apple' })
   * registry.register({ id: 'ticket-2', value: 'banana' })
   * registry.register({ id: 'ticket-3', value: 'cherry' })
   *
   * // Seek the first ticket
   * const first = registry.seek('first')
   *
   * // Seek the last ticket
   * const last = registry.seek('last')
   *
   * // Seek the first ticket with value 'banana'
   * const banana = registry.seek('first', undefined, ticket => ticket.value === 'banana')
   *
   * // Seek from index 1 to find the next ticket with value starting with 'c'
   * const cherry = registry.seek('first', 1, ticket => (ticket.value as string).startsWith('c'))
   * ```
  */
  seek: (direction?: 'first' | 'last', from?: number, predicate?: (ticket: Z) => boolean) => Z | undefined
  /**
   * Listen for registry events
   *
   * @param event The name of the event to listen for.
   * @param cb The callback function to invoke when the event is emitted.
   * @remarks Must be enabled via the `events` option when creating the registry.
   * Supported events:
   * - `register` - Emitted when a ticket is registered, receives the ticket as argument
   * - `unregister` - Emitted when a ticket is unregistered, receives the ticket as argument
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#on
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry({ events: true })
   *
   * registry.on('register', (ticket) => {
   *   console.log('Ticket registered:', ticket)
   * })
   *
   * registry.register({ id: 'ticket-id' }) // Console: Ticket registered: { id: 'ticket-id', ... }
   * ```
  */
  on: (event: string, cb: Function) => void
  /**
   * Stop listening for registry events
   *
   * @param event The name of the event to stop listening for.
   * @param cb The callback function to remove.
   * @remarks Must be enabled via the `events` option when creating the registry.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#off
   *
   * @example
   * ```ts
   * import { onScopeDispose } from 'vue'
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry({ events: true })
   *
   * function onRegister(ticket) {
   *   console.log('Ticket registered:', ticket)
   * }
   *
   * registry.on('register', onRegister)
   *
   * registry.register({ id: 'ticket-id' }) // Console: Ticket registered: { id: 'ticket-id', ... }
   *
   * onScopeDispose(() => {
   *   registry.off('register', onRegister)
   * })
   * ```
  */
  off: (event: string, cb: Function) => void
  /**
   * Emit an event with data
   *
   * @param event The name of the event to emit.
   * @param data The data to pass to event listeners.
   * @remarks Must be enabled via the `events` option when creating the registry.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#emit
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry({ events: true })
   *
   * registry.on('custom-event', (data) => {
   *   console.log('Custom event received:', data)
   * })
   *
   * registry.emit('custom-event', { message: 'Hello, World!' }) // Console: Custom event received: { message: 'Hello, World!' }
   * ```
  */
  emit: (event: string, data: any) => void
  /**
   * Clears the registry and removes all listeners
   *
   * @remarks Disposes of the registry by clearing all tickets and removing all event listeners.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#dispose
   *
   * @example
   * ```ts
   * import { onScopeDispose } from 'vue'
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry({ events: true })
   *
   * registry.register({ id: 'ticket-id' })
   *
   * onScopeDispose(() => {
   *   registry.dispose()
   * })
   * ```
  */
  dispose: () => void
  /**
   * Onboard multiple tickets at once
   *
   * @param registrations An array of partial ticket data to register.
   * @remarks Registers multiple tickets in a single operation and returns the array of registered tickets.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#onboard
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * const tickets = registry.onboard([
   *   { id: 'ticket-1', value: 'value-1' },
   *   { id: 'ticket-2', value: 'value-2' },
   * ])
   *
   * console.log(tickets) // [{ id: 'ticket-1', ... }, { id: 'ticket-2', ... }]
   * ```
  */
  onboard: (registrations: Partial<Z>[]) => Z[]
  /**
   * The number of tickets in the registry
   *
   * @remarks Reflects the current size of the internal ticket collection.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-registry#size
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry()
   *
   * registry.register({ id: 'ticket-1' })
   * registry.register({ id: 'ticket-2' })
   *
   * console.log(registry.size) // 2
   * ```
  */
  size: number
}

export interface RegistryOptions {
  /**
   * Enable event emission for registry operations
   *
   * @default false
   * @remarks When enabled, the registry will emit events for operations like registration and unregistration. Listeners can be added using the `on` method.
   *
   * @example
   * ```ts
   * import { useRegistry } from '@vuetify/v0'
   *
   * const registry = useRegistry({ events: true })
   *
   * registry.on('register', (ticket) => {
   *   console.log('Ticket registered:', ticket)
   * })
   *
   * registry.register({ id: 'ticket-id' }) // Console: Ticket registered: { id: 'ticket-id', ... }
   * ```
  */
  events?: boolean
}

/**
 * Creates a new registry instance.
 *
 * @param options The options for the registry instance.
 * @template Z The type of registry ticket that extends RegistryTicket. Use this to add custom properties to tickets.
 * @template E The type of registry context that extends RegistryContext<Z>. Use this when extending the registry with additional methods.
 * @returns A new registry instance.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-registry
 *
 * @example
 * ```ts
 * import { useRegistry } from '@vuetify/v0'
 *
 * const registry = useRegistry()
 *
 * const ticket1 = registry.register({ id: 'user-1', value: { name: 'John' } })
 * const ticket2 = registry.register({ id: 'user-2', value: { name: 'Jane' } })
 *
 * console.log(registry.size) // 2
 * console.log(registry.get('user-1')) // { id: 'user-1', index: 0, value: { name: 'John' }, ... }
 * ```
 */
export function useRegistry<
  Z extends RegistryTicket = RegistryTicket,
  E extends RegistryContext<Z> = RegistryContext<Z>,
> (options?: RegistryOptions): E {
  const logger = useLogger()

  const collection = new Map<ID, Z>()
  const catalog = new Map<unknown, ID | ID[]>()
  const directory = new Map<number, ID>()
  const cache = new Map<'keys' | 'values' | 'entries', unknown[]>()
  const listeners = new Map<string, Set<Function>>()

  const events = options?.events ?? false

  function emit (event: string, data: any) {
    if (!events) return
    const cbs = listeners.get(event)
    if (!cbs) return
    for (const cb of cbs) cb(data)
  }

  function on (event: string, cb: Function) {
    if (!events) {
      logger.warn(`Attempted to register event listener for "${event}" but events are disabled.`)
      return
    }

    if (!listeners.has(event)) listeners.set(event, new Set())
    listeners.get(event)!.add(cb)
  }

  function off (event: string, cb: Function) {
    listeners.get(event)?.delete(cb)
  }

  function dispose () {
    if (listeners.size > 0) listeners.clear()
    clear()
  }

  function get (id: ID) {
    return collection.get(id)
  }

  function upsert (id: ID, patch: Partial<Z> = {}) {
    const existing = get(id)

    if (!existing) return register({ ...patch, id })

    const hasValue = Object.prototype.hasOwnProperty.call(patch, 'value')
    let value = existing.value
    let valueIsIndex = existing.valueIsIndex

    if (hasValue) {
      if (patch.value === undefined) {
        value = existing.index
        valueIsIndex = true
      } else {
        value = patch.value
        valueIsIndex = false
      }

      if (!Object.is(value, existing.value)) {
        unassign(existing.value, id)
        assign(value, id)
      }
    }

    const updated: Z = {
      ...existing,
      ...patch,
      id,
      index: existing.index,
      value,
      valueIsIndex,
    }

    collection.set(id, updated)
    invalidate()

    return updated
  }

  function browse (value: unknown) {
    return catalog.get(value)
  }

  function lookup (index: number) {
    return directory.get(index)
  }

  function has (id: ID) {
    return collection.has(id)
  }

  function assign (value: unknown, id: ID) {
    const bucket = catalog.get(value)
    if (bucket) {
      if (isArray(bucket)) {
        if (!bucket.includes(id)) bucket.push(id)
      } else if (bucket !== id) {
        catalog.set(value, [bucket, id])
      }
    } else {
      catalog.set(value, id)
    }
  }

  function unassign (value: unknown, id: ID) {
    const bucket = catalog.get(value)
    if (!bucket) return
    if (isArray(bucket)) {
      const next = bucket.filter(v => v !== id)
      if (next.length === 0) catalog.delete(value)
      else if (next.length === 1) catalog.set(value, next[0]!)
      else catalog.set(value, next)
    } else if (bucket === id) {
      catalog.delete(value)
    }
  }

  function keys () {
    const cached = cache.get('keys')
    if (cached != undefined) return cached as ID[]

    const keys = Array.from(collection.keys())

    cache.set('keys', keys)

    return keys
  }

  function values () {
    const cached = cache.get('values')
    if (cached != undefined) return cached as Z[]

    const values = Array.from(collection.values())

    cache.set('values', values)

    return values
  }

  function entries () {
    const cached = cache.get('entries')
    if (cached != undefined) return cached as [ID, Z][]

    const entries = Array.from(collection.entries())

    cache.set('entries', entries)

    return entries
  }

  function clear () {
    if (collection.size > 0) collection.clear()
    if (catalog.size > 0) catalog.clear()
    if (directory.size > 0) directory.clear()
    invalidate()
  }

  function invalidate () {
    if (cache.size > 0) cache.clear()
  }

  function reindex () {
    if (catalog.size > 0) catalog.clear()
    if (directory.size > 0) directory.clear()

    let index = 0

    for (const ticket of values()) {
      if (ticket.index !== index) {
        ticket.index = index

        if (ticket.valueIsIndex) ticket.value = index
      }

      directory.set(index, ticket.id)
      assign(ticket.value, ticket.id)

      index++
    }

    invalidate()
  }

  function register (registration: Partial<Z> = {}): Z {
    const size = collection.size
    const id = registration.id ?? genId()

    if (has(id)) {
      logger.warn(`Ticket with id "${id}" already exists in the registry. Skipping registration.`)

      return get(id) as Z
    }

    const index = registration.index ?? size
    const value = registration.value === undefined ? index : registration.value
    const valueIsIndex = registration.value === undefined

    const ticket = {
      ...registration,
      id,
      index,
      value,
      valueIsIndex,
    } as Z

    collection.set(ticket.id, ticket)
    directory.set(ticket.index, ticket.id)

    assign(ticket.value, ticket.id)
    invalidate()
    emit('register', ticket)

    return ticket
  }

  function unregister (id: ID) {
    const ticket = collection.get(id)

    if (!ticket) return

    collection.delete(ticket.id)
    directory.delete(ticket.index)
    unassign(ticket.value, ticket.id)

    invalidate()
    emit('unregister', ticket)
    reindex()
  }

  function seek (
    direction: 'first' | 'last' = 'first',
    from?: number,
    predicate?: (ticket: Z) => boolean,
  ): Z | undefined {
    if (collection.size === 0) return undefined

    const tickets = values()
    const index = isUndefined(from) ? undefined : Math.max(0, Math.min(from, tickets.length - 1))

    if (direction === 'last') {
      const start = isUndefined(index) ? tickets.length - 1 : index
      for (let i = start; i >= 0; i--) {
        const ticket = tickets[i]!
        if (!predicate || predicate(ticket)) return ticket
      }
    } else {
      const start = isUndefined(index) ? 0 : index
      for (let i = start; i < tickets.length; i++) {
        const ticket = tickets[i]!
        if (!predicate || predicate(ticket)) return ticket
      }
    }

    return undefined
  }

  return {
    collection,
    emit,
    on,
    off,
    dispose,
    has,
    keys,
    clear,
    browse,
    entries,
    values,
    lookup,
    get,
    upsert,
    register,
    unregister,
    reindex,
    seek,
    onboard (registrations: Partial<Z>[]) {
      return registrations.map(registration => this.register(registration))
    },
    get size () {
      return collection.size
    },
  } as E
}

/**
 * Creates a new registry context.
 *
 * @param namespace The namespace for the registry context.
 * @param options The options for the registry context.
 *
 * @template Z The type of registry ticket that extends RegistryTicket. Use this to add custom properties to tickets.
 * @template E The type of registry context that extends RegistryContext<Z>. Use this when extending the registry with additional methods.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-registry
 *
 * @example
 * ```ts
 * import { createRegistryContext } from '@vuetify/v0'
 *
 * export const [useItems, provideItems, items] = createRegistryContext('items')
 *
 * // In a parent component:
 * provideItems()
 *
 * // In a child component:
 * const items = useItems()
 * items.register({ id: 'item-1', value: 'Value 1' })
 * ```
 */
export function createRegistryContext<
  Z extends RegistryTicket = RegistryTicket,
  E extends RegistryContext<Z> = RegistryContext<Z>,
> (
  namespace: string,
  options?: RegistryOptions,
): ContextTrinity<E> {
  const [useRegistryContext, _provideRegistryContext] = createContext<E>(namespace)

  const context = useRegistry<Z, E>(options)

  function provideRegistryContext (_context: E = context, app?: App): E {
    return _provideRegistryContext(_context, app)
  }

  return createTrinity<E>(useRegistryContext, provideRegistryContext, context)
}
