/**
 * @module createRegistry
 *
 * @see https://0.vuetifyjs.com/composables/registration/create-registry
 *
 * @remarks
 * A foundational composable for managing collections of items (tickets) with:
 * - Unique ID-based access
 * - Index-based ordering and reordering via `move()`
 * - Value-based reverse lookup
 * - `unregister()` for individual item removal
 * - Automatic reindexing
 * - Batched event dispatch to prevent N cache invalidations
 * - Performance-optimized caching
 *
 * The registry serves as the base for many other composables in the system,
 * including createSelection, createForm, createTimeline, and more.
 *
 * @example
 * ```ts
 * import { createRegistry } from '@vuetify/v0'
 *
 * const registry = createRegistry()
 * const ticket = registry.register({ value: 'item-1' })
 * console.log(registry.size) // 1
 * registry.unregister(ticket.id)
 * ```
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { clamp, isUndefined, useId } from '#v0/utilities'
import { shallowReactive } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { Extensible, ID } from '#v0/types'

/**
 * User-facing input shape for registry tickets.
 *
 * Extend this when defining custom ticket types passed to `register()` and `onboard()`.
 * The registry adds the computed fields (`index`, `valueIsIndex`) automatically — those
 * live on {@link RegistryTicket}, which is the output type returned by `get()` and `values()`.
 *
 * @template V The type of the ticket value.
 */
export interface RegistryTicketInput<V = unknown> {
  /** The unique identifier. Optional — auto-generated if not provided. */
  id?: ID
  /** The value associated with the ticket. If not provided, it defaults to the index. */
  value?: V
}

export interface RegistryTicket<V = unknown> {
  /** The unique identifier. Is randomly generated if not provided. */
  id: ID
  /**
   * The index of the ticket in the registry.
   *
   * @remarks Automatically managed by the registry. Updated during reindexing. It's not recommended to manually set this.
   */
  index: number
  /** The value associated with the ticket. If not provided, it defaults to the index. */
  value: V
  /**
   * Whether the value is derived from index.
   *
   * @remarks Set to true when no explicit value is provided during registration. It's not recommended to manually set this.
   */
  valueIsIndex: boolean
  /** Remove this ticket from the registry. Semantic sugar for `registry.unregister(ticket.id)`. */
  unregister: () => void
}

/** Valid event names for registry operations */
export type RegistryEventName =
  | 'register:ticket'
  | 'unregister:ticket'
  | 'update:ticket'
  | 'clear:registry'
  | 'reindex:registry'

/** Maps event names to their payload types */
export type RegistryEventMap<Z extends RegistryTicket> = {
  'register:ticket': Z
  'unregister:ticket': Z
  'update:ticket': Z
  'clear:registry': undefined
  'reindex:registry': undefined
}

/**
 * Callback signature for registry event listeners.
 *
 * Resolves to a typed payload for known {@link RegistryEventName} keys, and
 * `(data: unknown) => void` for custom events.
 */
export type RegistryEventCallback<
  Z extends RegistryTicket = RegistryTicket,
  K extends Extensible<RegistryEventName> = Extensible<RegistryEventName>,
> = K extends RegistryEventName
  ? (data: RegistryEventMap<Z>[K]) => void
  : (data: unknown) => void

/** Resolves payload type: typed for known events, unknown for custom events */
type EventPayload<Z extends RegistryTicket, K extends string> =
  K extends RegistryEventName
    ? RegistryEventMap<Z>[K]
    : unknown

/** Internal callback type for event listeners storage */
type InternalEventCallback = (data: unknown) => void

export interface RegistryContext<
  Z extends RegistryTicketInput = RegistryTicketInput,
  E extends RegistryTicket & Z = RegistryTicket & Z,
