/**
 * @module toReactive
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
 */

// Types
import type { MaybeRef, UnwrapNestedRefs } from 'vue'

// Utilities
import { isRef, reactive, unref } from 'vue'

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

  const target = objectRef.value

  // Handle Map collections
  if (target instanceof Map) {
    const mapProxy = new Proxy(new Map(), {
      get (_, p) {
        const map = objectRef.value as Map<unknown, unknown>
        if (p === 'get') {
          return (key: unknown) => unref(map.get(key))
        }
        if (p === 'set') {
          return (key: unknown, value: unknown) => {
            const existingValue = map.get(key)
            if (isRef(existingValue)) {
              existingValue.value = unref(value)
            } else {
              map.set(key, value)
            }
            return mapProxy
          }
        }
        if (p === 'has') {
          return (key: unknown) => map.has(key)
        }
        if (p === 'delete') {
          return (key: unknown) => map.delete(key)
        }
        if (p === 'clear') {
          return () => map.clear()
        }
        if (p === 'size') {
          return map.size
        }
        if (p === 'keys') {
          return () => map.keys()
        }
        if (p === 'values') {
          return function* () {
            for (const value of map.values()) {
              yield unref(value)
            }
          }
        }
        if (p === 'entries') {
          return function* () {
            for (const [key, value] of map.entries()) {
              yield [key, unref(value)] as [unknown, unknown]
            }
          }
        }
        if (p === 'forEach') {
          return (callback: (value: unknown, key: unknown, map: Map<unknown, unknown>) => void, thisArg?: unknown) => {
            for (const [key, value] of map.entries()) {
              callback.call(thisArg, unref(value), key, mapProxy)
            }
          }
        }
        if (p === Symbol.iterator) {
          return function* () {
            for (const [key, value] of map.entries()) {
              yield [key, unref(value)] as [unknown, unknown]
            }
          }
        }
        return Reflect.get(map, p)
      },
    })
    return reactive(mapProxy) as UnwrapNestedRefs<Z>
  }

  // Handle Set collections
  if (target instanceof Set) {
    const setProxy = new Proxy(new Set(), {
      get (_, p) {
        const set = objectRef.value as Set<unknown>
        if (p === 'add') {
          return (value: unknown) => {
            set.add(value)
            return setProxy
          }
        }
        if (p === 'has') {
          return (value: unknown) => set.has(value)
        }
        if (p === 'delete') {
          return (value: unknown) => set.delete(value)
        }
        if (p === 'clear') {
          return () => set.clear()
        }
        if (p === 'size') {
          return set.size
        }
        if (p === 'keys' || p === 'values') {
          return function* () {
            for (const value of set.values()) {
              yield unref(value)
            }
          }
        }
        if (p === 'entries') {
          return function* () {
            for (const value of set.values()) {
              const unreffedValue = unref(value)
              yield [unreffedValue, unreffedValue] as [unknown, unknown]
            }
          }
        }
        if (p === 'forEach') {
          return (callback: (value: unknown, value2: unknown, set: Set<unknown>) => void, thisArg?: unknown) => {
            for (const value of set) {
              const unreffedValue = unref(value)
              callback.call(thisArg, unreffedValue, unreffedValue, setProxy)
            }
          }
        }
        if (p === Symbol.iterator) {
          return function* () {
            for (const value of set.values()) {
              yield unref(value)
            }
          }
        }
        return Reflect.get(set, p)
      },
    })
    return reactive(setProxy) as UnwrapNestedRefs<Z>
  }

  // Handle regular objects and arrays
  const proxy = new Proxy({}, {
    get (_, p, receiver) {
      return unref(Reflect.get(objectRef.value, p, receiver))
    },
    set (_, p, value) {
      const currentTarget = objectRef.value as Record<PropertyKey, unknown>
      currentTarget[p] = value
      return true
    },
    deleteProperty (_, p) {
      return Reflect.deleteProperty(objectRef.value, p)
    },
    has (_, p) {
      return Reflect.has(objectRef.value, p)
    },
    ownKeys () {
      return Object.keys(objectRef.value)
    },
    getOwnPropertyDescriptor (_, p) {
      const desc = Reflect.getOwnPropertyDescriptor(objectRef.value, p)
      if (!desc) {
        return undefined
      }
      const newDesc = { ...desc, configurable: true }
      if ('value' in newDesc) {
        newDesc.value = unref(newDesc.value)
      }
      return newDesc
    },
  })

  return reactive(proxy) as UnwrapNestedRefs<Z>
}
