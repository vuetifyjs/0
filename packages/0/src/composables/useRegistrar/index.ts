// Composables
import { useContext } from '../useContext'

// Utilities
import { reactive } from 'vue'
import { genId } from '#v0/utils/helpers'

// Types
import type { ID } from '#v0/types'
import type { App, Reactive } from 'vue'

export interface RegistrarItem {
  id?: ID
}

export interface RegistrarTicket extends Required<RegistrarItem> {
  index: number
}

export type RegisterCallback<Item extends RegistrarItem, Ticket extends RegistrarTicket> = (item?: Partial<Item> | ((ticket: Ticket) => Partial<Item>)) => Reactive<Ticket>

export type RegisterArgument<Item extends RegistrarItem, Ticket extends RegistrarTicket> = Parameters<RegisterCallback<Item, Ticket>>[0]

export type IntakeFunction<Item extends RegistrarItem, Ticket extends RegistrarTicket> = (ticket: RegistrarTicket, item?: Partial<Item> | ((ticket: Ticket) => Partial<Item>)) => Partial<Ticket>

export interface RegistrarContext<
  T extends RegistrarTicket = RegistrarTicket,
  R extends RegistrarItem = RegistrarItem,
  RegisterFn = RegisterCallback<R, T>,
  IntakeFn = IntakeFunction<R, T>,
> {
  registeredItems: Reactive<Map<ID, Reactive<T>>>
  register: RegisterFn
  intake: IntakeFn
  unregister: (id: ID) => void
  reindex: () => void
}

export function useRegistrar<
  T extends RegistrarTicket,
  U extends RegistrarContext<T>,
> (namespace: string) {
  type PartialItem = Omit<T, keyof RegistrarTicket> & Partial<RegistrarTicket>

  const [useRegistrarContext, provideRegistrarContext] = useContext<U>(namespace)

  const registeredItems = reactive(new Map<ID, any>())

  function reindex () {
    let index = 0
    for (const item of registeredItems.values()) {
      item.index = index++
    }
  }

  function intake (ticket: RegistrarTicket, item: RegisterArgument<PartialItem, RegistrarTicket>) {
    if (typeof item === 'function') {
      return item(ticket)
    }
    return item
  }

  function register (registration?: RegisterArgument<PartialItem, T>): Reactive<T> {
    const isFunction = typeof registration === 'function'

    const ticket: RegistrarTicket = {
      id: isFunction ? genId() : registration?.id ?? genId(),
      index: registeredItems.size,
    }

    const item = intake(ticket, registration as T)

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
    intake,
  } as unknown as U

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
