/**
 * @module createTrinity
 *
 * @see https://0.vuetifyjs.com/composables/foundation/create-trinity
 *
 * @remarks
 * Factory for creating the trinity pattern tuple used throughout the codebase.
 *
 * The trinity pattern returns a readonly tuple of [useContext, provideContext, defaultContext],
 * enabling flexible dependency injection with sensible defaults. This pattern is fundamental
 * to all registry-based composables.
 */

// Types
import type { App } from 'vue'

export type ContextTrinity<Z = unknown> = readonly [
  () => Z,
  (context?: Z, app?: App) => Z,
  Z,
]

/**
 * Creates a new trinity for a context composable and its provider.
 *
 * @param createContext The function that retrieves/uses the context (typically named `useContext`).
 * @param provideContext The function that provides the context to descendants.
 * @param context The default context instance to use when no custom context is provided.
 * @template Z The type of the context.
 * @returns A readonly tuple containing: [useContext function, provideContext wrapper function, default context instance].
 *
 * @remarks The trinity pattern is a foundational pattern used throughout the codebase for creating reusable context systems. It provides three related elements:
 *
 * 1. A function to retrieve/use the context
 * 2. A function to provide the context (with default value support)
 * 3. The default context instance
 *
 * The returned tuple is readonly (using `as const`) to ensure proper type inference.
 *
 * @see https://0.vuetifyjs.com/composables/foundation/create-trinity#create-trinity
 *
 * @example
 * ```ts
 * interface MyContext {
 *   foo: string
 *   bar: number
 * }
 *
 * export function createMyFeature<E extends MyContext = MyContext>() {
 *   const [useContext, _provideContext] = createContext<E>('my-context')
 *
 *   const context = { foo: 'hello', bar: 42 }
 *
 *   function provideContext (_context: E = context, app?: App): E {
 *     return _provideContext(_context, app)
 *   }
 *
 *   return createTrinity<E>(useContext, provideContext, context)
 * }
 * ```
 */
export function createTrinity<Z = unknown> (
  createContext: () => Z,
  provideContext: (_context?: Z, app?: App) => Z,
  context: Z,
): ContextTrinity<Z> {
  return [
    createContext,
    (_context: Z = context, app?: App): Z => provideContext(_context, app),
    context,
  ] as const
}
