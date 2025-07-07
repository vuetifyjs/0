// Utilities
import { inject, provide } from 'vue'

// Types
import type { App, InjectionKey } from 'vue'

export function useContext<T> (key: InjectionKey<T> | string) {
  function provideContext (value: T, app?: App) {
    app ? app.provide(key, value) : provide(key, value)
  }

  function injectContext (): T {
    const contextValue = inject<T>(key)

    if (contextValue === undefined) {
      throw new Error(`Context "${String(key)}" not found. Ensure it's provided by an ancestor component.`)
    }

    return contextValue
  }

  return [injectContext, provideContext] as const
}
