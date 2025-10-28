/**
 * @module useHydration
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-hydration
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
import { createTrinity } from '#v0/composables/createTrinity'
import { createPlugin } from '#v0/composables/createPlugin'

// Utilities
import { shallowRef, shallowReadonly } from 'vue'

// Types
import type { App, ShallowRef } from 'vue'
import type { ContextTrinity } from '#v0/composables/createTrinity'

export interface HydrationContext {
  isHydrated: Readonly<ShallowRef<boolean>>
  hydrate: () => void
}

export interface HydrationOptions {}

export interface HydrationContextOptions extends HydrationOptions {
  namespace?: string
}

export interface HydrationPluginOptions extends HydrationContextOptions {}

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
 * const hydration = createHydration()
 * console.log(hydration.isHydrated.value) // false
 * hydration.hydrate()
 * console.log(hydration.isHydrated.value) // true
 * ```
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
 * Creates a new hydration context trinity.
 *
 * @param options Options for creating the hydration context.
 * @template E The type of the hydration context.
 * @returns A new hydration context trinity.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-hydration
 *
 * @example
 * ```ts
 * import { createHydrationContext } from '@vuetify/v0'
 *
 * export const [useHydrationContext, provideHydrationContext, context] = createHydrationContext({
 *   namespace: 'app:hydration',
 * })
 * ```
 */
export function createHydrationContext<
  E extends HydrationContext = HydrationContext,
> (_options: HydrationContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:hydration' } = _options
  const [useHydrationContext, _provideHydrationContext] = createContext<E>(namespace)
  const context = createHydration<E>()

  function provideHydrationContext (_context: E = context, app?: App): E {
    return _provideHydrationContext(_context, app)
  }

  return createTrinity<E>(useHydrationContext, provideHydrationContext, context)
}

/**
 * Creates a new hydration plugin.
 *
 * @param options The options for the hydration plugin.
 * @template E The type of the hydration context.
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
 * const app = createApp(App)
 *
 * app.use(createHydrationPlugin())
 *
 * app.mount('#app')
 * ```
 */
export function createHydrationPlugin<
  E extends HydrationContext = HydrationContext,
> (_options: HydrationPluginOptions = {}) {
  const { namespace = 'v0:hydration', ...options } = _options
  const [, provideHydrationContext, context] = createHydrationContext<E>({ ...options, namespace })

  return createPlugin({
    namespace,
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

/**
 * Returns the current hydration instance.
 *
 * @param namespace The namespace for the hydration context. Defaults to `v0:hydration`.
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
> (namespace = 'v0:hydration'): E {
  return useContext<E>(namespace)
}
