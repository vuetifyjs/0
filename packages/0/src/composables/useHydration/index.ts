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

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Utilities
import { instanceExists, isNull } from '#v0/utilities'
import { nextTick, shallowReadonly, shallowRef } from 'vue'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App, ShallowRef } from 'vue'

export interface HydrationContext {
  /** True when root component has mounted (hydration complete) */
  isHydrated: Readonly<ShallowRef<boolean>>
  /** True after first tick post-hydration (safe for animations after state restoration) */
  isSettled: Readonly<ShallowRef<boolean>>
  /** Mark hydration as complete */
  hydrate: () => void
  /** Mark as settled (called automatically after nextTick post-hydration) */
  settle: () => void
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
  const isSettled = shallowRef(false)

  function hydrate () {
    isHydrated.value = true
  }

  function settle () {
    isSettled.value = true
  }

  return {
    isHydrated: shallowReadonly(isHydrated),
    isSettled: shallowReadonly(isSettled),
    hydrate,
    settle,
  } as E
}

export function createFallbackHydration<
  E extends HydrationContext = HydrationContext,
> (): E {
  return {
    isHydrated: shallowReadonly(shallowRef(true)),
    isSettled: shallowReadonly(shallowRef(true)),
    hydrate: () => {},
    settle: () => {},
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
        async mounted () {
          if (!isNull(this.$parent)) return

          context.hydrate()
          // Wait for next tick to allow state restoration in other onMounted hooks
          await nextTick()
          context.settle()
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
 *   const { isHydrated, isSettled } = useHydration()
 *
 *   // Use isSettled to gate animations after state restoration
 *   const transition = computed(() => isSettled.value ? 'fade' : undefined)
 * </script>
 *
 * <template>
 *   <Transition :name="transition">
 *     <div v-if="show">Animates only after hydration settles</div>
 *   </Transition>
 * </template>
 * ```
 */
export function useHydration<
  E extends HydrationContext = HydrationContext,
> (namespace = 'v0:hydration'): E {
  const fallback = createFallbackHydration<E>()

  if (!instanceExists()) return fallback

  try {
    return useContext<E>(namespace, fallback)
  } catch {
    return fallback
  }
}
