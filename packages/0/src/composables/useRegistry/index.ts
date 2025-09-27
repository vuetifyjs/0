// Factories
import { createContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { genId, isArray } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App } from 'vue'

export interface RegistryTicket {
  /** The unique identifier. Is randomly generated if not provided. */
  id: ID
  /** The index of the ticket. It's not recommended to manually set this. */
  index: number
  /** The value associated with the ticket. If not provided, it defaults to the index. */
  value: unknown
  /** Whether the value is derived from index. It's not recommended to manually set this. */
  valueIsIndex: boolean
}

export interface RegistryContext<Z extends RegistryTicket = RegistryTicket> {
  /** The collection of tickets */
  collection: Map<ID, Z>
  /** Clear the entire registry */
  clear: () => void
  /** Check if an item exists by ID */
  has: (id: ID) => boolean
  /** Returns an array of registered IDs */
  keys: () => ID[]
  /** Browse for an ID by value */
  browse: (value: unknown) => ID | ID[] | undefined
  /** lookup a ticket by index number */
  lookup: (index: number) => ID | undefined
  /** Get a ticket by ID */
  get: (id: ID) => Z | undefined
  /** Update or insert an item by ID */
  upsert: (id: ID, item?: Partial<Z>) => Z
  /** Get all registered tickets */
  values: () => Z[]
  /** Get all entries as [ID, ticket] pairs */
  entries: () => [ID, Z][]
  /** Register a new item */
  register: (item?: Partial<Z>) => Z
  /** Unregister an item by ID */
  unregister: (id: ID) => void
  /** Reset the index directory and update all tickets */
  reindex: () => void
  /** Listen for registry events */
  on: (event: string, cb: Function) => void
  /** Stop listening for registry events */
  off: (event: string, cb: Function) => void
  /** Emit an event with data */
  emit: (event: string, data: any) => void
  /** Clears the registry and listeners */
  dispose: () => void
  /** Onboard multiple new items */
  onboard: (registrations: Partial<Z>[]) => Z[]
  /** The size of the registry */
  size: number
}

export interface RegistryOptions {
  /** Enable event emission for registry operations */
  events?: boolean
}

/**
 * Creates a new registry instance.
 *
 * @param options The options for the registry instance.
 * @template Z The type of the registry ticket.
 * @template E The type of the registry context.
 * @returns A new registry instance.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-registry
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

  function emit (event: string, data: any) {
    if (!options?.events) return
    const cbs = listeners.get(event)
    if (!cbs) return
    for (const cb of cbs) cb(data)
  }

  function on (event: string, cb: Function) {
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

    for (const item of values()) {
      if (item.index !== index) {
        item.index = index

        if (item.valueIsIndex) item.value = index
      }

      directory.set(index, item.id)
      assign(item.value, item.id)

      index++
    }

    invalidate()
  }

  function register (registration: Partial<Z> = {}): Z {
    const size = collection.size
    const id = registration.id ?? genId()

    if (has(id)) {
      logger.warn(`Item with id "${id}" already exists in the registry. Skipping registration.`)

      return get(id) as Z
    }

    const index = registration.index ?? size
    const value = registration.value === undefined ? index : registration.value
    const valueIsIndex = registration.value === undefined

    const item = {
      ...registration,
      id,
      index,
      value,
      valueIsIndex,
    } as Z

    collection.set(item.id, item)
    directory.set(item.index, item.id)

    assign(item.value, item.id)
    invalidate()
    emit('register', item)

    return item
  }

  function unregister (id: ID) {
    const item = collection.get(id)

    if (!item) return

    collection.delete(item.id)
    directory.delete(item.index)
    unassign(item.value, item.id)

    emit('unregister', item)
    reindex()
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
 * @template Z The type of the registry ticket.
 * @template E The type of the registry context.
 * @returns A new registry context.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-registry
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
