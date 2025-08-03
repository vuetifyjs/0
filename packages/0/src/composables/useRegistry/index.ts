// Utilities
import { reactive, shallowReactive } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Types
import type { ID } from '#v0/types'
import type { Reactive } from 'vue'

export interface RegistryTicket {
  id: ID
  index: number
  value: unknown
  valueIsIndex: boolean
}

export interface RegistryContext<Z extends RegistryTicket = RegistryTicket> {
  /** The reactive collection of items */
  collection: Map<ID, Z>
  /** A catalog of all values in the collection */
  catalog: Map<unknown, ID>
  /** A directory of all indexes in the collection */
  directory: Map<number, ID>
  /** Clear the entire registry */
  clear: () => void
  /** Check if an item exists by id */
  has: (id: ID) => boolean
  /** Browse for an ID by value */
  browse: (value: unknown) => ID | undefined
  /** lookup a ticket by index number */
  lookup: (index: number) => ID | undefined
  /** Find a ticket by id */
  find: (id: ID) => Reactive<Z> | undefined
  /** Register a new item */
  register: (item?: Partial<Z>) => Reactive<Z>
  /** Unregister an item by id */
  unregister: (id: ID) => void
  /** Reset the index directory and update all tickets */
  reindex: () => void
  /** Listen for registry events */
  on: (event: string, cb: Function) => void
  /** Stop listening for registry events */
  off: (event: string, cb: Function) => void
}

export interface RegistryOptions {
  /** Use reactive instead of shallowReactive */
  deep?: boolean
  /** Enable event emission for registry operations */
  events?: boolean
}

/**
 * Creates a registry for managing collections of items with registration and lookup capabilities.
 * This function provides the foundation for item management systems with ID-based, value-based,
 * and index-based access patterns.
 *
 * @param options Optional configuration for reactivity behavior.
 * @template Z The type of items managed by the registry.
 * @template E The type of the registry context.
 * @returns The registry context object.
 */
export function useRegistry<
  Z extends RegistryTicket = RegistryTicket,
  E extends RegistryContext<Z> = RegistryContext<Z>,
> (options?: RegistryOptions): E {
  const reactivity = options?.deep ? reactive : shallowReactive
  const collection = reactivity(new Map<ID, Z>())
  const catalog = new Map<unknown, ID>()
  const directory = new Map<number, ID>()

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

  function find (id: ID): Reactive<Z> | undefined {
    return collection.get(id) as Reactive<Z> | undefined
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

  function clear () {
    collection.clear()
    catalog.clear()
    directory.clear()
  }

  function reindex () {
    directory.clear()
    catalog.clear()

    let index = 0

    for (const item of collection.values()) {
      item.index = index

      if (item.valueIsIndex) item.value = index

      directory.set(index, item.id)
      catalog.set(item.value, item.id)

      index++
    }
  }

  function register (registrant: Partial<Z> = {}): Reactive<Z> {
    const size = collection.size
    const id = registrant.id ?? genId()
    const item: Partial<Z> = {
      ...registrant,
      id,
      index: registrant.index ?? size,
      value: registrant.value ?? size,
      valueIsIndex: registrant.value == null,
    }
    const ticket = reactive(item) as Reactive<Z>

    collection.set(ticket.id, ticket as any)
    catalog.set(ticket.value, ticket.id)
    directory.set(ticket.index, ticket.id)

    emit('register', ticket)

    return ticket
  }

  function unregister (id: ID) {
    const item = collection.get(id)

    if (!item) return

    collection.delete(item.id)
    catalog.delete(item.value)
    directory.delete(item.index)

    reindex()

    emit('unregister', item)
  }

  return {
    collection,
    catalog,
    directory,
    on,
    off,
    has,
    clear,
    browse,
    lookup,
    find,
    register,
    unregister,
    reindex,
  } as E
}
