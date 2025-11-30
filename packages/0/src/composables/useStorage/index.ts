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

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'
import { createPlugin } from '#v0/composables/createPlugin'

// Utilities
import { ref, watch } from 'vue'
import { isNullOrUndefined } from '#v0/utilities'

// Adapters
import { MemoryAdapter } from '#v0/composables/useStorage/adapters'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { App, Ref } from 'vue'
import type { StorageAdapter } from '#v0/composables/useStorage/adapters'
import type { ContextTrinity } from '#v0/composables/createTrinity'

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
        adapter?.setItem(prefixedKey, serializer.write(newValue))
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

  return {
    has,
    get,
    set,
    remove,
    clear,
  } as E
}

export function createStorageContext<
  E extends StorageContext = StorageContext,
> (_options: StorageContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:storage', ...options } = _options
  const [useStorageContext, _provideStorageContext] = createContext<E>(namespace)
  const context = createStorage<E>(options)

  function provideStorageContext (_context: E = context, app?: App): E {
    return _provideStorageContext(_context, app)
  }

  return createTrinity<E>(useStorageContext, provideStorageContext, context)
}

/**
 * Creates a new storage plugin.
 *
 * @param options The options for the storage plugin.
 * @returns A new storage plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-storage
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createStoragePlugin } from '@vuetify/v0'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 *
 * app.use(createStoragePlugin())
 *
 * app.mount('#app')
 * ```
 */
export function createStoragePlugin<
  E extends StorageContext = StorageContext,
> (_options: StoragePluginOptions = {}) {
  const { namespace = 'v0:storage', ...options } = _options
  const [, provideStorageContext, context] = createStorageContext<E>({ ...options, namespace })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideStorageContext(context, app)
    },
  })
}

/**
 * Returns the current storage instance.
 *
 * @param namespace The namespace for the storage context. Defaults to `'v0:storage'`.
 * @returns The current storage instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-storage
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useStorage } from '@vuetify/v0'
 *
 *   const storage = useStorage()
 *   const username = storage.get('username', 'Guest')
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Username: {{ username }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useStorage<
  E extends StorageContext = StorageContext,
> (namespace = 'v0:storage'): E {
  return useContext<E>(namespace)
}
