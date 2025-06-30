// Composables
import { useContext } from '../useContext'

// Utilities
import { reactive } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { Reactive } from 'vue'

export interface RegistrarItem {
  id: ID
}

export interface RegistrarTicket extends RegistrarItem {
  index: number
}

export interface RegistrarContext<
  R extends RegistrarItem = RegistrarItem,
  T extends RegistrarTicket = RegistrarTicket,
> {
  registeredItems: Reactive<Map<ID, T>>
  register: (item?: Partial<R>) => Reactive<T>
  unregister: (id: ID) => void
  reindex: () => void
}

export function useRegistrar<
  R extends RegistrarItem,
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

  function register (item?: Partial<R>): Reactive<T> {
    const registrant = reactive({
      id: item?.id ?? crypto.randomUUID(),
      index: registeredItems.size,
    }) as Reactive<T>

    registeredItems.set(registrant.id, registrant as any)

    return registrant
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
  } as unknown as U

  return [
    useRegistrarContext,
    function provideRegistrar (_context?: U) {
      provideRegistrarContext(_context ?? context,
      )

      return _context ?? context
    },
    context,
  ] as const
}
