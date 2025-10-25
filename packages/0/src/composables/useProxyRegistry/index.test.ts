// Composables
import { useRegistry } from '#v0/composables/useRegistry'
import { useProxyRegistry } from './index'

// Utilities
import { describe, it, expect, vi } from 'vitest'
import { effectScope } from 'vue'

describe('useProxyRegistry', () => {
  describe('basic functionality', () => {
    it('should create reactive objects for registry data', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      expect(proxy.keys).toEqual([])
      expect(proxy.values).toEqual([])
      expect(proxy.entries).toEqual([])
      expect(proxy.size).toBe(0)
    })

    it('should update properties when items are registered', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      const ticket1 = registry.register({ value: 'Item 1' })
      const ticket2 = registry.register({ value: 'Item 2' })

      expect(proxy.keys).toEqual([ticket1.id, ticket2.id])
      expect(proxy.values).toEqual([ticket1, ticket2])
      expect(proxy.size).toBe(2)
    })

    it('should update properties when items are unregistered', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      const ticket1 = registry.register({ value: 'Item 1' })
      const ticket2 = registry.register({ value: 'Item 2' })

      registry.unregister(ticket1.id)

      expect(proxy.keys).toEqual([ticket2.id])
      expect(proxy.values).toEqual([ticket2])
      expect(proxy.size).toBe(1)
    })

    it('should update entries property correctly', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      const ticket = registry.register({ value: 'Item 1' })

      expect(proxy.entries).toEqual([[ticket.id, ticket]])
    })
  })

  describe('reactivity options', () => {
    it('should use shallow reactivity by default', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      expect(proxy.keys).toBeDefined()
    })

    it('should support deep reactivity option', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry, { deep: true })

      const ticket = registry.register({ value: { nested: 'data' } })

      expect(proxy.values).toEqual([ticket])
    })
  })

  describe('multiple updates', () => {
    it('should handle rapid register/unregister operations', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      for (let i = 0; i < 10; i++) {
        registry.register({ value: `Item ${i}` })
      }

      expect(proxy.size).toBe(10)

      const ids = proxy.keys
      for (let i = 0; i < 5; i++) {
        registry.unregister(ids[i]!)
      }

      expect(proxy.size).toBe(5)
    })

    it('should handle bulk operations via onboard', () => {
      const registry = useRegistry({ events: true })
      const proxy = useProxyRegistry(registry)

      registry.onboard([
        { value: 'Item 1' },
        { value: 'Item 2' },
        { value: 'Item 3' },
      ])

      expect(proxy.size).toBe(3)
      expect(proxy.values.length).toBe(3)
    })
  })

  describe('multiple proxies', () => {
    it('should support multiple proxy instances on same registry', () => {
      const registry = useRegistry({ events: true })
      const proxy1 = useProxyRegistry(registry)
      const proxy2 = useProxyRegistry(registry)

      registry.register({ value: 'Item 1' })

      expect(proxy1.size).toBe(1)
      expect(proxy2.size).toBe(1)
    })
  })

  describe('cleanup', () => {
    it('should remove event listeners on scope disposal', () => {
      const scope = effectScope()
      const registry = useRegistry({ events: true })
      vi.spyOn(registry, 'off')

      scope.run(() => {
        useProxyRegistry(registry)
      })

      expect(registry.off).not.toHaveBeenCalled()

      scope.stop()
      expect(registry.off).toHaveBeenCalledTimes(4)
      expect(registry.off).toHaveBeenCalledWith('register:ticket', expect.any(Function))
      expect(registry.off).toHaveBeenCalledWith('unregister:ticket', expect.any(Function))
      expect(registry.off).toHaveBeenCalledWith('update:ticket', expect.any(Function))
      expect(registry.off).toHaveBeenCalledWith('clear:registry', expect.any(Function))
    })
  })
})
