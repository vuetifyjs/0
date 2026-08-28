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
 * Supports `persist()` / `restore()` lifecycle hooks for saving and rehydrating plugin state.
 *
 * In development, plugins that pass `devtools: true` appear under a single "v0"
 * inspector in Vue DevTools. Default is off — opt in per plugin.
 *
 * @example
 * ```ts
 * import { createPlugin } from '@vuetify/v0'
 *
 * const plugin = createPlugin({
 *   namespace: 'v0:my-plugin',
 *   provide: app => app.provide('my-key', { greet: () => 'hello' }),
 * })
 * // app.use(plugin)
 * ```
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isNullOrUndefined, isUndefined } from '#v0/utilities'
import { hasInjectionContext, inject, watch } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App } from 'vue'

export interface PluginOptions {
  namespace: string
  provide: (app: App) => void
  setup?: (app: App) => void
  /** When true, this plugin appears in the Vue DevTools v0 inspector. @default false */
  devtools?: boolean
  /** Custom inspector payload. Falls back to a generic snapshot of `context`. */
  inspect?: (context: unknown) => unknown
}

export interface Plugin {
  install: (app: App, ...options: unknown[]) => void
}

interface PluginRecord {
  namespace: string
  context?: unknown
  devtools: boolean
  inspect?: (context: unknown) => unknown
}

const INSTALLED = Symbol.for('v0:installed-plugins')

function getInstalled (app: App): Map<string, PluginRecord> {
  const ctx = app._context as typeof app._context & { [INSTALLED]?: Map<string, PluginRecord> }
  return ctx[INSTALLED] ??= new Map()
}

/**
 * Attach a plugin context to the DevTools inspector record for `namespace`.
 *
 * `createPluginContext` calls this after provide. Plugins that wrap
 * `createPlugin` directly (stack, date) must call it from `provide`.
 *
 * @param app The Vue app the plugin was installed on.
 * @param namespace The plugin namespace, e.g. `'v0:stack'`.
 * @param context The live plugin context to show in the inspector.
 *
 * @example
 * ```ts
 * return createPlugin({
 *   namespace,
 *   provide: app => {
 *     provideStackContext(context, app)
 *     bindPluginContext(app, namespace, context)
 *   },
 * })
 * ```
 */
export function bindPluginContext (app: App, namespace: string, context: unknown) {
  const record = getInstalled(app).get(namespace)
  if (record) record.context = context
}

function notifyDevtools (app: App) {
  /* v8 ignore next -- __DEV__ is a build-time constant; production short-circuits */
  if (typeof __DEV__ === 'undefined' || !__DEV__ || !IN_BROWSER) return

  void import('./devtools').then(mod => mod.sync(app, getInstalled(app)))
}

/**
 * Creates a new Vue plugin.
 *
 * @param options The plugin options.
 * @returns A new Vue plugin.
 *
 * @see https://0.vuetifyjs.com/composables/foundation/create-plugin
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
        const installed = getInstalled(app)
        if (installed.has(options.namespace)) return
        installed.set(options.namespace, {
          namespace: options.namespace,
          devtools: options.devtools === true,
          inspect: options.inspect,
        })

        options.provide(app)
        options.setup?.(app)
        if (options.devtools) notifyDevtools(app)
      })
    },
  } satisfies Plugin as Z
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
  /** Returns the value to persist. Called reactively inside a watch source. */
  persist?: (context: E) => unknown
  /** Restores previously persisted state into the context. Called before setup. */
  restore?: (context: E, saved: unknown) => void
  /** Default `devtools` for this plugin. Install-time `devtools` overrides. @default false */
  devtools?: boolean
  /** Custom inspector payload. Falls back to a generic snapshot of the context. */
  inspect?: (context: E) => unknown
}

function deriveKey (namespace: string): string {
  return namespace.startsWith('v0:') ? namespace.slice(3) : namespace
}

// Minimal storage shape needed for persist/restore.
// Uses useContext('v0:storage') directly to avoid circular import with useStorage.
interface PersistedStorage {
  get: (key: string) => { value: unknown }
}

function getPersistedStorage (): PersistedStorage {
  return useContext('v0:storage')
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
 *       if (__DEV__ && IN_BROWSER) (window as Window & { __v0Logger__?: typeof context }).__v0Logger__ = context
 *     },
 *   })
 * ```
 */
type PluginKeys = { namespace?: string, persist?: boolean, devtools?: boolean }

export function createPluginContext<
  O extends PluginKeys = Record<never, never>,
  E = unknown,
> (
  defaultNamespace: string,
  factory: (options: Omit<O, 'namespace' | 'persist' | 'devtools'>) => E,
  config?: PluginContextConfig<Omit<O, 'namespace' | 'persist' | 'devtools'>, E>,
): readonly [
  <_E extends E = E>(_options?: O) => ContextTrinity<_E>,
  (_options?: O & { devtools?: boolean }) => Plugin,
  <_E extends E = E>(namespace?: string) => _E,
] {
  function createXContext<_E extends E = E> (_options: O = {} as O): ContextTrinity<_E> {
    const { namespace = defaultNamespace, persist: _persist, devtools: _devtools, ...options } = _options as O & PluginKeys
    const context = factory(options as Omit<O, 'namespace' | 'persist' | 'devtools'>) as _E

    return createTrinity<_E>(namespace, context)
  }

  function createXPlugin (_options: O & { devtools?: boolean } = {} as O): Plugin {
    const { namespace = defaultNamespace, persist: shouldPersist, devtools, ...options } = _options as O & PluginKeys
    const enabled = devtools ?? config?.devtools ?? false

    // Created lazily inside provide (install time) so a never-installed or skipped
    // duplicate-namespace plugin allocates no live resources.
    // https://github.com/vuetifyjs/0/issues/338
    let context!: E

    return createPlugin({
      namespace,
      devtools: enabled,
      inspect: config?.inspect
        ? (context: unknown) => config.inspect!(context as E)
        : undefined,
      provide: app => {
        const [, provide, ctx] = createXContext({ ...options, namespace } as O)
        context = ctx
        provide(context, app)
        bindPluginContext(app, namespace, context)

        if (shouldPersist && config?.restore) {
          const storage = getPersistedStorage()
          const key = deriveKey(namespace)
          const saved = storage.get(key)
          if (!isNullOrUndefined(saved.value)) {
            config.restore(context, saved.value)
          }
        }
      },
      setup: (config?.setup || shouldPersist)
        ? app => {
          // Capture once: provide ran first and set context for this app. Reusing the
          // same plugin object on another app reassigns the shared binding, so the
          // persist watch must close over this local, not the outer `context`.
          const ctx = context

          config?.setup?.(ctx, app, options as Omit<O, 'namespace' | 'persist' | 'devtools'>)

          if (shouldPersist && config?.persist) {
            const storage = getPersistedStorage()
            const key = deriveKey(namespace)
            const stored = storage.get(key)
            const stop = watch(
              () => config.persist!(ctx),
              val => {
                stored.value = val
              },
            )
            app.onUnmount(stop)
          }
        }
        : undefined,
    })
  }

  function useX<_E extends E = E> (namespace = defaultNamespace): _E {
    if (config?.fallback) {
      if (!hasInjectionContext()) return config.fallback(namespace) as _E

      const provided = inject<_E | undefined>(namespace as string, undefined)
      if (!isUndefined(provided)) return provided

      return config.fallback(namespace) as _E
    }
    return useContext<_E>(namespace)
  }

  return [createXContext, createXPlugin, useX] as const
}
