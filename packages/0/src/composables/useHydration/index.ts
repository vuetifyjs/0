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
import { createPluginContext } from '#v0/composables/createPlugin'

// Utilities
import { isNull } from '#v0/utilities'
import { nextTick, shallowReadonly, shallowRef } from 'vue'

// Types
import type { ShallowRef } from 'vue'

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
export const [createHydrationContext, createHydrationPlugin, useHydration] =
  createPluginContext<HydrationContextOptions, HydrationContext>(
    'v0:hydration',
    () => createHydration(),
    {
      fallback: () => createFallbackHydration(),
      setup: (context, app, _options) => {
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
    },
  )
