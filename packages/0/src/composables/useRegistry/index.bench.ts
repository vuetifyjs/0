// Composables
import { useRegistry } from './index'

// Utitilties
import { bench, describe } from 'vitest'

describe('useRegistry benchmarks', () => {
  describe('registration', () => {
    bench('registration operations', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }
    })

    bench('unregistration operations', () => {
      const registry = useRegistry()

      for (let i = 0; i < 1000; i++) {
        registry.register({ id: `item-${i}`, value: `value-${i}` })
      }

      for (let i = 0; i < 1000; i++) {
        registry.unregister(`item-${i}`)
      }
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
