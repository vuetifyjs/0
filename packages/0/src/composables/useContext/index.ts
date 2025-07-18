// Utilities
import { inject, provide } from 'vue'

// Types
import type { App, InjectionKey } from 'vue'

/**
 * Simple composable that wraps Vue's `provide` and `inject` functions.
 *
 * @param key The key to provide or inject the context.
 * @returns A tuple containing the inject function and a provide function.
 */
export function useContext<T> (key: InjectionKey<T> | string) {
  function provideContext (value: T, app?: App) {
    app ? app.provide(key, value) : provide(key, value)
  }

  function injectContext (): T {
    const contextValue = inject<T>(key)

    if (contextValue === undefined) {
      throw new Error(`Context "${String(key)}" not found. Ensure it's provided by an ancestor.`)
    }

    return contextValue
  }

  return [injectContext, provideContext] as const
}