> {
  /**
   * The collection of tickets in the registry
   *
   * @template ID The type of the ticket ID.
   * @template E The type of the registry ticket.
   *
   * @remarks Read-only view of the internal collection. Use `register`, `unregister`, `upsert`, and `clear` methods to modify.
   */
  collection: ReadonlyMap<ID, E>
  /**
   * Clear the entire registry
   *
   * @remarks Removes all tickets from the registry. This operation invalidates cached results from `keys()`, `values()`, and `entries()`.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
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
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
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
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
   *
   * registry.register({ id: 'ticket-1' })
   * registry.register({ id: 'ticket-2' })
   *
   * const ids = registry.keys() // ['ticket-1', 'ticket-2']
   * ```
   */
  keys: () => readonly ID[]
  /**
   * Browse for an ID(s) by value
   *
   * @param value The value to browse for.
   * @remarks Returns an array of IDs that share the given value, or undefined if no match is found.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
   *
   * registry.register({ id: 'ticket-1', value: 'common-value' })
   * registry.register({ id: 'ticket-2', value: 'common-value' })
   * registry.register({ id: 'ticket-3', value: 'unique-value' })
   *
   * const common = registry.browse('common-value') // ['ticket-1', 'ticket-2']
   * const unique = registry.browse('unique-value') // ['ticket-3']
   * ```
   */
  browse: (value: E['value']) => readonly ID[] | undefined
  /**
   * Lookup a ticket by index number
   *
   * @param index The index number to lookup.
   * @remarks Maps do not support indexing by default, this method provides a way to retrieve an ID based on its index in the registry.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * const registry = createRegistry()
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
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
   *
   * registry.register({ id: 'ticket-id', value: 'some-value' })
   *
   * const ticket = registry.get('ticket-id') // { id: 'ticket-id', index: 0, value: 'some-value', ... }
   * ```
   */
  get: (id: ID) => E | undefined
  /**
   * Update or insert a ticket by ID
   *
   * @param id The ID of the ticket to upsert.
   * @param ticket The partial ticket data to update or insert.
   * @param event Optional custom event name to emit alongside `update:ticket`. The patched ticket is dispatched as the event payload.
   * @remarks If the ticket exists, it will be updated in place — the ticket reference returned by `register()` remains valid and reactive (when `reactive: true`). If it doesn't exist, a new ticket will be created with the given ID and data. This operation invalidates cached results from `keys()`, `values()`, and `entries()`.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry({ events: true })
   *
   * // Insert a new ticket
   * const ticket = registry.upsert('ticket-id', { value: 'initial-value' })
   *
   * // Update the existing ticket
   * const patched = registry.upsert('ticket-id', { value: 'updated-value' })
   *
   * // Emit a custom event with the patched ticket as payload
   * registry.upsert('ticket-id', { value: 'final' }, 'ticket:final')
   * ```
  */
  upsert: (id: ID, ticket?: Partial<Z>, event?: string) => E
  /**
   * Get all values of registered tickets
   *
   * @remarks Calls `collection.values` internally with caching. First call is O(n), subsequent calls are O(1) until cache invalidation.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
   *
   * registry.register({ id: 'ticket-1', value: 'value-1' })
   * registry.register({ id: 'ticket-2', value: 'value-2' })
   *
   * const values = registry.values() // [{ id: 'ticket-1', ... }, { id: 'ticket-2', ... }]
   * ```
   */
  values: () => readonly E[]
  /**
   * Get all entries of registered tickets
   *
   * @remarks Calls `collection.entries` internally with caching. First call is O(n), subsequent calls are O(1) until cache invalidation.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
   *
   * registry.register({ id: 'ticket-1', value: 'value-1' })
   * registry.register({ id: 'ticket-2', value: 'value-2' })
   *
   * const entries = registry.entries() // [['ticket-1', { id: 'ticket-1', ... }], ['ticket-2', { id: 'ticket-2', ... }]]
   * ```
  */
  entries: () => readonly [ID, E][]
  /**
   * Register a new ticket
   *
   * @param ticket The partial ticket data to register.
   * @remarks If no ID is provided, a unique ID will be generated automatically. If no value is provided, it defaults to the ticket's index. This operation invalidates cached results from `keys()`, `values()`, and `entries()`.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
   *
   * const ticket = registry.register()
   *
   * console.log(ticket) // { id: 'generated-id', index: 0, value: 0, valueIsIndex: true }
   * ```
  */
  register: (ticket?: Partial<Z & RegistryTicket>) => E
  /**
   * Unregister a ticket by ID
   *
   * @param id The ID of the ticket to unregister.
   * @remarks Removes the ticket from the registry and reindexes the remaining tickets. This operation invalidates cached results from `keys()`, `values()`, and `entries()`.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
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
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
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
   * Move a ticket to a new index position
   *
   * @param id The ID of the ticket to move.
   * @param toIndex The target index position. Clamped to valid range.
   * @returns The moved ticket, or undefined if the ticket was not found.
   *
   * @remarks Rebuilds the internal collection order by removing and reinserting the entry at the target position. Triggers a full reindex after the move. This operation invalidates cached results from `keys()`, `values()`, and `entries()`.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
   *
   * registry.onboard([
   *   { id: 'a', value: 'alpha' },
   *   { id: 'b', value: 'beta' },
   *   { id: 'c', value: 'gamma' },
   * ])
   *
   * // Move 'a' from index 0 to index 2
   * registry.move('a', 2)
   *
   * console.log(registry.keys()) // ['b', 'c', 'a']
   * ```
  */
  move: (id: ID, toIndex: number) => E | undefined
  /**
   * Reorder the registry to match a canonical permutation of ids in one pass.
   *
   * @param ids A full permutation of the currently-registered ticket ids.
   *
   * @remarks
   * Bulk equivalent of calling `move` n times, but does the rebuild once
   * (O(n) total rather than O(n²)). Silently no-ops when `ids.length !== size`,
   * when any id is unknown, or when `ids` contains duplicates — caller is
   * responsible for validation and warnings. Emits `reindex:registry` once on
   * completion; does not emit per-ticket `update:ticket` events.
   *
   * @example
   * ```ts
   * const registry = createRegistry()
   * registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
   *
   * registry.reorder(['c', 'a', 'b'])
   *
   * console.log(registry.keys()) // ['c', 'a', 'b']
   * ```
   */
  reorder: (ids: ID[]) => void
  /**
   * Seek for a ticket based on direction and optional predicate
   *
   * @param direction The scan direction (`'first'` = forward, `'last'` = backward). Defaults to `'first'`.
   * @param from The index to start scanning from. With `'first'` the scan moves forward from `from`; with `'last'` the scan moves backward from `from`. Defaults to `0` for `'first'` and `size - 1` for `'last'`.
   * @param predicate An optional function to test each ticket. The first ticket reached in scan order that satisfies the predicate is returned.
   * @remarks This method allows for flexible searching within the registry, either from the start or end, and can filter tickets based on custom criteria.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
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
  seek: (direction?: 'first' | 'last', from?: number, predicate?: (ticket: E) => boolean) => E | undefined
  /**
   * Listen for registry events
   *
   * @param event The name of the event to listen for.
   * @param cb The callback function to invoke when the event is emitted.
   * @remarks Must be enabled via the `events` option when creating the registry.
   * Supported events:
   * - `register:ticket` - Emitted when a ticket is registered, receives the ticket as argument
   * - `unregister:ticket` - Emitted when a ticket is unregistered, receives the ticket as argument
   * - `update:ticket` - Emitted when a ticket is updated, receives the updated ticket as argument
   * - `clear:registry` - Emitted when the registry is cleared
   * - `reindex:registry` - Emitted when the registry is reindexed
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry({ events: true })
   *
   * registry.on('register:ticket', (ticket) => {
   *   console.log('Ticket registered:', ticket)
   * })
   *
   * registry.register({ id: 'ticket-id' }) // Console: Ticket registered: { id: 'ticket-id', ... }
   * ```
  */
  on: <K extends Extensible<RegistryEventName>>(event: K, cb: RegistryEventCallback<E, K>) => void
  /**
   * Stop listening for registry events
   *
   * @param event The name of the event to stop listening for.
   * @param cb The callback function to remove.
   * @remarks Must be enabled via the `events` option when creating the registry.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { onScopeDispose } from 'vue'
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry({ events: true })
   *
   * function onRegister(ticket) {
   *   console.log('Ticket registered:', ticket)
   * }
   *
   * registry.on('register:ticket', onRegister)
   *
   * registry.register({ id: 'ticket-id' }) // Console: Ticket registered: { id: 'ticket-id', ... }
   *
   * onScopeDispose(() => {
   *   registry.off('register:ticket', onRegister)
   * })
   * ```
  */
  off: <K extends Extensible<RegistryEventName>>(event: K, cb: RegistryEventCallback<E, K>) => void
  /**
   * Emit an event with data
   *
   * @param event The name of the event to emit.
   * @param data The data to pass to event listeners.
   * @remarks Must be enabled via the `events` option when creating the registry.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry({ events: true })
   *
   * registry.on('custom-event', (data) => {
   *   console.log('Custom event received:', data)
   * })
   *
   * registry.emit('custom-event', { message: 'Hello, World!' }) // Console: Custom event received: { message: 'Hello, World!' }
   * ```
  */
  emit: <K extends Extensible<RegistryEventName>>(event: K, data: EventPayload<E, K>) => void
  /**
   * Clears the registry and removes all listeners
   *
   * @remarks Disposes of the registry by clearing all tickets and removing all event listeners.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { onScopeDispose } from 'vue'
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry({ events: true })
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
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
   *
   * const tickets = registry.onboard([
   *   { id: 'ticket-1', value: 'value-1' },
   *   { id: 'ticket-2', value: 'value-2' },
   * ])
   *
   * console.log(tickets) // [{ id: 'ticket-1', ... }, { id: 'ticket-2', ... }]
   * ```
  */
  onboard: (registrations: Partial<Z & RegistryTicket>[]) => E[]
  /**
   * Offboard multiple tickets at once, returning the input shapes that were removed.
   *
   * @param ids An array of ticket IDs to unregister.
   * @returns An array of `Partial<Z>` — the inputs that were registered, with
   * registry-managed fields (`index`, `valueIsIndex`, `unregister`) stripped.
   * The `id` is preserved only when `valueIsIndex` was false (i.e. the user
   * supplied a meaningful value); otherwise the id is stripped so the receiving
   * registry can assign a fresh one. Order matches the input `ids` array. Missing
   * ids are silently skipped — the returned array may be shorter than `ids`.
   * @remarks Unregisters multiple tickets in a single operation with optimized
   * reindexing. The inverse of `onboard`: onboard takes inputs and returns outputs;
   * offboard takes ids and returns the inputs back. Pair with `onboard` on a
   * different registry to move tickets across registries.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
   *
   * registry.onboard([
   *   { id: 'ticket-1', value: 'value-1' },
   *   { id: 'ticket-2', value: 'value-2' },
   *   { id: 'ticket-3', value: 'value-3' },
   * ])
   *
   * const removed = registry.offboard(['ticket-1', 'ticket-3'])
   *
   * console.log(registry.size) // 1
   * console.log(removed) // [{ id: 'ticket-1', value: 'value-1' }, { id: 'ticket-3', value: 'value-3' }]
   *
   * // Move to another registry
   * const other = createRegistry()
   * other.onboard(removed)
   * ```
  */
  offboard: (ids: ID[]) => Partial<Z>[]
  /**
   * The number of tickets in the registry
   *
   * @remarks Reflects the current size of the internal ticket collection.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry()
   *
   * registry.register({ id: 'ticket-1' })
   * registry.register({ id: 'ticket-2' })
   *
   * console.log(registry.size) // 2
   * ```
  */
  size: number
  /**
   * Execute operations in a batch, deferring cache invalidation and event emission until complete
   *
   * @param fn The function containing batch operations.
   * @returns The return value of the batch function.
   * @remarks Useful for bulk operations like onboard(). Invalidation and events happen once at the end, not after each operation.
   *
   * @see https://0.vuetifyjs.com/composables/registration/create-registry
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry({ events: true })
   *
   * // Without batch: N invalidations + N events
   * // With batch: 1 invalidation + N events (after all registrations)
   * const tickets = registry.batch(() => {
   *   return [
   *     registry.register({ id: 'a' }),
   *     registry.register({ id: 'b' }),
   *     registry.register({ id: 'c' }),
   *   ]
   * })
   * ```
  */
  batch: <R>(fn: () => R) => R
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
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry({ events: true })
   *
   * registry.on('register:ticket', (ticket) => {
   *   console.log('Ticket registered:', ticket)
   * })
   *
   * registry.register({ id: 'ticket-id' }) // Console: Ticket registered: { id: 'ticket-id', ... }
   * ```
  */
  events?: boolean
  /**
   * Enable reactive behavior for registry operations
   *
   * @default false
   * @remarks When enabled, the registry will use Vue's shallowReactive to track changes. This is useful for scenarios where you want to reactively update the registry state in response to changes.
   *
   * @example
   * ```ts
   * import { createRegistry } from '@vuetify/v0'
   *
   * const registry = createRegistry({ reactive: true })
   *
   * registry.register({ id: 'ticket-id' })
   *
   * console.log(registry.size) // 1
   * ```
  */
  reactive?: boolean
}

export interface RegistryContextOptions extends RegistryOptions {
  namespace?: string
}

/**
 * Creates a new registry instance.
 *
 * @param options The options for the registry instance.
 * @template Z The type of registry ticket that extends RegistryTicket. Use this to add custom properties to tickets.
 * @template E The type of registry context that extends RegistryContext<Z>. Use this when extending the registry with additional methods.
 * @returns A new registry instance.
 *
 * @see https://0.vuetifyjs.com/composables/registration/create-registry
 *
 * @example
 * ```ts
 * import { createRegistry } from '@vuetify/v0'
 *
 * const registry = createRegistry()
 *
 * const ticket1 = registry.register({ id: 'user-1', value: { name: 'John' } })
 * const ticket2 = registry.register({ id: 'user-2', value: { name: 'Jane' } })
 *
 * console.log(registry.size) // 2
 * console.log(registry.get('user-1')) // { id: 'user-1', index: 0, value: { name: 'John' }, ... }
 * ```
 */
export function createRegistry<
  Z extends RegistryTicketInput = RegistryTicketInput,
  E extends RegistryTicket & Z = RegistryTicket & Z,
> (options?: RegistryOptions): RegistryContext<Z, E> {
  const logger = useLogger()

  const events = options?.events ?? false
  const reactive = options?.reactive ?? false

  const collection = reactive ? shallowReactive(new Map<ID, E>()) : new Map<ID, E>()
  const catalog = new Map<unknown, ID[]>()
  const directory = new Map<number, ID>()
  const cache = new Map<'keys' | 'values' | 'entries', unknown[]>()
  const listeners = new Map<string, Set<InternalEventCallback>>()
  // Ordered list of IDs – the canonical position sequence.  Splicing this
  // array is all that move() needs; Map insertion order is no longer load-bearing.
  // Made reactive when the registry is reactive so that keys()/values()/entries()
  // re-evaluate whenever the order changes (register, move, reorder, etc.).
  const order = (reactive ? shallowReactive([] as ID[]) : []) as ID[]

  let indexDependentCount = 0
  let needsReindex = false
  let minDirtyIndex = Infinity
  let maxDirtyIndex = -Infinity
  let isBatching = false
  let batched: Array<{ event: string, data: unknown }> = []

  function dispatch (event: string, data: unknown) {
    const cbs = listeners.get(event)
    if (!cbs) return
    for (const cb of cbs) cb(data)
  }

  function emit (event: string, data: unknown = undefined) {
    if (!events) return

    if (isBatching) {
      batched.push({ event, data })
      return
    }

    dispatch(event, data)
  }

  function on (event: string, cb: InternalEventCallback) {
    if (!events) {
      logger.warn(`Events are disabled. Initialize with \`createRegistry({ events: true })\` to enable.`)
      return
    }

    if (!listeners.has(event)) listeners.set(event, new Set())
    const cbs = listeners.get(event)!
    cbs.add(cb)

    if (__DEV__ && cbs.size === 101) {
      logger.warn(`Event "${event}" has ${cbs.size} listeners. Possible memory leak.`)
    }
  }

  function off (event: string, cb: InternalEventCallback) {
    if (!events) {
      logger.warn(`Events are disabled. Initialize with \`createRegistry({ events: true })\` to enable.`)
      return
    }
    listeners.get(event)?.delete(cb)
  }

  function dispose () {
    listeners.clear()
    clear()
  }

  function get (id: ID) {
    return collection.get(id)
  }

  function upsert (id: ID, patch: Partial<Z> = {}, event?: string) {
    if (needsReindex) reindex()

    const existing = get(id)

    if (!existing) return register({ ...patch, id } as Partial<Z & RegistryTicket>)

    const hasValue = Object.prototype.hasOwnProperty.call(patch, 'value')
    let value = existing.value
    let valueIsIndex = existing.valueIsIndex

    if (hasValue) {
      if (isUndefined(patch.value)) {
        value = existing.index
        valueIsIndex = true
      } else {
        value = patch.value
        valueIsIndex = false
      }

      if (valueIsIndex !== existing.valueIsIndex) {
        if (valueIsIndex) {
          indexDependentCount++
        } else {
          indexDependentCount--
        }
      }

      if (!Object.is(value, existing.value)) {
        unassign(existing.value, id)
        assign(value, id)
      }
    }

    Object.assign(existing, patch, { id, index: existing.index, value, valueIsIndex })
    collection.set(id, existing)
    invalidate()
    emit('update:ticket', existing)
    if (event) emit(event, existing)

    return existing
  }

  function browse (value: unknown) {
    if (needsReindex) reindex()
    const bucket = catalog.get(value)
    return bucket ? bucket.slice() : undefined
  }

  function lookup (index: number) {
    if (needsReindex) reindex()
    return directory.get(index)
  }

  function has (id: ID) {
    return collection.has(id)
  }

  function assign (value: unknown, id: ID) {
    const bucket = catalog.get(value)
    if (bucket) {
      if (!bucket.includes(id)) bucket.push(id)
    } else {
      catalog.set(value, [id])
    }
  }

  function unassign (value: unknown, id: ID) {
    const bucket = catalog.get(value)
    if (!bucket) return

    const next = bucket.filter(v => v !== id)
    if (next.length === 0) catalog.delete(value)
    else catalog.set(value, next)
  }

  function keys (): readonly ID[] {
    if (reactive) {
      // `order` is shallowReactive, so reading it here registers the dependency.
      // Effects re-evaluate when order is mutated (register, unregister, move, …).
      return order.slice()
    }

    const cached = cache.get('keys')
    if (!isUndefined(cached)) return cached as readonly ID[]

    const out = order.slice()

    cache.set('keys', out)

    return out
  }

  function values (): readonly E[] {
    if (reactive) {
      return order.map(id => collection.get(id)!)
    }

    const cached = cache.get('values')
    if (!isUndefined(cached)) return cached as readonly E[]

    const out = order.map(id => collection.get(id)!)

    cache.set('values', out)

    return out
  }

  function entries (): readonly [ID, E][] {
    if (reactive) {
      return order.map(id => [id, collection.get(id)!] as [ID, E])
    }

    const cached = cache.get('entries')
    if (!isUndefined(cached)) return cached as readonly [ID, E][]

    const out = order.map(id => [id, collection.get(id)!] as [ID, E])

    cache.set('entries', out)

    return out
  }

  function clear () {
    order.length = 0
    collection.clear()
    catalog.clear()
    directory.clear()
    invalidate()
    indexDependentCount = 0
    needsReindex = false
    minDirtyIndex = Infinity
    maxDirtyIndex = -Infinity
    emit('clear:registry')
  }

  function invalidate () {
    if (isBatching) return
    cache.clear()
  }

  function batch<R> (fn: () => R): R {
    if (isBatching) return fn()

    isBatching = true
    batched = []

    try {
      const result = fn()

      cache.clear()

      for (const { event, data } of batched) {
        dispatch(event, data)
      }

      return result
    } finally {
      isBatching = false
      batched = []
    }
  }

  function reindex () {
    // The dirty window is [start..end]. `minDirtyIndex === Infinity` means "no
    // lower bound recorded" (renumber from 0); `maxDirtyIndex === -Infinity`
    // means "no upper bound recorded" (renumber to the end) — the case for
    // removals and full reorders, where every trailing index shifts.
    const size = order.length
    const start = minDirtyIndex === Infinity ? 0 : minDirtyIndex
    const end = maxDirtyIndex === -Infinity ? size - 1 : Math.min(maxDirtyIndex, size - 1)
    const full = start === 0 && end === size - 1

    invalidate()

    if (full) {
      catalog.clear()
      directory.clear()
    } else {
      // Clear stale window entries before reassigning. Two passes are required
      // because a single delete-then-set pass would clobber a freshly-set slot
      // when the dirty window is a non-monotonic permutation (e.g. a mid-list move).
      for (let i = start; i <= end; i++) {
        const ticket = collection.get(order[i]!)!
        directory.delete(ticket.index)
        if (ticket.valueIsIndex) unassign(ticket.value, ticket.id)
      }
    }

    for (let i = start; i <= end; i++) {
      const ticket = collection.get(order[i]!)!

      if (ticket.valueIsIndex) {
        ticket.value = i
        assign(ticket.value, ticket.id)
      } else if (full) {
        assign(ticket.value, ticket.id)
      }

      ticket.index = i
      directory.set(i, ticket.id)
    }

    needsReindex = false
    minDirtyIndex = Infinity
    maxDirtyIndex = -Infinity
    emit('reindex:registry')
  }

  function register (registration: Partial<Z & RegistryTicket> = {}): E {
    if (needsReindex) reindex()

    const size = collection.size
    const id = registration.id ?? useId()

    if (has(id)) {
      logger.warn(`Ticket "${id}" already exists. Use \`upsert()\` to update or check \`has()\` before registering.`)

      return get(id)!
    }

    const valueIsUndefined = isUndefined(registration.value)
    const index = registration.index ?? size
    const value = valueIsUndefined ? index : registration.value
    const valueIsIndex = registration.valueIsIndex ?? valueIsUndefined

    if (valueIsIndex) {
      indexDependentCount++
    }

    const input = {
      ...registration,
      id,
      index,
      value,
      valueIsIndex,
      unregister: () => unregister(id),
    } as E

    const ticket = reactive ? shallowReactive(input) : input

    collection.set(ticket.id, ticket)
    order.push(ticket.id)
    directory.set(ticket.index, ticket.id)

    assign(ticket.value, ticket.id)
    invalidate()
    emit('register:ticket', ticket)

    return ticket
  }

  function unregister (id: ID) {
    const ticket = collection.get(id)

    if (!ticket) return

    if (ticket.valueIsIndex) {
      indexDependentCount--
    }

    const orderPos = order.indexOf(ticket.id)
    if (orderPos !== -1) order.splice(orderPos, 1)
    collection.delete(ticket.id)
    directory.delete(ticket.index)
    unassign(ticket.value, ticket.id)

    const willReindex = indexDependentCount > 0 && ticket.index < collection.size
    if (!willReindex) invalidate()

    minDirtyIndex = Math.min(minDirtyIndex, ticket.index)
    if (willReindex) {
      reindex()
    } else {
      needsReindex = true
    }

    emit('unregister:ticket', ticket)
  }

  function onboard (registrations: Partial<Z & RegistryTicket>[]) {
    return batch(() => registrations.map(registration => register(registration)))
  }

  // Strip registry-managed fields off an output ticket to produce its input shape.
  // `id` is preserved only when the user supplied a meaningful value; otherwise
  // the id was auto-generated and stripping it lets the receiving registry assign
  // a fresh one.
  function toInput (ticket: E): Partial<Z> {
    const input = { ...ticket } as Record<string, unknown>
    delete input.index
    delete input.valueIsIndex
    delete input.unregister
    if (ticket.valueIsIndex) {
      delete input.id
      delete input.value
    }
    return input as Partial<Z>
  }

  function offboard (ids: ID[]): Partial<Z>[] {
    // Collect valid tickets before any mutations so we know what to remove.
    const removed: E[] = []
    const removedIds = new Set<ID>()
    for (const id of ids) {
      const ticket = collection.get(id)
      if (ticket) {
        removed.push(ticket)
        removedIds.add(id)
      }
    }

    if (removed.length === 0) return []

    batch(() => {
      // Compact order FIRST so that Vue sync effects triggered by the subsequent
      // Map mutations see a consistent snapshot (no dangling IDs in order).
      let w = 0
      for (let r = 0; r < order.length; r++) {
        if (!removedIds.has(order[r]!)) order[w++] = order[r]!
      }
      order.length = w

      for (const ticket of removed) {
        if (ticket.valueIsIndex) {
          indexDependentCount--
        }
        minDirtyIndex = Math.min(minDirtyIndex, ticket.index)
        collection.delete(ticket.id)
        directory.delete(ticket.index)
        unassign(ticket.value, ticket.id)
      }

      for (const ticket of removed) {
        emit('unregister:ticket', ticket)
      }

      needsReindex = true
    })

    // TODO: this builds an array even when the caller discards the return value.
    // Trivial today (offboard isn't a hot path), revisit if profiling shows
    // allocation pressure on bulk-clear workloads.
    return removed.map(ticket => toInput(ticket))
  }

  function move (id: ID, toIndex: number): E | undefined {
    if (needsReindex) reindex()

    const ticket = collection.get(id)
    if (!ticket) return undefined

    const size = collection.size
    const target = clamp(toIndex, 0, size - 1)
    const from = ticket.index

    if (from === target) return ticket

    return batch(() => {
      order.splice(from, 1)
      order.splice(target, 0, id)

      // Bound the reindex to the [from..target] window: only those indices
      // changed, so reindex() touches O(distance) tickets instead of the tail.
      minDirtyIndex = Math.min(from, target)
      maxDirtyIndex = Math.max(from, target)
      reindex()
      emit('update:ticket', ticket)

      return ticket
    })
  }

  function reorder (ids: ID[]): void {
    if (needsReindex) reindex()

    if (ids.length !== collection.size) return

    const seen = new Set<ID>()
    for (const id of ids) {
      if (seen.has(id)) return
      if (!collection.has(id)) return
      seen.add(id)
    }

    batch(() => {
      for (const [i, id] of ids.entries()) {
        order[i] = id!
      }
      minDirtyIndex = 0
      maxDirtyIndex = -Infinity
      reindex()
    })
  }

  function seek (
    direction: 'first' | 'last' = 'first',
    from?: number,
    predicate?: (ticket: E) => boolean,
  ): E | undefined {
    if (collection.size === 0) return undefined

    if (needsReindex) reindex()

    // Fast path: simple first/last without predicate or offset
    if (!predicate && isUndefined(from)) {
      const tickets = values()
      return direction === 'first' ? tickets[0] : tickets.at(-1)
    }

    const tickets = values()
    const index = isUndefined(from) ? undefined : clamp(from, 0, tickets.length - 1)

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
    collection: collection as ReadonlyMap<ID, E>,
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
    move,
    reorder,
    seek,
    batch,
    onboard,
    offboard,
    get size () {
      return collection.size
    },
  } as RegistryContext<Z, E>
}

