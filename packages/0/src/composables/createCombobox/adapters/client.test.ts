import { describe, expect, it, vi } from 'vitest'

import { ClientComboboxAdapter } from './client'

// Utilities
import { shallowRef } from 'vue'

// Types
import type { SelectionTicket } from '#v0/composables/createSelection'
import type { ComboboxAdapterContext } from './adapter'

function createContext (
  items: SelectionTicket[] = [],
  query = '',
): ComboboxAdapterContext {
  return {
    query: shallowRef(query),
    items: shallowRef(items),
  }
}

function makeTicket (id: string, value: unknown): SelectionTicket {
  return { id, value } as SelectionTicket
}

describe('clientComboboxAdapter', () => {
  describe('instantiation', () => {
    it('should construct without options', () => {
      const adapter = new ClientComboboxAdapter()

      expect(adapter).toBeInstanceOf(ClientComboboxAdapter)
      expect(typeof adapter.setup).toBe('function')
    })

    it('should accept options', () => {
      const adapter = new ClientComboboxAdapter({ mode: 'every' })

      expect(adapter).toBeInstanceOf(ClientComboboxAdapter)
    })
  })

  describe('setup', () => {
    it('should return filtered, isLoading, and isEmpty', () => {
      const adapter = new ClientComboboxAdapter()
      const result = adapter.setup(createContext())

      expect(result.filtered).toBeDefined()
      expect(result.isLoading).toBeDefined()
      expect(result.isEmpty).toBeDefined()
      expect(result.isLoading.value).toBe(false)
    })

    it('should return all ids when query is empty', () => {
      const adapter = new ClientComboboxAdapter()
      const items = [
        makeTicket('a', 'Apple'),
        makeTicket('b', 'Banana'),
      ]
      const result = adapter.setup(createContext(items))

      expect(result.filtered.value.size).toBe(2)
    })

    it('should report isEmpty when no items match', () => {
      const adapter = new ClientComboboxAdapter()
      const items = [makeTicket('a', 'Apple')]
      const ctx = createContext(items, 'zzz')
      const result = adapter.setup(ctx)

      expect(result.filtered.value.size).toBe(0)
      expect(result.isEmpty.value).toBe(true)
    })
  })

  describe('customFilter option', () => {
    it('should invoke the customFilter callback with stringified query and item value', () => {
      const customFilter = vi.fn((query: string, value: unknown) => {
        return String(value).toLowerCase().includes(query.toLowerCase())
      })
      const adapter = new ClientComboboxAdapter({ filter: customFilter })
      const items = [
        makeTicket('a', 'Apple'),
        makeTicket('b', 'Banana'),
        makeTicket('c', 'Cherry'),
      ]
      const ctx = createContext(items, 'an')
      const result = adapter.setup(ctx)

      // Trigger evaluation of the filtered computed
      const ids = result.filtered.value

      expect(customFilter).toHaveBeenCalled()
      // 'an' matches Banana
      expect(ids.has('b')).toBe(true)
      expect(ids.has('a')).toBe(false)
      expect(ids.has('c')).toBe(false)
    })

    it('should pass query through String() and forward to customFilter', () => {
      const customFilter = vi.fn((_q: string, _v: unknown) => true)
      const adapter = new ClientComboboxAdapter({ filter: customFilter })
      const items = [makeTicket('a', 'Apple')]
      const ctx = createContext(items, 'abc')
      const result = adapter.setup(ctx)

      void result.filtered.value

      expect(customFilter).toHaveBeenCalled()
      const firstCall = customFilter.mock.calls[0]!
      expect(typeof firstCall[0]).toBe('string')
      expect(firstCall[0]).toBe('abc')
    })
  })

  describe('keys option', () => {
    it('should filter object values by configured keys', () => {
      const adapter = new ClientComboboxAdapter({ keys: ['name'] })
      const items = [
        makeTicket('a', { name: 'Apple', desc: 'red fruit' }),
        makeTicket('b', { name: 'Banana', desc: 'yellow fruit' }),
      ]
      const ctx = createContext(items, 'app')
      const result = adapter.setup(ctx)

      expect(result.filtered.value.has('a')).toBe(true)
      expect(result.filtered.value.has('b')).toBe(false)
    })
  })
})
