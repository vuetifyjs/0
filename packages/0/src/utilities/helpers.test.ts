import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

// Utilities
import {
  isFunction,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isNull,
  isNullOrUndefined,
  isUndefined,
  isPrimitive,
  isSymbol,
  isNaN,
  mergeDeep,
  genId,
  clamp,
  range,
  debounce,
} from './helpers'

describe('helpers', () => {
  describe('type guards', () => {
    describe('isFunction', () => {
      it('should return true for functions', () => {
        expect(isFunction(() => {})).toBe(true)
        expect(isFunction(function () {})).toBe(true)
        expect(isFunction(async () => {})).toBe(true)
        expect(isFunction(class {})).toBe(true)
        expect(isFunction(Array.isArray)).toBe(true)
      })

      it('should return false for non-functions', () => {
        expect(isFunction(null)).toBe(false)
        expect(isFunction(undefined)).toBe(false)
        expect(isFunction({})).toBe(false)
        expect(isFunction([])).toBe(false)
        expect(isFunction('function')).toBe(false)
        expect(isFunction(123)).toBe(false)
      })
    })

    describe('isString', () => {
      it('should return true for strings', () => {
        expect(isString('')).toBe(true)
        expect(isString('hello')).toBe(true)
        expect(isString(`template`)).toBe(true)
        expect(isString(String('wrapped'))).toBe(true)
      })

      it('should return false for non-strings', () => {
        expect(isString(123)).toBe(false)
        expect(isString(null)).toBe(false)
        expect(isString(undefined)).toBe(false)
        expect(isString({})).toBe(false)
        expect(isString(['s', 't', 'r'])).toBe(false)

        // eslint-disable-next-line unicorn/new-for-builtins -- testing boxed primitives
        expect(isString(new String('boxed'))).toBe(false)
      })
    })

    describe('isNumber', () => {
      it('should return true for numbers', () => {
        expect(isNumber(0)).toBe(true)
        expect(isNumber(123)).toBe(true)
        expect(isNumber(-456)).toBe(true)
        expect(isNumber(3.14)).toBe(true)
        expect(isNumber(Infinity)).toBe(true)
        expect(isNumber(-Infinity)).toBe(true)
        expect(isNumber(Number.NaN)).toBe(true)
      })

      it('should return false for non-numbers', () => {
        expect(isNumber('123')).toBe(false)
        expect(isNumber(null)).toBe(false)
        expect(isNumber(undefined)).toBe(false)
        expect(isNumber({})).toBe(false)

        // eslint-disable-next-line unicorn/new-for-builtins -- testing boxed primitives
        expect(isNumber(new Number(5))).toBe(false)
      })
    })

    describe('isBoolean', () => {
      it('should return true for booleans', () => {
        expect(isBoolean(true)).toBe(true)
        expect(isBoolean(false)).toBe(true)
        expect(isBoolean(Boolean(1))).toBe(true)
      })

      it('should return false for non-booleans', () => {
        expect(isBoolean(0)).toBe(false)
        expect(isBoolean(1)).toBe(false)
        expect(isBoolean('')).toBe(false)
        expect(isBoolean('true')).toBe(false)
        expect(isBoolean(null)).toBe(false)
        expect(isBoolean(undefined)).toBe(false)

        // eslint-disable-next-line unicorn/new-for-builtins -- testing boxed primitives
        expect(isBoolean(new Boolean(true))).toBe(false)
      })
    })

    describe('isObject', () => {
      it('should return true for plain objects', () => {
        expect(isObject({})).toBe(true)
        expect(isObject({ a: 1 })).toBe(true)
        expect(isObject(Object.create(null))).toBe(true)
        expect(isObject(new Object())).toBe(true)
      })

      it('should return false for null', () => {
        expect(isObject(null)).toBe(false)
      })

      it('should return false for arrays', () => {
        expect(isObject([])).toBe(false)
        expect(isObject([1, 2, 3])).toBe(false)
      })

      it('should return false for other types', () => {
        expect(isObject('object')).toBe(false)
        expect(isObject(123)).toBe(false)
        expect(isObject(undefined)).toBe(false)
        expect(isObject(() => {})).toBe(false)
      })

      it('should return true for class instances', () => {
        class Foo {}
        expect(isObject(new Foo())).toBe(true)
        expect(isObject(new Date())).toBe(true)
        expect(isObject(new Map())).toBe(true)
        expect(isObject(/regex/)).toBe(true)
      })
    })

    describe('isArray', () => {
      it('should return true for arrays', () => {
        expect(isArray([])).toBe(true)
        expect(isArray([1, 2, 3])).toBe(true)
        expect(isArray(Array.from({ length: 5 }))).toBe(true)
        expect(isArray(Array.from({ length: 3 }))).toBe(true)
      })

      it('should return false for non-arrays', () => {
        expect(isArray(null)).toBe(false)
        expect(isArray(undefined)).toBe(false)
        expect(isArray({})).toBe(false)
        expect(isArray('array')).toBe(false)
        expect(isArray({ length: 3 })).toBe(false)
      })
    })

    describe('isNull', () => {
      it('should return true for null', () => {
        expect(isNull(null)).toBe(true)
      })

      it('should return false for non-null', () => {
        expect(isNull(undefined)).toBe(false)
        expect(isNull(0)).toBe(false)
        expect(isNull('')).toBe(false)
        expect(isNull(false)).toBe(false)
        expect(isNull({})).toBe(false)
      })
    })

    describe('isUndefined', () => {
      it('should return true for undefined', () => {
        expect(isUndefined(undefined)).toBe(true)
        expect(isUndefined(void 0)).toBe(true)
        let undef
        expect(isUndefined(undef)).toBe(true)
      })

      it('should return false for non-undefined', () => {
        expect(isUndefined(null)).toBe(false)
        expect(isUndefined(0)).toBe(false)
        expect(isUndefined('')).toBe(false)
        expect(isUndefined(false)).toBe(false)
      })
    })

    describe('isNullOrUndefined', () => {
      it('should return true for null', () => {
        expect(isNullOrUndefined(null)).toBe(true)
      })

      it('should return true for undefined', () => {
        expect(isNullOrUndefined(undefined)).toBe(true)
      })

      it('should return false for falsy non-nullish values', () => {
        expect(isNullOrUndefined(0)).toBe(false)
        expect(isNullOrUndefined('')).toBe(false)
        expect(isNullOrUndefined(false)).toBe(false)
        expect(isNullOrUndefined(Number.NaN)).toBe(false)
      })

      it('should return false for other values', () => {
        expect(isNullOrUndefined({})).toBe(false)
        expect(isNullOrUndefined([])).toBe(false)
        expect(isNullOrUndefined('null')).toBe(false)
      })
    })

    describe('isPrimitive', () => {
      it('should return true for strings', () => {
        expect(isPrimitive('')).toBe(true)
        expect(isPrimitive('hello')).toBe(true)
      })

      it('should return true for numbers', () => {
        expect(isPrimitive(0)).toBe(true)
        expect(isPrimitive(123)).toBe(true)
        expect(isPrimitive(Number.NaN)).toBe(true)
      })

      it('should return true for booleans', () => {
        expect(isPrimitive(true)).toBe(true)
        expect(isPrimitive(false)).toBe(true)
      })

      it('should return false for null and undefined', () => {
        expect(isPrimitive(null)).toBe(false)
        expect(isPrimitive(undefined)).toBe(false)
      })

      it('should return false for objects and arrays', () => {
        expect(isPrimitive({})).toBe(false)
        expect(isPrimitive([])).toBe(false)
      })

      it('should return false for symbols', () => {
        expect(isPrimitive(Symbol('test'))).toBe(false)
      })
    })

    describe('isSymbol', () => {
      it('should return true for symbols', () => {
        expect(isSymbol(Symbol())).toBe(true)
        expect(isSymbol(Symbol('named'))).toBe(true)
        expect(isSymbol(Symbol.for('global'))).toBe(true)
        expect(isSymbol(Symbol.iterator)).toBe(true)
      })

      it('should return false for non-symbols', () => {
        expect(isSymbol('Symbol()')).toBe(false)
        expect(isSymbol(null)).toBe(false)
        expect(isSymbol(undefined)).toBe(false)
        expect(isSymbol({})).toBe(false)
      })
    })

    describe('isNaN', () => {
      it('should return true for NaN', () => {
        expect(isNaN(Number.NaN)).toBe(true)
        expect(isNaN(Number.NaN)).toBe(true)
        expect(isNaN(0 / 0)).toBe(true)
      })

      it('should return false for numbers that are not NaN', () => {
        expect(isNaN(0)).toBe(false)
        expect(isNaN(123)).toBe(false)
        expect(isNaN(Infinity)).toBe(false)
        expect(isNaN(-Infinity)).toBe(false)
      })

      it('should return false for non-numbers (unlike global isNaN)', () => {
        expect(isNaN('hello')).toBe(false)
        expect(isNaN(undefined)).toBe(false)
        expect(isNaN({})).toBe(false)
        expect(isNaN(null)).toBe(false)
      })
    })
  })

  describe('mergeDeep', () => {
    it('should return target if no sources', () => {
      const target = { a: 1 }
      expect(mergeDeep(target)).toBe(target)
      expect(target).toEqual({ a: 1 })
    })

    it('should merge simple properties', () => {
      const target: Record<string, number> = { a: 1 }
      const result = mergeDeep(target, { b: 2 })
      expect(result).toEqual({ a: 1, b: 2 })
      expect(result).toBe(target)
    })

    it('should overwrite primitives', () => {
      const target = { a: 1, b: 'old' }
      mergeDeep(target, { a: 2, b: 'new' })
      expect(target).toEqual({ a: 2, b: 'new' })
    })

    it('should deeply merge nested objects', () => {
      const target: Record<string, unknown> = { a: 1, b: { c: 2 } }
      mergeDeep(target, { b: { d: 3 } })
      expect(target).toEqual({ a: 1, b: { c: 2, d: 3 } })
    })

    it('should replace arrays, not merge them', () => {
      const target = { arr: [1, 2, 3] }
      mergeDeep(target, { arr: [4, 5] })
      expect(target).toEqual({ arr: [4, 5] })
    })

    it('should merge multiple sources left to right', () => {
      const target: Record<string, number> = { a: 1 }
      mergeDeep(target, { b: 2 }, { c: 3 }, { a: 4 })
      expect(target).toEqual({ a: 4, b: 2, c: 3 })
    })

    it('should replace non-object target with object from source', () => {
      const target = { a: 'string' } as Record<string, unknown>
      mergeDeep(target, { a: { nested: true } })
      expect(target).toEqual({ a: { nested: true } })
    })

    it('should merge into existing nested objects', () => {
      const target: Record<string, Record<string, unknown>> = { a: { existing: 1 } }
      mergeDeep(target, { a: { nested: true } })
      expect(target).toEqual({ a: { existing: 1, nested: true } })
    })

    it('should handle deeply nested merges', () => {
      const target: Record<string, unknown> = { level1: { level2: { level3: { a: 1 } } } }
      mergeDeep(target, { level1: { level2: { level3: { b: 2 } } } })
      expect(target).toEqual({ level1: { level2: { level3: { a: 1, b: 2 } } } })
    })

    it('should not merge inherited properties', () => {
      const proto = { inherited: true }
      const source = Object.create(proto)
      source.own = 'value'

      const target = {} as Record<string, unknown>
      mergeDeep(target, source)

      expect(target).toEqual({ own: 'value' })
      expect(target.inherited).toBeUndefined()
    })

    it('should handle null and undefined source values', () => {
      const target = { a: 1, b: 2 }
      mergeDeep(target, { a: null, b: undefined } as any)
      expect(target).toEqual({ a: null, b: undefined })
    })

    it('should handle empty objects', () => {
      const target = { a: 1 }
      mergeDeep(target, {})
      expect(target).toEqual({ a: 1 })
    })

    describe('prototype pollution protection', () => {
      it('should ignore __proto__ key', () => {
        const target = {}
        const malicious = JSON.parse('{"__proto__": {"polluted": true}}')
        mergeDeep(target, malicious)

        expect((target as any).__proto__.polluted).toBeUndefined()
        expect(({} as any).polluted).toBeUndefined()
      })

      it('should ignore constructor key', () => {
        const target = {}
        const malicious = JSON.parse('{"constructor": {"prototype": {"polluted": true}}}')
        mergeDeep(target, malicious)

        expect((target as any).constructor).toBe(Object)
        expect(({} as any).polluted).toBeUndefined()
      })

      it('should ignore prototype key', () => {
        const target = {}
        const malicious = { prototype: { polluted: true } }
        mergeDeep(target, malicious as any)

        expect((target as any).prototype).toBeUndefined()
      })

      it('should ignore nested pollution attempts', () => {
        const target: Record<string, unknown> = { nested: {} }
        const malicious = JSON.parse('{"nested": {"__proto__": {"polluted": true}}}')
        mergeDeep(target, malicious)

        expect(({} as any).polluted).toBeUndefined()
      })
    })
  })

  describe('genId', () => {
    it('should return a string', () => {
      expect(typeof genId()).toBe('string')
    })

    it('should return a 7-character string', () => {
      expect(genId()).toHaveLength(7)
    })

    it('should only contain alphanumeric characters', () => {
      const id = genId()
      expect(id).toMatch(/^[a-z0-9]+$/)
    })

    it('should generate unique IDs', () => {
      const ids = new Set(Array.from({ length: 100 }, () => genId()))
      expect(ids.size).toBe(100)
    })
  })

  describe('clamp', () => {
    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(0.5, 0, 1)).toBe(0.5)
    })

    it('should clamp to min when value is below', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(-100, 0, 1)).toBe(0)
    })

    it('should clamp to max when value is above', () => {
      expect(clamp(15, 0, 10)).toBe(10)
      expect(clamp(100, 0, 1)).toBe(1)
    })

    it('should use default min=0 and max=1', () => {
      expect(clamp(0.5)).toBe(0.5)
      expect(clamp(-1)).toBe(0)
      expect(clamp(2)).toBe(1)
    })

    it('should handle equal min and max', () => {
      expect(clamp(5, 3, 3)).toBe(3)
      expect(clamp(1, 3, 3)).toBe(3)
    })

    it('should handle negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5)
      expect(clamp(-15, -10, -1)).toBe(-10)
      expect(clamp(0, -10, -1)).toBe(-1)
    })

    it('should handle boundary values', () => {
      expect(clamp(0, 0, 10)).toBe(0)
      expect(clamp(10, 0, 10)).toBe(10)
    })
  })

  describe('range', () => {
    it('should create array starting from 0 by default', () => {
      expect(range(3)).toEqual([0, 1, 2])
      expect(range(5)).toEqual([0, 1, 2, 3, 4])
    })

    it('should create array starting from specified index', () => {
      expect(range(3, 1)).toEqual([1, 2, 3])
      expect(range(5, 10)).toEqual([10, 11, 12, 13, 14])
    })

    it('should return empty array for length 0', () => {
      expect(range(0)).toEqual([])
      expect(range(0, 10)).toEqual([])
    })

    it('should handle negative start', () => {
      expect(range(3, -2)).toEqual([-2, -1, 0])
    })

    it('should create single element array', () => {
      expect(range(1)).toEqual([0])
      expect(range(1, 5)).toEqual([5])
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should delay function execution', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(99)
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should reset timer on subsequent calls', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      vi.advanceTimersByTime(50)
      debounced()
      vi.advanceTimersByTime(50)
      debounced()
      vi.advanceTimersByTime(50)

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments to the function', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced('arg1', 'arg2')
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should use latest arguments when called multiple times', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced('first')
      debounced('second')
      debounced('third')
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('third')
    })

    describe('clear', () => {
      it('should cancel pending execution', () => {
        const fn = vi.fn()
        const debounced = debounce(fn, 100)

        debounced()
        vi.advanceTimersByTime(50)
        debounced.clear()
        vi.advanceTimersByTime(100)

        expect(fn).not.toHaveBeenCalled()
      })

      it('should be safe to call when no pending execution', () => {
        const fn = vi.fn()
        const debounced = debounce(fn, 100)

        expect(() => debounced.clear()).not.toThrow()
      })
    })

    describe('immediate', () => {
      it('should execute function immediately', () => {
        const fn = vi.fn()
        const debounced = debounce(fn, 100)

        debounced.immediate()
        expect(fn).toHaveBeenCalledTimes(1)
      })

      it('should pass arguments when called immediately', () => {
        const fn = vi.fn()
        const debounced = debounce(fn, 100)

        debounced.immediate('immediate-arg')
        expect(fn).toHaveBeenCalledWith('immediate-arg')
      })

      it('should cancel any pending execution', () => {
        const fn = vi.fn()
        const debounced = debounce(fn, 100)

        debounced('pending')
        vi.advanceTimersByTime(50)
        debounced.immediate('immediate')
        vi.advanceTimersByTime(100)

        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith('immediate')
      })
    })
  })
})
