// Utilities
import type { App } from 'vue'

export interface PluginOptions {
  namespace: string
  provide: (app: App) => void
  setup?: (app: App) => void
}

export interface Plugin {
  install: (app: App, ...options: any[]) => void
}

/**
 * Creates a new Vue plugin.
 *
 * @param options The plugin options.
 * @returns A new Vue plugin.
 *
 * @see https://vuejs.org/guide/reusability/plugins.html
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
        options.provide(app)
        options.setup?.(app)
      })
    },
  } as Z
}
