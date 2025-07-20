// Types
import type { App } from 'vue'

export type ContextTriad<Z> = readonly [
  () => Z,
  (context?: Z, app?: App) => Z,
  Z,
]

/**
 * Converts individual composable parts to a standardized context triad pattern.
 * This utility abstracts the common pattern of returning [useContext, provideContext, context].
 *
 * @param useContext The context hook function
 * @param provideContext The underlying context provider function
 * @param context The context object
 * @template Z The context type
 * @returns A triad containing [useContext, provideContext, context]
 */
export function toTriad<Z> (
  useContext: () => Z,
  provideContext: (context?: Z, app?: App) => Z,
  context: Z,
): ContextTriad<Z> {
  return [
    useContext,
    (_context: Z = context, app?: App): Z => provideContext(_context, app),
    context,
  ] as const
}
