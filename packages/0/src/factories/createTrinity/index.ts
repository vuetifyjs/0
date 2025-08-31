// Types
import type { App } from 'vue'

export type ContextTrinity<Z = unknown> = readonly [
  () => Z,
  (context?: Z, app?: App) => Z,
  Z,
]

/**
 * A tuple containing Vue's provide/inject and a context object
 * @param createContext The function that creates the context
 * @param provideContext The function that provides context
 * @param context The underlying context object singleton
 * @template Z The type parameter for the context value
 * @template E The vmodel type for the context state.
 * @returns [createContext, provideContext, context]
 *
 * @see https://0.vuetifyjs.com/composables/foundation/create-trinity
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
