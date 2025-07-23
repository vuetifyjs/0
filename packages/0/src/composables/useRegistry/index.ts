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
}

export interface RegistryContext {
  collection: Reactive<Map<ID, Reactive<any>>>
  /** lookup an item by index number */
  lookup: (index: number) => ID | undefined
  /** Find an item by id */
  find: (id: ID) => Reactive<any> | undefined
  /** Register a new item */
  register: (item?: Partial<RegistryTicket>, id?: ID) => Reactive<any>
  /** Unregister an item by id */
  unregister: (id: ID) => void
  /** Reset the index directory and update all items */
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
  Z extends RegistryContext,
  E extends RegistryTicket,
> (namespace: string) {
  const [useRegistryContext, _provideRegistryContext] = createContext<Z>(namespace)

  const collection = reactive(new Map<ID, E>())
  const directory = reactive(new Map<number, ID>())

  function find (id: ID) {
    return collection.get(id) as E | undefined
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

  function register (registrant: Partial<E>, id: ID = genId()): Reactive<E> {
    const item = reactive({
      id,
      index: registrant?.index ?? collection.size,
      ...registrant,
    }) as Reactive<E>

    collection.set(item.id, item as any)
    directory.set(item.index, item.id)

    return item
  }

  function unregister (id: ID) {
    const item = collection.get(id)

    if (!item) return

    directory.delete(item.index)
    collection.delete(item.id)

    reindex()
  }

  const context = {
    collection,
    lookup,
    find,
    register,
    unregister,
    reindex,
  } as Z

  function provideRegistryContext (_: unknown, _context: Z = context, app?: App): Z {
    return _provideRegistryContext(_context, app)
  }

  return createTrinity<Z>(useRegistryContext, provideRegistryContext, context)
}
