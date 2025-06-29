// Composables
import { useContext } from '../useContext'

// Utilities
import { reactive } from 'vue'

// Types
import type { GenericObject, ID } from '#v0/types'
import type { Reactive } from 'vue'

export type RegistrarItem<T extends GenericObject = {}> = {
  id?: ID
} & T

export type RegistrarTicket<T extends GenericObject = {}> = {
  id: ID
  index: number
} & T

export interface RegistrarContext<U extends GenericObject = {}> {
  register: (item?: Partial<RegistrarItem<U>>) => RegistrarTicket<U>
  unregister: (id: RegistrarItem['id']) => void
}

export interface RegistrarState<U extends GenericObject = {}> {
  registeredItems: Reactive<Map<string | number, RegistrarItem<U>>>
  register: (item?: Partial<RegistrarItem<U>>) => RegistrarTicket<U>
  unregister: (id: RegistrarItem['id']) => void
  reindex: () => void
}

export function useRegistrar<
  U extends GenericObject = {},
  T extends RegistrarContext<U> = RegistrarContext<U>,
> (namespace: string) {
  const [useRegistrarContext, provideRegistrarContext] = useContext<T>(namespace)

  const registeredItems = reactive(new Map<string | number, RegistrarItem<U>>())

  function reindex () {
    let index = 0
    for (const item of registeredItems.values()) {
      item.index = index++
    }
  }

  function register (item?: Partial<RegistrarItem<U>>): RegistrarTicket<U> {
    const id = item?.id ?? crypto.randomUUID()
    const index = registeredItems.size

    const registrant = {
      ...item,
      id,
    } as RegistrarItem<U>

    registeredItems.set(id, registrant as any)

    return {
      id,
      index,
      ...item,
    } as RegistrarTicket<U>
  }

  function unregister (id: string | number) {
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
