// Composables
import { useContext } from '../useContext'

// Utilities
import { shallowReactive, shallowRef } from 'vue'

// Types
import type { GenericObject, ID } from '#v0/types'
import type { ShallowReactive, ShallowRef } from 'vue'

export type RegistrarItem<T extends GenericObject = {}> = {
  id?: ID
} & T

export type RegistrarTicket<T extends GenericObject = {}> = {
  id: ID
  index: ShallowRef<number>
} & T

export interface RegistrarContext<U extends GenericObject = {}> {
  register: (item?: Partial<RegistrarItem<U>>) => RegistrarTicket<U>
  unregister: (id: ID) => void
}

export interface RegistrarState<U extends GenericObject = {}> {
  registeredItems: ShallowReactive<Map<ID, RegistrarTicket<U>>>
  register: (item?: Partial<RegistrarItem<U>>) => RegistrarTicket<U>
  unregister: (id: ID) => void
  reindex: () => void
}

export function useRegistrar<
  U extends GenericObject = {},
  T extends RegistrarContext<U> = RegistrarContext<U>,
> (namespace: string) {
  const [useRegistrarContext, provideRegistrarContext] = useContext<T>(namespace)

  const registeredItems = shallowReactive(new Map<ID, RegistrarTicket<U>>())

  function reindex () {
    let index = 0
    for (const item of registeredItems.values()) {
      item.index.value = index++
    }
  }

  function register (item?: Partial<RegistrarItem<U>>): RegistrarTicket<U> {
    const registrant = {
      id: item?.id ?? crypto.randomUUID(),
      index: shallowRef(registeredItems.size),
    } as RegistrarTicket<U>

    registeredItems.set(registrant.id, registrant as any)

    return registrant
  }

  function unregister (id: ID) {
    registeredItems.delete(id)
    reindex()
  }

  return [
    useRegistrarContext,
    function provideRegistrar (context?: Omit<T, keyof RegistrarContext<U>>) {
      const registrar = {
        register,
        unregister,
        ...context,
      } as T

      provideRegistrarContext(registrar)

      return registrar
    },
    {
      registeredItems,
      register,
      unregister,
      reindex,
    } as RegistrarState<U>,
  ] as const
}
