// Utilities
import { isNullOrUndefined } from '#v0/utilities'

/* #__NO_SIDE_EFFECTS__ */
export function toArray<T> (value: T | T[]): T[] {
  return isNullOrUndefined(value) ? [] : (Array.isArray(value) ? value : [value])
}
