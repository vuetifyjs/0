// Composables
import { useContext } from '../useContext'

// Utilities
import { shallowReadonly, shallowRef } from 'vue'

// Types
import type { App, ShallowRef } from 'vue'

export interface HydrationContext {
  isHydrated: Readonly<ShallowRef<boolean>>
  hydrate: () => void
}

export interface HydrationPlugin {
  install: (app: App) => void
}

export const [useHydrationContext, provideHydrationContext] = useContext<HydrationContext>('v0:hydration')

/**
 * Creates a hydration context for managing client-side hydration state.
 * This function provides a way to track when the application has been fully
 * hydrated on the client side, which is useful for SSR applications.
 *
 * @returns A hydration context object with reactive state and hydration control.
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
 */
export function useHydration (): HydrationContext {
  return useHydrationContext()
}

/**
 * Creates a Vue plugin for managing application hydration state.
 * This plugin automatically detects when the root component is mounted
 * and triggers the hydration process, useful for SSR applications.
 *
 * @returns A Vue plugin object with install method.
 */
export function createHydrationPlugin (): HydrationPlugin {
  return {
    install (app: App) {
      const context = createHydration()

      app.runWithContext(() => {
        provideHydrationContext(context, app)
      })

      app.mixin({
        mounted () {
          if (this.$parent !== null) return

          context.hydrate()
        },
      })
    },
  }
}
