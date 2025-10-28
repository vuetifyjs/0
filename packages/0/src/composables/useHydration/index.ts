/**
 * @module useHydration
 *
 * @remarks
 * SSR hydration state management composable.
 *
 * Key features:
 * - Hydration state detection (browser vs SSR)
 * - Root component detection
 * - Readonly hydration state refs
 * - Plugin installation support
 * - Perfect for hydration-safe rendering
 *
 * Essential for composables that need to behave differently during SSR vs client-side.
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'

// Utilities
import { shallowRef, shallowReadonly } from 'vue'

// Types
import type { App, ShallowRef } from 'vue'

export interface HydrationContext {
  isHydrated: Readonly<ShallowRef<boolean>>
  hydrate: () => void
}

/**
 * Creates a new hydration instance.
 *
 * @returns A new hydration instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-hydration
 */
export function createHydration<
  E extends HydrationContext = HydrationContext,
> (): E {
  const isHydrated = shallowRef(false)

  function hydrate () {
    isHydrated.value = true
  }

  return {
    isHydrated: shallowReadonly(isHydrated),
    hydrate,
  } as E
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
export function useHydration<
  E extends HydrationContext = HydrationContext,
> (): E {
  return useContext<E>('v0:hydration')
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
export function createHydrationPlugin<
  E extends HydrationContext = HydrationContext,
> () {
  const [, provideHydrationContext] = createContext<E>('v0:hydration')
  const context = createHydration<E>()

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
