// Utitilties
import { bench, describe } from 'vitest'

// Composables
import { useRegistry } from './index'

describe('useRegistry benchmarks', () => {
  describe('registration', () => {
    bench('Register 1,000 items (explicit values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }
    })

    bench('Register 1,000 items (index values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}` })
      }
    })

    bench('Onboard 1,000 items (explicit values)', () => {
      const registry = useRegistry()
      const items = Array.from({ length: 1000 }, (_, i) => ({
        id: `item-${i}`,
        value: `value-${i}`,
      }))

      registry.onboard(items)
    })

    bench('Register and unregister 1,000 items (explicit values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.unregister(`item-${i}`)
      }
    })

    bench('Register and unregister 1,000 items (index values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.unregister(`item-${i}`)
      }
    })

    bench('Register and offboard 1,000 items (explicit values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      const ids = Array.from({ length: 1000 }, (_, i) => `item-${i}`)
      registry.offboard(ids)
    })

    bench('Register and offboard 1,000 items (index values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}` })
      }

      const ids = Array.from({ length: 1000 }, (_, i) => `item-${i}`)
      registry.offboard(ids)
    })
  })

  describe('lookup operations', () => {
    bench('Register and get 1,000 items by id', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.get(`item-${i}`)
      }
    })

    bench('Register and lookup 1,000 items by index', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.lookup(i)
      }
    })

    bench('Register and browse 1,000 items by value', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.browse(`value-${i}`)
      }
    })

    bench('Register and check existence of 1,000 items', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.has(`item-${i}`)
      }
    })
  })

  describe('management operations', () => {
    bench('Register 1,000 items then clear', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      registry.clear()
    })

    bench('Register 1,000 items then reindex', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      registry.reindex()
    })
  })
})
