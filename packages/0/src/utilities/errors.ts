/**
 * @module utilities/errors
 *
 * @remarks
 * Structured error class thrown by v0 internals. Pattern modeled on
 * tRPC's `TRPCError` and Node's built-in `Error` codes — `code` is a
 * top-level discriminant field on the error, *not* a payload nested
 * inside `Error.cause`. `cause` stays reserved for wrapping the
 * genuine upstream error so error trackers (Sentry's `LinkedErrors`,
 * Datadog RUM, Rollbar) render the chain correctly.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
 * @see https://nodejs.org/api/errors.html#nodejs-error-codes
 * @see https://trpc.io/docs/server/error-handling
 * @see https://docs.sentry.io/platforms/javascript/configuration/integrations/linkederrors/
 */

// Utilities
import { isUndefined, UNSAFE_KEYS } from './helpers'

// Types
import type { V0ErrorCode, V0ErrorDetails } from '#v0/types'

/**
 * Structured error thrown by v0 internals.
 *
 * @remarks
 * Carries a stable {@link V0ErrorCode} discriminant on `code` so
 * consumers, devtools panels, and error trackers can identify the
 * error without parsing the message string. Domain context lives in
 * top-level fields per code (`key` for `V0_CONTEXT_MISSING`, `plugin`
 * for `V0_PLUGIN_MISSING`), populated from a {@link V0ErrorDetails}
 * argument and merged onto the instance at construction time.
 *
 * `cause` is forwarded to `Error`'s standard `ErrorOptions.cause` slot
 * and is intended to carry a wrapped upstream error, not metadata.
 *
 * Prefer {@link isV0Error} over manual `instanceof` checks at the
 * narrowing site — the guard intersects the instance type with the
 * matching {@link V0ErrorDetails} arm, so per-code fields are typed.
 *
 * @example Author site
 * ```ts
 * throw new V0Error('Context not found.', { code: 'V0_CONTEXT_MISSING', key })
 * ```
 *
 * @example Author site with upstream wrap
 * ```ts
 * try {
 *   JSON.parse(raw)
 * } catch (err) {
 *   throw new V0Error('Failed to hydrate registry.', {
 *     code: 'V0_CONTEXT_MISSING',
 *     key: 'v0:registry',
 *     cause: err,
 *   })
 * }
 * ```
 *
 * @example Consumer site
 * ```ts
 * try {
 *   useContext(myKey)
 * } catch (err) {
 *   if (isV0Error(err, 'V0_CONTEXT_MISSING')) {
 *     console.log(err.key)
 *   }
 * }
 * ```
 */
export class V0Error extends Error {
  override name = 'V0Error'
  readonly code: V0ErrorCode
  readonly key?: string | symbol
  readonly plugin?: string
  readonly palette?: string
  readonly seed?: string
  readonly variant?: string
  readonly adapter?: string
  readonly prefix?: string

  constructor (message: string, details: V0ErrorDetails & { cause?: unknown }) {
    const { cause, ...rest } = details
    super(message, isUndefined(cause) ? undefined : { cause })
    this.code = details.code

    for (const key in rest) {
      if (UNSAFE_KEYS.has(key) || !Object.hasOwn(rest, key)) continue
      ;(this as Record<string, unknown>)[key] = (rest as Record<string, unknown>)[key]
    }
  }
}

/* #__NO_SIDE_EFFECTS__ */
/**
 * Type guard for v0-thrown errors.
 *
 * @param value The value to test.
 * @param code Optional discriminant — narrow the result to a specific
 *   {@link V0ErrorCode} so per-code fields become required.
 *
 * @remarks
 * Without the optional `code` argument, the guard verifies the value
 * is a {@link V0Error} instance. With the `code` argument, the guard
 * also narrows the instance type to the intersection with the matching
 * {@link V0ErrorDetails} arm — fields like `key` or `plugin` change
 * from optional to required on the narrowed type.
 *
 * @example Narrow to any v0 error
 * ```ts
 * if (isV0Error(err)) {
 *   console.log(err.code)
 * }
 * ```
 *
 * @example Narrow to a specific code
 * ```ts
 * if (isV0Error(err, 'V0_CONTEXT_MISSING')) {
 *   console.log(err.key) // typed as string | symbol, not string | symbol | undefined
 * }
 * ```
 */
export function isV0Error<C extends V0ErrorCode> (
  value: unknown,
  code?: C,
): value is V0Error & Extract<V0ErrorDetails, { code: C }> {
  if (!(value instanceof V0Error)) return false
  return isUndefined(code) || value.code === code
}
