// Utilities
import { inject, provide } from 'vue'

// Types
import type { App, InjectionKey } from 'vue'

export type ContextKey<Z> = InjectionKey<Z> | string

/**
 * Injects a context provided by an ancestor component.
 *
 * @param key The key of the context to inject.
 * @template Z The type of the context.
 * @returns The injected context.
 * @throws An error if the context is not found.
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
 * Provides a context to all descendant components.
 *
 * @param key The key of the context to provide.
 * @param context The context to provide.
 * @param app The Vue app instance to provide the context to.
 * @template Z The type of the context.
 * @returns The provided context.
 *
 * @see https://vuejs.org/api/composition-api-dependency-injection.html#provide
 * @see https://0.vuetifyjs.com/composables/foundation/create-context
 */
export function provideContext<Z> (key: ContextKey<Z>, context: Z, app?: App) {
  app?.provide(key, context) ?? provide(key, context)

  return context
}

/**
 * Creates a new context for providing and injecting data.
 *
 * @param _key The key of the context to create.
 * @template Z The type of the context.
 * @returns A tuple containing the `useContext` and `provideContext` functions.
 *
 * @see https://vuejs.org/api/composition-api-dependency-injection.html
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
