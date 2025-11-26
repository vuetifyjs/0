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
export function isNaN (item: unknown): item is number {
  return isNumber(item) && Number.isNaN(item)
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

/**
 * Clamps a value between a minimum and maximum
 *
 * @param value The value to clamp
 * @param min The minimum value (default: 0)
 * @param max The maximum value (default: 1)
 * @returns The clamped value
 *
 * @example
 * ```ts
 * clamp(5, 0, 10)  // 5
 * clamp(-5, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function clamp (value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Creates an array of sequential numbers
 *
 * @param length The length of the array to create
 * @param start The starting index (default: 0)
 * @returns An array of sequential numbers
 *
 * @example
 * ```ts
 * range(3)     // [0, 1, 2]
 * range(3, 1)  // [1, 2, 3]
 * range(5, 10) // [10, 11, 12, 13, 14]
 * range(0)     // []
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function range (length: number, start = 0): number[] {
  return Array.from({ length }, (_, index) => start + index)
}

/**
 * Debounces a function call by the specified delay
 *
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced function with clear and immediate methods
 *
 * @example
 * ```ts
 * const debouncedFn = debounce(() => console.log('called'), 500)
 * debouncedFn()        // Will call after 500ms
 * debouncedFn.clear()  // Cancel pending call
 * debouncedFn.immediate() // Call immediately
 * ```
 */
export function debounce<T extends (...args: any[]) => any> (
  fn: T,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  function debounced (...args: Parameters<T>) {
    if (!isUndefined(timeoutId)) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }

  debounced.clear = () => {
    if (!isUndefined(timeoutId)) clearTimeout(timeoutId)
  }

  debounced.immediate = (...args: Parameters<T>) => {
    debounced.clear()
    fn(...args)
  }

  return debounced
}
