// Composables
import { useContext } from '../useContext'

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
  registeredItems: Reactive<Map<ID, Reactive<any>>>
  register: (item: any, id?: ID) => Reactive<any>
  unregister: (id: ID) => void
  reindex: () => void
}

export function useRegistrar<
  T extends RegistrarTicket,
  U extends RegistrarContext,
> (namespace: string) {
  const [useRegistrarContext, provideRegistrarContext] = useContext<U>(namespace)

  const registeredItems = reactive(new Map<ID, T>())

  function reindex () {
    let index = 0
    for (const item of registeredItems.values()) {
      item.index = index++
    }
  }

  function register (registrant: Partial<T>, id: ID = genId()): Reactive<T> {
    const item = reactive({
      id,
      index: registrant?.index ?? registeredItems.size,
      ...registrant,
    }) as Reactive<T>

    registeredItems.set(item.id, item as any)

    return item
  }

  function unregister (id: ID) {
    registeredItems.delete(id)
    reindex()
  }

  const context = {
    registeredItems,
    register,
    unregister,
    reindex,
  } as U

  return [
    useRegistrarContext,
    function provideRegistrar (
      _context: U = context,
      app?: App,
    ) {
      provideRegistrarContext(_context, app)

      return _context
    },
    context,
  ] as const
}
