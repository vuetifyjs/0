/**
 * createVirtual Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - WARM operations (resize, scrollTo) share a populated instance and time only
 *   the operation — never the O(n) create + item-array setup. resize alternates
 *   the target height each iteration to defeat its `heights[i] === height`
 *   early-bail (a constant height would measure a ~0 cache hit); scrollTo is
 *   index-driven and recomputes on every call, so it needs no reset.
 * - FRESH fixtures only where the populate IS the measured op (initialization)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, scroll operations, resize operations, scrollTo operations, computed access, offset repair, item replacement
 *
 * Goal (10,000 items), mean of the engine bench divided by the reference bench:
 * - Repair offsets after resize <= 1.25 × Tail add reference
 * - Replace keyed items <= 1.35 × Keyed reattach reference
 */

import { bench, describe, vi } from 'vitest'

// Framework
import { createVirtual } from '@vuetify/v0/composables'

// Utilities
import { nextTick, ref, shallowRef, watch } from 'vue'

// Types
import type { VirtualContext } from '@vuetify/v0/composables'
import type { Ref, ShallowRef } from 'vue'

// =============================================================================
// MOCKS - Required for lifecycle-dependent code
// =============================================================================

vi.mock('#v0/composables/useResizeObserver', async () => {
  const actual = await vi.importActual('#v0/composables/useResizeObserver')
  return {
    ...actual,
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
  }
})

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

