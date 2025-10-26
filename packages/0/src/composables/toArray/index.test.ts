import { describe, it, expect } from 'vitest'
import { toArray } from './index'

describe('toArray', () => {
  describe('basic conversions', () => {
    it('should convert single primitive value to array', () => {
      expect(toArray('test')).toEqual(['test'])
      expect(toArray(42)).toEqual([42])
      expect(toArray(true)).toEqual([true])
      expect(toArray(false)).toEqual([false])
    })

    it('should return array as-is when already an array', () => {
      const arr = [1, 2, 3]
      const result = toArray(arr)

      expect(result).toBe(arr)
      expect(result).toEqual([1, 2, 3])
    })

    it('should convert single object to array', () => {
      const obj = { name: 'test' }
      const result = toArray(obj)

      expect(result).toEqual([obj])
      expect(result[0]).toBe(obj)
    })
  })

  describe('null and undefined handling', () => {
    it('should convert null to empty array', () => {
      expect(toArray(null)).toEqual([])
    })

    it('should convert undefined to empty array', () => {
      expect(toArray(undefined)).toEqual([])
    })

    it('should handle null in type union', () => {
      const value: string | null = null
      const result = toArray(value)

      expect(result).toEqual([])
    })

    it('should handle undefined in type union', () => {
      const value: number | undefined = undefined
      const result = toArray(value)

      expect(result).toEqual([])
    })
  })

  describe('array handling', () => {
    it('should handle empty arrays', () => {
      const arr: string[] = []
      const result = toArray(arr)

      expect(result).toBe(arr)
      expect(result).toEqual([])
    })

    it('should handle arrays of primitives', () => {
      expect(toArray([1, 2, 3])).toEqual([1, 2, 3])
      expect(toArray(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
      expect(toArray([true, false])).toEqual([true, false])
    })

    it('should handle arrays of objects', () => {
      const objs = [{ id: 1 }, { id: 2 }]
      const result = toArray(objs)

      expect(result).toBe(objs)
      expect(result).toEqual(objs)
    })

    it('should handle nested arrays', () => {
      const nested = [[1, 2], [3, 4]]
      const result = toArray(nested)

      expect(result).toBe(nested)
      expect(result).toEqual([[1, 2], [3, 4]])
    })
  })

  describe('special values', () => {
    it('should handle zero', () => {
      expect(toArray(0)).toEqual([0])
    })

    it('should handle empty string', () => {
      expect(toArray('')).toEqual([''])
    })

    it('should handle NaN', () => {
      const result = toArray(Number.NaN)

      expect(result).toHaveLength(1)
      expect(Number.isNaN(result[0])).toBe(true)
    })

    it('should handle Infinity', () => {
      expect(toArray(Infinity)).toEqual([Infinity])
      expect(toArray(-Infinity)).toEqual([-Infinity])
    })
  })

  describe('edge cases', () => {
    it('should handle symbols', () => {
      const sym = Symbol('test')
      const result = toArray(sym)

      expect(result).toEqual([sym])
      expect(result[0]).toBe(sym)
    })

    it('should handle functions', () => {
      const fn = () => 'test'
      const result = toArray(fn)

      expect(result).toEqual([fn])
      expect(result[0]).toBe(fn)
    })

    it('should handle Date objects', () => {
      const date = new Date('2024-01-01')
      const result = toArray(date)

      expect(result).toEqual([date])
      expect(result[0]).toBe(date)
    })

    it('should handle RegExp objects', () => {
      const regex = /test/
      const result = toArray(regex)

      expect(result).toEqual([regex])
      expect(result[0]).toBe(regex)
    })

    it('should handle Map objects', () => {
      const map = new Map([['key', 'value']])
      const result = toArray(map)

      expect(result).toEqual([map])
      expect(result[0]).toBe(map)
    })

    it('should handle Set objects', () => {
      const set = new Set([1, 2, 3])
      const result = toArray(set)

      expect(result).toEqual([set])
      expect(result[0]).toBe(set)
    })

    it('should handle class instances', () => {
      class TestClass {
        constructor (public value: string) {}
      }
      const instance = new TestClass('test')
      const result = toArray(instance)

      expect(result).toEqual([instance])
      expect(result[0]).toBe(instance)
    })
  })
})
