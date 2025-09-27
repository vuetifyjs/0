// Types
import type { App } from 'vue'

export type ContextTrinity<Z = unknown> = readonly [
  () => Z,
  (context?: Z, app?: App) => Z,
  Z,
]

/**
 * Creates a new trinity for providing and injecting data.
 *
 * @param createContext The function that creates the context.
 * @param provideContext The function that provides the context.
 * @param context The context to provide.
 * @template Z The type of the context.
 * @returns A new trinity.
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
