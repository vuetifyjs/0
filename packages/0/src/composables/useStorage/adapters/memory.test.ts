import { beforeEach, describe, expect, it } from 'vitest'

import { MemoryAdapter } from './memory'

describe('memoryAdapter', () => {
  let adapter: MemoryAdapter

  beforeEach(() => {
    adapter = new MemoryAdapter()
  })

  describe('constructor', () => {
    it('should start with empty storage', () => {
      expect(adapter.length).toBe(0)
    })
  })

  describe('getItem', () => {
    it('should return null for non-existent keys', () => {
      expect(adapter.getItem('nonexistent')).toBeNull()
    })

    it('should retrieve stored items', () => {
      adapter.setItem('key', 'value')

      expect(adapter.getItem('key')).toBe('value')
    })
  })

  describe('setItem', () => {
    it('should store and retrieve items', () => {
      adapter.setItem('key', 'value')

      expect(adapter.getItem('key')).toBe('value')
      expect(adapter.length).toBe(1)
    })

    it('should overwrite existing items', () => {
      adapter.setItem('key', 'value1')
      adapter.setItem('key', 'value2')

      expect(adapter.getItem('key')).toBe('value2')
      expect(adapter.length).toBe(1)
    })

    it('should store multiple keys independently', () => {
      adapter.setItem('user', 'john')
      adapter.setItem('theme', 'dark')
      adapter.setItem('locale', 'en-US')

      expect(adapter.length).toBe(3)
      expect(adapter.getItem('user')).toBe('john')
      expect(adapter.getItem('theme')).toBe('dark')
      expect(adapter.getItem('locale')).toBe('en-US')
    })
  })

  describe('removeItem', () => {
    it('should remove items', () => {
      adapter.setItem('key', 'value')
      adapter.removeItem('key')

      expect(adapter.getItem('key')).toBeNull()
      expect(adapter.length).toBe(0)
    })

    it('should handle removing non-existent keys gracefully', () => {
      expect(() => adapter.removeItem('nonexistent')).not.toThrow()
    })

    it('should only remove specified key', () => {
      adapter.setItem('user', 'john')
      adapter.setItem('theme', 'dark')
      adapter.setItem('locale', 'en-US')

      adapter.removeItem('theme')

      expect(adapter.length).toBe(2)
      expect(adapter.getItem('theme')).toBeNull()
    })
  })

  describe('key', () => {
    it('should return key at index', () => {
      adapter.setItem('first', 'a')
      adapter.setItem('second', 'b')
      adapter.setItem('third', 'c')

      expect(adapter.key(0)).toBe('first')
      expect(adapter.key(1)).toBe('second')
      expect(adapter.key(2)).toBe('third')
    })

    it('should return empty string for out of bounds index', () => {
      adapter.setItem('key', 'value')

      expect(adapter.key(5)).toBe('')
      expect(adapter.key(-1)).toBe('')
    })
  })

  describe('edge cases', () => {
    it('should handle JSON serialized values', () => {
      const data = { name: 'test', count: 42 }

      adapter.setItem('json', JSON.stringify(data))
      const retrieved = JSON.parse(adapter.getItem('json')!)

      expect(retrieved).toEqual(data)
    })
  })
})
