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
  })

  describe('collection management', () => {
    it('should find an item by id', () => {
      const registry = useRegistry()
      registry.register({ id: 'find-me' })

      const found = registry.find('find-me')

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

      expect(registry.lookup(2)).toBe('item-1')
      expect(registry.find('item-1')?.index).toBe(2)

      registry.reindex()

      expect(registry.lookup(2)).toBeUndefined()
      expect(registry.find('item-1')?.index).toBe(0)
    })

    it('should clear the entire registry', () => {
      const registry = useRegistry()
      registry.register()

      expect(registry.collection.size).toBe(1)

      registry.clear()

      expect(registry.collection.size).toBe(0)
    })
  })
})
