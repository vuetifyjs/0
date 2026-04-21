/**
 * @module toReactive
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-reactive
 *
 * @remarks
 * Utility function to convert values and refs into reactive proxies with ref unwrapping.
 *
 * Key features:
 * - Automatic ref unwrapping
 * - Deep reactive proxying
 * - Map and Set support with ref unwrapping
 * - Nested object/array reactivity
 * - Type preservation
 *
 * Perfect for creating reactive versions of plain objects while automatically unwrapping refs.
 *
 * @example
 * ```ts
 * import { shallowRef } from 'vue'
 * import { toReactive } from '@vuetify/v0'
 *
 * const source = { name: shallowRef('Alice'), age: 30 }
 * const reactive = toReactive(source)
 * console.log(reactive.name) // 'Alice' (auto-unwrapped)
 * ```
 */

// Utilities
import { isFunction } from '#v0/utilities'
import { isRef, reactive, unref } from 'vue'

// Types
import type { MaybeRef, Ref, UnwrapNestedRefs } from 'vue'

function createMapProxy<Z extends object> (refObject: Ref<Z>): UnwrapNestedRefs<Z> {
  let mapProxy: Map<unknown, unknown>

  const mapHandlers: Record<string | symbol, Function> = {
    get: (key: unknown) => unref((refObject.value as Map<unknown, unknown>).get(key)),
    set: (key: unknown, value: unknown) => {
      const map = refObject.value as Map<unknown, unknown>
      const existingValue = map.get(key)
      if (isRef(existingValue)) {
        existingValue.value = unref(value)
      } else {
        map.set(key, value)
      }
      return mapProxy
    },
    has: (key: unknown) => (refObject.value as Map<unknown, unknown>).has(key),
    delete: (key: unknown) => (refObject.value as Map<unknown, unknown>).delete(key),
    clear: () => (refObject.value as Map<unknown, unknown>).clear(),
    keys: () => (refObject.value as Map<unknown, unknown>).keys(),
    * values () {
      for (const value of (refObject.value as Map<unknown, unknown>).values()) {
        yield unref(value)
      }
    },
    * entries () {
      for (const [key, value] of (refObject.value as Map<unknown, unknown>).entries()) {
        yield [key, unref(value)] as [unknown, unknown]
      }
    },
    forEach: (callback: (value: unknown, key: unknown, map: Map<unknown, unknown>) => void, thisArg?: unknown) => {
      ;for (const [key, value] of (refObject.value as Map<unknown, unknown>).entries()) {
        callback.call(thisArg, unref(value), key, mapProxy)
      }
    },
  }
  mapHandlers[Symbol.iterator] = mapHandlers.entries

  const proxy = new Proxy(new Map(), {
    get (_, p) {
      if (p === 'size') return (refObject.value as Map<unknown, unknown>).size
      if (Object.prototype.hasOwnProperty.call(mapHandlers, p)) return mapHandlers[p as keyof typeof mapHandlers]

      const map = refObject.value as Map<unknown, unknown>
      const value = Reflect.get(map, p)
      return isFunction(value) ? value.bind(map) : value
    },
  })
  mapProxy = proxy
  return reactive(mapProxy) as UnwrapNestedRefs<Z>
}

function createSetProxy<Z extends object> (refObject: Ref<Z>): UnwrapNestedRefs<Z> {
  let setProxy: Set<unknown>

  const setHandlers: Record<string | symbol, Function> = {
    add: (value: unknown) => {
      ;(refObject.value as Set<unknown>).add(value)
      return setProxy
    },
    has: (value: unknown) => (refObject.value as Set<unknown>).has(value),
    delete: (value: unknown) => (refObject.value as Set<unknown>).delete(value),
    clear: () => (refObject.value as Set<unknown>).clear(),
    * keys () {
      for (const value of (refObject.value as Set<unknown>).values()) {
        yield unref(value)
      }
    },
    * values () {
      for (const value of (refObject.value as Set<unknown>).values()) {
        yield unref(value)
      }
    },
    * entries () {
      for (const value of (refObject.value as Set<unknown>).values()) {
        const unreffedValue = unref(value)
        yield [unreffedValue, unreffedValue] as [unknown, unknown]
      }
    },
    forEach: (callback: (value: unknown, value2: unknown, set: Set<unknown>) => void, thisArg?: unknown) => {
      ;for (const value of (refObject.value as Set<unknown>)) {
        const unreffedValue = unref(value)
        callback.call(thisArg, unreffedValue, unreffedValue, setProxy)
      }
    },
  }
  setHandlers[Symbol.iterator] = setHandlers.values

  const proxy = new Proxy(new Set(), {
    get (_, p) {
      if (p === 'size') return (refObject.value as Set<unknown>).size
      if (Object.prototype.hasOwnProperty.call(setHandlers, p)) return setHandlers[p as keyof typeof setHandlers]

      const set = refObject.value as Set<unknown>
      const value = Reflect.get(set, p)
      return isFunction(value) ? value.bind(set) : value
    },
  })
  setProxy = proxy
  return reactive(setProxy) as UnwrapNestedRefs<Z>
}

function createObjectProxy<Z extends object> (refObject: Ref<Z>): UnwrapNestedRefs<Z> {
  const proxy = new Proxy({}, {
    get (_, p, receiver) {
      return unref(Reflect.get(refObject.value, p, receiver))
    },
    set (_, p, value) {
      return Reflect.set(refObject.value, p, value)
    },
    deleteProperty (_, p) {
      return Reflect.deleteProperty(refObject.value, p)
    },
    has (_, p) {
      return Reflect.has(refObject.value, p)
    },
    ownKeys () {
      return Reflect.ownKeys(refObject.value)
    },
    getOwnPropertyDescriptor (_, p) {
      const desc = Reflect.getOwnPropertyDescriptor(refObject.value, p)
      if (!desc) {
        return undefined
      }
      const newDesc: PropertyDescriptor = {
        configurable: true,
        enumerable: desc.enumerable,
      }
      if ('value' in desc) {
        newDesc.value = unref(desc.value)
        newDesc.writable = desc.writable
      } else {
        newDesc.get = desc.get
        newDesc.set = desc.set
      }
      return newDesc
    },
  })

  return reactive(proxy) as UnwrapNestedRefs<Z>
}

/**
 * Converts a `MaybeRef` to a `UnwrapNestedRefs`.
 *
 * @param objectRef The object to convert.
 * @template Z The type of the object.
 * @returns The converted object.
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-reactive
 *
 * @example
 * ```ts
 * import { ref } from 'vue'
 * import { toReactive } from '@vuetify/v0'
 *
 * const state = ref({ name: 'John', age: 30 })
 * const rstate = toReactive(state)
 *
 * console.log(rstate.name) // John
 * ```
 */
export function toReactive<Z extends object> (
  objectRef: MaybeRef<Z>,
): UnwrapNestedRefs<Z> {
  if (!isRef(objectRef))
    return reactive(objectRef)

  const refObject = objectRef as Ref<Z>
  const target = refObject.value

  // Handle Map collections
  if (target instanceof Map) return createMapProxy(refObject)

  // Handle Set collections
  if (target instanceof Set) return createSetProxy(refObject)

  // Handle regular objects and arrays
  return createObjectProxy(refObject)
}
