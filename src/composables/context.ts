import type { InjectionKey } from 'vue'

export function useContext<T> (key: InjectionKey<T> | string) {
  function provideContext (value: any) {
    provide(key, value)
  }

  function injectContext () {
    const contextValue = inject(key)

    if (contextValue === undefined) {
      throw new Error(`Context "${key.toString()}" not found. Ensure it's provided by an ancestor component.`)
    }

    return contextValue
  }

  return [injectContext, provideContext] as const
}
