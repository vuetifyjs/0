// Composables
import { useRegistry } from './index'

// Utitilties
import { bench, describe } from 'vitest'

describe('useRegistry benchmarks', () => {
  describe('registration', () => {
    bench('register 1000 items (explicit values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }
    })

    bench('register 1000 items (index values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}` })
      }
    })

    bench('onboard 1000 items (explicit values)', () => {
      const registry = useRegistry()
      const items = Array.from({ length: 1000 }, (_, i) => ({
        id: `item-${i}`,
        value: `value-${i}`,
      }))

      registry.onboard(items)
    })

    bench('unregister 1000 items (explicit values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.unregister(`item-${i}`)
      }
    })

    bench('unregister 1000 items (index values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.unregister(`item-${i}`)
      }
    })

    bench('offboard 1000 items (explicit values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      const ids = Array.from({ length: 1000 }, (_, i) => `item-${i}`)
      registry.offboard(ids)
    })

    bench('offboard 1000 items (index values)', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}` })
      }

      const ids = Array.from({ length: 1000 }, (_, i) => `item-${i}`)
      registry.offboard(ids)
    })
  })

  describe('lookup operations', () => {
    bench('get by id', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.get(`item-${i}`)
      }
    })

    bench('lookup by index', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.lookup(i)
      }
    })

    bench('browse by value', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.browse(`value-${i}`)
      }
    })

    bench('has operations', () => {
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
    bench('clear operations', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      registry.clear()
    })

    bench('reindex operations', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      registry.reindex()
    })
  })
})
