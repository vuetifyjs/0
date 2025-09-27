// Utilities
import { isNullOrUndefined } from '#v0/utilities'

/**
 * Converts a value to an array.
 *
 * @param value The value to convert.
 * @template T The type of the value.
 * @returns The converted array.
 */
export function toArray<T> (value: T | T[]): T[] {
  return isNullOrUndefined(value) ? [] : (Array.isArray(value) ? value : [value])
}
