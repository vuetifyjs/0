export function useContext<T>(key: string) {
  function provideContext (value: T) {
    provide(key, value)
  }

  function injectContext (): T {
    const contextValue = inject<T>(key)

    if (contextValue === undefined) {
      throw new Error(`Context "${key}" not found. Ensure it's provided by an ancestor component.`)
    }

    return contextValue
  }

  return [provideContext, injectContext] as const
}
