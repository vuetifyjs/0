import type { Reactive } from 'vue'
import { reactive, computed } from 'vue'
import type { GenericObject } from '#v0/types'

export type ID = string | number

export interface RegistrarItem {
  id?: ID
}

export interface RegistrarTicket extends Required<RegistrarItem> { }

export function useRegistrar<Defined extends GenericObject> () {
  const registeredItems = reactive(new Map<ID, Reactive<Defined> | null>())

  type Item = NonNullable<ReturnType<typeof registeredItems['get']>>

  const definedItems = computed(() =>
    Array.from(registeredItems.entries())
      .reduce((map, [key, value]) => value === null ? map : map.set(key, value as Item), new Map<ID, Item>()),
  )

  function register (item?: RegistrarItem) {
    const id = (item?.id ?? crypto.randomUUID()) as ID

    registeredItems.set(id, null)

    function define (callback: (arg: RegistrarTicket) => Defined) {
      const ticket = reactive(callback({ id }))
      registeredItems.set(id, ticket as Item)
      return ticket
    }

    function undefine () {
      registeredItems.delete(id)
    }

    return {
      id,
      define,
      undefine,
    }
  }

  function unregister (id: ID) {
    registeredItems.delete(id)
  }

  function reset () {
    registeredItems.clear()
  }

  return {
    registeredItems,
    definedItems,
    register,
    unregister,
    reset,
  }
}
