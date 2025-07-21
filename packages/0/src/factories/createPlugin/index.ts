// Utilities
import type { App } from 'vue'

export interface PluginOptions {
  namespace: string
  provide: (app: App) => void
  setup?: (app: App) => void | Promise<void>
}

/**
 * Universal plugin factory that eliminates boilerplate code for Vue plugin creation.
 * This factory standardizes the plugin installation pattern across all composables.
 *
 * @param options Configuration object with namespace, provide function, and optional setup function
 * @returns A Vue plugin object with install method
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
