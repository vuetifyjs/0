/**
 * @module useStorage
 *
 * @remarks
 * Reactive storage composable with adapter pattern for localStorage, sessionStorage, or memory.
 *
 * Key features:
 * - Reactive refs that sync with storage
 * - localStorage, sessionStorage, and memory adapters
 * - Custom serialization support
 * - SSR fallback to memory adapter
 * - Automatic cleanup on remove/clear
 *
 * Uses adapter pattern to abstract storage implementation details.
 */

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'

// Composables
import { useWindowEventListener } from '#v0/composables/useEventListener'

// Adapters
import { MemoryAdapter } from '#v0/composables/useStorage/adapters'

// Utilities
import { isNullOrUndefined } from '#v0/utilities'
import { ref, watch } from 'vue'

// Types
import type { StorageAdapter } from '#v0/composables/useStorage/adapters'
import type { Ref } from 'vue'

export interface StorageContext {
  /** Check if a key exists in storage */
  has: (key: string) => boolean
  /** Get a reactive ref for a storage key */
  get: <T>(key: string, defaultValue?: T) => Ref<T>
  /** Set a value for a storage key */
  set: <T>(key: string, value: T) => void
  /** Remove a key from storage */
  remove: (key: string) => void
  /** Clear all keys from storage */
  clear: () => void
}

export interface StorageOptions {
  /** The storage adapter to use. Defaults to localStorage in browser, MemoryAdapter otherwise */
  adapter?: StorageAdapter
  /** The prefix to use for all storage keys. Defaults to 'v0:' */
  prefix?: string
  /** Custom serializer for reading and writing values. Defaults to JSON.parse/stringify */
  serializer?: {
    read: (value: string) => unknown
    write: (value: unknown) => string
  }
}

export interface StorageContextOptions extends StorageOptions {
  /** The namespace for the storage context. Defaults to `v0:storage` */
  namespace?: string
}

export interface StoragePluginOptions extends StorageContextOptions {}

// Exports
export { MemoryAdapter } from '#v0/composables/useStorage/adapters'

export type { StorageAdapter, StorageType } from '#v0/composables/useStorage/adapters'

/**
 * Creates a new storage instance.
 *
 * @param options The options for the storage instance.
 * @template E The type of the storage context.
 * @returns A new storage instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-storage
 *
 * @example
 * ```ts
 * import { createStorage } from '@vuetify/v0'
 *
 * const storage = createStorage()
 *
 * storage.set('username', 'MyUsername')
 *
 * const username = storage.get('username')
 *
 * console.log(username.value) // MyUsername
 *
 * storage.clear()
 * ```
 */
export function createStorage<
  E extends StorageContext,
> (options: StorageOptions = {}) {
  const {
    adapter = IN_BROWSER ? window.localStorage : new MemoryAdapter(),
    prefix = 'v0:',
    serializer = {
      read: JSON.parse,
      write: JSON.stringify,
    },
  } = options

  const cache = new Map<string, Ref<any>>()
  const watchers = new Map<string, () => void>()

  function has (key: string) {
    const prefixedKey = `${prefix}${key}`
    return cache.has(prefixedKey)
  }

  function get<T> (key: string, defaultValue?: T): Ref<T> {
    const prefixedKey = `${prefix}${key}`

    if (cache.has(prefixedKey)) {
      return cache.get(prefixedKey)!
    }

    const storedValue = adapter?.getItem(prefixedKey)
    let initialValue = defaultValue

    if (storedValue) {
      try {
        initialValue = serializer.read(storedValue)
      } catch (error) {
        console.error(`[v0:storage] Failed to parse stored value for key "${prefixedKey}":`, error)
      }
    }

    const valueRef = ref<T>(initialValue as T)

    const stop = watch(valueRef, newValue => {
      if (isNullOrUndefined(newValue)) {
        adapter?.removeItem(prefixedKey)
      } else {
        try {
          adapter?.setItem(prefixedKey, serializer.write(newValue))
        } catch (error) {
          console.error(`[v0:storage] Failed to write key "${prefixedKey}":`, error)
        }
      }
    }, { deep: true })

    watchers.set(prefixedKey, stop)
    cache.set(prefixedKey, valueRef)

    return valueRef as Ref<T>
  }

  function set<T> (key: string, value: T) {
    const valueRef = get(key)
    valueRef.value = value
  }

  function remove (key: string) {
    const prefixedKey = `${prefix}${key}`
    const stop = watchers.get(prefixedKey)

    if (!stop) return

    stop()
    watchers.delete(prefixedKey)
    adapter?.removeItem(prefixedKey)
    cache.delete(prefixedKey)
  }

  function clear () {
    if (watchers.size > 0) {
      for (const stop of watchers.values()) {
        stop()
      }
      watchers.clear()
    }

    if (cache.size > 0) {
      for (const key of cache.keys()) {
        adapter?.removeItem(key)
      }
      cache.clear()
    }
  }

  if (IN_BROWSER && adapter === window.localStorage) {
    useWindowEventListener('storage', (e: StorageEvent) => {
      if (!e.key?.startsWith(prefix)) return

      const valueRef = cache.get(e.key)
      if (!valueRef) return

      watchers.get(e.key)?.()

      valueRef.value = e.newValue == null ? undefined : serializer.read(e.newValue)

      const stop = watch(valueRef, newValue => {
        if (isNullOrUndefined(newValue)) {
          adapter?.removeItem(e.key!)
        } else {
          try {
            adapter?.setItem(e.key!, serializer.write(newValue))
          } catch (error) {
            console.error(`[v0:storage] Failed to write key "${e.key}":`, error)
          }
        }
      }, { deep: true })

      watchers.set(e.key, stop)
    })
  }

  return {
    has,
    get,
    set,
    remove,
    clear,
  } as E
}

export const [createStorageContext, createStoragePlugin, useStorage] =
  createPluginContext<StorageContextOptions, StorageContext>(
    'v0:storage',
    options => createStorage(options),
  )
