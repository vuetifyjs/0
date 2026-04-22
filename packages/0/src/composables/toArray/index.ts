/**
 * @module toArray
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-array
 *
 * @remarks
 * Utility function to normalize single values and arrays into arrays.
 *
 * Converts single values into single-element arrays, passes arrays through unchanged,
 * and handles null/undefined by returning empty arrays. Perfect for functions that
 * accept both single values and arrays as input (e.g., ID | ID[]).
 *
 * @example
 * ```ts
 * import { toArray } from '@vuetify/v0'
 *
 * toArray('hello') // ['hello']
 * toArray(['a', 'b']) // ['a', 'b']
 * toArray(null) // []
 * ```
 */

// Utilities
import { isArray, isNullOrUndefined } from '#v0/utilities'

/**
 * Converts a value to an array.
 *
 * @param value The value to convert.
 * @template Z The type of the value.
 * @returns The converted array.
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-array
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
/* #__NO_SIDE_EFFECTS__ */
export function toArray<Z> (value: Z | Z[]): Z[] {
  return isNullOrUndefined(value) ? [] : (isArray(value) ? value : [value])
}
