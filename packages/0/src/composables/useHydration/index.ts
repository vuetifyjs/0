// Composables
import { useContext } from '../useContext'

// Utilities
import { getCurrentInstance, onMounted, shallowReadonly, shallowRef } from 'vue'

// Types
import type { App, ShallowRef } from 'vue'

export interface HydrationContext {
  isHydrated: Readonly<ShallowRef<boolean>>
  hydrate: () => void
}

export interface HydrationPlugin {
  install: (app: App) => void
}

const [useHydrationContext, provideHydrationContext] = useContext<HydrationContext>('v0:hydration')

export function createHydration (): HydrationContext {
  const isHydrated = shallowRef(false)

  function hydrate () {
    isHydrated.value = true
  }

  if (getCurrentInstance()) {
    onMounted(() => {
      hydrate()
    })
  }

  return {
    isHydrated: shallowReadonly(isHydrated),
    hydrate,
  }
}

export function useHydration (): HydrationContext {
  return useHydrationContext()
}

export function createHydrationPlugin (): HydrationPlugin {
  return {
    install (app: App) {
      const context = createHydration()

      app.runWithContext(() => {
        provideHydrationContext(context, app)
      })
    },
  }
}