describe('createVirtual benchmarks', () => {
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
  // WARM: shared instance per bench, alternating the target height each iteration.
  //   resize() early-bails when `heights[index] === height`, so a constant height
  //   would measure a ~0 cache hit after the first call — the toggle keeps every
  //   call doing real work while oscillating between two deterministic states (no
  //   drift). Own instances, not the scroll-group fixtures, since resize mutates
  //   the heights array. Isolates resize from the O(n) create + item-array setup.
  // ===========================================================================
  describe('resize operations', () => {
    const resizeSingle1k = createVirtualInstance(1000)
    let singleHeight1k = 150

    const resizeSingle10k = createVirtualInstance(10_000)
    let singleHeight10k = 150

    const resizeSeq1k = createVirtualInstance(1000)
    let seqParity1k = 0

    const resizeSeq10k = createVirtualInstance(10_000)
    let seqParity10k = 0

    const variableItems = ref(ITEMS_1K) as Ref<readonly BenchmarkItem[]>
    const resizeVariable = createVirtual(variableItems, { itemHeight: null, height: 600 })
    resizeVariable.element.value = createMockContainer()
    let variableParity = 0

    bench('Resize single item (1,000 items)', () => {
      resizeSingle1k.resize(500, singleHeight1k)
      singleHeight1k = singleHeight1k === 150 ? 50 : 150
    })

    bench('Resize single item (10,000 items)', () => {
      resizeSingle10k.resize(5000, singleHeight10k)
      singleHeight10k = singleHeight10k === 150 ? 50 : 150
    })

    bench('Resize 100 items sequentially (1,000 items)', () => {
      for (let i = 0; i < 100; i++) {
        resizeSeq1k.resize(i, 50 + i + seqParity1k)
      }
      seqParity1k = seqParity1k === 0 ? 1 : 0
    })

    bench('Resize 100 items sequentially (10,000 items)', () => {
      for (let i = 0; i < 100; i++) {
        resizeSeq10k.resize(i, 50 + i + seqParity10k)
      }
      seqParity10k = seqParity10k === 0 ? 1 : 0
    })

    bench('Resize with variable heights (1,000 items)', () => {
      for (let i = 0; i < 100; i++) {
        resizeVariable.resize(i, 50 + (i % 10) * 10 + variableParity)
      }
      variableParity = variableParity === 0 ? 1 : 0
    })
  })

  // ===========================================================================
  // SCROLLTO OPERATIONS - Programmatic scroll position changes
  // WARM: shared instance per size. scrollTo() sets element.scrollTop and calls
  //   update() synchronously, recomputing the visible window (binary search) on
  //   every call regardless of the target — so no reset is needed and no memoized
  //   read is skipped (same pattern as the shared "scroll operations" group).
  //   Isolates scrollTo from the O(n) create + item-array setup.
  // ===========================================================================
  describe('scrollTo operations', () => {
    const scrollTo1k = createVirtualInstance(1000)
    const scrollTo10k = createVirtualInstance(10_000)

    bench('ScrollTo start (1,000 items)', () => {
      scrollTo1k.scrollTo(0)
    })

    bench('ScrollTo start (10,000 items)', () => {
      scrollTo10k.scrollTo(0)
    })

    bench('ScrollTo middle (1,000 items)', () => {
      scrollTo1k.scrollTo(500)
    })

    bench('ScrollTo middle (10,000 items)', () => {
      scrollTo10k.scrollTo(5000)
    })

    bench('ScrollTo end (1,000 items)', () => {
      scrollTo1k.scrollTo(999)
    })

    bench('ScrollTo end (10,000 items)', () => {
      scrollTo10k.scrollTo(9999)
    })

    bench('ScrollTo 5 positions (10,000 items)', () => {
      scrollTo10k.scrollTo(0)
      scrollTo10k.scrollTo(5000)
      scrollTo10k.scrollTo(9999)
      scrollTo10k.scrollTo(2500)
      scrollTo10k.scrollTo(7500)
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

  // ===========================================================================
  // OFFSET REPAIR - one measured row forces a 10,000-wide offset update
  // WARM: shared instance. resize() early-bails on an unchanged height, so the
  // height toggles between two values. A synchronous animation frame is
  // installed per task (setup/teardown), so the tail add runs inside resize()
  // and the other benches keep the native scheduler.
  // The drift check runs on the first warmup call, outside the measured samples.
  // Goal: Repair offsets after resize <= 1.25 × Tail add reference.
  // ===========================================================================
  describe('offset repair', () => {
    const nativeFrame = globalThis.requestAnimationFrame
    const nativeCancel = globalThis.cancelAnimationFrame
    const nativeWindowFrame = globalThis.window?.requestAnimationFrame
    function syncFrame (callback: FrameRequestCallback) {
      callback(0)
      return 1
    }

    const repair = createVirtualInstance(10_000)
    const repairEl = repair.element.value as HTMLElement
    let nextHeight = 80
    let proved = false

    const tail = Array.from({ length: 10_000 }, (_, index) => index * 50)
    let tailNext = 80
    let tailPrev = 50
    let sink = 0

    bench('Repair offsets after resize (10,000 items)', () => {
      const written = nextHeight
      repair.resize(0, written)
      if (!proved) {
        proved = true
        repair.scrollTo(1)
        const head = repairEl.scrollTop
        repair.scrollTo(5_000)
        const mid = repairEl.scrollTop
        if (head !== written || mid !== head + 4_999 * 50) {
          throw new Error(`resize repair drifted: head ${head}, mid ${mid}, written ${written}`)
        }
      }
      nextHeight = nextHeight === 80 ? 64 : 80
    }, {
      setup () {
        globalThis.requestAnimationFrame = syncFrame
        globalThis.cancelAnimationFrame = () => {}
        if (globalThis.window) globalThis.window.requestAnimationFrame = syncFrame
      },
      teardown () {
        globalThis.requestAnimationFrame = nativeFrame
        globalThis.cancelAnimationFrame = nativeCancel
        if (globalThis.window && nativeWindowFrame) {
          globalThis.window.requestAnimationFrame = nativeWindowFrame
        }
      },
    })

    bench('Tail add reference (10,000 items)', () => {
      const delta = tailNext - tailPrev
      tailPrev = tailNext

      for (let i = 1; i < 10_000; i++) tail[i] = tail[i]! + delta
      tailNext = tailNext === 80 ? 64 : 80
      sink = tail[9_999]!
    })

    void sink
  })

  // ===========================================================================
  // ITEM REPLACEMENT - keyed reattach of stored heights, one pass
  // WARM: lists are built once. The timed region is the assignment plus the
  // pre-flush watch (nextTick), which is where the walk runs. Same length so
  // the cost is the walk, not an allocation of a longer list. Departed keys
  // are dropped. The map is primed here, at collection, with a no-op frame so
  // the prime stays O(n) and no bench inherits that frame.
  // The drift check runs on the first warmup call, outside the measured samples.
  // Goal: Replace keyed items <= 1.35 × Keyed reattach reference.
  // ===========================================================================
  describe('item replacement', () => {
    const shifted: BenchmarkItem[] = Array.from({ length: 10_000 }, (_, i) => ({
      id: i + 1,
      value: i + 1,
    }))
    const lists = [ITEMS_10K, shifted]
    const keyedItems = shallowRef(ITEMS_10K) as ShallowRef<readonly BenchmarkItem[]>
    const keyed = createVirtual(keyedItems, {
      itemHeight: 50,
      height: 600,
      itemKey: (item: BenchmarkItem) => item.id,
    })
    const keyedEl = createMockContainer()
    keyed.element.value = keyedEl

    const primeFrame = globalThis.requestAnimationFrame
    const primeCancel = globalThis.cancelAnimationFrame
    const primeWindowFrame = globalThis.window?.requestAnimationFrame
    function ignoreFrame () {
      return 1
    }
    function ignoreCancel () {}
    globalThis.requestAnimationFrame = ignoreFrame
    globalThis.cancelAnimationFrame = ignoreCancel
    if (globalThis.window) globalThis.window.requestAnimationFrame = ignoreFrame
    try {
      for (let i = 0; i < 10_000; i++) keyed.resize(i, 40 + (i % 17))
    } finally {
      globalThis.requestAnimationFrame = primeFrame
      globalThis.cancelAnimationFrame = primeCancel
      if (globalThis.window && primeWindowFrame) {
        globalThis.window.requestAnimationFrame = primeWindowFrame
      }
    }

    let which = 1
    let proved = false
    const probe = shallowRef(0)
    let live = new Map<number, number>()
    const refHeights = Array.from({ length: 10_000 }, () => 0)
    const refOffsets = Array.from({ length: 10_000 }, () => 0)
    let sink = 0

    for (let i = 0; i < 10_000; i++) live.set(i, 40 + (i % 17))

    watch(probe, () => {
      const rows = lists[probe.value & 1]!
      const next = new Map<number, number>()
      const fallback = 50
      let sum = 0
      const length = rows.length

      for (let i = 0; i < length; i++) {
        const id = rows[i]!.id
        const known = live.get(id)
        if (typeof known === 'number') {
          refHeights[i] = known
          next.set(id, known)
          refOffsets[i] = sum
          sum += known || fallback
        } else {
          refHeights[i] = 0
          refOffsets[i] = sum
          sum += fallback
        }
      }
      live = next
      sink = sum
    })

    bench('Replace keyed items (10,000 items)', async () => {
      keyedItems.value = lists[which]!
      which ^= 1
      await nextTick()
      if (!proved) {
        proved = true
        // First assignment is `shifted`: index 0 is id 1, primed at 41.
        keyed.scrollTo(1)
        if (keyedEl.scrollTop !== 41) {
          throw new Error(`keyed reattach drifted: head ${keyedEl.scrollTop}`)
        }
      }
    })

    bench('Keyed reattach reference (10,000 items)', async () => {
      probe.value++
      await nextTick()
    })

    void sink
  })
})
