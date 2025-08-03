// Utilities
import { isNullOrUndefined } from '#v0/utilities'

export function toArray<T> (value: T | T[]): T[] {
  return isNullOrUndefined(value) ? [] : (Array.isArray(value) ? value : [value])
}
