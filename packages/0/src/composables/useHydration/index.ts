// Factories
import { createContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'

// Utilities
import { shallowRef, shallowReadonly } from 'vue'

// Types
import type { App, ShallowRef } from 'vue'

export interface HydrationContext {
  isHydrated: Readonly<ShallowRef<boolean>>
  hydrate: () => void
}

export const [useHydrationContext, provideHydrationContext] = createContext<HydrationContext>('v0:hydration')

/**
 * Creates a new hydration instance.
 *
 * @returns A new hydration instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-hydration
 *
 * @example
 * ```ts
 * import { createHydration } from '@vuetify/v0'
 *
 * const [useHydration, provideHydration] = createHydration()
 * ```
 */
export function createHydration (): HydrationContext {
  const isHydrated = shallowRef(false)

  function hydrate () {
    isHydrated.value = true
  }

  return {
    isHydrated: shallowReadonly(isHydrated),
    hydrate,
  }
}

/**
 * Returns the current hydration instance.
 *
 * @returns The current hydration instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-hydration
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useHydration } from '@vuetify/v0'
 *
 *   const hydration = useHydration()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Is hydrated: {{ hydration.isHydrated.value }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useHydration (): HydrationContext {
  return useHydrationContext()
}

/**
 * Creates a new hydration plugin.
 *
 * @returns A new hydration plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-hydration
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createHydrationPlugin } from '@vuetify/v0'
 * import App from './App.vue'
 *
 * const plugin = createHydrationPlugin()
 *
 * const app = createApp(App)
 *
 * app.use(plugin)
 *
 * app.mount('#app')
 * ```
 */
export function createHydrationPlugin () {
  const context = createHydration()

  return createPlugin({
    namespace: 'v0:hydration',
    provide: (app: App) => {
      provideHydrationContext(context, app)
    },
    setup: (app: App) => {
      app.mixin({
        mounted () {
          if (this.$parent !== null) return

          context.hydrate()
        },
      })
    },
  })
}
