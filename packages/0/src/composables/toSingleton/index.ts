// Types
import type { App, Ref } from 'vue'

export type ContextSingleton<Z, E> = readonly [
  () => E,
  (model?: Ref<Z>, context?: E, app?: App) => E,
  E,
]

/**
 * Converts individual composable parts to a standardized context singleton pattern.
 * This utility extends the trinity pattern with model binding support for single-value contexts.
 *
 * @param useContext The context hook function
 * @param provideContext The underlying context provider function with model support
 * @param context The context object
 * @template Z The model type
 * @template E The context type
 * @returns A singleton containing [useContext, provideContext, context]
 */
export function toSingleton<Z, E> (
  useContext: () => E,
  provideContext: (model?: Ref<Z>, context?: E, app?: App) => E,
  context: E,
): ContextSingleton<Z, E> {
  return [
    useContext,
    (model?: Ref<Z>, _context: E = context, app?: App): E => provideContext(model, _context, app),
    context,
  ] as const
}
