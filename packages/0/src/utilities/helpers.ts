/**
 * @module utilities/helpers
 *
 * @remarks
 * Collection of utility functions for type checking, object manipulation,
 * and common transformations. All exports are tree-shakeable.
 */

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { DeepPartial } from '#v0/types'

/**
 * Checks if a value is a function
 *
 * @param item The value to check
 * @returns True if the value is a function
 *
 * @example
 * ```ts
 * isFunction(() => {})  // true
 * isFunction('string')  // false
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function isFunction (item: unknown): item is Function {
  return typeof item === 'function'
}

/**
 * Checks if a value is a string
 *
 * @param item The value to check
 * @returns True if the value is a string
 *
 * @example
 * ```ts
 * isString('hello')  // true
 * isString(123)      // false
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function isString (item: unknown): item is string {
  return typeof item === 'string'
}

/**
 * Checks if a value is a number
 *
 * @param item The value to check
 * @returns True if the value is a number (including NaN)
 *
 * @example
 * ```ts
 * isNumber(123)       // true
 * isNumber(NaN)       // true
 * isNumber('123')     // false
 * ```
 *
 * @see {@link isNaN} to check for NaN specifically
 */
/* #__NO_SIDE_EFFECTS__ */
export function isNumber (item: unknown): item is number {
  return typeof item === 'number'
}

/**
 * Checks if a value is a boolean
 *
 * @param item The value to check
 * @returns True if the value is a boolean
 *
 * @example
 * ```ts
 * isBoolean(true)   // true
 * isBoolean(false)  // true
 * isBoolean(0)      // false
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function isBoolean (item: unknown): item is boolean {
  return typeof item === 'boolean'
}

/**
 * Checks if a value is a plain object (excludes null and arrays)
 *
 * @param item The value to check
 * @returns True if the value is a plain object
 *
 * @remarks
 * Returns false for null and arrays, even though `typeof null === 'object'`
 * and `typeof [] === 'object'` in JavaScript.
 *
 * @example
 * ```ts
 * isObject({})        // true
 * isObject({ a: 1 })  // true
 * isObject(null)      // false
 * isObject([])        // false
 * ```
 *
 * @see {@link isArray} to check for arrays
 * @see {@link isNull} to check for null
 */
/* #__NO_SIDE_EFFECTS__ */
export function isObject (item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item)
}

/**
 * Checks if a value is an array
 *
 * @param item The value to check
 * @returns True if the value is an array
 *
 * @example
 * ```ts
 * isArray([])        // true
 * isArray([1, 2, 3]) // true
 * isArray('string')  // false
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function isArray (item: unknown): item is unknown[] {
  return Array.isArray(item)
}

/**
 * Checks if a value is null
 *
 * @param item The value to check
 * @returns True if the value is null
 *
 * @example
 * ```ts
 * isNull(null)      // true
 * isNull(undefined) // false
 * ```
 *
 * @see {@link isUndefined} to check for undefined
 * @see {@link isNullOrUndefined} to check for either
 */
/* #__NO_SIDE_EFFECTS__ */
export function isNull (item: unknown): item is null {
  return item === null
}

/**
 * Checks if a value is null or undefined
 *
 * @param item The value to check
 * @returns True if the value is null or undefined
 *
 * @remarks
 * Uses loose equality (`== null`) which matches both null and undefined.
 *
 * @example
 * ```ts
 * isNullOrUndefined(null)      // true
 * isNullOrUndefined(undefined) // true
 * isNullOrUndefined(0)         // false
 * isNullOrUndefined('')        // false
 * ```
 *
 * @see {@link isNull} to check for null only
 * @see {@link isUndefined} to check for undefined only
 */
/* #__NO_SIDE_EFFECTS__ */
export function isNullOrUndefined (item: unknown): item is null | undefined {
  return item == null
}

/**
 * Checks if a value is undefined
 *
 * @param item The value to check
 * @returns True if the value is undefined
 *
 * @example
 * ```ts
 * isUndefined(undefined) // true
 * isUndefined(null)      // false
 * ```
 *
 * @see {@link isNull} to check for null
 * @see {@link isNullOrUndefined} to check for either
 */
/* #__NO_SIDE_EFFECTS__ */
export function isUndefined (item: unknown): item is undefined {
  return item === undefined
}

