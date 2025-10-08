// Utilities
import { isNullOrUndefined } from '#v0/utilities'

/**
 * Converts a value to an array.
 *
 * @param value The value to convert.
 * @template T The type of the value.
 * @returns The converted array.
 *
 * @example
 * ```ts
 * const value = 'Example Value'
 * const valueAsArray = toArray(value)
 * console.log(valueAsArray) // ['Example Value']
 * ```
 */
export function toArray<T> (value: T | T[]): T[] {
  return isNullOrUndefined(value) ? [] : (Array.isArray(value) ? value : [value])
}
