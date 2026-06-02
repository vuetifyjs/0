import { describe, expect, it } from 'vitest'

import { ServerComboboxAdapter } from './server'

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

describe('serverComboboxAdapter', () => {
  describe('instantiation', () => {
    it('should construct without error', () => {
      const adapter = new ServerComboboxAdapter()

      expect(adapter).toBeInstanceOf(ServerComboboxAdapter)
      expect(typeof adapter.setup).toBe('function')
    })
  })

  describe('setup', () => {
    it('should return a result with filtered, isLoading, and isEmpty refs', () => {
      const adapter = new ServerComboboxAdapter()
      const result = adapter.setup(createContext())

      expect(result).toBeDefined()
      expect(result.filtered).toBeDefined()
      expect(result.isLoading).toBeDefined()
      expect(result.isEmpty).toBeDefined()
    })

    it('should expose isLoading as a writable shallowRef defaulting to false', () => {
      const adapter = new ServerComboboxAdapter()
      const result = adapter.setup(createContext())

      expect(result.isLoading.value).toBe(false)
      result.isLoading.value = true
      expect(result.isLoading.value).toBe(true)
    })

    it('should expose all item ids as filtered (pass-through, no filtering)', () => {
      const adapter = new ServerComboboxAdapter()
      const items = [
        makeTicket('a', 'Apple'),
        makeTicket('b', 'Banana'),
        makeTicket('c', 'Cherry'),
      ]
      const result = adapter.setup(createContext(items))

      expect(result.filtered.value.size).toBe(3)
      expect(result.filtered.value.has('a')).toBe(true)
      expect(result.filtered.value.has('b')).toBe(true)
      expect(result.filtered.value.has('c')).toBe(true)
    })

    it('should ignore the query (no client-side filtering)', () => {
      const adapter = new ServerComboboxAdapter()
      const items = [
        makeTicket('a', 'Apple'),
        makeTicket('b', 'Banana'),
      ]
      const result = adapter.setup(createContext(items, 'xyz'))

      expect(result.filtered.value.size).toBe(2)
    })

    it('should expose isEmpty as true when no items are registered', () => {
      const adapter = new ServerComboboxAdapter()
      const result = adapter.setup(createContext([]))

      expect(result.isEmpty.value).toBe(true)
      expect(result.filtered.value.size).toBe(0)
    })

    it('should expose isEmpty as false when items are registered', () => {
      const adapter = new ServerComboboxAdapter()
      const result = adapter.setup(createContext([makeTicket('a', 'Apple')]))

      expect(result.isEmpty.value).toBe(false)
    })

    it('should track item changes reactively', () => {
      const adapter = new ServerComboboxAdapter()
      const items = shallowRef<SelectionTicket[]>([])
      const result = adapter.setup({
        query: shallowRef(''),
        items,
      })

      expect(result.filtered.value.size).toBe(0)
      expect(result.isEmpty.value).toBe(true)

      items.value = [makeTicket('a', 'Apple'), makeTicket('b', 'Banana')]

      expect(result.filtered.value.size).toBe(2)
      expect(result.isEmpty.value).toBe(false)
    })
  })
})
