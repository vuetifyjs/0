/**
 * @module createPlugin
 *
 * @see https://vuejs.org/guide/reusability/plugins.html
 * @see https://0.vuetifyjs.com/composables/foundation/create-plugin
 *
 * @remarks
 * Factory for creating Vue plugins with proper context provision.
 *
 * Wraps the provide function in app.runWithContext() to ensure proper execution context,
 * allowing plugins to safely provide dependency injection contexts at the application level.
 *
 * Also exports `createPluginContext` — a higher-level factory that generates the standard
 * context/plugin/consumer triple for plugin composables, eliminating boilerplate.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { hasInjectionContext } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App } from 'vue'

export interface PluginOptions {
  namespace: string
  provide: (app: App) => void
  setup?: (app: App) => void
}

export interface Plugin {
  install: (app: App, ...options: unknown[]) => void
}

const INSTALLED = Symbol.for('v0:installed-plugins')

function getInstalled (app: App): Set<string> {
  const ctx = app._context as unknown as Record<symbol, Set<string>>
  return ctx[INSTALLED] ??= new Set<string>()
}

/**
 * Creates a new Vue plugin.
 *
 * @param options The plugin options.
 * @returns A new Vue plugin.
 *
 * @see https://0.vuetifyjs.com/composables/foundation/create-plugin#create-plugin
 *
 * @example
 * ```ts
 * export const [useContext, provideContext] = createContext<MyContext>('my-plugin')
 *
 * const context = {}
 *
 * export const MyPlugin = createPlugin({
 *   namespace: 'my-plugin',
 *   provide: (app) => {
 *     provideContext(context, app)
 *   },
 *   setup: (app) => {
 *     // Optional setup logic
 *   },
 * })
 */
export function createPlugin<Z extends Plugin = Plugin> (options: PluginOptions) {
  return {
    install (app: App) {
      app.runWithContext(() => {
        options.provide(app)

        const installed = getInstalled(app)
        if (installed.has(options.namespace)) return
        installed.add(options.namespace)

        options.setup?.(app)
      })
    },
  } as Z
}

export interface PluginContextConfig<O, E> {
  /**
   * Optional plugin setup callback, called once per Vue app after context provision.
   * Use for adapter initialization, Vue app mixins, global side effects, etc.
   * Receives the plugin options (minus namespace) so adapters and targets are accessible.
   */
  setup?: (context: E, app: App, options: O) => void
  /**
   * Optional fallback factory. When provided, the generated `useX` consumer uses the
   * defensive pattern: returns the fallback when called outside a component instance or
   * when the context is not found. Required for composables that may be consumed outside
   * component setup (e.g. useLogger, useLocale, useHydration).
   *
   * Receives the requested namespace so error messages can include it.
   */
  fallback?: (namespace: string) => E
}

/**
 * Creates the three standard functions for a plugin composable.
 *
 * @param defaultNamespace The default DI namespace string (e.g. `'v0:logger'`).
 * @param factory Function that creates the composable context instance from options.
 * @param config Optional setup callback and fallback factory.
 * @returns A readonly tuple: `[createXContext, createXPlugin, useX]`.
 *
 * @example
 * ```ts
 * // Simple — no setup or fallback
 * export const [createStorageContext, createStoragePlugin, useStorage] =
 *   createPluginContext('v0:storage', options => createStorage(options))
 *
 * // With fallback — safe outside component instances
 * export const [createLoggerContext, createLoggerPlugin, useLogger] =
 *   createPluginContext('v0:logger', options => createLogger(options), {
 *     fallback: ns => createFallbackLogger(ns),
 *     setup: (context) => {
 *       if (__DEV__ && IN_BROWSER) (window as any).__v0Logger__ = context
 *     },
 *   })
 * ```
 */
export function createPluginContext<
  O extends { namespace?: string } = Record<never, never>,
  E = unknown,
> (
  defaultNamespace: string,
  factory: (options: Omit<O, 'namespace'>) => E,
  config?: PluginContextConfig<Omit<O, 'namespace'>, E>,
): readonly [
  <_E extends E = E>(_options?: O) => ContextTrinity<_E>,
  (_options?: O) => Plugin,
  <_E extends E = E>(namespace?: string) => _E,
] {
  function createXContext<_E extends E = E> (_options: O = {} as O): ContextTrinity<_E> {
    const { namespace = defaultNamespace, ...options } = _options as O & { namespace?: string }
    const [_use, _provide] = createContext<_E>(namespace)
    const context = factory(options as Omit<O, 'namespace'>) as _E

    function provide (_context: _E = context, app?: App): _E {
      return _provide(_context, app)
    }

    return createTrinity<_E>(_use, provide, context)
  }

  function createXPlugin (_options: O = {} as O): Plugin {
    const { namespace = defaultNamespace, ...options } = _options as O & { namespace?: string }
    const [, provide, context] = createXContext({ ...options, namespace } as O)

    return createPlugin({
      namespace,
      provide: app => {
        provide(context, app)
      },
      setup: config?.setup
        ? app => config.setup!(context, app, options as Omit<O, 'namespace'>)
        : undefined,
    })
  }

  function useX<_E extends E = E> (namespace = defaultNamespace): _E {
    if (config?.fallback) {
      const instance = config.fallback(namespace) as _E
      if (!hasInjectionContext()) return instance
      return useContext<_E>(namespace, instance)
    }
    return useContext<_E>(namespace)
  }

  return [createXContext, createXPlugin, useX] as const
}