/**
 * Creates a new registry context.
 *
 * @param options The options for the registry context, including `namespace` (defaults to `'v0:registry'`) and `events`.
 * @template Z The type of registry ticket that extends RegistryTicket. Use this to add custom properties to tickets.
 * @template E The type of registry context that extends RegistryContext<Z>. Use this when extending the registry with additional methods.
 * @returns A new registry context.
 *
 * @see https://0.vuetifyjs.com/composables/registration/create-registry
 *
 * @example
 * ```ts
 * import { createRegistryContext } from '@vuetify/v0'
 *
 * // With default namespace 'v0:registry'
 * export const [useItems, provideItems, items] = createRegistryContext()
 *
 * // Or with custom namespace
 * export const [useItems, provideItems, items] = createRegistryContext({ namespace: 'my-items' })
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
  Z extends RegistryTicketInput = RegistryTicketInput,
  E extends RegistryTicket & Z = RegistryTicket & Z,
> (_options: RegistryContextOptions = {}): ContextTrinity<RegistryContext<Z, E>> {
  const { namespace = 'v0:registry', ...options } = _options

  const context = createRegistry<Z, E>(options)

  return createTrinity<RegistryContext<Z, E>>(namespace, context)
}

/**
 * Uses an existing registry from context.
 *
 * @param namespace The namespace for the registry context. Defaults to `'v0:registry'`.
 * @template Z The type of registry ticket that extends RegistryTicket.
 * @template E The type of registry context that extends RegistryContext<Z>.
 * @returns The registry instance.
 *
 * @see https://0.vuetifyjs.com/composables/registration/create-registry
 *
 * @example
 * ```ts
 * import { useRegistry } from '@vuetify/v0'
 *
 * // In a child component (after provideRegistry was called by an ancestor):
 * const registry = useRegistry()
 *
 * registry.register({ id: 'item-1', value: 'Value 1' })
 * ```
 */
export function useRegistry<
  Z extends RegistryTicketInput = RegistryTicketInput,
  E extends RegistryTicket & Z = RegistryTicket & Z,
> (namespace = 'v0:registry'): RegistryContext<Z, E> {
  return useContext<RegistryContext<Z, E>>(namespace)
}
