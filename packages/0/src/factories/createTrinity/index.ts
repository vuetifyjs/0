// Types
import type { App, Ref } from 'vue'

export type ContextTrinity<Z = unknown, E = unknown> = readonly [
  () => Z,
  (model?: Ref<E>, context?: Z, app?: App) => Z,
  Z,
]

/**
 * Converts individual composable parts to a standardized context trinity pattern.
 * This utility abstracts the common pattern of returning [useContext, provideContext, context].
 *
 * @param useContext The context hook function
 * @param provideContext The underlying context provider function
 * @param context The context object
 * @template Z The context type
 * @template E The model type
 * @returns A trinity containing [useContext, provideContext, context]
 */
export function createTrinity<Z = unknown, E = unknown> (
  useContext: () => Z,
  provideContext: (model?: Ref<E>, _context?: Z, app?: App) => Z,
  context: Z,
): ContextTrinity<Z, E> {
  return [
    useContext,
    (model?: Ref<E>, _context: Z = context, app?: App): Z => provideContext(model, _context, app),
    context,
  ] as const
}
