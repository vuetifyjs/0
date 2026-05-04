/**
 * @module useStorage
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-storage
 *
 * @remarks
 * Reactive storage composable with adapter pattern for localStorage, sessionStorage, or memory.
 *
 * Key features:
 * - Reactive refs that sync with storage
 * - localStorage, sessionStorage, and memory adapters
 * - TTL (time-to-live) for time-based cache expiration
 * - Custom serialization support
 * - SSR fallback to memory adapter
 * - Automatic cleanup on remove/clear
 *
 * Uses adapter pattern to abstract storage implementation details.
 *
 * @example
 * ```ts
 * import { useStorage } from '@vuetify/v0'
 *
 * const storage = useStorage()
 * const theme = storage.get('theme', 'light')
 * theme.value = 'dark' // persists automatically
 * ```
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'
import { useWindowEventListener } from '#v0/composables/useEventListener'

// Adapters
import { MemoryAdapter } from '#v0/composables/useStorage/adapters'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isArray, isNullOrUndefined, isObject } from '#v0/utilities'
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
  /** Time-to-live in milliseconds. When set, expired entries return the default value on `get()` and `set()` automatically timestamps entries. */
  ttl?: number
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
    ttl,
  } = options

  const cache = new Map<string, Ref<unknown>>()
  const watchers = new Map<string, () => void>()

  function has (key: string) {
    const prefixedKey = `${prefix}${key}`
    return cache.has(prefixedKey) || !isNullOrUndefined(readStored(prefixedKey))
  }

  function readStored (prefixedKey: string) {
    const raw = adapter?.getItem(prefixedKey)
    if (isNullOrUndefined(raw)) return undefined

    try {
      const parsed = serializer.read(raw)

      // TTL check: expired entries are treated as absent
      if (ttl && isObject(parsed) && '__v0' in parsed && '__v' in parsed) {
        const envelope = parsed as { __v0: number, __v: unknown, __t: number }
        if (Date.now() - envelope.__t > ttl) {
          adapter?.removeItem(prefixedKey)
          return undefined
        }
        return envelope.__v
      }

      return parsed
    } catch (error) {
      console.error(`[v0:storage] Failed to parse stored value for key "${prefixedKey}":`, error)
      return undefined
    }
  }

  function writeStored (prefixedKey: string, value: unknown) {
    const wrapped = ttl ? { __v0: 1, __v: value, __t: Date.now() } : value

    try {
      adapter?.setItem(prefixedKey, serializer.write(wrapped))
    } catch (error) {
      console.error(`[v0:storage] Failed to write key "${prefixedKey}":`, error)
    }
  }

  function get<T> (key: string, defaultValue?: T): Ref<T> {
    const prefixedKey = `${prefix}${key}`

    if (cache.has(prefixedKey)) {
      return cache.get(prefixedKey)! as Ref<T>
    }

    const stored = readStored(prefixedKey)
    const initialValue = stored ?? (isObject(defaultValue) || isArray(defaultValue)
      ? structuredClone(defaultValue)
      : defaultValue)
    const valueRef = ref<T>(initialValue as T)

    const stop = watch(valueRef, newValue => {
      if (isNullOrUndefined(newValue)) {
        adapter?.removeItem(prefixedKey)
      } else {
        writeStored(prefixedKey, newValue)
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

      valueRef.value = isNullOrUndefined(e.newValue) ? undefined : readStored(e.key)

      const stop = watch(valueRef, newValue => {
        if (isNullOrUndefined(newValue)) {
          adapter?.removeItem(e.key!)
        } else {
          writeStored(e.key!, newValue)
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

function createStorageFallback<
  E extends StorageContext = StorageContext,
> (): E {
  return createStorage<E>({ adapter: new MemoryAdapter() })
}

export const [createStorageContext, createStoragePlugin, useStorage] =
  createPluginContext<StorageContextOptions, StorageContext>(
    'v0:storage',
    options => createStorage(options),
    { fallback: () => createStorageFallback() },
  )
