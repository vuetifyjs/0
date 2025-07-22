// Utilities
import { inject, provide } from 'vue'

// Types
import type { App, InjectionKey } from 'vue'

/**
 * A simple wrapper for tapping into a v0 namespace
 * @param key The provided string or InjectionKey
 * @template Z The type values for the context.
 * @returns A function that retrieves context
 */
export function useContext<Z> (key: InjectionKey<Z> | string) {
  return function (): Z {
    const contextValue = inject<Z>(key)

    if (contextValue === undefined) {
      throw new Error(`Context "${String(key)}" not found. Ensure it's provided by an ancestor.`)
    }

    return contextValue
  }
}

/**
 * A simple wrapper for Vues provide & inject systems
 * to create context for managing application state
 * @param key The provided string or InjectionKey
 * @template Z The type values for the context.
 * @returns A tuple containing provide/inject
 *
 * @see https://vuejs.org/guide/components/provide-inject
 */
export function createContext<Z> (key: InjectionKey<Z> | string) {
  function provideContext (value: Z, app?: App) {
    app ? app.provide(key, value) : provide(key, value)

    return value
  }

  return [useContext<Z>(key), provideContext] as const
}
