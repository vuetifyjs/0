// Composables
import { useRegistry } from './index'

// Utilities
import { describe, it, expect } from 'vitest'

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
})
