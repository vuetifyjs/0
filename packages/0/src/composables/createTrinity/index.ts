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

// Composables
import { createContext } from '#v0/composables/createContext'

// Utilities
import { isString } from '#v0/utilities'

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
 * @param useContext The function that retrieves/uses the context (typically named `useContext`).
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
 * @see https://0.vuetifyjs.com/composables/foundation/create-trinity
 *
 * @example
 * ```ts
 * // Simplified — key + context
 * export function createMyFeature() {
 *   const context = { foo: 'hello', bar: 42 }
 *   return createTrinity('my-context', context)
 * }
 *
 * // Explicit — useContext + provideContext + context
 * export function createMyFeature<E extends MyContext = MyContext>() {
 *   const [useContext, provideContext] = createContext<E>('my-context')
 *   const context = { foo: 'hello', bar: 42 }
 *   return createTrinity<E>(useContext, provideContext, context)
 * }
 * ```
 */
export function createTrinity<Z = unknown> (
  key: string,
  context: Z,
): ContextTrinity<Z>
export function createTrinity<Z = unknown> (
  useContext: () => Z,
  provideContext: (context: Z, app?: App) => Z,
  context: Z,
): ContextTrinity<Z>
export function createTrinity<Z = unknown> (
  keyOrUseContext: string | (() => Z),
  provideContextOrContext: ((context: Z, app?: App) => Z) | Z,
  maybeContext?: Z,
): ContextTrinity<Z> {
  if (isString(keyOrUseContext)) {
    const [useContext, provideContext] = createContext<Z>(keyOrUseContext)
    const context = provideContextOrContext as Z

    return [
      useContext,
      (_context: Z = context, app?: App): Z => provideContext(_context, app),
      context,
    ] as const
  }

  const provideContext = provideContextOrContext as (context: Z, app?: App) => Z
  const context = maybeContext as Z

  return [
    keyOrUseContext,
    (_context: Z = context, app?: App): Z => provideContext(_context, app),
    context,
  ] as const
}
