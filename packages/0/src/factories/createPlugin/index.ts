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
 * A universal plugin factory to reduce boilerplate code for Vue plugin creation
 * @param options Configurable object with namespace and provide/setup methods
 * @returns A Vue plugin object with install method that runs app w/ context
 *
 * @see https://vuejs.org/api/application.html#app-runwithcontext
 * @see https://0.vuetifyjs.com/factories/create-plugin
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
