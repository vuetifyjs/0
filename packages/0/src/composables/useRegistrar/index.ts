// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { createContext } from '#v0/factories/createContext'

// Utilities
import { reactive } from 'vue'
import { genId } from '#v0/utilities/helpers'

// Types
import type { ID } from '#v0/types'
import type { App, Reactive } from 'vue'

export interface RegistrarTicket {
  id: ID
  index: number
}

export interface RegistrarContext {
  tickets: Reactive<Map<ID, Reactive<any>>>
  lookup: (index: number) => ID | undefined
  register: (ticket?: Partial<RegistrarTicket>, id?: ID) => Reactive<any>
  unregister: (id: ID) => void
  reindex: () => void
}

/**
 * Simple composable that provides a registrar for managing tickets.
 * It allows for registering, unregistering, and reindexing tickets,
 * enabling dynamic management of application state.
 *
 * @param namespace The namespace for the registrar context.
 * @template Z The type of the tickets managed by the registrar.
 * @template E The type of the registrar context.
 * @returns A tuple containing the inject function, provide function, and the registrar context.
 */
export function useRegistrar<
  Z extends RegistrarTicket,
  E extends RegistrarContext,
> (namespace: string) {
  const [useRegistrarContext, _provideRegistrarContext] = createContext<E>(namespace)

  const tickets = reactive(new Map<ID, Z>())
  const directory = reactive(new Map<number, ID>())

  function lookup (index: number) {
    return directory.get(index)
  }

  function reindex () {
    directory.clear()
    let index = 0
    for (const item of tickets.values()) {
      item.index = index
      directory.set(index, item.id)
      index++
    }
  }

  function register (registrant: Partial<Z>, id: ID = genId()): Reactive<Z> {
    const item = reactive({
      id,
      index: registrant?.index ?? tickets.size,
      ...registrant,
    }) as Reactive<Z>

    tickets.set(item.id, item as any)
    directory.set(item.index, item.id)

    return item
  }

  function unregister (id: ID) {
    const item = tickets.get(id)

    if (!item) return

    directory.delete(item.index)
    tickets.delete(item.id)
    reindex()
  }

  const context = {
    tickets,
    lookup,
    register,
    unregister,
    reindex,
  } as E

  function provideRegistrarContext (_: unknown, _context: E = context, app?: App): E {
    return _provideRegistrarContext(_context, app)
  }

  return createTrinity<E>(useRegistrarContext, provideRegistrarContext, context)
}
