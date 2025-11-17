// Composables
import { useVirtual } from './index'

// Vue
import { ref } from 'vue'

// Utilities
import { bench, describe, vi } from 'vitest'

// Mock useResizeObserver to avoid lifecycle hook warnings
vi.mock('#v0/composables/useResizeObserver', () => ({
  useResizeObserver: (target: any, callback: any) => {
    // Immediately trigger callback with mock dimensions if target has value
    if (target.value) {
      callback([{
        target: target.value,
        contentRect: { height: 600, width: 400 },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      }])
    }
    return { stop: vi.fn() }
  },
}))

// Mock SUPPORTS_OBSERVER
vi.mock('#v0/constants/globals', async () => {
  const actual = await vi.importActual('#v0/constants/globals')
  return {
    ...actual,
    SUPPORTS_OBSERVER: true,
  }
})

describe('useVirtual benchmarks', () => {
  describe('initialization', () => {
    bench('initialize with 1,000 items', () => {
      const items = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i })))
      useVirtual(items, { itemHeight: 50, height: 600 })
    })

    bench('initialize with 10,000 items', () => {
      const items = ref(Array.from({ length: 10_000 }, (_, i) => ({ id: i, value: i })))
      useVirtual(items, { itemHeight: 50, height: 600 })
    })

    bench('initialize with 100,000 items', () => {
      const items = ref(Array.from({ length: 100_000 }, (_, i) => ({ id: i, value: i })))
      useVirtual(items, { itemHeight: 50, height: 600 })
    })
  })

  describe('offset calculation (rebuild)', () => {
    bench('rebuild offsets for 1,000 items', () => {
      const items = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i })))
      useVirtual(items, { itemHeight: 50, height: 600 })

      // Trigger rebuild by changing items
      items.value = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i * 2 }))
    })

    bench('rebuild offsets for 10,000 items', () => {
      const items = ref(Array.from({ length: 10_000 }, (_, i) => ({ id: i, value: i })))
      useVirtual(items, { itemHeight: 50, height: 600 })

      items.value = Array.from({ length: 10_000 }, (_, i) => ({ id: i, value: i * 2 }))
    })

    bench('rebuild offsets with mixed heights', () => {
      const items = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      // Simulate varied heights
      for (let i = 0; i < 100; i++) {
        virtual.resize(i, 50 + (i % 5) * 10)
      }
    })
  })

  describe('binary search (findIndex)', () => {
    bench('binary search in 10,000 offsets - start', () => {
      const items = ref(Array.from({ length: 10_000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      // Mock container
      const mockContainer = {
        scrollTop: 0,
        clientHeight: 600,
      } as HTMLElement

      virtual.element.value = mockContainer
      virtual.scroll()
    })

    bench('binary search in 10,000 offsets - middle', () => {
      const items = ref(Array.from({ length: 10_000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      const mockContainer = {
        scrollTop: 250_000, // Middle of list
        clientHeight: 600,
      } as HTMLElement

      virtual.element.value = mockContainer
      virtual.scroll()
    })

    bench('binary search in 10,000 offsets - end', () => {
      const items = ref(Array.from({ length: 10_000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      const mockContainer = {
        scrollTop: 500_000, // Near end
        clientHeight: 600,
      } as HTMLElement

      virtual.element.value = mockContainer
      virtual.scroll()
    })
  })

  describe('scroll operations', () => {
    bench('handle scroll event (1,000 items)', () => {
      const items = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      const mockContainer = {
        scrollTop: 5000,
        clientHeight: 600,
      } as HTMLElement

      virtual.element.value = mockContainer

      for (let i = 0; i < 100; i++) {
        mockContainer.scrollTop = i * 50
        virtual.scroll()
      }
    })

    bench('handle scroll event (10,000 items)', () => {
      const items = ref(Array.from({ length: 10_000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      const mockContainer = {
        scrollTop: 5000,
        clientHeight: 600,
      } as HTMLElement

      virtual.element.value = mockContainer

      for (let i = 0; i < 100; i++) {
        mockContainer.scrollTop = i * 500
        virtual.scroll()
      }
    })
  })

  describe('scrollToIndex operations', () => {
    bench('scroll to various indices (10,000 items)', () => {
      const items = ref(Array.from({ length: 10_000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      const mockContainer = {
        scrollTop: 0,
        clientHeight: 600,
      } as HTMLElement

      virtual.element.value = mockContainer

      virtual.scrollTo(0)
      virtual.scrollTo(5000)
      virtual.scrollTo(9999)
      virtual.scrollTo(2500)
      virtual.scrollTo(7500)
    })
  })

  describe('item resize operations', () => {
    bench('resize single item', () => {
      const items = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      virtual.resize(100, 150)
    })

    bench('resize multiple items sequentially', () => {
      const items = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      for (let i = 0; i < 100; i++) {
        virtual.resize(i, 50 + i)
      }
    })

    bench('dynamic heights (no initial height)', () => {
      const items = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: null, height: 600 })

      for (let i = 0; i < 100; i++) {
        virtual.resize(i, 50 + (i % 10) * 10)
      }
    })
  })

  describe('computed items', () => {
    bench('access computed items (1,000 total)', () => {
      const items = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      const mockContainer = {
        scrollTop: 5000,
        clientHeight: 600,
      } as HTMLElement

      virtual.element.value = mockContainer
      virtual.scroll()

      for (let i = 0; i < 100; i++) {
        void virtual.items.value.length
      }
    })

    bench('access computed items (10,000 total)', () => {
      const items = ref(Array.from({ length: 10_000 }, (_, i) => ({ id: i, value: i })))
      const virtual = useVirtual(items, { itemHeight: 50, height: 600 })

      const mockContainer = {
        scrollTop: 50_000,
        clientHeight: 600,
      } as HTMLElement

      virtual.element.value = mockContainer
      virtual.scroll()

      for (let i = 0; i < 100; i++) {
        void virtual.items.value.length
      }
    })
  })
})
