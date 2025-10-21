// Composables
import { useRegistry } from '#v0/composables/useRegistry'
import { useProxyRegistry } from './index'

// Utilities
import { describe, it, expect } from 'vitest'

describe('useProxyRegistry', () => {
  describe('basic functionality', () => {
    it('should create reactive refs for registry data', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      expect(proxy.keys.value).toEqual([])
      expect(proxy.values.value).toEqual([])
      expect(proxy.entries.value).toEqual([])
      expect(proxy.size.value).toBe(0)
    })

    it('should update refs when items are registered', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      const ticket1 = registry.register({ value: 'Item 1' })
      const ticket2 = registry.register({ value: 'Item 2' })

      expect(proxy.keys.value).toEqual([ticket1.id, ticket2.id])
      expect(proxy.values.value).toEqual([ticket1, ticket2])
      expect(proxy.size.value).toBe(2)
    })

    it('should update refs when items are unregistered', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      const ticket1 = registry.register({ value: 'Item 1' })
      const ticket2 = registry.register({ value: 'Item 2' })

      registry.unregister(ticket1.id)

      expect(proxy.keys.value).toEqual([ticket2.id])
      expect(proxy.values.value).toEqual([ticket2])
      expect(proxy.size.value).toBe(1)
    })

    it('should update entries ref correctly', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      const ticket = registry.register({ value: 'Item 1' })

      expect(proxy.entries.value).toEqual([[ticket.id, ticket]])
    })
  })

  describe('reactivity options', () => {
    it('should use shallow reactivity by default', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      expect(proxy.keys.value).toBeDefined()
    })

    it('should support deep reactivity option', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry, { deep: true })

      const ticket = registry.register({ value: { nested: 'data' } })

      expect(proxy.values.value).toEqual([ticket])
    })
  })

  describe('multiple updates', () => {
    it('should handle rapid register/unregister operations', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      for (let i = 0; i < 10; i++) {
        registry.register({ value: `Item ${i}` })
      }

      expect(proxy.size.value).toBe(10)

      const ids = proxy.keys.value
      for (let i = 0; i < 5; i++) {
        registry.unregister(ids[i]!)
      }

      expect(proxy.size.value).toBe(5)
    })

    it('should handle bulk operations via onboard', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      registry.onboard([
        { value: 'Item 1' },
        { value: 'Item 2' },
        { value: 'Item 3' },
      ])

      expect(proxy.size.value).toBe(3)
      expect(proxy.values.value.length).toBe(3)
    })
  })

  describe('multiple proxies', () => {
    it('should support multiple proxy instances on same registry', () => {
      const registry = useRegistry({ events: true })
      const proxy1 = useProxyRegistry(registry)
      const proxy2 = useProxyRegistry(registry)

      registry.register({ value: 'Item 1' })

      expect(proxy1.size.value).toBe(1)
      expect(proxy2.size.value).toBe(1)
    })
  })
})
