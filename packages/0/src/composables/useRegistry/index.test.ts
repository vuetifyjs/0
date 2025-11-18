// Composables
import { useRegistry } from './index'

// Utilities
import { describe, it, expect, vi } from 'vitest'

describe('useRegistry', () => {
  describe('registration', () => {
    it('should register an item with nothing', () => {
      const registry = useRegistry()
      const ticket = registry.register()

      expect(ticket).toBeDefined()
      expect(ticket.id).toBeDefined()
      expect(ticket.index).toBe(0)
      expect(registry.collection.size).toBe(1)
    })

    it('should upsert an item', () => {
      const registry = useRegistry()
      const ticket = registry.upsert('item-1', { value: 'value-1' })

      expect(ticket).toBeDefined()
      expect(ticket.id).toBeDefined()
      expect(ticket.index).toBe(0)
      expect(registry.collection.size).toBe(1)
    })

    it('should register an item with a custom id', () => {
      const registry = useRegistry()
      const ticket = registry.register({ id: 'test-id' })

      expect(ticket).toBeDefined()
      expect(ticket.id).toBe('test-id')
      expect(ticket.index).toBe(0)
      expect(registry.collection.size).toBe(1)
    })

    it('should register an item with a custom value', () => {
      const registry = useRegistry()
      const ticket = registry.register({ value: 'test-value' })

      expect(ticket).toBeDefined()
      expect(ticket.value).toBe('test-value')
      expect(ticket.index).toBe(0)
      expect(registry.collection.size).toBe(1)
    })

    it('should unregister an item by id', () => {
      const registry = useRegistry()
      const ticket = registry.register()

      expect(registry.collection.size).toBe(1)

      registry.unregister(ticket.id)

      expect(registry.collection.size).toBe(0)
    })

    it('should onboard multiple items at once', () => {
      const registry = useRegistry()
      const tickets = registry.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-2' },
      ])

      expect(tickets.length).toBe(3)
      expect(registry.collection.size).toBe(3)

      const item1 = registry.get('item-1')
      const item2 = registry.get('item-2')

      expect(item1?.value).toBe('value-1')
      expect(item2?.value).toBe('value-2')
    })

    it('should not remove an item if unregistering a non-existent id', () => {
      const registry = useRegistry()
      const tickets = registry.onboard([
        { id: 'item-1', value: 1, valueIsIndex: true },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-2' },
      ])

      expect(tickets.length).toBe(3)
      registry.unregister('non-existent-id')
      expect(registry.collection.size).toBe(3)
    })
  })

  describe('collection management', () => {
    it('should find an item by id', () => {
      const registry = useRegistry()
      registry.register({ id: 'find-me' })

      const found = registry.get('find-me')

      expect(found).toBeDefined()
      expect(found?.id).toBe('find-me')
    })

    it('should lookup an items ID by index', () => {
      const registry = useRegistry()
      registry.register({ id: 'lookup-me', index: 1 })

      const found = registry.lookup(1)

      expect(found).toBeDefined()
      expect(found).toBe('lookup-me')
    })

    it('should browse an items ID by value', () => {
      const registry = useRegistry()
      registry.register({ id: 'browse-me', value: 'test-value' })

      const found = registry.browse('test-value')

      expect(found).toBeDefined()
      expect(found).toBe('browse-me')
    })

    it('should return if an item exists in the collection', () => {
      const registry = useRegistry()

      expect(registry.has('exists-me')).toBe(false)

      registry.register({ id: 'exists-me' })

      expect(registry.has('exists-me')).toBe(true)
    })

    it('should reset a directory and catalog', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1', index: 2, value: 'value-1' })
      registry.register({ id: 'item-2', index: 3, value: 'value-2' })
      registry.register({ id: 'item-3', index: 4, valueIsIndex: true })

      expect(registry.lookup(2)).toBe('item-1')
      expect(registry.get('item-1')?.index).toBe(2)

      registry.reindex()

      expect(registry.lookup(3)).toBeUndefined()
      expect(registry.get('item-1')?.index).toBe(0)
      expect(registry.get('item-3')?.value).toBe(2)
    })

    it('should clear the entire registry', () => {
      const registry = useRegistry()
      registry.register()

      expect(registry.collection.size).toBe(1)

      registry.clear()

      expect(registry.collection.size).toBe(0)
    })

    it('should update an existing item', () => {
      const registry = useRegistry()
      const ticket = registry.register({ id: 'update-me', value: 'initial' })

      expect(ticket.value).toBe('initial')

      let updated = registry.upsert('update-me', { value: 'updated' })

      expect(updated.valueIsIndex).toBe(false)
      expect(updated.value).toBe('updated')

      updated = registry.upsert('update-me', { value: undefined })

      expect(updated.valueIsIndex).toBe(true)
      expect(updated.value).toBe(updated.index)
    })
  })

  describe('Catalog management', () => {
    it('Catalogs tickets with duplicate values', () => {
      const registry = useRegistry()
      registry.onboard([{ id: 'item-1', value: 'value-1' }, { id: 'item-2', value: 'value-2' }, { id: 'dupe-item-1', value: 'value-1', valueIsIndex: true }])
      const ids = registry.browse('value-1')
      expect(ids).toEqual(['item-1', 'dupe-item-1'])

      registry.unregister('dupe-item-1')
      const idsAfterUnregister = registry.browse('value-1')
      expect(idsAfterUnregister).toEqual('item-1')
    })
  })

  describe('Event emission', () => {
    it('should not emit events when events option is disabled', () => {
      const registry = useRegistry({ events: false })
      const listener = vi.fn()
      const warnSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      registry.on('register:ticket', listener)
      registry.register({ id: 'test' })

      expect(listener).not.toHaveBeenCalled()

      warnSpy.mockRestore()
    })

    it('should emit register:ticket event when enabled', () => {
      const registry = useRegistry({ events: true })
      const listener = vi.fn()

      registry.on('register:ticket', listener)
      const ticket = registry.register({ id: 'test-id', value: 'test-value' })

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith(ticket)
    })

    it('should emit unregister:ticket event when enabled', () => {
      const registry = useRegistry({ events: true })
      const listener = vi.fn()

      const ticket = registry.register({ id: 'test-id' })
      registry.on('unregister:ticket', listener)
      registry.unregister('test-id')

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith(ticket)
    })

    it('should emit update:ticket event when upserting existing ticket', () => {
      const registry = useRegistry({ events: true })
      const listener = vi.fn()

      registry.register({ id: 'test-id', value: 'initial' })
      registry.on('update:ticket', listener)
      const updated = registry.upsert('test-id', { value: 'updated' })

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith(updated)
    })

    it('should emit clear:registry event when clearing', () => {
      const registry = useRegistry({ events: true })
      const listener = vi.fn()

      registry.register({ id: 'test-id' })
      registry.on('clear:registry', listener)
      registry.clear()

      expect(listener).toHaveBeenCalledOnce()
    })

    it('should remove event listener with off', () => {
      const registry = useRegistry({ events: true })
      const listener = vi.fn()

      registry.on('register:ticket', listener)
      registry.register({ id: 'test-1' })
      expect(listener).toHaveBeenCalledOnce()

      registry.off('register:ticket', listener)
      registry.register({ id: 'test-2' })
      expect(listener).toHaveBeenCalledOnce()
    })

    it('should support custom events with emit', () => {
      const registry = useRegistry({ events: true })
      const listener = vi.fn()

      registry.on('custom-event', listener)
      registry.emit('custom-event', { data: 'test' })

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith({ data: 'test' })
    })

    it('should warn when attempting to register listener without events enabled', () => {
      const registry = useRegistry({ events: false })
      const warnSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      registry.on('register:ticket', vi.fn())

      warnSpy.mockRestore()
    })

    it('should support multiple listeners for same event', () => {
      const registry = useRegistry({ events: true })
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      registry.on('register:ticket', listener1)
      registry.on('register:ticket', listener2)
      registry.register({ id: 'test' })

      expect(listener1).toHaveBeenCalledOnce()
      expect(listener2).toHaveBeenCalledOnce()
    })
  })

  describe('Cache management', () => {
    it('should cache keys, values, and entries', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1' })
      registry.register({ id: 'item-2' })

      const keys1 = registry.keys()
      const keys2 = registry.keys()
      expect(keys1).toBe(keys2)

      const values1 = registry.values()
      const values2 = registry.values()
      expect(values1).toBe(values2)

      const entries1 = registry.entries()
      const entries2 = registry.entries()
      expect(entries1).toBe(entries2)
    })

    it('should invalidate cache on register', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1' })

      const keys1 = registry.keys()
      registry.register({ id: 'item-2' })
      const keys2 = registry.keys()

      expect(keys1).not.toBe(keys2)
      expect(keys1.length).toBe(1)
      expect(keys2.length).toBe(2)
    })

    it('should invalidate cache on unregister', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1' })
      registry.register({ id: 'item-2' })

      const keys1 = registry.keys()
      registry.unregister('item-1')
      const keys2 = registry.keys()

      expect(keys1).not.toBe(keys2)
      expect(keys1.length).toBe(2)
      expect(keys2.length).toBe(1)
    })

    it('should invalidate cache on clear', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1' })

      const keys1 = registry.keys()
      registry.clear()
      const keys2 = registry.keys()

      expect(keys1).not.toBe(keys2)
      expect(keys1.length).toBe(1)
      expect(keys2.length).toBe(0)
    })

    it('should invalidate cache on upsert', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1' })

      const keys1 = registry.keys()
      registry.upsert('item-2', { value: 'new' })
      const keys2 = registry.keys()

      expect(keys1).not.toBe(keys2)
    })
  })

  describe('Seek functionality', () => {
    it('should seek first ticket without predicate', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1', value: 'a' })
      registry.register({ id: 'item-2', value: 'b' })
      registry.register({ id: 'item-3', value: 'c' })

      const first = registry.seek('first')
      expect(first?.id).toBe('item-1')
    })

    it('should seek last ticket without predicate', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1', value: 'a' })
      registry.register({ id: 'item-2', value: 'b' })
      registry.register({ id: 'item-3', value: 'c' })

      const last = registry.seek('last')
      expect(last?.id).toBe('item-3')
    })

    it('should seek first ticket with predicate', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1', value: 'apple' })
      registry.register({ id: 'item-2', value: 'banana' })
      registry.register({ id: 'item-3', value: 'cherry' })

      const found = registry.seek('first', undefined, ticket => (ticket.value as string).startsWith('b'))
      expect(found?.id).toBe('item-2')
    })

    it('should seek last ticket with predicate', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1', value: 'apple' })
      registry.register({ id: 'item-2', value: 'banana' })
      registry.register({ id: 'item-3', value: 'apricot' })

      const found = registry.seek('last', undefined, ticket => (ticket.value as string).startsWith('a'))
      expect(found?.id).toBe('item-3')
    })

    it('should seek from specific index', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1', value: 'a' })
      registry.register({ id: 'item-2', value: 'b' })
      registry.register({ id: 'item-3', value: 'c' })

      const found = registry.seek('first', 1)
      expect(found?.id).toBe('item-2')
    })

    it('should return undefined when no ticket matches predicate', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1', value: 'a' })

      const found = registry.seek('first', undefined, ticket => ticket.value === 'z')
      expect(found).toBeUndefined()
    })

    it('should return undefined for empty registry', () => {
      const registry = useRegistry()
      const found = registry.seek('first')
      expect(found).toBeUndefined()
    })

    it('should clamp from index to valid range', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1' })
      registry.register({ id: 'item-2' })

      const found1 = registry.seek('first', 100)
      expect(found1?.id).toBe('item-2')

      const found2 = registry.seek('first', -100)
      expect(found2?.id).toBe('item-1')
    })
  })

  describe('Dispose functionality', () => {
    it('should clear collection and listeners on dispose', () => {
      const registry = useRegistry({ events: true })
      const listener = vi.fn()

      registry.register({ id: 'item-1' })
      registry.on('register:ticket', listener)

      expect(registry.size).toBe(1)

      registry.dispose()

      expect(registry.size).toBe(0)
      registry.register({ id: 'item-2' })
      expect(listener).not.toHaveBeenCalled()
    })

    it('should not throw when disposing registry without events', () => {
      const registry = useRegistry({ events: false })
      registry.register({ id: 'item-1' })

      expect(() => registry.dispose()).not.toThrow()
      expect(registry.size).toBe(0)
    })
  })

  describe('Edge cases', () => {
    it('should handle registering duplicate IDs by returning existing ticket', () => {
      const registry = useRegistry()
      const warnSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const ticket1 = registry.register({ id: 'duplicate', value: 'first' })
      const ticket2 = registry.register({ id: 'duplicate', value: 'second' })

      expect(ticket1).toBe(ticket2)
      expect(registry.size).toBe(1)
      expect(ticket1.value).toBe('first')

      warnSpy.mockRestore()
    })

    it('should handle null value in browse', () => {
      const registry = useRegistry()
      registry.register({ id: 'item-1', value: null })

      const found = registry.browse(null)
      expect(found).toBe('item-1')
    })

    it('should handle complex objects as values', () => {
      const registry = useRegistry()
      const obj1 = { nested: { data: 'test' } }
      const obj2 = { nested: { data: 'test' } }

      registry.register({ id: 'item-1', value: obj1 })
      registry.register({ id: 'item-2', value: obj2 })

      expect(registry.browse(obj1)).toBe('item-1')
      expect(registry.browse(obj2)).toBe('item-2')
    })

    it('should maintain index integrity after multiple operations', () => {
      const registry = useRegistry()

      registry.register({ id: 'item-1' })
      registry.register({ id: 'item-2' })
      registry.register({ id: 'item-3' })
      registry.unregister('item-2')
      registry.register({ id: 'item-4' })

      expect(registry.get('item-1')?.index).toBe(0)
      expect(registry.get('item-3')?.index).toBe(1)
      expect(registry.get('item-4')?.index).toBe(2)
    })

    it('should handle size property correctly', () => {
      const registry = useRegistry()

      expect(registry.size).toBe(0)

      registry.register({ id: 'item-1' })
      expect(registry.size).toBe(1)

      registry.register({ id: 'item-2' })
      expect(registry.size).toBe(2)

      registry.unregister('item-1')
      expect(registry.size).toBe(1)

      registry.clear()
      expect(registry.size).toBe(0)
    })
  })
})
