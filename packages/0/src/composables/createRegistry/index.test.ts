import { describe, expect, it, vi } from 'vitest'

import { createRegistry, createRegistryContext, useRegistry } from './index'

// Utilities
import { computed, isReactive, nextTick, shallowRef, watchEffect, watchSyncEffect } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { RegistryTicketInput } from './index'

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

    it('should dedupe repeated ids within a single offboard call', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      // No explicit value → valueIsIndex true, so removal touches indexDependentCount.
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])

      registry.on('unregister:ticket', listener)
      const removed = registry.offboard(['a', 'a'])

      // The repeated id is removed once — not double-counted into a second
      // indexDependentCount decrement or a second unregister emit.
      expect(removed).toHaveLength(1)
      expect(listener).toHaveBeenCalledTimes(1)
      expect(registry.size).toBe(2)
      expect(registry.keys()).toEqual(['b', 'c'])

      // lookup() drains the deferred reindex; survivors renumber cleanly.
      expect(registry.lookup(0)).toBe('b')
      expect(registry.lookup(1)).toBe('c')
      expect(registry.get('b')?.index).toBe(0)
      expect(registry.get('c')?.index).toBe(1)
    })

    it('should return removed inputs preserving id when valueIsIndex is false', () => {
      const registry = createRegistry()

      registry.onboard([
        { id: 'a', value: 'alpha' },
        { id: 'b', value: 'beta' },
        { id: 'c', value: 'gamma' },
      ])

      const removed = registry.offboard(['a', 'c'])

      expect(removed).toHaveLength(2)
      expect(removed[0]).toEqual({ id: 'a', value: 'alpha' })
      expect(removed[1]).toEqual({ id: 'c', value: 'gamma' })
    })

    it('should strip a registry-minted id and an index-derived value from the returned input', () => {
      const registry = createRegistry()

      const auto = registry.register({})

      const [removed] = registry.offboard([auto.id])

      expect(removed).toBeDefined()
      expect(removed).not.toHaveProperty('id')
      expect(removed).not.toHaveProperty('value')
      expect(removed).not.toHaveProperty('index')
      expect(removed).not.toHaveProperty('valueIsIndex')
      expect(removed).not.toHaveProperty('unregister')
    })

    it('should preserve user-added fields on returned inputs', () => {
      interface Custom { id?: string, value?: string, label?: string, tag?: number }
      const registry = createRegistry<Custom>()

      registry.register({ id: 'a', value: 'alpha', label: 'A', tag: 1 })

      const [removed] = registry.offboard(['a'])

      expect(removed).toEqual({ id: 'a', value: 'alpha', label: 'A', tag: 1 })
    })

    it('should skip missing ids in returned array', () => {
      const registry = createRegistry()

      registry.onboard([{ id: 'a', value: 'alpha' }])

      const removed = registry.offboard(['a', 'missing'])

      expect(removed).toHaveLength(1)
      expect(removed[0]).toEqual({ id: 'a', value: 'alpha' })
    })

    it('should support round-trip onboard → offboard → onboard across registries', () => {
      const source = createRegistry<{ id?: string, value?: string }>()
      const destination = createRegistry<{ id?: string, value?: string }>()

      source.onboard([
        { id: 'a', value: 'alpha' },
        { id: 'b', value: 'beta' },
      ])

      const inputs = source.offboard(['a', 'b'])
      const tickets = destination.onboard(inputs)

      expect(source.size).toBe(0)
      expect(destination.size).toBe(2)
      expect(tickets[0].id).toBe('a')
      expect(tickets[0].value).toBe('alpha')
      expect(tickets[1].id).toBe('b')
      expect(tickets[1].value).toBe('beta')
    })

    it('should honor explicit valueIsIndex on register', () => {
      const registry = createRegistry()
      const ticket = registry.register({ id: 'a', value: 5, valueIsIndex: true })

      expect(ticket.value).toBe(5)
      expect(ticket.valueIsIndex).toBe(true)
    })

    it('should default valueIsIndex from value presence when not supplied', () => {
      const registry = createRegistry()
      const auto = registry.register({ id: 'a' })
      expect(auto.valueIsIndex).toBe(true)

      const explicit = registry.register({ id: 'b', value: 'x' })
      expect(explicit.valueIsIndex).toBe(false)
    })

    it('should ignore a supplied index and append when registering', () => {
      const registry = createRegistry()
      const a = registry.register({ id: 'a' })
      const b = registry.register({ id: 'b' })
      const c = registry.register({ id: 'c', index: 0 })
      const d = registry.register({ id: 'd', index: 99 })

      expect(registry.keys()).toEqual(['a', 'b', 'c', 'd'])
      expect(registry.lookup(0)).toBe('a')
      expect(registry.lookup(2)).toBe('c')
      expect(registry.lookup(99)).toBeUndefined()
      expect(registry.values()[2]?.id).toBe('c')
      expect(a.index).toBe(0)
      expect(b.index).toBe(1)
      expect(c.index).toBe(2)
      expect(d.index).toBe(3)
    })

    it('should keep order and collection consistent when moving after a registration with a supplied index', () => {
      const registry = createRegistry()
      registry.register({ id: 'a' })
      registry.register({ id: 'b' })
      registry.register({ id: 'c', index: 0 })

      registry.move('c', 0)

      expect(registry.keys()).toEqual(['c', 'a', 'b'])
      expect(registry.keys().length).toBe(registry.size)
      expect(new Set(registry.keys()).size).toBe(registry.size)
      for (const id of ['a', 'b', 'c']) {
        expect(registry.has(id)).toBe(true)
      }
      for (const [index, ticket] of registry.values().entries()) {
        expect(ticket.index).toBe(index)
        expect(registry.lookup(index)).toBe(ticket.id)
      }
    })

    it('should ignore a supplied index when upserting a missing id', () => {
      const registry = createRegistry<RegistryTicketInput & { index?: number }>()
      registry.register({ id: 'a' })
      registry.register({ id: 'b' })
      registry.upsert('c', { index: 0 })

      expect(registry.keys()).toEqual(['a', 'b', 'c'])
      expect(registry.lookup(0)).toBe('a')
      expect(registry.get('c')?.index).toBe(2)
    })

    it('should append a re-registered ticket that carries a stale index', () => {
      const registry = createRegistry()
      registry.register({ id: 'a' })
      const b = registry.register({ id: 'b' })
      registry.register({ id: 'c' })

      registry.unregister('b')
      const again = registry.register({ ...b })

      expect(again.index).toBe(2)
      expect(registry.keys()).toEqual(['a', 'c', 'b'])
      expect(registry.lookup(0)).toBe('a')
      expect(registry.lookup(2)).toBe('b')
      expect(new Set(registry.keys()).size).toBe(registry.size)
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
      registry.register({ id: 'zero' })
      registry.register({ id: 'lookup-me' })

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

      expect(registry.lookup(2)).toBe('item-3')
      expect(registry.get('item-1')?.index).toBe(0)

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

    it('should drain pending reindex before register to avoid directory collisions', () => {
      const registry = createRegistry()
      registry.register({ id: 'a' })
      registry.register({ id: 'b', value: 'X' })

      registry.unregister('a')
      registry.register({ id: 'c' })

      expect(registry.get('b')?.index).toBe(0)
      expect(registry.get('c')?.index).toBe(1)
      expect(registry.lookup(0)).toBe('b')
      expect(registry.lookup(1)).toBe('c')
    })

    it('should trigger lazy reindex via browse when needed', () => {
      const registry = createRegistry()
      registry.register({ id: 'item-1' }) // valueIsIndex: true
      registry.register({ id: 'item-2' }) // valueIsIndex: true
      registry.register({ id: 'item-3' }) // valueIsIndex: true

      // Tail-only removal defers the reindex (no survivor shifts), so needsReindex
      // survives until browse() drains it — a mid-list removal would reindex eagerly.
      registry.offboard(['item-3'])

      // browse() drains the deferred reindex before reading the catalog.
      expect(registry.browse(0)).toEqual(['item-1'])
      expect(registry.browse(1)).toEqual(['item-2'])
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

    it('should not allow internal catalog mutation via browse return', () => {
      const registry = createRegistry()
      registry.register({ id: 'a', value: 'shared' })
      registry.register({ id: 'b', value: 'shared' })

      const ids = registry.browse('shared')!
      ;(ids as ID[]).push('rogue')

      expect(registry.browse('shared')).toEqual(['a', 'b'])
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
      using warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      registry.on('register:ticket', listener)
      registry.register({ id: 'test' })

      expect(listener).not.toHaveBeenCalled()
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Events are disabled'))
    })

    it('should emit register:ticket event when enabled', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.on('register:ticket', listener)
      const ticket = registry.register({ id: 'test-id', value: 'test-value' })

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(ticket)
    })

    it('should emit unregister:ticket event when enabled', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      const ticket = registry.register({ id: 'test-id' })
      registry.on('unregister:ticket', listener)
      registry.unregister('test-id')

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(ticket)
    })

    it('should emit update:ticket event when upserting existing ticket', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.register({ id: 'test-id', value: 'initial' })
      registry.on('update:ticket', listener)
      const updated = registry.upsert('test-id', { value: 'updated' })

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(updated)
    })

    it('should emit clear:registry event when clearing', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.register({ id: 'test-id' })
      registry.on('clear:registry', listener)
      registry.clear()

      expect(listener).toHaveBeenCalledTimes(1)
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

      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('should remove event listener with off', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.on('register:ticket', listener)
      registry.register({ id: 'test-1' })
      expect(listener).toHaveBeenCalledTimes(1)

      registry.off('register:ticket', listener)
      registry.register({ id: 'test-2' })
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('should support custom events with emit', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      registry.on('custom-event', listener)
      registry.emit('custom-event', { data: 'test' })

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith({ data: 'test' })
    })

    it('should warn when attempting to register listener without events enabled', () => {
      const registry = createRegistry({ events: false })
      using warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      registry.on('register:ticket', vi.fn())

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Events are disabled'))
    })

    it('should warn when attempting to remove listener without events enabled', () => {
      const registry = createRegistry({ events: false })
      using warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      registry.off('register:ticket', vi.fn())

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Events are disabled'))
    })

    it('should support multiple listeners for same event', () => {
      const registry = createRegistry({ events: true })
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      registry.on('register:ticket', listener1)
      registry.on('register:ticket', listener2)
      registry.register({ id: 'test' })

      expect(listener1).toHaveBeenCalledTimes(1)
      expect(listener2).toHaveBeenCalledTimes(1)
    })

    it('should warn when listener count exceeds 100', () => {
      const registry = createRegistry({ events: true })
      using warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      for (let index = 0; index <= 100; index++) {
        registry.on('test-event', vi.fn())
      }

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('101 listeners'),
      )
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

      // Missing id → register path → membership changed
      expect(keys1).not.toBe(keys2)

      // Existing id → in-place patch → contents unchanged, but a fresh array
      // identity so event-driven snapshot consumers (useProxyRegistry) observe
      // the update off update:ticket
      registry.upsert('item-1', { value: 'patched' })
      const keys3 = registry.keys()
      expect(keys3).not.toBe(keys2)
      expect(keys3).toEqual(keys2)
      expect(registry.get('item-1')!.value).toBe('patched')
    })

    it('should not re-notify iterating effects on field-only upsert (reactive)', () => {
      const registry = createRegistry({ reactive: true })
      registry.register({ id: 'a', value: 1 })

      let runs = 0
      const stop = watchEffect(() => {
        registry.values()
        runs++
      }, { flush: 'sync' })
      expect(runs).toBe(1)

      // Field patch — membership and order unchanged → no version notification
      registry.upsert('a', { value: 2 })
      expect(runs).toBe(1)
      expect(registry.get('a')!.value).toBe(2)

      // Structural mutation → notified
      registry.register({ id: 'b' })
      expect(runs).toBe(2)

      stop()
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

    it('should drain pending reindex before seeking', () => {
      const registry = createRegistry()
      registry.register({ id: 'a', value: 'A' })
      registry.register({ id: 'b' })
      registry.register({ id: 'c', value: 'C' })

      registry.unregister('b')

      const found = registry.seek('first', 1)

      expect(found?.id).toBe('c')
      expect(found?.index).toBe(1)
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
      using warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const ticket1 = registry.register({ id: 'duplicate', value: 'first' })
      const ticket2 = registry.register({ id: 'duplicate', value: 'second' })

      expect(ticket1).toBe(ticket2)
      expect(registry.size).toBe(1)
      expect(ticket1.value).toBe('first')
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('already exists'))
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

    it('should keep mid-batch reads consistent and re-cache after batch', () => {
      const registry = createRegistry()
      registry.register({ id: 'initial' })

      const keys1 = registry.keys()

      registry.batch(() => {
        registry.register({ id: 'item-1' })
        // Mid-batch reads reflect mutations already applied — never a stale
        // pre-batch snapshot (a reader mid-batch must not see removed tickets
        // or miss registered ones).
        expect(registry.keys()).toEqual(['initial', 'item-1'])

        registry.register({ id: 'item-2' })
      })

      const keys2 = registry.keys()
      expect(keys2).not.toBe(keys1)
      expect(keys2.length).toBe(3)
      // Cache is warm again after the batch — repeat reads return the same array.
      expect(registry.keys()).toBe(keys2)
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
      expect(listener).toHaveBeenCalledTimes(1)
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

      expect(registerListener).toHaveBeenCalledTimes(1)
      expect(updateListener).toHaveBeenCalledTimes(1)
      expect(unregisterListener).toHaveBeenCalledTimes(1)
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

    it('should defer user-called emit() during batch', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()
      const callOrder: string[] = []

      registry.on('custom-event', () => {
        callOrder.push('custom')
        listener()
      })

      registry.batch(() => {
        registry.emit('custom-event', 'payload')
        callOrder.push('after-emit')
      })
      callOrder.push('after-batch')

      expect(listener).toHaveBeenCalledTimes(1)
      expect(callOrder).toEqual([
        'after-emit',
        'custom',
        'after-batch',
      ])
    })

    it('should defer clear() events during batch', () => {
      const registry = createRegistry({ events: true })
      const clearListener = vi.fn()

      registry.register({ id: 'item-1' })
      registry.register({ id: 'item-2' })

      registry.on('clear:registry', clearListener)

      registry.batch(() => {
        registry.clear()

        // State is immediately cleared
        expect(registry.size).toBe(0)
        // Events not yet emitted
        expect(clearListener).not.toHaveBeenCalled()
      })

      // Events emitted after batch completes
      expect(clearListener).toHaveBeenCalledTimes(1)
    })

    it('should keep keys, values, and entries coherent after a listener mutates during batch dispatch', () => {
      const registry = createRegistry({ events: true })
      let mutated = false

      registry.on('register:ticket', () => {
        registry.keys()
        registry.values()
        registry.entries()
      })
      registry.on('register:ticket', () => {
        if (mutated) return
        mutated = true
        registry.register({ id: 'extra' })
      })

      registry.batch(() => {
        registry.register({ id: 'item-1' })
      })

      expect(registry.size).toBe(2)
      expect(registry.keys().length).toBe(2)
      expect(registry.values().length).toBe(2)
      expect(registry.entries().length).toBe(2)
      expect(registry.keys()).toContain('extra')
    })

    it('should keep caches coherent after a clear:registry listener mutates during batch dispatch', () => {
      const registry = createRegistry({ events: true })
      registry.register({ id: 'item-1' })

      let seeded = false
      registry.on('clear:registry', () => {
        registry.keys()
        registry.values()
        registry.entries()
      })
      registry.on('clear:registry', () => {
        if (seeded) return
        seeded = true
        registry.register({ id: 'seed' })
      })

      registry.batch(() => {
        registry.clear()
      })

      expect(registry.size).toBe(1)
      expect(registry.keys()).toEqual(['seed'])
      expect(registry.values().length).toBe(1)
      expect(registry.entries().length).toBe(1)
    })

    it('should update valueIsIndex and catalog on upsert', () => {
      const registry = createRegistry()

      // Register with no value - valueIsIndex should be true
      const ticket = registry.register({ id: 'item-1' })
      expect(ticket.valueIsIndex).toBe(true)
      expect(ticket.value).toBe(0)

      // Upsert with explicit value - valueIsIndex should become false
      const updated = registry.upsert('item-1', { value: 'explicit' })
      expect(updated.valueIsIndex).toBe(false)
      expect(updated.value).toBe('explicit')

      // Catalog should reflect the new value
      expect(registry.browse('explicit')).toEqual(['item-1'])
      // Old index-based value should no longer be in catalog
      expect(registry.browse(0)).toBeUndefined()
    })
  })

  describe('indexDependentCount integrity', () => {
    it('should keep reindex behavior consistent after mixed upsert/unregister/offboard sequences', () => {
      const registry = createRegistry()

      registry.onboard([
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
        { id: 'd' },
      ])

      registry.upsert('a', { value: 'A' })
      registry.upsert('c', { value: 'C' })
      registry.upsert('a', { value: undefined })

      registry.unregister('b')
      registry.offboard(['d'])

      expect(registry.lookup(0)).toBe('a')
      expect(registry.lookup(1)).toBe('c')
      expect(registry.get('a')?.index).toBe(0)
      expect(registry.get('c')?.index).toBe(1)

      registry.register({ id: 'e' })

      expect(registry.get('e')?.index).toBe(2)
      expect(registry.lookup(2)).toBe('e')
      expect(registry.size).toBe(3)
    })

    it('should drain pending reindex before upsert valueIsIndex transition', () => {
      const registry = createRegistry()
      registry.register({ id: 'a', value: 'A' })
      registry.register({ id: 'b' })
      registry.register({ id: 'c', value: 'C' })

      registry.unregister('b')

      const updated = registry.upsert('c', { value: undefined })

      expect(updated.valueIsIndex).toBe(true)
      expect(updated.value).toBe(1)
      expect(updated.index).toBe(1)
      expect(registry.browse(1)).toEqual(['c'])
      expect(registry.browse(2)).toBeUndefined()
    })

    it('should reindex correctly after offboard with mixed valueIsIndex tickets', () => {
      const registry = createRegistry()

      registry.onboard([
        { id: 'a' },
        { id: 'b', value: 'B' },
        { id: 'c' },
        { id: 'd', value: 'D' },
        { id: 'e' },
      ])

      registry.offboard(['a', 'c'])

      expect(registry.size).toBe(3)
      expect(registry.lookup(0)).toBe('b')
      expect(registry.lookup(1)).toBe('d')
      expect(registry.lookup(2)).toBe('e')
      expect(registry.get('e')?.value).toBe(2)
    })
  })

  describe('unassign edge cases', () => {
    it('should handle unassign when catalog has no entry for value', () => {
      const registry = createRegistry()

      // Register with explicit value
      registry.register({ id: 'item-1', value: 'value-1' })

      // Manually upsert to change value, which triggers unassign on old value
      // Then unregister to ensure old catalog entry is cleaned
      registry.upsert('item-1', { value: 'value-2' })
      registry.upsert('item-1', { value: 'value-3' })

      // Old values should be removed from catalog
      expect(registry.browse('value-1')).toBeUndefined()
      expect(registry.browse('value-2')).toBeUndefined()
      expect(registry.browse('value-3')).toEqual(['item-1'])
    })
  })

  describe('slot operations', () => {
    it('should provide and use registry via createRegistryContext', () => {
      const [, provideRegistryContext, context] = createRegistryContext()

      expect(context).toBeDefined()
      expect(typeof provideRegistryContext).toBe('function')

      context.register({ id: 'test' })
      expect(context.size).toBe(1)
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

      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('should create independent contexts', () => {
      const [, , context1] = createRegistryContext({ namespace: 'test:context-1' })
      const [, , context2] = createRegistryContext({ namespace: 'test:context-2' })

      context1.register({ id: 'item-1' })

      expect(context1.size).toBe(1)
      expect(context2.size).toBe(0)
    })
  })

  describe('useRegistry', () => {
    it('should throw when no registry context is provided', () => {
      // Calling the consumer outside a component setup makes Vue's inject()
      // warn; the throw is what we assert. Silence the incidental warning.
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      expect(() => useRegistry('v0:missing-registry')).toThrow(
        'Context "v0:missing-registry" not found. Ensure it\'s provided by an ancestor.',
      )
      expect(warn).toHaveBeenCalled()
    })
  })

  describe('move functionality', () => {
    it('should move a ticket to a new index position', () => {
      const registry = createRegistry()
      registry.onboard([
        { id: 'a', value: 'alpha' },
        { id: 'b', value: 'beta' },
        { id: 'c', value: 'gamma' },
      ])
      const result = registry.move('a', 2)
      expect(result).toBeDefined()
      expect(registry.keys()).toEqual(['b', 'c', 'a'])
      expect(registry.get('b')?.index).toBe(0)
      expect(registry.get('c')?.index).toBe(1)
      expect(registry.get('a')?.index).toBe(2)
    })

    it('should return undefined for non-existent ticket', () => {
      const registry = createRegistry()
      registry.register({ id: 'a' })
      expect(registry.move('nonexistent', 0)).toBeUndefined()
    })

    it('should return ticket when target equals current index', () => {
      const registry = createRegistry()
      registry.onboard([{ id: 'a', value: 'alpha' }, { id: 'b', value: 'beta' }])
      const result = registry.move('a', 0)
      expect(result?.id).toBe('a')
      expect(registry.keys()).toEqual(['a', 'b'])
    })

    it('should clamp target index to valid range', () => {
      const registry = createRegistry()
      registry.onboard([
        { id: 'a', value: 'alpha' },
        { id: 'b', value: 'beta' },
        { id: 'c', value: 'gamma' },
      ])
      registry.move('a', 100)
      expect(registry.keys()).toEqual(['b', 'c', 'a'])
      registry.move('a', -100)
      expect(registry.keys()).toEqual(['a', 'b', 'c'])
    })

    it('should trigger lazy reindex before moving', () => {
      const registry = createRegistry()
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      // Tail-only removal defers the reindex so move() must drain it first.
      registry.offboard(['c'])
      const result = registry.move('a', 1)
      expect(result).toBeDefined()
      expect(registry.keys()).toEqual(['b', 'a'])
    })

    it('should emit update:ticket for the moved ticket', () => {
      const registry = createRegistry({ events: true })
      registry.onboard([
        { id: 'a', value: 'alpha' },
        { id: 'b', value: 'beta' },
        { id: 'c', value: 'gamma' },
      ])

      const handler = vi.fn()
      registry.on('update:ticket', handler)

      const moved = registry.move('a', 2)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(moved)
    })

    it('should not emit update:ticket when move is a no-op', () => {
      const registry = createRegistry({ events: true })
      registry.onboard([{ id: 'a' }, { id: 'b' }])

      const handler = vi.fn()
      registry.on('update:ticket', handler)

      registry.move('a', 0)

      expect(handler).not.toHaveBeenCalled()
    })

    it('should dispatch reindex:registry before update:ticket during move', () => {
      const registry = createRegistry({ events: true })
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])

      const order: string[] = []
      registry.on('reindex:registry', () => order.push('reindex'))
      registry.on('update:ticket', () => order.push('update'))

      registry.move('a', 2)

      expect(order).toEqual(['reindex', 'update'])
    })

    it('should update catalog and directory after move', () => {
      const registry = createRegistry()
      registry.onboard([
        { id: 'a', value: 'alpha' },
        { id: 'b', value: 'beta' },
        { id: 'c', value: 'gamma' },
      ])
      registry.move('a', 2)
      expect(registry.lookup(0)).toBe('b')
      expect(registry.lookup(1)).toBe('c')
      expect(registry.lookup(2)).toBe('a')
      expect(registry.browse('alpha')).toEqual(['a'])
    })
  })

  describe('move functionality — windowed (issue #258)', () => {
    function fixture () {
      const registry = createRegistry()
      registry.onboard([
        { id: 'a', value: 'alpha' },
        { id: 'b', value: 'beta' },
        { id: 'c', value: 'gamma' },
        { id: 'd', value: 'delta' },
        { id: 'e', value: 'epsilon' },
      ])
      return registry
    }

    it('should not corrupt directory or catalog on a mid-list move', () => {
      const registry = fixture()

      registry.move('b', 3)

      expect(registry.keys()).toEqual(['a', 'c', 'd', 'b', 'e'])

      expect(registry.get('a')?.index).toBe(0)
      expect(registry.get('c')?.index).toBe(1)
      expect(registry.get('d')?.index).toBe(2)
      expect(registry.get('b')?.index).toBe(3)
      expect(registry.get('e')?.index).toBe(4)

      expect(registry.lookup(0)).toBe('a')
      expect(registry.lookup(1)).toBe('c')
      expect(registry.lookup(2)).toBe('d')
      expect(registry.lookup(3)).toBe('b')
      expect(registry.lookup(4)).toBe('e')

      expect(registry.browse('alpha')).toEqual(['a'])
      expect(registry.browse('beta')).toEqual(['b'])
      expect(registry.browse('gamma')).toEqual(['c'])
    })

    it('should keep lookup and index consistent on a mid-list move by 1 upward', () => {
      const registry = fixture()

      registry.move('c', 3)

      expect(registry.keys()).toEqual(['a', 'b', 'd', 'c', 'e'])

      const keys = registry.keys()
      for (const [i, key] of keys.entries()) {
        expect(registry.lookup(i)).toBe(key)
        expect(registry.get(key!)?.index).toBe(i)
      }
    })

    it('should keep lookup and index consistent on a mid-list move downward', () => {
      const registry = fixture()

      registry.move('d', 1)

      expect(registry.keys()).toEqual(['a', 'd', 'b', 'c', 'e'])

      const keys = registry.keys()
      for (const [i, key] of keys.entries()) {
        expect(registry.lookup(i)).toBe(key)
        expect(registry.get(key!)?.index).toBe(i)
      }
    })

    it('should track valueIsIndex values after a mid-list move', () => {
      const registry = createRegistry()
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }])

      registry.move('b', 2)

      expect(registry.keys()).toEqual(['a', 'c', 'b', 'd'])

      expect(registry.get('a')?.value).toBe(0)
      expect(registry.get('c')?.value).toBe(1)
      expect(registry.get('b')?.value).toBe(2)
      expect(registry.get('d')?.value).toBe(3)

      expect(registry.browse(2)).toContain('b')
      expect(registry.lookup(2)).toBe('b')
    })

    it('should hold the lookup/index invariant across a sequence of moves', () => {
      const registry = createRegistry()
      registry.onboard([
        { id: 'a', value: 'v0' },
        { id: 'b', value: 'v1' },
        { id: 'c', value: 'v2' },
        { id: 'd', value: 'v3' },
        { id: 'e', value: 'v4' },
        { id: 'f', value: 'v5' },
      ])

      function assertInvariant () {
        const keys = registry.keys()
        for (const [i, key] of keys.entries()) {
          expect(registry.lookup(i)).toBe(key)
          expect(registry.get(key!)?.index).toBe(i)
        }
      }

      registry.move('a', 5)
      assertInvariant()
      registry.move('f', 0)
      assertInvariant()
      registry.move('c', 4)
      assertInvariant()
      registry.move('e', 1)
      assertInvariant()
    })

    it('should trigger keys() reactivity on a move in reactive mode', async () => {
      const registry = createRegistry({ reactive: true })
      registry.onboard([
        { id: 'a', value: 'alpha' },
        { id: 'b', value: 'beta' },
        { id: 'c', value: 'gamma' },
      ])

      const snapshots: string[] = []
      watchEffect(() => snapshots.push(registry.keys().join(',')))

      await nextTick()
      expect(snapshots.at(-1)).toBe('a,b,c')

      registry.move('a', 2)
      await nextTick()

      expect(snapshots.at(-1)).toBe('b,c,a')
    })
  })

  describe('reorder functionality', () => {
    it('should reorder tickets to match a canonical permutation', () => {
      const registry = createRegistry()
      registry.onboard([
        { id: 'a', value: 'alpha' },
        { id: 'b', value: 'beta' },
        { id: 'c', value: 'gamma' },
      ])
      registry.reorder(['c', 'a', 'b'])
      expect(registry.keys()).toEqual(['c', 'a', 'b'])
      expect(registry.get('c')?.index).toBe(0)
      expect(registry.get('a')?.index).toBe(1)
      expect(registry.get('b')?.index).toBe(2)
    })

    it('should silently no-op when ids length does not match size', () => {
      const registry = createRegistry()
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      registry.reorder(['a', 'b'])
      expect(registry.keys()).toEqual(['a', 'b', 'c'])
    })

    it('should silently no-op when any id is unknown', () => {
      const registry = createRegistry()
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      registry.reorder(['a', 'b', 'missing'])
      expect(registry.keys()).toEqual(['a', 'b', 'c'])
    })

    it('should silently no-op when ids contain duplicates', () => {
      const registry = createRegistry()
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
      registry.reorder(['a', 'a', 'a'])
      expect(registry.keys()).toEqual(['a', 'b', 'c'])
      expect(registry.size).toBe(3)
    })

    it('should update catalog and directory after reorder', () => {
      const registry = createRegistry()
      registry.onboard([
        { id: 'a', value: 'alpha' },
        { id: 'b', value: 'beta' },
        { id: 'c', value: 'gamma' },
      ])
      registry.reorder(['c', 'a', 'b'])
      expect(registry.lookup(0)).toBe('c')
      expect(registry.lookup(1)).toBe('a')
      expect(registry.lookup(2)).toBe('b')
      expect(registry.browse('alpha')).toEqual(['a'])
      expect(registry.browse('gamma')).toEqual(['c'])
    })

    it('should emit reindex:registry once', () => {
      const registry = createRegistry({ events: true })
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])

      const handler = vi.fn()
      registry.on('reindex:registry', handler)

      registry.reorder(['c', 'b', 'a'])

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should not emit per-ticket update:ticket events', () => {
      const registry = createRegistry({ events: true })
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])

      const handler = vi.fn()
      registry.on('update:ticket', handler)

      registry.reorder(['c', 'b', 'a'])

      expect(handler).not.toHaveBeenCalled()
    })

    it('should trigger lazy reindex before reorder', () => {
      const registry = createRegistry()
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }])
      // Tail-only removal defers the reindex so reorder() must drain it first.
      registry.offboard(['d'])
      registry.reorder(['c', 'a', 'b'])
      expect(registry.keys()).toEqual(['c', 'a', 'b'])
      expect(registry.get('c')?.index).toBe(0)
      expect(registry.get('a')?.index).toBe(1)
      expect(registry.get('b')?.index).toBe(2)
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

    it('should propagate upserts to computeds iterating values() after a non-iteration re-run', async () => {
      const registry = createRegistry<{ value: string }>({ reactive: true })
      const trigger = shallowRef(0)

      registry.register({ id: 'a', value: 'initial-a' })
      registry.register({ id: 'b', value: 'initial-b' })

      const snapshot = computed(() => {
        void trigger.value
        return registry.values().map(t => t.value).join(',')
      })

      expect(snapshot.value).toBe('initial-a,initial-b')

      trigger.value++
      await nextTick()
      expect(snapshot.value).toBe('initial-a,initial-b')

      registry.upsert('b', { value: 'updated-b' })
      await nextTick()
      expect(snapshot.value).toBe('initial-a,updated-b')
    })

    it('should propagate registers to computeds iterating keys() after a non-iteration re-run', async () => {
      const registry = createRegistry({ reactive: true })
      const trigger = shallowRef(0)

      registry.register({ id: 'a' })

      const snapshot = computed(() => {
        void trigger.value
        return [...registry.keys()].join(',')
      })

      expect(snapshot.value).toBe('a')

      trigger.value++
      await nextTick()
      expect(snapshot.value).toBe('a')

      registry.register({ id: 'b' })
      await nextTick()
      expect(snapshot.value).toBe('a,b')
    })

    it('should propagate upserts to computeds iterating entries() after a non-iteration re-run', async () => {
      const registry = createRegistry<{ value: string }>({ reactive: true })
      const trigger = shallowRef(0)

      registry.register({ id: 'a', value: 'initial-a' })
      registry.register({ id: 'b', value: 'initial-b' })

      const snapshot = computed(() => {
        void trigger.value
        return registry.entries().map(([id, t]) => `${id}=${t.value}`).join(',')
      })

      expect(snapshot.value).toBe('a=initial-a,b=initial-b')

      trigger.value++
      await nextTick()
      expect(snapshot.value).toBe('a=initial-a,b=initial-b')

      registry.upsert('a', { value: 'updated-a' })
      await nextTick()
      expect(snapshot.value).toBe('a=updated-a,b=initial-b')
    })

    it('should emit a custom upsert event with the patched ticket as payload', () => {
      const registry = createRegistry({ events: true })
      const listener = vi.fn()

      const created = registry.register({ id: 'foo', value: 'a' })
      registry.on('foo:custom', listener)

      const updated = registry.upsert('foo', { value: 'b' }, 'foo:custom')

      expect(updated).toBe(created)
      expect(listener).toHaveBeenCalledWith(updated)
    })

    it('should preserve ticket identity and reactivity across upsert', async () => {
      const registry = createRegistry({ reactive: true })
      const ticket = registry.register({ id: 'test', value: 'initial' })
      const values: unknown[] = []

      watchEffect(() => {
        values.push(ticket.value)
      })

      expect(values).toEqual(['initial'])

      const patched = registry.upsert('test', { value: 'updated' })
      await nextTick()

      expect(patched).toBe(ticket)
      expect(values).toEqual(['initial', 'updated'])
    })
  })

  describe('offboard reindex + id provenance + batch version', () => {
    it('should eagerly heal index and value of index-derived tickets after a mid-list offboard', () => {
      const registry = createRegistry()
      const tickets = registry.onboard([{}, {}, {}, {}])

      registry.offboard([tickets[1].id])

      // No drain method called — values()/entries() must already reflect the
      // renumbered survivors, not the pre-offboard index/value.
      const values = registry.values()
      expect(values.map(ticket => ticket.index)).toEqual([0, 1, 2])
      expect(values.map(ticket => ticket.value)).toEqual([0, 1, 2])

      // The surviving ticket references are healed in place.
      expect(tickets[2].index).toBe(1)
      expect(tickets[2].value).toBe(1)
      expect(tickets[3].index).toBe(2)
      expect(tickets[3].value).toBe(2)
    })

    it('should emit reindex:registry when a mid-list offboard shifts index-derived survivors', () => {
      const registry = createRegistry({ events: true })

      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])

      const onReindex = vi.fn()
      registry.on('reindex:registry', onReindex)

      registry.offboard(['b'])

      expect(onReindex).toHaveBeenCalledTimes(1)
    })

    it('should defer (not reindex) when an offboard removes only a tail block', () => {
      const registry = createRegistry({ events: true })

      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])

      const onReindex = vi.fn()
      registry.on('reindex:registry', onReindex)

      registry.offboard(['c'])

      expect(onReindex).not.toHaveBeenCalled()
    })

    it('should renumber correctly after a tail offboard followed by a lazy unregister', () => {
      const registry = createRegistry()
      const tickets = registry.onboard([{}, {}, {}, {}, {}])

      registry.offboard([tickets[4].id])
      registry.unregister(tickets[1].id)

      expect(registry.keys()).toEqual([tickets[0].id, tickets[2].id, tickets[3].id])
      expect(registry.lookup(0)).toBe(tickets[0].id)
      expect(registry.get(tickets[2].id)?.index).toBe(1)
      expect(registry.get(tickets[3].id)?.index).toBe(2)
    })

    it('should preserve a user-supplied id on offboard even when the value is index-derived', () => {
      const registry = createRegistry<{ id?: string, value?: string }>()

      registry.register({ id: 'keep' })

      const [removed] = registry.offboard(['keep'])

      expect(removed).toEqual({ id: 'keep' })
    })

    it('should round-trip a user-supplied id with no value across registries', () => {
      const source = createRegistry<{ id?: string }>()
      const destination = createRegistry<{ id?: string }>()

      source.register({ id: 'x' })

      const inputs = source.offboard(['x'])
      const [ticket] = destination.onboard(inputs)

      expect(ticket.id).toBe('x')
    })

    it('should re-register a previously offboarded auto id as auto again', () => {
      const registry = createRegistry()

      const auto = registry.register({})
      registry.offboard([auto.id])

      const next = registry.register({})
      const [removed] = registry.offboard([next.id])

      expect(removed).not.toHaveProperty('id')
    })

    it('should strip a minted id but keep an explicit value on offboard', () => {
      const registry = createRegistry<{ id?: string, value?: string }>()

      // Minted id (none supplied) + explicit value: id is stripped, value survives.
      const ticket = registry.register({ value: 'x' })

      const [removed] = registry.offboard([ticket.id])

      expect(removed).toEqual({ value: 'x' })
    })

    it('should never expose removed ids to a sync effect firing mid-offboard', () => {
      const registry = createRegistry({ reactive: true })
      registry.onboard([{ id: 'a', value: 'x' }, { id: 'b', value: 'y' }, { id: 'c', value: 'z' }])

      const seen: ID[][] = []
      const stop = watchSyncEffect(() => {
        // Track the collection so the effect fires on the Map delete below, and read
        // keys() inside it: the early invalidate() must have cleared the cache so the
        // rebuild reflects the compacted order, never a mid-delete stale snapshot.
        void registry.collection.size
        seen.push([...registry.keys()])
      })

      seen.length = 0 // discard the pre-offboard snapshot
      registry.offboard(['b'])
      stop()

      expect(seen.every(snapshot => !snapshot.includes('b'))).toBe(true)
      expect(registry.keys()).toEqual(['a', 'c'])
    })

    it('should notify iteration subscribers after a tail offboard', () => {
      const registry = createRegistry({ reactive: true })
      registry.onboard([{ id: 'a' }, { id: 'b' }, { id: 'c' }])

      const runs = vi.fn()
      const stop = watchSyncEffect(() => {
        runs()
        void registry.values()
      })
      expect(runs).toHaveBeenCalledTimes(1)

      // A tail offboard defers the reindex; the early invalidate() is the only
      // structural setter on that path, so it must still bump the version.
      registry.offboard(['c'])
      expect(runs).toHaveBeenCalledTimes(2)

      stop()
    })

    it('should not re-notify iteration subscribers for a field-only upsert batch', () => {
      const registry = createRegistry({ reactive: true })
      registry.onboard([{ id: 'a', value: 'x' }, { id: 'b', value: 'y' }])

      const runs = vi.fn()
      const stop = watchSyncEffect(() => {
        runs()
        void registry.values()
      })

      expect(runs).toHaveBeenCalledTimes(1)

      registry.batch(() => {
        registry.upsert('a', { value: 'z' })
      })
      expect(runs).toHaveBeenCalledTimes(1)

      registry.batch(() => {
        registry.register({ id: 'c', value: 'w' })
      })
      expect(runs).toHaveBeenCalledTimes(2)

      stop()
    })

    it('should not notify iteration subscribers for an empty batch', () => {
      const registry = createRegistry({ reactive: true })
      registry.register({ id: 'a', value: 'x' })

      const runs = vi.fn()
      const stop = watchSyncEffect(() => {
        runs()
        void registry.values()
      })

      expect(runs).toHaveBeenCalledTimes(1)

      registry.batch(() => {})
      expect(runs).toHaveBeenCalledTimes(1)

      stop()
    })
  })
})
