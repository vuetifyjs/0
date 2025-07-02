// Composables
import { useContext } from '../useContext'

// Utilities
import { onMounted, shallowRef } from 'vue'

// Types
import type { App, ShallowRef } from 'vue'

export interface HydrationContext {
  isHydrated: ShallowRef<boolean>
  hydrate: () => void
}

const [useHydrationContext, provideHydrationContext] = useContext<HydrationContext>('v0:hydration')

export function createHydration (): HydrationContext {
  const isHydrated = shallowRef(false)

  function hydrate () {
    isHydrated.value = true
  }

  onMounted(() => {
    hydrate()
  })

  return {
    isHydrated,
    hydrate,
  }
}

export function useHydration (): HydrationContext {
  return useHydrationContext()
}

export function installHydrationPlugin (app: App) {
  const context = createHydration()

  app.runWithContext(() => {
    provideHydrationContext(context)
  })
}
