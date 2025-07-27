// Factories
import { createContext } from '#v0/factories/createContext'
import { createTrinity } from '#v0/factories/createTrinity'

// Utilities
import { reactive } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Types
import type { ID } from '#v0/types'
import type { App, Reactive } from 'vue'

export interface RegistryTicket {
  id: ID
  index: number
  value: unknown
  valueIsIndex: boolean
}

export interface RegistryContext<Z extends RegistryTicket = RegistryTicket> {
  collection: Map<ID, Z>
  /** Browse for an ID by value */
  browse: (value: unknown) => ID | undefined
  /** lookup a ticket by index number */
  lookup: (index: number) => ID | undefined
  /** Find a ticket by id */
  find: (id: ID) => Z | undefined
  /** Register a new item */
  register: (item?: Partial<Z>, id?: ID) => Z
  /** Unregister an item by id */
  unregister: (id: ID) => void
  /** Reset the index directory and update all tickets */
  reindex: () => void
}

/**
 * A composable for managing a collection of info.
 * @param namespace The key to scope the context
 * @template Z The registry context interface.
 * @template E The structure of the collection.
 * @returns A trinity of registry methods.
 */
export function useRegistry<
  Z extends RegistryTicket = RegistryTicket,
  E extends RegistryContext = RegistryContext,
> (namespace: string) {
  const [useRegistryContext, _provideRegistryContext] = createContext<E>(namespace)

  const collection = reactive(new Map<ID, Z>())
  const catalog = new Map<unknown, ID>()
  const directory = new Map<number, ID>()

  function find (id: ID) {
    return collection.get(id)
  }

  function browse (value: unknown): ID | undefined {
    return catalog.get(value)
  }

  function lookup (index: number) {
    return directory.get(index)
  }

  function reindex () {
    directory.clear()
    let index = 0
    for (const item of collection.values()) {
      item.index = index
      directory.set(index, item.id)
      index++
    }
  }

  function register (registrant: Partial<Z>, id: ID = genId()): Reactive<Z> {
    const size = collection.size
    const item = reactive({
      id,
      index: registrant?.index ?? size,
      value: registrant?.value ?? size,
      valueIsIndex: registrant?.value == null,
      ...registrant,
    }) as Reactive<Z>

    collection.set(item.id, item as any)
    catalog.set(item.value, item.id)
    directory.set(item.index, item.id)

    return item
  }

  function unregister (id: ID) {
    const item = collection.get(id)

    if (!item) return

    collection.delete(item.id)
    catalog.delete(item.value)
    directory.delete(item.index)

    reindex()
  }

  const context = {
    collection,
    browse,
    lookup,
    find,
    register,
    unregister,
    reindex,
  } as unknown as E

  function provideRegistryContext (_: unknown, _context: E = context, app?: App): E {
    return _provideRegistryContext(_context, app)
  }

  return createTrinity<E>(useRegistryContext, provideRegistryContext, context)
}
