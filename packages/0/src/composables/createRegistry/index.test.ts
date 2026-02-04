import { describe, expect, it, vi } from 'vitest'

// Utilities
import { isReactive, nextTick, watchEffect } from 'vue'

import { createRegistry, createRegistryContext } from './index'

describe('createRegistry', () => {
  describe('registration', () => {
    it('should register an item with nothing', () => {
      const registry = createRegistry()
      const ticket = registry.register()

      expect(ticket).toBeDefined()
      expect(ticket.id).toBeDefined()
      expect(ticket.index).toBe(0)
      expect(registry.collection.size).toBe(1)
    })

    it('should upsert an item', () => {
      const registry = createRegistry()
      const ticket = registry.upsert('item-1', { value: 'value-1' })

      expect(ticket).toBeDefined()
      expect(ticket.id).toBeDefined()
      expect(ticket.index).toBe(0)
      expect(registry.collection.size).toBe(1)
    })

    it('should register an item with a custom id', () => {
      const registry = createRegistry()
      const ticket = registry.register({ id: 'test-id' })

      expect(ticket).toBeDefined()
      expect(ticket.id).toBe('test-id')
      expect(ticket.index).toBe(0)
      expect(registry.collection.size).toBe(1)
    })

    it('should register an item with a custom value', () => {
      const registry = createRegistry()
      const ticket = registry.register({ value: 'test-value' })

      expect(ticket).toBeDefined()
      expect(ticket.value).toBe('test-value')
      expect(ticket.index).toBe(0)
      expect(registry.collection.size).toBe(1)
    })

    it('should unregister an item by id', () => {
      const registry = createRegistry()
      const ticket = registry.register()

      expect(registry.collection.size).toBe(1)

      registry.unregister(ticket.id)

      expect(registry.collection.size).toBe(0)
    })

    it('should onboard multiple items at once', () => {
      const registry = createRegistry()
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

    it('should offboard multiple items at once', () => {
      const registry = createRegistry()
      registry.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      expect(registry.size).toBe(3)

      registry.offboard(['item-1', 'item-3'])

      expect(registry.size).toBe(1)
      expect(registry.has('item-1')).toBe(false)
      expect(registry.has('item-2')).toBe(true)
      expect(registry.has('item-3')).toBe(false)
    })

    it('should skip non-existent ids when offboarding', () => {
      const registry = createRegistry()
      registry.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      registry.offboard(['item-1', 'non-existent', 'item-2'])

      expect(registry.size).toBe(0)
    })

    it('should update indexes correctly after offboard', () => {
      const registry = createRegistry()
      registry.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      registry.offboard(['item-1'])

      expect(registry.lookup(0)).toBe('item-2')
      expect(registry.lookup(1)).toBe('item-3')
      expect(registry.get('item-2')?.index).toBe(0)
      expect(registry.get('item-3')?.index).toBe(1)
    })

    it('should emit events for each offboarded item', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      registry.on('unregister:ticket', listener)
      registry.offboard(['item-1', 'item-3'])

      expect(listener).toHaveBeenCalledTimes(2)
    })

    it('should not remove an item if unregistering a non-existent id', () => {
      const registry = createRegistry()
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
      const registry = createRegistry()
      registry.register({ id: 'find-me' })

      const found = registry.get('find-me')

      expect(found).toBeDefined()
      expect(found?.id).toBe('find-me')
    })

    it('should lookup an items ID by index', () => {
      const registry = createRegistry()
      registry.register({ id: 'lookup-me', index: 1 })

      const found = registry.lookup(1)

      expect(found).toBeDefined()
      expect(found).toBe('lookup-me')
    })

    it('should browse an items ID by value', () => {
      const registry = createRegistry()
      registry.register({ id: 'browse-me', value: 'test-value' })

      const found = registry.browse('test-value')

      expect(found).toBeDefined()
      expect(found).toEqual(['browse-me'])
    })

    it('should return if an item exists in the collection', () => {
      const registry = createRegistry()

      expect(registry.has('exists-me')).toBe(false)

      registry.register({ id: 'exists-me' })

      expect(registry.has('exists-me')).toBe(true)
    })

    it('should reset a directory and catalog', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', index: 2, value: 'value-1' })
      registry.register({ id: 'item-2', index: 3, value: 'value-2' })
      registry.register({ id: 'item-3', index: 4 })

      expect(registry.lookup(2)).toBe('item-1')
      expect(registry.get('item-1')?.index).toBe(2)

      registry.reindex()

      expect(registry.lookup(3)).toBeUndefined()
      expect(registry.get('item-1')?.index).toBe(0)
      expect(registry.get('item-3')?.value).toBe(2)
      // Verify catalog is updated after reindex for valueIsIndex tickets
      expect(registry.browse(2)).toEqual(['item-3'])
    })

    it('should partially reindex from dirty index when unregistering', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1' }) // valueIsIndex: true, value: 0
      registry.register({ id: 'item-2' }) // valueIsIndex: true, value: 1
      registry.register({ id: 'item-3' }) // valueIsIndex: true, value: 2

      // Unregister from middle triggers partial reindex
      registry.unregister('item-1')

      // Remaining items should have updated indexes and values
      expect(registry.get('item-2')?.index).toBe(0)
      expect(registry.get('item-2')?.value).toBe(0)
      expect(registry.get('item-3')?.index).toBe(1)
      expect(registry.get('item-3')?.value).toBe(1)

      // Catalog should be updated correctly
      expect(registry.browse(0)).toEqual(['item-2'])
      expect(registry.browse(1)).toEqual(['item-3'])
    })

    it('should trigger lazy reindex via browse when needed', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1' }) // valueIsIndex: true
      registry.register({ id: 'item-2' }) // valueIsIndex: true
      registry.register({ id: 'item-3' }) // valueIsIndex: true

      // Offboard sets needsReindex but doesn't immediately reindex
      registry.offboard(['item-1'])

      // browse() should trigger lazy reindex when indexDependentCount > 0
      expect(registry.browse(0)).toEqual(['item-2'])
      expect(registry.browse(1)).toEqual(['item-3'])
    })

    it('should clear the entire registry', () => {
      const registry = createRegistry()
      registry.register()

      expect(registry.collection.size).toBe(1)

      registry.clear()

      expect(registry.collection.size).toBe(0)
    })

    it('should update an existing item', () => {
      const registry = createRegistry()
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

  describe('catalog management', () => {
    it('should catalog tickets with duplicate values', () => {
      const registry = createRegistry()
      registry.onboard([{ id: 'item-1', value: 'value-1' }, { id: 'item-2', value: 'value-2' }, { id: 'dupe-item-1', value: 'value-1', valueIsIndex: true }])
      const ids = registry.browse('value-1')
      expect(ids).toEqual(['item-1', 'dupe-item-1'])

      registry.unregister('dupe-item-1')
      const idsAfterUnregister = registry.browse('value-1')
      expect(idsAfterUnregister).toEqual(['item-1'])
    })

    it('should return undefined when browsing non-existent value', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: 'exists' })

      expect(registry.browse('non-existent')).toBeUndefined()
      expect(registry.browse(999)).toBeUndefined()
      expect(registry.browse(null)).toBeUndefined()
    })
  })

  describe('event emission', () => {
    it('should not emit events when events option is disabled', () => {
      const registry = createRegistry({ events: false })
      const listener = vi.fn()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      registry.on('register:ticket', listener)
      registry.register({ id: 'test' })

      expect(listener).not.toHaveBeenCalled()
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Events are disabled'))

      warnSpy.mockRestore()
    })

    it('should emit register:ticket event when enabled', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.on('register:ticket', listener)
      const ticket = registry.register({ id: 'test-id', value: 'test-value' })

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith(ticket)
    })

    it('should emit unregister:ticket event when enabled', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      const ticket = registry.register({ id: 'test-id' })
      registry.on('unregister:ticket', listener)
      registry.unregister('test-id')

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith(ticket)
    })

    it('should emit update:ticket event when upserting existing ticket', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.register({ id: 'test-id', value: 'initial' })
      registry.on('update:ticket', listener)
      const updated = registry.upsert('test-id', { value: 'updated' })

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith(updated)
    })

    it('should emit clear:registry event when clearing', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.register({ id: 'test-id' })
      registry.on('clear:registry', listener)
      registry.clear()

      expect(listener).toHaveBeenCalledOnce()
    })

    it('should emit reindex:registry event when reindexing', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.onboard([
        { id: 'item-1', index: 5 },
        { id: 'item-2', index: 10 },
      ])

      registry.on('reindex:registry', listener)
      registry.reindex()

      expect(listener).toHaveBeenCalledOnce()
    })

    it('should remove event listener with off', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.on('register:ticket', listener)
      registry.register({ id: 'test-1' })
      expect(listener).toHaveBeenCalledOnce()

      registry.off('register:ticket', listener)
      registry.register({ id: 'test-2' })
      expect(listener).toHaveBeenCalledOnce()
    })

    it('should support custom events with emit', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.on('custom-event', listener)
      registry.emit('custom-event', { data: 'test' })

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith({ data: 'test' })
    })

    it('should warn when attempting to register listener without events enabled', () => {
      const registry = createRegistry({ events: false })
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      registry.on('register:ticket', vi.fn())

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Events are disabled'))

      warnSpy.mockRestore()
    })

    it('should warn when attempting to remove listener without events enabled', () => {
      const registry = createRegistry({ events: false })
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      registry.off('register:ticket', vi.fn())

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Events are disabled'))

      warnSpy.mockRestore()
    })

    it('should support multiple listeners for same event', () => {
      const registry = createRegistry({ events: true })
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      registry.on('register:ticket', listener1)
      registry.on('register:ticket', listener2)
      registry.register({ id: 'test' })

      expect(listener1).toHaveBeenCalledOnce()
      expect(listener2).toHaveBeenCalledOnce()
    })
  })

  describe('cache management', () => {
    it('should cache keys, values, and entries', () => {
      const registry = createRegistry()
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
      const registry = createRegistry()
      registry.register({ id: 'item-1' })

      const keys1 = registry.keys()
      registry.register({ id: 'item-2' })
      const keys2 = registry.keys()

      expect(keys1).not.toBe(keys2)
      expect(keys1.length).toBe(1)
      expect(keys2.length).toBe(2)
    })

    it('should invalidate cache on unregister', () => {
      const registry = createRegistry()
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
      const registry = createRegistry()
      registry.register({ id: 'item-1' })

      const keys1 = registry.keys()
      registry.clear()
      const keys2 = registry.keys()

      expect(keys1).not.toBe(keys2)
      expect(keys1.length).toBe(1)
      expect(keys2.length).toBe(0)
    })

    it('should invalidate cache on upsert', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1' })

      const keys1 = registry.keys()
      registry.upsert('item-2', { value: 'new' })
      const keys2 = registry.keys()

      expect(keys1).not.toBe(keys2)
    })
  })

  describe('seek functionality', () => {
    it('should seek first ticket without predicate', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: 'a' })
      registry.register({ id: 'item-2', value: 'b' })
      registry.register({ id: 'item-3', value: 'c' })

      const first = registry.seek('first')
      expect(first?.id).toBe('item-1')
    })

    it('should seek last ticket without predicate', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: 'a' })
      registry.register({ id: 'item-2', value: 'b' })
      registry.register({ id: 'item-3', value: 'c' })

      const last = registry.seek('last')
      expect(last?.id).toBe('item-3')
    })

    it('should seek first ticket with predicate', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: 'apple' })
      registry.register({ id: 'item-2', value: 'banana' })
      registry.register({ id: 'item-3', value: 'cherry' })

      const found = registry.seek('first', undefined, ticket => (ticket.value as string).startsWith('b'))
      expect(found?.id).toBe('item-2')
    })

    it('should seek last ticket with predicate', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: 'apple' })
      registry.register({ id: 'item-2', value: 'banana' })
      registry.register({ id: 'item-3', value: 'apricot' })

      const found = registry.seek('last', undefined, ticket => (ticket.value as string).startsWith('a'))
      expect(found?.id).toBe('item-3')
    })

    it('should seek from specific index', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: 'a' })
      registry.register({ id: 'item-2', value: 'b' })
      registry.register({ id: 'item-3', value: 'c' })

      const found = registry.seek('first', 1)
      expect(found?.id).toBe('item-2')
    })

    it('should return undefined when no ticket matches predicate', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: 'a' })

      const found = registry.seek('first', undefined, ticket => ticket.value === 'z')
      expect(found).toBeUndefined()
    })

    it('should return undefined for empty registry', () => {
      const registry = createRegistry()
      const found = registry.seek('first')
      expect(found).toBeUndefined()
    })

    it('should clamp from index to valid range', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1' })
      registry.register({ id: 'item-2' })

      const found1 = registry.seek('first', 100)
      expect(found1?.id).toBe('item-2')

      const found2 = registry.seek('first', -100)
      expect(found2?.id).toBe('item-1')
    })

    it('should seek last from specific index', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: 'a' })
      registry.register({ id: 'item-2', value: 'b' })
      registry.register({ id: 'item-3', value: 'c' })

      const found = registry.seek('last', 1)
      expect(found?.id).toBe('item-2')
    })

    it('should seek last with predicate from offset', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: 'apple' })
      registry.register({ id: 'item-2', value: 'banana' })
      registry.register({ id: 'item-3', value: 'apricot' })

      const found = registry.seek('last', 2, t => (t.value as string).startsWith('a'))
      expect(found?.id).toBe('item-3')
    })

    it('should seek last from beginning when from is 0', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: 'a' })
      registry.register({ id: 'item-2', value: 'b' })
      registry.register({ id: 'item-3', value: 'c' })

      const found = registry.seek('last', 0)
      expect(found?.id).toBe('item-1')
    })
  })

  describe('dispose functionality', () => {
    it('should clear collection and listeners on dispose', () => {
      const registry = createRegistry({ events: true })
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
      const registry = createRegistry({ events: false })
      registry.register({ id: 'item-1' })

      expect(() => registry.dispose()).not.toThrow()
      expect(registry.size).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should handle registering duplicate IDs by returning existing ticket', () => {
      const registry = createRegistry()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const ticket1 = registry.register({ id: 'duplicate', value: 'first' })
      const ticket2 = registry.register({ id: 'duplicate', value: 'second' })

      expect(ticket1).toBe(ticket2)
      expect(registry.size).toBe(1)
      expect(ticket1.value).toBe('first')
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('already exists'))

      warnSpy.mockRestore()
    })

    it('should handle null value in browse', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1', value: null })

      const found = registry.browse(null)
      expect(found).toEqual(['item-1'])
    })

    it('should handle complex objects as values', () => {
      const registry = createRegistry()
      const obj1 = { nested: { data: 'test' } }
      const obj2 = { nested: { data: 'test' } }

      registry.register({ id: 'item-1', value: obj1 })
      registry.register({ id: 'item-2', value: obj2 })

      expect(registry.browse(obj1)).toEqual(['item-1'])
      expect(registry.browse(obj2)).toEqual(['item-2'])
    })

    it('should maintain index integrity after multiple operations', () => {
      const registry = createRegistry()

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
      const registry = createRegistry()

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

describe('batch operations', () => {
  it('should return the value from the batched function', () => {
    const registry = createRegistry()

    const result = registry.batch(() => {
      registry.register({ id: 'item-1' })
      return 'batch-result'
    })

    expect(result).toBe('batch-result')
    expect(registry.size).toBe(1)
  })

  it('should defer event emission until batch completes', () => {
    const registry = createRegistry({ events: true })
    const listener = vi.fn()
    const callOrder: string[] = []

    registry.on('register:ticket', () => {
      callOrder.push('event')
      listener()
    })

    registry.batch(() => {
      registry.register({ id: 'item-1' })
      callOrder.push('after-register-1')
      registry.register({ id: 'item-2' })
      callOrder.push('after-register-2')
    })
    callOrder.push('after-batch')

    // Events should be emitted AFTER all operations, not during
    expect(listener).toHaveBeenCalledTimes(2)
    expect(callOrder).toEqual([
      'after-register-1',
      'after-register-2',
      'event',
      'event',
      'after-batch',
    ])
  })

  it('should only invalidate cache once at end of batch', () => {
    const registry = createRegistry()
    registry.register({ id: 'initial' })

    const keys1 = registry.keys()

    registry.batch(() => {
      registry.register({ id: 'item-1' })
      const keysDuringBatch = registry.keys()
      // During batch, cache should still be valid (same reference)
      expect(keysDuringBatch).toBe(keys1)

      registry.register({ id: 'item-2' })
    })

    const keys2 = registry.keys()
    // After batch, cache should be invalidated
    expect(keys2).not.toBe(keys1)
    expect(keys2.length).toBe(3)
  })

  it('should handle nested batch calls correctly', () => {
    const registry = createRegistry({ events: true })
    const listener = vi.fn()

    registry.on('register:ticket', listener)

    registry.batch(() => {
      registry.register({ id: 'item-1' })

      // Nested batch should just execute, not reset outer batch
      registry.batch(() => {
        registry.register({ id: 'item-2' })
      })

      registry.register({ id: 'item-3' })
    })

    // All 3 events should be emitted after outer batch completes
    expect(listener).toHaveBeenCalledTimes(3)
    expect(registry.size).toBe(3)
  })

  it('should cleanup batching state on error', () => {
    const registry = createRegistry({ events: true })
    const listener = vi.fn()

    registry.on('register:ticket', listener)

    expect(() => {
      registry.batch(() => {
        registry.register({ id: 'item-1' })
        throw new Error('Test error')
      })
    }).toThrow('Test error')

    // Batching state should be reset
    // Next register should emit immediately
    registry.register({ id: 'item-2' })
    expect(listener).toHaveBeenCalledOnce()
  })

  it('should batch multiple different operations', () => {
    const registry = createRegistry({ events: true })
    const registerListener = vi.fn()
    const unregisterListener = vi.fn()
    const updateListener = vi.fn()

    registry.on('register:ticket', registerListener)
    registry.on('unregister:ticket', unregisterListener)
    registry.on('update:ticket', updateListener)

    registry.register({ id: 'existing', value: 'initial' })
    registerListener.mockClear()

    registry.batch(() => {
      registry.register({ id: 'new-item' })
      registry.upsert('existing', { value: 'updated' })
      registry.unregister('new-item')
    })

    expect(registerListener).toHaveBeenCalledOnce()
    expect(updateListener).toHaveBeenCalledOnce()
    expect(unregisterListener).toHaveBeenCalledOnce()
  })

  it('should work with onboard and offboard in batch', () => {
    const registry = createRegistry({ events: true })
    const listener = vi.fn()

    registry.on('register:ticket', listener)

    registry.batch(() => {
      registry.onboard([
        { id: 'item-1' },
        { id: 'item-2' },
        { id: 'item-3' },
      ])
      registry.offboard(['item-2'])
    })

    // Should emit 3 register events (offboard emits unregister, not register)
    expect(listener).toHaveBeenCalledTimes(3)
    expect(registry.size).toBe(2)
  })

  it('should maintain correct state during batch', () => {
    const registry = createRegistry()

    registry.batch(() => {
      registry.register({ id: 'item-1', value: 'a' })

      // State should be immediately available during batch
      expect(registry.size).toBe(1)
      expect(registry.has('item-1')).toBe(true)
      expect(registry.get('item-1')?.value).toBe('a')

      registry.register({ id: 'item-2', value: 'b' })
      expect(registry.size).toBe(2)
    })
  })
})

describe('createRegistryContext', () => {
  it('should create a context trinity with default namespace', () => {
    const [useRegistryContext, provideRegistryContext, defaultContext] = createRegistryContext()

    expect(useRegistryContext).toBeDefined()
    expect(typeof useRegistryContext).toBe('function')
    expect(provideRegistryContext).toBeDefined()
    expect(typeof provideRegistryContext).toBe('function')
    expect(defaultContext).toBeDefined()
    expect(defaultContext.collection).toBeInstanceOf(Map)
  })

  it('should create a context with custom namespace', () => {
    const [, , context] = createRegistryContext({ namespace: 'custom:registry' })

    expect(context.size).toBe(0)
    context.register({ id: 'test' })
    expect(context.size).toBe(1)
  })

  it('should pass events option through to registry', () => {
    const [, , context] = createRegistryContext({ events: true })
    const listener = vi.fn()

    context.on('register:ticket', listener)
    context.register({ id: 'test' })

    expect(listener).toHaveBeenCalledOnce()
  })

  it('should create independent contexts', () => {
    const [, , context1] = createRegistryContext({ namespace: 'context-1' })
    const [, , context2] = createRegistryContext({ namespace: 'context-2' })

    context1.register({ id: 'item-1' })

    expect(context1.size).toBe(1)
    expect(context2.size).toBe(0)
  })
})

describe('reactive option', () => {
  it('should create reactive collection when enabled', () => {
    const registry = createRegistry({ reactive: true })
    expect(isReactive(registry.collection)).toBe(true)
  })

  it('should not create reactive collection when disabled', () => {
    const registry = createRegistry({ reactive: false })
    expect(isReactive(registry.collection)).toBe(false)
  })

  it('should create reactive tickets when enabled', () => {
    const registry = createRegistry({ reactive: true })
    const ticket = registry.register({ id: 'test' })
    expect(isReactive(ticket)).toBe(true)
  })

  it('should not create reactive tickets when disabled', () => {
    const registry = createRegistry({ reactive: false })
    const ticket = registry.register({ id: 'test' })
    expect(isReactive(ticket)).toBe(false)
  })

  it('should trigger reactivity on collection changes', async () => {
    const registry = createRegistry({ reactive: true })
    const sizes: number[] = []

    watchEffect(() => {
      sizes.push(registry.collection.size)
    })

    expect(sizes).toEqual([0])

    registry.register({ id: 'item-1' })
    await nextTick()
    expect(sizes).toEqual([0, 1])

    registry.register({ id: 'item-2' })
    await nextTick()
    expect(sizes).toEqual([0, 1, 2])

    registry.unregister('item-1')
    await nextTick()
    expect(sizes).toEqual([0, 1, 2, 1])
  })

  it('should trigger reactivity when getting updated ticket from collection', async () => {
    const registry = createRegistry({ reactive: true })
    registry.register({ id: 'test', value: 'initial' })
    const values: unknown[] = []

    watchEffect(() => {
      const ticket = registry.get('test')
      values.push(ticket?.value)
    })

    expect(values).toEqual(['initial'])

    registry.upsert('test', { value: 'updated' })
    await nextTick()
    expect(values).toEqual(['initial', 'updated'])
  })
})
