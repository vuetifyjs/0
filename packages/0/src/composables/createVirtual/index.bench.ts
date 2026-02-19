/**
 * useVirtual Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - MUTATION operations create fresh fixtures per iteration (includes setup cost)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, scroll operations, resize operations, scrollTo operations, computed access
 */

import { bench, describe, vi } from 'vitest'

// Utilities
import { ref } from 'vue'

// Types
import type { VirtualContext } from './index'
import type { Ref } from 'vue'

import { createVirtual } from './index'

// =============================================================================
// MOCKS - Required for lifecycle-dependent code
// =============================================================================

vi.mock('#v0/composables/useResizeObserver', () => ({
  useResizeObserver: (target: Ref<HTMLElement | undefined>, callback: (entries: ResizeObserverEntry[]) => void) => {
    if (target.value) {
      callback([{
        target: target.value,
        contentRect: { height: 600, width: 400 },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      }] as unknown as ResizeObserverEntry[])
    }
    return { stop: vi.fn() }
  },
}))

vi.mock('#v0/constants/globals', async () => {
  const actual = await vi.importActual('#v0/constants/globals')
  return {
    ...actual,
    SUPPORTS_OBSERVER: true,
  }
})

// =============================================================================
// FIXTURES - Types and data for benchmarks
// =============================================================================

interface BenchmarkItem {
  id: number
  value: number
}

// Pre-generated item arrays (avoids allocation in benchmarks)
const ITEMS_1K: BenchmarkItem[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  value: i,
}))

const ITEMS_10K: BenchmarkItem[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: i,
  value: i,
}))

const ITEMS_100K: BenchmarkItem[] = Array.from({ length: 100_000 }, (_, i) => ({
  id: i,
  value: i,
}))

// Mock container factory
function createMockContainer (scrollTop = 0): HTMLElement {
  return {
    scrollTop,
    clientHeight: 600,
    scrollHeight: 50_000,
  } as HTMLElement
}

// Fresh virtual instance factory (for mutation benchmarks)
function createVirtualInstance (count: number): VirtualContext<BenchmarkItem> {
  const items = count === 1000
    ? ITEMS_1K
    : (count === 10_000
        ? ITEMS_10K
        : ITEMS_100K)
  const itemsRef = ref(items) as Ref<readonly BenchmarkItem[]>
  const virtual = createVirtual(itemsRef, { itemHeight: 50, height: 600 })
  virtual.element.value = createMockContainer()
  return virtual
}

