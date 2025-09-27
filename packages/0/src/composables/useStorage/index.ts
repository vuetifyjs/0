// Factories
import { createContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'

// Utilities
import { ref, watch } from 'vue'

// Adapters
import { MemoryAdapter } from './adapters'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { App, Ref } from 'vue'
import type { StorageAdapter } from './adapters'

export interface StorageContext {
  get: <T>(key: string, defaultValue?: T) => Ref<T>
  set: <T>(key: string, value: T) => void
  remove: (key: string) => void
  clear: () => void
}

export interface StorageOptions {
  adapter?: StorageAdapter
  prefix?: string
  serializer?: {
    read: (value: string) => any
    write: (value: any) => string
  }
}

export const [useStorageContext, provideStorageContext] = createContext<StorageContext>('v0:storage')

/**
 * Creates a new storage instance.
 *
 * @param options The options for the storage instance.
 * @template E The type of the storage context.
 * @returns A new storage instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-storage
 */
export function createStorage<E extends StorageContext> (options: StorageOptions = {}) {
  const {
    adapter = IN_BROWSER ? window.localStorage : new MemoryAdapter(),
    prefix = 'v0:',
    serializer = {
      read: JSON.parse,
      write: JSON.stringify,
    },
  } = options

  const cache = new Map<string, Ref<any>>()

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

    watch(valueRef, newValue => {
      if (newValue === undefined || newValue === null) {
        adapter?.removeItem(prefixedKey)
      } else {
        adapter?.setItem(prefixedKey, serializer.write(newValue))
      }
    }, { deep: true })

    cache.set(prefixedKey, valueRef)
    return valueRef as Ref<T>
  }

  function set<T> (key: string, value: T) {
    const valueRef = get(key)
    valueRef.value = value
  }

  function remove (key: string) {
    const prefixedKey = `${prefix}${key}`
    adapter?.removeItem(prefixedKey)
    cache.delete(prefixedKey)
  }

  function clear () {
    for (const key of cache.keys()) {
      adapter?.removeItem(key)
    }
    cache.clear()
  }

  return {
    get,
    set,
    remove,
    clear,
  } as E
}

/**
 * Returns the current storage instance.
 *
 * @returns The current storage instance.
 *
 * @see https://0.vuetifyjs.com/composables/use-storage
 */
export function useStorage (): StorageContext {
  return useStorageContext()
}

/**
 * Creates a new storage plugin.
 *
 * @param options The options for the storage plugin.
 * @returns A new storage plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-storage
 */
export function createStoragePlugin (options: StorageOptions = {}) {
  const context = createStorage(options)

  return createPlugin({
    namespace: 'v0:storage',
    provide: (app: App) => {
      provideStorageContext(context, app)
    },
  })
}
