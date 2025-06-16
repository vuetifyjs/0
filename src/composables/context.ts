export function useContext<T>(key: string) {
  function defineProvides (value: T) {
    provide(key, value)
  }

  function defineInjects (): T {
    const contextValue = inject<T>(key)

    if (contextValue === undefined) {
      throw new Error(`Context "${key}" not found. Ensure it's provided by an ancestor component.`)
    }

    return contextValue
  }

  return [defineProvides, defineInjects] as const
}
