// Utilities
import { inject, provide } from 'vue'

// Types
import type { App, InjectionKey } from 'vue'

export type ContextKey<Z> = InjectionKey<Z> | string

/**
 * A simple wrapper for tapping into a v0 namespace
 * @param key The provided string or InjectionKey
 * @template Z The type values for the context.
 * @returns A function that retrieves context
 */
export function useContext<Z> (key: ContextKey<Z>) {
  return function (): Z {
    const context = inject<Z>(key)

    if (context === undefined) {
      throw new Error(`Context "${String(key)}" not found. Ensure it's provided by an ancestor.`)
    }

    return context
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
 * @see https://0.vuetifyjs.com/composables/foundation/create-context
 */
export function createContext<Z> (key: ContextKey<Z>) {
  function provideContext (context: Z, app?: App) {
    app ? app.provide(key, context) : provide(key, context)

    return context
  }

  return [useContext<Z>(key), provideContext] as const
}
