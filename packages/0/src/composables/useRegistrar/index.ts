// Factories
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useContext } from '#v0/composables/useContext'

// Utilities
import { reactive } from 'vue'
import { genId } from '#v0/utils/helpers'

// Types
import type { ID } from '#v0/types'
import type { App, Reactive } from 'vue'

export interface RegistrarTicket {
  id: ID
  index: number
}

export interface RegistrarContext {
  tickets: Reactive<Map<ID, Reactive<any>>>
  register: (ticket: Partial<RegistrarTicket>, id?: ID) => Reactive<any>
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
  const [useRegistrarContext, provideRegistrarContext] = useContext<E>(namespace)

  const tickets = reactive(new Map<ID, Z>())

  function reindex () {
    let index = 0
    for (const item of tickets.values()) {
      item.index = index++
    }
  }

  function register (registrant: Partial<Z>, id: ID = genId()): Reactive<Z> {
    const item = reactive({
      id,
      index: registrant?.index ?? tickets.size,
      ...registrant,
    }) as Reactive<Z>

    tickets.set(item.id, item as any)

    return item
  }

  function unregister (id: ID) {
    tickets.delete(id)
    reindex()
  }

  const context = {
    tickets,
    register,
    unregister,
    reindex,
  } as E

  return createTrinity<E>(
    useRegistrarContext,
    (_: unknown, _context: E = context, app?: App) => {
      provideRegistrarContext(_context, app)
      return _context
    },
    context,
  )
}
