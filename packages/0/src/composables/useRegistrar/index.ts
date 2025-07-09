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

export type RegisterCallback<Item extends RegistrarItem, Ticket extends RegistrarTicket> = (item?: Partial<Item> | ((ticket: Ticket) => Partial<Item>)) => Reactive<Ticket>

export type RegisterArgument<Item extends RegistrarItem> = Parameters<RegisterCallback<Item, RegistrarTicket>>[0]

export interface RegistrarContext<
  T extends RegistrarTicket = RegistrarTicket,
  RegisterFn = RegisterCallback<RegistrarItem, T>,
> {
  registeredItems: Reactive<Map<ID, Reactive<T>>>
  register: RegisterFn
  unregister: (id: ID) => void
  reindex: () => void
}

export function useRegistrar<
  T extends RegistrarTicket,
  U extends RegistrarContext<T>,
> (namespace: string) {
  type PartialItem = Omit<T, keyof RegistrarTicket> & Partial<RegistrarTicket>

  const [useRegistrarContext, provideRegistrarContext] = useContext<U>(namespace)

  const registeredItems = reactive(new Map())

  function reindex () {
    let index = 0
    for (const item of registeredItems.values()) {
      item.index = index++
    }
  }

  function register (registration?: RegisterArgument<PartialItem>): Reactive<T> {
    const ticket: RegistrarTicket = {
      id: crypto.randomUUID(),
      index: registeredItems.size,
    }

    const item = typeof registration === 'function' ? registration(ticket) : registration

    Object.assign(ticket, item)

    const registrant = reactive(ticket) as Reactive<T>

    registeredItems.set(registrant.id, registrant)

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
