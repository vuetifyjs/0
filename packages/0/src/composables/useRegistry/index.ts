// Composables
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { genId, isArray } from '#v0/utilities/helpers'

// Types
import type { ID } from '#v0/types'

export interface RegistryTicket {
  id: ID
  index: number
  value: unknown
  valueIsIndex: boolean
}

export interface RegistryContext<Z extends RegistryTicket = RegistryTicket> {
  /** The collection of tickets */
  collection: Map<ID, Z>
  /** Clear the entire registry */
  clear: () => void
  /** Check if an item exists by id */
  has: (id: ID) => boolean
  /** Browse for an ID by value */
  browse: (value: unknown) => ID | undefined
  /** lookup a ticket by index number */
  lookup: (index: number) => ID | undefined
  /** Find a ticket by id */
  find: (id: ID) => Z | undefined
  /** Register a new item */
  register: (item?: Partial<Z>) => Z
  /** Unregister an item by id */
  unregister: (id: ID) => void
  /** Reset the index directory and update all tickets */
  reindex: () => void
  /** Listen for registry events */
  on: (event: string, cb: Function) => void
  /** Stop listening for registry events */
  off: (event: string, cb: Function) => void
  /** Emit an event with data */
  emit: (event: string, data: any) => void
}

export interface RegistryOptions {
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
  const logger = useLogger()

  const collection = new Map<ID, Z>()
  const catalog = new Map<unknown, ID | ID[]>()
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

  function find (id: ID) {
    return collection.get(id)
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
      if (item.index !== index) {
        item.index = index

        if (item.valueIsIndex) item.value = index
      }

      directory.set(index, item.id)
      catalog.set(item.value, item.id)

      index++
    }
  }

  function register (registrant: Partial<Z> = {}): Z {
    const size = collection.size
    const id = registrant.id ?? genId()

    if (has(id)) {
      logger.warn(`Item with id "${id}" already exists in the registry.`)
    }

    const item = {
      ...registrant,
      id,
      index: registrant.index ?? size,
      value: registrant.value ?? size,
      valueIsIndex: registrant.value == null,
    } as Z

    collection.set(item.id, item)
    directory.set(item.index, item.id)

    const exists = browse(item.value)

    if (exists) {
      if (isArray(exists)) exists.push(item.id)
      else catalog.set(item.value, [exists, item.id])
    } else catalog.set(item.value, item.id)

    emit('register', item)

    return item
  }

  function unregister (id: ID) {
    const item = collection.get(id)

    if (!item) return

    collection.delete(item.id)
    directory.delete(item.index)

    let exists = browse(item.value)

    if (isArray(exists)) {
      exists = exists.filter(i => i !== item.id)
      if (exists.length === 1) catalog.set(item.value, exists[0])
      else if (exists.length === 0) catalog.delete(item.value)
    } else catalog.delete(item.value)

    emit('unregister', item)

    reindex()
  }

  return {
    collection,
    emit,
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
