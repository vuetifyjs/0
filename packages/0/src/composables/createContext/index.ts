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
 *
 * Supports two modes:
 * - **Static key**: `createContext('my-key')` - key is fixed at creation time
 * - **Dynamic key**: `createContext()` or `createContext({ suffix: 'item' })` - key provided at runtime
 */

// Types
import type { App, InjectionKey } from 'vue'
import { isObject, isString, isSymbol, isUndefined } from '#v0/utilities'

// Utilities
import { inject, provide } from 'vue'

export type ContextKey<Z> = InjectionKey<Z> | string

export interface CreateContextOptions {
  /** Optional suffix to append to the runtime key */
  suffix?: string
}

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

  if (isUndefined(context)) {
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
 * Supports two modes:
 * - **Static key mode**: Pass a string/symbol key. The key is fixed at creation time.
 * - **Dynamic key mode**: Pass nothing or an options object. The key is provided at runtime.
 *
 * @template Z The type of the context.
 * @returns A tuple containing the `useContext` and `provideContext` functions.
 *
 * @see https://vuejs.org/api/composition-api-dependency-injection.html
 * @see https://0.vuetifyjs.com/composables/foundation/create-context#create-context
 *
 * @example
 * ```ts
 * // Static key mode - key fixed at creation
 * const [useContext, provideContext] = createContext<ThemeContext>('v0:theme')
 * provideContext(context)              // provides to 'v0:theme'
 * useContext()                         // injects from 'v0:theme'
 *
 * // Dynamic key mode - key provided at runtime
 * const [useContext, provideContext] = createContext<PanelContext>()
 * provideContext('v0:panel', context)  // provides to 'v0:panel'
 * useContext('v0:panel')               // injects from 'v0:panel'
 *
 * // Dynamic key with suffix - suffix appended to runtime key
 * const [useContext, provideContext] = createContext<ItemContext>({ suffix: 'item' })
 * provideContext('v0:panel', context)  // provides to 'v0:panel:item'
 * useContext('v0:panel')               // injects from 'v0:panel:item'
 * ```
 */
export function createContext<Z> (key: ContextKey<Z>, defaultValue?: Z): readonly [
  () => Z,
  (context: Z, app?: App) => Z,
]
export function createContext<Z> (options?: CreateContextOptions): readonly [
  (key: string, defaultValue?: Z) => Z,
  (key: string, context: Z, app?: App) => Z,
]
export function createContext<Z> (
  keyOrOptions?: ContextKey<Z> | CreateContextOptions,
  defaultValue?: Z,
) {
  // Static key mode: createContext('my-key') or createContext(Symbol())
  if (isString(keyOrOptions) || isSymbol(keyOrOptions)) {
    const _key = keyOrOptions as ContextKey<Z>

    function _provideContext (context: Z, app?: App) {
      return provideContext<Z>(_key, context, app)
    }

    function _useContext () {
      return useContext<Z>(_key, defaultValue)
    }

    return [_useContext, _provideContext] as const
  }

  // Dynamic key mode: createContext() or createContext({ suffix: 'item' })
  const suffix = isObject(keyOrOptions) ? keyOrOptions.suffix : undefined

  function _provideContext (key: string, context: Z, app?: App) {
    const resolved = suffix ? `${key}:${suffix}` : key
    return provideContext<Z>(resolved, context, app)
  }

  function _useContext (key: string, defaultValue?: Z) {
    const resolved = suffix ? `${key}:${suffix}` : key
    return useContext<Z>(resolved, defaultValue)
  }

  return [_useContext, _provideContext] as const
}
