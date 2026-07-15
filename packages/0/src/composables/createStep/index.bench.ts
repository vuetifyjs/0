/**
 * createStep Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - WARM operations (next, prev, first, last, step) share a pre-populated fixture
 *   positioned at a mid-point; the O(n) onboard is hoisted out. next/prev call
 *   the respective sibling op to restore position after each iteration. first/last
 *   alternate to stay warm. step() is called with +1 and -1 alternately.
 * - FRESH fixtures only where the populate IS the measured op (initialization)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, navigation operations (linear, circular, boundary),
 *   computed access
 */

import { bench, describe } from 'vitest'

// Framework
import { createStep } from '@vuetify/v0/composables'

// =============================================================================
// FIXTURES - Created once, reused across read-only benchmarks
// =============================================================================

interface BenchmarkItem {
  id: string
  value: string
}

const ITEMS_1K: BenchmarkItem[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

const ITEMS_10K: BenchmarkItem[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

function createPopulatedStep (count: number, options?: Parameters<typeof createStep>[0]) {
  const step = createStep(options)
  const items = count === 1000 ? ITEMS_1K : ITEMS_10K
  step.onboard(items.slice(0, count))
  return step
}

// Pre-populated shared fixture positioned at mid-point for read/nav benchmarks
const step1k = createPopulatedStep(1000)
step1k.select('item-500')

const step10k = createPopulatedStep(10_000)
step10k.select('item-5000')

const stepCircular1k = createPopulatedStep(1000, { circular: true })
stepCircular1k.select('item-500')

// =============================================================================
// BENCHMARKS
// =============================================================================

describe('createStep benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create empty step', () => {
      createStep()
    })

    bench('Onboard 1,000 items', () => {
      const step = createStep()
      step.onboard(ITEMS_1K)
    })

    bench('Onboard 10,000 items', () => {
      const step = createStep()
      step.onboard(ITEMS_10K)
    })

    bench('Onboard 1,000 items (circular)', () => {
      const step = createStep({ circular: true })
      step.onboard(ITEMS_1K)
    })

    bench('Onboard 1,000 items (mandatory)', () => {
      const step = createStep({ mandatory: true })
      step.onboard(ITEMS_1K)
    })
  })

  // ===========================================================================
  // NAVIGATION OPERATIONS - next / prev / first / last / step
  // WARM: shared fixture positioned at mid-point. next/prev alternate to restore
  // the cursor (net displacement of 0 across pairs). first/last pair similarly.
  // ===========================================================================
  describe('navigation operations (linear)', () => {
    const nav1k = createPopulatedStep(1000)
    nav1k.select('item-500')

    const nav10k = createPopulatedStep(10_000)
    nav10k.select('item-5000')

    bench('next() from mid-point (1,000 items)', () => {
      nav1k.next()
      nav1k.prev()
    })

    bench('next() from mid-point (10,000 items)', () => {
      nav10k.next()
      nav10k.prev()
    })

    bench('prev() from mid-point (1,000 items)', () => {
      nav1k.prev()
      nav1k.next()
    })

    bench('prev() from mid-point (10,000 items)', () => {
      nav10k.prev()
      nav10k.next()
    })

    bench('first() (1,000 items)', () => {
      nav1k.first()
      nav1k.select('item-500')
    })

    bench('last() (1,000 items)', () => {
      nav1k.last()
      nav1k.select('item-500')
    })

    bench('step(+5) from mid-point (1,000 items)', () => {
      nav1k.step(5)
      nav1k.step(-5)
    })

    bench('step(+50) from mid-point (1,000 items)', () => {
      nav1k.step(50)
      nav1k.step(-50)
    })
  })

  // ===========================================================================
  // NAVIGATION OPERATIONS - circular mode (wraps at boundary)
  // ===========================================================================
  describe('navigation operations (circular)', () => {
    const circ1k = createPopulatedStep(1000, { circular: true })
    circ1k.select('item-500')

    bench('next() from mid-point circular (1,000 items)', () => {
      circ1k.next()
      circ1k.prev()
    })

    bench('next() wrapping past end circular (1,000 items)', () => {
      circ1k.last()
      circ1k.next() // wraps to item-0
      circ1k.select('item-999')
    })

    bench('prev() wrapping past start circular (1,000 items)', () => {
      circ1k.first()
      circ1k.prev() // wraps to item-999
      circ1k.select('item-0')
    })
  })

  // ===========================================================================
  // BOUNDARY CONDITIONS - next/prev at start/end (linear, must not move)
  // ===========================================================================
  describe('boundary conditions', () => {
    const bound1k = createPopulatedStep(1000)

    bench('next() at last item — no-op (1,000 items)', () => {
      bound1k.last()
      bound1k.next() // no-op in linear mode
    })

    bench('prev() at first item — no-op (1,000 items)', () => {
      bound1k.first()
      bound1k.prev() // no-op in linear mode
    })
  })

  // ===========================================================================
  // COMPUTED ACCESS - selectedIndex, selectedId, selectedValue
  // Shared fixture (safe - reading .value does not mutate state)
  // ===========================================================================
  describe('computed access', () => {
    bench('Access selectedIndex 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void step1k.selectedIndex.value
      }
    })

    bench('Access selectedIndex 100 times (10,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void step10k.selectedIndex.value
      }
    })

    bench('Access selectedId 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void step1k.selectedId.value
      }
    })

    bench('Access selectedValue 100 times (1,000 items, cached)', () => {
      for (let i = 0; i < 100; i++) {
        void step1k.selectedValue.value
      }
    })
  })
})
