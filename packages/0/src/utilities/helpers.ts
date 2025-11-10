// Types
import type { DeepPartial } from '#v0/types'

/* #__NO_SIDE_EFFECTS__ */
export function isFunction (item: unknown): item is Function {
  return typeof item === 'function'
}

/* #__NO_SIDE_EFFECTS__ */
export function isString (item: unknown): item is string {
  return typeof item === 'string'
}

/* #__NO_SIDE_EFFECTS__ */
export function isNumber (item: unknown): item is number {
  return typeof item === 'number'
}

/* #__NO_SIDE_EFFECTS__ */
export function isBoolean (item: unknown): item is boolean {
  return typeof item === 'boolean'
}

/* #__NO_SIDE_EFFECTS__ */
export function isObject (item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item)
}

/* #__NO_SIDE_EFFECTS__ */
export function isArray (item: unknown): item is unknown[] {
  return Array.isArray(item)
}

/* #__NO_SIDE_EFFECTS__ */
export function isNull (item: unknown): item is null {
  return item === null
}

/* #__NO_SIDE_EFFECTS__ */
export function isNullOrUndefined (item: unknown): item is null {
  return item == null
}

/* #__NO_SIDE_EFFECTS__ */
export function isUndefined (item: unknown): item is undefined {
  return item === undefined
}

/* #__NO_SIDE_EFFECTS__ */
export function isPrimitive (item: unknown): item is string | number | boolean {
  return (
    typeof item === 'string' ||
    typeof item === 'number' ||
    typeof item === 'boolean'
  )
}

/* #__NO_SIDE_EFFECTS__ */
export function mergeDeep<T extends object> (target: T, ...sources: DeepPartial<T>[]): T {
  if (sources.length === 0) return target

  const source = sources.shift()

  // Ensure both target and source are objects before attempting to merge
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      // Check if the key exists in the source and is an own property
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key]
        const targetValue = (target as Record<string, unknown>)[key]

        if (isObject(sourceValue)) {
          if (!isObject(targetValue)) {
            // If targetValue is not an object, initialize it as an empty object
            Object.assign(target, { [key]: {} })
          }
          // Recursively merge
          mergeDeep(targetValue as object, sourceValue as object)
        } else {
          // Directly assign primitive values or arrays
          Object.assign(target, { [key]: sourceValue })
        }
      }
    }
  }

  return mergeDeep(target, ...sources)
}

/* #__NO_SIDE_EFFECTS__ */
export function genId (): string {
  return Math.random().toString(36).slice(2, 9)
}
