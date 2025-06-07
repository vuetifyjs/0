import { inject, type InjectionKey, provide } from 'vue'

/**
 * Composable for providing context values
 * @param key - The injection key
 * @param value - The value to provide
 * @returns The provided value
 */
export function useContextProvider<T> (key: InjectionKey<T>, value: T): T {
  provide(key, value)
  return value
}

/**
 * Composable for consuming context values with error handling
 * @param key - The injection key
 * @param fallback - Optional fallback value
 * @returns The injected value or fallback
 * @throws Error if context is not found and no fallback is provided
 */
export function useContextConsumer<T> (key: InjectionKey<T>, fallback?: T): T {
  const context = inject(key, fallback)

  if (context === undefined && fallback === undefined) {
    throw new Error(`Context ${key.toString()} not found. Make sure you're using this component within the appropriate provider.`)
  }

  return context as T
}

/**
 * Composable for optional context consumption (won't throw if not found)
 * @param key - The injection key
 * @param fallback - Optional fallback value
 * @returns The injected value, fallback, or undefined
 */
export function useOptionalContext<T> (key: InjectionKey<T>, fallback?: T): T | undefined {
  return inject(key, fallback)
}
