/**
 * @module DateAdapter
 *
 * @remarks
 * Date adapter contract and built-in implementations. `PlainDateAdapter`
 * uses a JavaScript `Date`. `V0DateAdapter` uses Temporal; import it from
 * `@vuetify/v0/date`.
 *
 * @example
 * ```ts
 * import { PlainDateAdapter } from '@vuetify/v0'
 * import { V0DateAdapter } from '@vuetify/v0/date'
 * ```
 */

// Adapters
export { DateAdapter } from './adapter'
export { PlainDateAdapter } from './plain'
