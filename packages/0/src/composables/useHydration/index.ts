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
 * Creates a hydration context for tracking client-side hydration state in SSR applications.
 * This function provides a way to determine when the application has been fully hydrated
 * on the client side, which is essential for SSR/SSG compatibility.
 *
 * @returns A hydration context object with reactive state and hydration control.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-hydration
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
 * Simple hook to access the hydration context.
 *
 * @returns The hydration context containing hydration state and controls.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-hydration
 */
export function useHydration (): HydrationContext {
  return useHydrationContext()
}

/**
 * Creates a Vue plugin for hydration state management in SSR/SSG applications.
 * This plugin automatically detects when the root component is mounted and
 * triggers the hydration process, ensuring proper client-side hydration timing.
 *
 * @returns A Vue plugin object with install method.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-hydration
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
