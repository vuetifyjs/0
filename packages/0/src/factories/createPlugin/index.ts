// Utilities
import type { App } from 'vue'

export interface PluginOptions {
  namespace: string
  provide: (app: App) => void
  setup?: (app: App) => void | Promise<void>
}

/**
 * A universal plugin factory to reduce boilerplate code for Vue plugin creation.
 * @param options Configurable object with namespace and provide/setup methods.
 * @returns A Vue plugin object with install method that runs app w/ context.
 *
 * @see https://vuejs.org/api/application.html#app-runwithcontext
 * @see https://0.vuetifyjs.com/factories/create-plugin
 */
export function createPlugin<Z> (options: PluginOptions) {
  return {
    install (app: App) {
      app.runWithContext(() => {
        options.provide(app)

        if (options.setup) options.setup(app)
      })
    },
  } as Z
}
