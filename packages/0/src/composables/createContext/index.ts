// Utilities
import { inject, provide } from 'vue'

// Types
import type { App, InjectionKey } from 'vue'

export type ContextKey<Z> = InjectionKey<Z> | string

/**
 * A simple wrapper for tapping into a v0 namespace
 *
 * @param key The provided string or InjectionKey
 * @template Z The type values for the context.
 * @returns The injected context
 * @throws Error if namespace is not found.
 *
 * @see https://vuejs.org/api/composition-api-dependency-injection.html#inject
 * @see https://0.vuetifyjs.com/composables/foundation/create-context
 */
export function useContext<Z> (key: ContextKey<Z>) {
  const context = inject<Z>(key, undefined as Z)

  if (context === undefined) {
    throw new Error(`Context "${String(key)}" not found. Ensure it's provided by an ancestor.`)
  }

  return context
}

/**
 * A simple wrapper for providing Vue context.
 *
 * @param key The provided string or InjectionKey
 * @param context The context value to provide
 * @param app Optional Vue app instance for global provide
 * @returns The provided context
 *
 * @see https://vuejs.org/api/composition-api-dependency-injection.html#provide
 * @see https://0.vuetifyjs.com/composables/foundation/create-context
 */
export function provideContext<Z> (key: ContextKey<Z>, context: Z, app?: App) {
  app?.provide(key, context) ?? provide(key, context)

  return context
}

/**
 * A simple wrapper for Vues provide & inject systems
 *
 * @param key The provided string or InjectionKey
 * @template Z The type values for the context.
 * @returns A tuple containing provide/inject
 *
 * @see https://vuejs.org/api/composition-api-dependency-injection.html#provide
 * @see https://0.vuetifyjs.com/composables/foundation/create-context
 */
export function createContext<Z> (_key: ContextKey<Z>) {
  function _provideContext (context: Z, app?: App) {
    return provideContext<Z>(_key, context, app)
  }
  function _useContext (key = _key) {
    return useContext<Z>(key)
  }

  return [_useContext, _provideContext] as const
}
