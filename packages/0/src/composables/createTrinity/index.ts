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
 * @param createContext The function that creates the context.
 * @param provideContext The function that provides the context.
 * @param context The context to provide.
 * @template Z The type of the context.
 * @returns A new trinity.
 *
 * @see https://0.vuetifyjs.com/composables/foundation/create-trinity
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
