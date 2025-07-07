// Composables
import { useContext } from '../useContext'

// Utilities
import { reactive } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { Reactive } from 'vue'

export interface RegistrarItem {
  id?: ID
}

export interface RegistrarTicket extends Required<RegistrarItem> {
  index: number
}

export type RegisterCallback<Item extends RegistrarItem, Ticket extends RegistrarTicket> = (item: Partial<Item> | ((order: RegistrarTicket) => Partial<Item>)) => Reactive<Ticket>

export interface RegistrarContext<
  T extends RegistrarTicket = RegistrarTicket,
> {
  registeredItems: Reactive<Map<ID, T>>
  register: (order: (order: RegistrarTicket) => Omit<T, keyof RegistrarTicket> & Partial<RegistrarTicket>) => Reactive<T>
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

  function register (createRegistrant: (order: RegistrarTicket) => Omit<T, keyof RegistrarTicket> & Partial<RegistrarTicket>): Reactive<T> {
    const ticket = {
      id: crypto.randomUUID(),
      index: registeredItems.size,
    }

    const ordered = createRegistrant(ticket)

    const registrant = reactive({
      ...ordered,
      id: ordered.id ?? ticket.id,
      index: ordered.index ?? ticket.index,
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
    function provideRegistrar (_context: U = context) {
      provideRegistrarContext(_context)

      return _context
    },
    context,
  ] as const
}