// Scroll positions for testing (middle of list for realistic access)
const SCROLL_MIDDLE_1K = 25_000 // Middle of 1K items * 50px
const SCROLL_MIDDLE_10K = 250_000 // Middle of 10K items * 50px

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('useVirtual benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create virtual (1,000 items)', () => {
      const items = ref(ITEMS_1K) as Ref<readonly BenchmarkItem[]>
      createVirtual(items, { itemHeight: 50, height: 600 })
    })

    bench('Create virtual (10,000 items)', () => {
      const items = ref(ITEMS_10K) as Ref<readonly BenchmarkItem[]>
      createVirtual(items, { itemHeight: 50, height: 600 })
    })

    bench('Create virtual (100,000 items)', () => {
      const items = ref(ITEMS_100K) as Ref<readonly BenchmarkItem[]>
      createVirtual(items, { itemHeight: 50, height: 600 })
    })
  })

  // ===========================================================================
  // SCROLL OPERATIONS - Binary search and viewport calculation
  // Shared fixture (safe - scroll() reads state without modification)
  // Measures: isolated operation cost without setup overhead
  // ===========================================================================
  describe('scroll operations', () => {
    const virtual1k = createVirtualInstance(1000)
    const virtual10k = createVirtualInstance(10_000)

    bench('Scroll to start position (1,000 items)', () => {
      (virtual1k.element.value as HTMLElement).scrollTop = 0
      virtual1k.scroll()
    })

    bench('Scroll to start position (10,000 items)', () => {
      (virtual10k.element.value as HTMLElement).scrollTop = 0
      virtual10k.scroll()
    })

    bench('Scroll to middle position (1,000 items)', () => {
      (virtual1k.element.value as HTMLElement).scrollTop = SCROLL_MIDDLE_1K
      virtual1k.scroll()
    })

    bench('Scroll to middle position (10,000 items)', () => {
      (virtual10k.element.value as HTMLElement).scrollTop = SCROLL_MIDDLE_10K
      virtual10k.scroll()
    })

    bench('Scroll to end position (1,000 items)', () => {
      (virtual1k.element.value as HTMLElement).scrollTop = 49_400 // Near end
      virtual1k.scroll()
    })

    bench('Scroll to end position (10,000 items)', () => {
      (virtual10k.element.value as HTMLElement).scrollTop = 499_400 // Near end
      virtual10k.scroll()
    })

    bench('Process 100 scroll events (1,000 items)', () => {
      for (let i = 0; i < 100; i++) {
        (virtual1k.element.value as HTMLElement).scrollTop = i * 50
        virtual1k.scroll()
      }
    })

    bench('Process 100 scroll events (10,000 items)', () => {
      for (let i = 0; i < 100; i++) {
        (virtual10k.element.value as HTMLElement).scrollTop = i * 500
        virtual10k.scroll()
      }
    })
  })

  // ===========================================================================
  // RESIZE OPERATIONS - Item height mutations
  // Fresh fixture per iteration (required - resize() modifies internal heights array)
  // Measures: setup + operation cost (unavoidable for mutations)
  // ===========================================================================
  describe('resize operations', () => {
    bench('Resize single item (1,000 items)', () => {
      const virtual = createVirtualInstance(1000)
      virtual.resize(500, 150)
    })

    bench('Resize single item (10,000 items)', () => {
      const virtual = createVirtualInstance(10_000)
      virtual.resize(5000, 150)
    })

    bench('Resize 100 items sequentially (1,000 items)', () => {
      const virtual = createVirtualInstance(1000)
      for (let i = 0; i < 100; i++) {
        virtual.resize(i, 50 + i)
      }
    })

    bench('Resize 100 items sequentially (10,000 items)', () => {
      const virtual = createVirtualInstance(10_000)
      for (let i = 0; i < 100; i++) {
        virtual.resize(i, 50 + i)
      }
    })

    bench('Resize with variable heights (1,000 items)', () => {
      const items = ref(ITEMS_1K) as Ref<readonly BenchmarkItem[]>
      const virtual = createVirtual(items, { itemHeight: null, height: 600 })
      virtual.element.value = createMockContainer()
      for (let i = 0; i < 100; i++) {
        virtual.resize(i, 50 + (i % 10) * 10)
      }
    })
  })

  // ===========================================================================
  // SCROLLTO OPERATIONS - Programmatic scroll position changes
  // Fresh fixture per iteration (required - scrollTo() mutates element.scrollTop)
  // Measures: setup + operation cost
  // ===========================================================================
  describe('scrollTo operations', () => {
    bench('ScrollTo start (1,000 items)', () => {
      const virtual = createVirtualInstance(1000)
      virtual.scrollTo(0)
    })

    bench('ScrollTo start (10,000 items)', () => {
      const virtual = createVirtualInstance(10_000)
      virtual.scrollTo(0)
    })

    bench('ScrollTo middle (1,000 items)', () => {
      const virtual = createVirtualInstance(1000)
      virtual.scrollTo(500)
    })

    bench('ScrollTo middle (10,000 items)', () => {
      const virtual = createVirtualInstance(10_000)
      virtual.scrollTo(5000)
    })

    bench('ScrollTo end (1,000 items)', () => {
      const virtual = createVirtualInstance(1000)
      virtual.scrollTo(999)
    })

    bench('ScrollTo end (10,000 items)', () => {
      const virtual = createVirtualInstance(10_000)
      virtual.scrollTo(9999)
    })

    bench('ScrollTo 5 positions (10,000 items)', () => {
      const virtual = createVirtualInstance(10_000)
      virtual.scrollTo(0)
      virtual.scrollTo(5000)
      virtual.scrollTo(9999)
      virtual.scrollTo(2500)
      virtual.scrollTo(7500)
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - Cached items slice performance
  // Shared fixture (safe - reading computed value, no state changes)
  // Measures: amortized cost of 100 cached reads
  // ===========================================================================
  describe('computed access', () => {
    const virtual1k = createVirtualInstance(1000)
    const virtual10k = createVirtualInstance(10_000)

    // Initialize scroll position for meaningful computed items
    ;(virtual1k.element.value as HTMLElement).scrollTop = SCROLL_MIDDLE_1K
    virtual1k.scroll()
    ;(virtual10k.element.value as HTMLElement).scrollTop = SCROLL_MIDDLE_10K
    virtual10k.scroll()

    bench('Access items 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void virtual1k.items.value.length
      }
    })

    bench('Access items 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void virtual10k.items.value.length
      }
    })

    bench('Access offset 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void virtual1k.offset.value
      }
    })

    bench('Access offset 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void virtual10k.offset.value
      }
    })

    bench('Access size 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void virtual1k.size.value
      }
    })

    bench('Access size 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void virtual10k.size.value
      }
    })
  })
})
