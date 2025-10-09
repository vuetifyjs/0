// Utilities
import { isNullOrUndefined } from '#v0/utilities'

/**
 * Converts a value to an array.
 *
 * @param value The value to convert.
 * @template Z The type of the value.
 * @returns The converted array.
 *
 * @example
 * ```ts
 * import { toArray } from '@vuetify/v0'
 *
 * const value = 'Example Value'
 * const valueAsArray = toArray(value)
 *
 * console.log(valueAsArray) // ['Example Value']
 * ```
 */
export function toArray<Z> (value: Z | Z[]): Z[] {
  return isNullOrUndefined(value) ? [] : (Array.isArray(value) ? value : [value])
}
