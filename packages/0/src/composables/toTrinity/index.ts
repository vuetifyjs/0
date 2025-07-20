// Types
import type { App } from 'vue'

export type ContextTrinity<Z> = readonly [
  () => Z,
  (context?: Z, app?: App) => Z,
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
 * @returns A trinity containing [useContext, provideContext, context]
 */
export function toTrinity<Z> (
  useContext: () => Z,
  provideContext: (context: Z, app?: App) => Z,
  context: Z,
): ContextTrinity<Z> {
  return [
    useContext,
    (_context: Z = context, app?: App): Z => provideContext(_context, app),
    context,
  ] as const
}
