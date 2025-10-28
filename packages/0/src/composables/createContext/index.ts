/**
 * @module createContext
 *
 * @see https://0.vuetifyjs.com/composables/foundation/create-context
 *
 * @remarks
 * Factory for creating type-safe Vue dependency injection contexts.
 *
 * Provides a wrapper around Vue's provide/inject that throws errors when context is not found,
 * eliminating silent failures and improving developer experience. Supports both app-level and
 * component-level provision.
 */

// Utilities
import { inject, provide } from 'vue'

// Types
import type { App, InjectionKey } from 'vue'

export type ContextKey<Z> = InjectionKey<Z> | string

/**
 * Injects a context provided by an ancestor component.
 *
 * @param key The key of the context to inject.
 * @param defaultValue Optional default value if context is not found.
 * @template Z The type of the context.
 * @returns The injected context.
 * @throws An error if the context is not found and no default is provided.
 *
 * @see https://vuejs.org/api/composition-api-dependency-injection.html#inject
 * @see https://0.vuetifyjs.com/composables/foundation/create-context#use-context
 *
 * @example
 * ```ts
 * // Without default value
 * const context = useContext<MyContext>('my-context')
 *
 * // With default value
 * const context = useContext<MyContext>('my-context', defaultContext)
 * ```
 */
export function useContext<Z> (key: ContextKey<Z>, defaultValue?: Z) {
  const context = inject<Z>(key, defaultValue as Z)

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
 * @param app Optional Vue app instance to provide the context at app level instead of component level.
 * @template Z The type of the context.
 * @returns The provided context.
 *
 * @remarks
 * When `app` parameter is provided, the context is made available to all components in the app.
 * When omitted, the context is provided at the current component level and available to descendants only.
 *
 * @see https://vuejs.org/api/composition-api-dependency-injection.html#provide
 * @see https://0.vuetifyjs.com/composables/foundation/create-context#provide-context
 *
 * @example
 * ```ts
 * // Component-level provision
 * provideContext<MyContext>('my-context', context)
 *
 * // App-level provision (typically used in plugins)
 * const app = createApp()
 * provideContext<MyContext>('my-context', context, app)
 * ```
 */
export function provideContext<Z> (key: ContextKey<Z>, context: Z, app?: App) {
  if (app) {
    app.provide(key, context)
  } else {
    provide(key, context)
  }

  return context
}

/**
 * Creates a new context for providing and injecting data.
 *
 * @param key The key of the context to create.
 * @param defaultValue Optional default value if context is not found.
 * @template Z The type of the context.
 * @returns A tuple containing the `useContext` and `provideContext` functions.
 *
 * @see https://vuejs.org/api/composition-api-dependency-injection.html
 * @see https://0.vuetifyjs.com/composables/foundation/create-context#create-context
 *
 * @example
 * ```ts
 * // Without default value
 * const [useMyContext, provideMyContext] = createContext<MyContext>('my-context')
 *
 * // With default value
 * const [useMyContext, provideMyContext] = createContext<MyContext>('my-context', defaultContext)
 * ```
 */
export function createContext<Z> (_key: ContextKey<Z>, defaultValue?: Z) {
  function _provideContext (context: Z, app?: App) {
    return provideContext<Z>(_key, context, app)
  }

  function _useContext (key = _key) {
    return useContext<Z>(key, defaultValue)
  }

  return [_useContext, _provideContext] as const
}
