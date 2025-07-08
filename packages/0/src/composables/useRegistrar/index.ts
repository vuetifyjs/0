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

export type RegisterCallback<Item extends RegistrarItem, Stub extends RegistrarTicket> = (item?: Partial<Item> | ((order: Stub) => Partial<Item>)) => Reactive<Stub>

export type RegisterArgument<Item extends RegistrarItem> = Parameters<RegisterCallback<Item, RegistrarTicket>>[0]

export interface RegistrarContext<
  T extends RegistrarTicket = RegistrarTicket,
  RegisterFn = RegisterCallback<RegistrarItem, T>,
> {
  registeredItems: Reactive<Map<ID, T>>
  register: RegisterFn
  unregister: (id: ID) => void
  reindex: () => void
}

export function useRegistrar<
  T extends RegistrarTicket,
  U extends RegistrarContext,
> (namespace: string) {
  type PartialTicket = Omit<T, keyof RegistrarTicket> & Partial<RegistrarTicket>

  const [useRegistrarContext, provideRegistrarContext] = useContext<U>(namespace)

  const registeredItems = reactive(new Map<ID, T>())

  function reindex () {
    let index = 0
    for (const item of registeredItems.values()) {
      item.index = index++
    }
  }

  function register (registration?: RegisterArgument<PartialTicket>): Reactive<T> {
    const stub = {
      id: crypto.randomUUID(),
      index: registeredItems.size,
    }

    // TODO: Add extract function
    const ticket = typeof registration === 'function' ? registration(stub) : registration

    const registrant = reactive({
      ...ticket,
      id: ticket?.id ?? stub.id,
      index: ticket?.index ?? stub.index,
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
