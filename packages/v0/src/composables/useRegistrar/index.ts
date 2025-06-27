// Composables
import { useContext } from '../useContext'

// Utilities
import { reactive } from 'vue'

// Types
import type { Reactive } from 'vue'

export type RegistrarItem<T extends Record<string, any> = {}> = {
  id: string | number
  index: number
} & T

export type RegistrarTicket<T extends Record<string, any> = {}> = {
  id: string | number
  index: number
} & T

export interface RegistrarContext<U extends Record<string, any> = {}> {
  register: (item?: Partial<RegistrarItem<U>>) => RegistrarTicket<U>
  unregister: (id: string | number) => void
}

export interface RegistrarState<U extends Record<string, any> = {}> {
  registeredItems: Reactive<Map<string | number, RegistrarItem<U>>>
}

export function useRegistrar<U extends Record<string, any> = {}, T extends RegistrarContext<U> = RegistrarContext<U>> (
  namespace: string,
) {
  const [useRegistrarContext, provideRegistrarContext] = useContext<T>(namespace)

  const registeredItems = reactive(new Map<string | number, any>()) as Reactive<Map<string | number, RegistrarItem<U>>>

  function reindex () {
    let index = 0

    for (const [, value] of registeredItems) {
      value.index = index++
    }
  }

  function register (item?: Partial<RegistrarItem<U>>): RegistrarTicket<U> {
    const index = registeredItems.size

    const baseItem = {
      id: item?.id ?? crypto.randomUUID(),
      index,
    }

    const fullItem = {
      ...baseItem,
      ...item,
    } as RegistrarItem<U>

    const registrant = reactive(fullItem)

    registeredItems.set(registrant.id, registrant as any)

    return {
      ...baseItem,
      ...item,
    } as RegistrarTicket<U>
  }

  function unregister (id: string | number) {
    registeredItems.delete(id)
    reindex()
  }

  return [
    useRegistrarContext,
    function (context?: Omit<T, keyof RegistrarContext<U>>) {
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
    } as RegistrarState<U>,
  ] as const
}