/**
 * Checks if a value is a primitive (string, number, or boolean)
 *
 * @param item The value to check
 * @returns True if the value is a string, number, or boolean
 *
 * @example
 * ```ts
 * isPrimitive('hello') // true
 * isPrimitive(123)     // true
 * isPrimitive(true)    // true
 * isPrimitive({})      // false
 * isPrimitive(null)    // false
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function isPrimitive (item: unknown): item is string | number | boolean {
  return (
    typeof item === 'string' ||
    typeof item === 'number' ||
    typeof item === 'boolean'
  )
}

/**
 * Checks if a value is a symbol
 *
 * @param item The value to check
 * @returns True if the value is a symbol
 *
 * @example
 * ```ts
 * isSymbol(Symbol('test')) // true
 * isSymbol('symbol')       // false
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function isSymbol (item: unknown): item is symbol {
  return typeof item === 'symbol'
}

/**
 * Checks if a value is NaN (Not a Number)
 *
 * @param item The value to check
 * @returns True if the value is NaN
 *
 * @remarks
 * Uses `Number.isNaN()` which only returns true for the actual NaN value,
 * unlike the global `isNaN()` which coerces the argument to a number first.
 *
 * @example
 * ```ts
 * isNaN(NaN)         // true
 * isNaN(123)         // false
 * isNaN('hello')     // false (unlike global isNaN)
 * isNaN(undefined)   // false (unlike global isNaN)
 * ```
 *
 * @see {@link isNumber} to check if a value is a number type
 */
/* #__NO_SIDE_EFFECTS__ */
export function isNaN (item: unknown): item is number {
  return isNumber(item) && Number.isNaN(item)
}

/**
 * Deeply merges source objects into a target object
 *
 * @param target The target object to merge into (will be mutated)
 * @param sources One or more source objects to merge from
 * @returns The mutated target object
 *
 * @remarks
 * - Mutates the target object in place
 * - Nested objects are recursively merged
 * - Arrays are replaced, not merged
 * - Primitives from sources overwrite target values
 *
 * @example
 * ```ts
 * const target = { a: 1, b: { c: 2 } }
 * mergeDeep(target, { b: { d: 3 } })
 * // target is now { a: 1, b: { c: 2, d: 3 } }
 *
 * // Multiple sources
 * mergeDeep({}, { a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 *
 * // Arrays are replaced
 * mergeDeep({ arr: [1, 2] }, { arr: [3] }) // { arr: [3] }
 * ```
 */
// Keys that could lead to prototype pollution
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

/* #__NO_SIDE_EFFECTS__ */
export function mergeDeep<T extends object> (target: T, ...sources: DeepPartial<T>[]): T {
  if (sources.length === 0) return target

  const source = sources.shift()

  // Ensure both target and source are objects before attempting to merge
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      // Skip prototype pollution vectors and non-own properties
      if (UNSAFE_KEYS.has(key)) continue
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue

      const sourceValue = source[key]
      const targetValue = (target as Record<string, unknown>)[key]

      if (isObject(sourceValue)) {
        if (!isObject(targetValue)) {
          // If targetValue is not an object, initialize it as an empty object
          Object.assign(target, { [key]: {} })
        }
        // Recursively merge using fresh reference from target
        mergeDeep((target as Record<string, unknown>)[key] as object, sourceValue as object)
      } else {
        // Directly assign primitive values or arrays
        Object.assign(target, { [key]: sourceValue })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

// Utilities
import { useId as vueUseId } from 'vue'

import { instanceExists } from './instance'

let idCounter = 0

/**
 * Generates a unique ID, using Vue's useId when in component context
 *
 * @returns A unique string ID
 *
 * @remarks
 * - In component setup/lifecycle: Uses Vue's `useId()` for SSR-safe hydration
 * - Outside components: Falls back to sequential counter (`v0-0`, `v0-1`, ...)
 * - Vapor mode compatible
 *
 * @example
 * ```ts
 * // In component setup - SSR safe
 * const id = useId() // 'v:0', 'v:1', etc. (Vue's format)
 *
 * // Outside component - counter fallback
 * const id = useId() // 'v0-0', 'v0-1', etc.
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function useId (): string {
  if (instanceExists()) {
    return vueUseId()
  }

  if (__DEV__ && !IN_BROWSER) {
    console.warn('[v0 warn] useId() called outside component context during SSR. Provide explicit ID to avoid hydration mismatch.')
  }

  return `v0-${idCounter++}`
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
