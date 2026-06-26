/**
 * createSortable Performance Benchmarks
 *
 * Structure:
 * - READ-ONLY operations use shared fixtures (safe, isolates operation cost)
 * - MUTATION operations create fresh fixtures per iteration (includes setup cost)
 * - Tests both 1,000 and 10,000 item datasets
 * - Categories: initialization, lookup operations, move operations, swap operations, reorder operations, batch operations, events overhead
 */

import { bench, describe } from 'vitest'

import { createSortable } from './index'

// Types
import type { SortableContext, SortableTicket, SortableTicketInput } from './index'

interface BenchmarkItem {
  id: string
  value: string
}

const ITEMS_100: BenchmarkItem[] = Array.from({ length: 100 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

const ITEMS_1K: BenchmarkItem[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

const ITEMS_10K: BenchmarkItem[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: `item-${i}`,
  value: `value-${i}`,
}))

function createPopulatedSortable (
  count: number,
  options?: Parameters<typeof createSortable>[0],
): SortableContext<SortableTicketInput, SortableTicket> {
  const sortable = createSortable(options)
  const items = count === 100 ? ITEMS_100 : (count === 1000 ? ITEMS_1K : ITEMS_10K)
  sortable.onboard(items.slice(0, count))
  return sortable
}

const FIRST_ID = 'item-0'
const MID_ID_1K = 'item-500'
const MID_ID_10K = 'item-5000'
const MID_INDEX_1K = 500
const MID_INDEX_10K = 5000
const LAST_INDEX_1K = 999
const LAST_INDEX_10K = 9999
const SWAP_A_1K = 'item-100'
const SWAP_B_1K = 'item-900'
const SWAP_A_10K = 'item-1000'
const SWAP_B_10K = 'item-9000'

const PERMUTATION_1K = ITEMS_1K.map(item => item.id).toReversed()
const PERMUTATION_10K = ITEMS_10K.map(item => item.id).toReversed()

// Pre-populated shared fixtures for read-only benchmarks
const sortable1k = createPopulatedSortable(1000)
const sortable10k = createPopulatedSortable(10_000)

describe('createSortable benchmarks', () => {
  // ===========================================================================
  // INITIALIZATION - Measures setup/creation cost
  // Fresh fixture per iteration (required - we're measuring creation itself)
  // ===========================================================================
  describe('initialization', () => {
    bench('Create empty sortable', () => {
      createSortable()
    })

    bench('Create empty sortable (disabled)', () => {
      createSortable({ disabled: true })
    })
  })

  // ===========================================================================
  // LOOKUP OPERATIONS - Inherited from registry; confirms sortable adds no overhead
  // Shared fixture (safe - read-only operations, no state changes)
  // ===========================================================================
  describe('lookup operations', () => {
    bench('Get by id (1,000 items)', () => {
      sortable1k.get(MID_ID_1K)
    })

    bench('Get by id (10,000 items)', () => {
      sortable10k.get(MID_ID_10K)
    })

    bench('Values snapshot (10,000 items)', () => {
      sortable10k.values()
    })
  })

  // ===========================================================================
  // MOVE OPERATIONS - Index reassignment with cascade shift
  // 1K benches: fresh fixture per iteration (setup cost is acceptable)
  // 10K benches: shared fixture with alternating targets (self-inverting: odd
  //   iterations move forward, even iterations restore; both have identical
  //   O(n) map-rebuild cost, isolating move from O(n) onboard setup cost)
  // ===========================================================================
  describe('move operations', () => {
    const sortable10kMoveFirstLast = createPopulatedSortable(10_000)
    let moveFirstLastTarget = LAST_INDEX_10K

    const sortable10kMoveMid = createPopulatedSortable(10_000)
    let moveMidTarget = MID_INDEX_10K + 1

    bench('Move first to last (1,000 items)', () => {
      const sortable = createPopulatedSortable(1000)
      sortable.move(FIRST_ID, LAST_INDEX_1K)
    })

    bench('Move first to last (10,000 items)', () => {
      sortable10kMoveFirstLast.move(FIRST_ID, moveFirstLastTarget)
      moveFirstLastTarget = moveFirstLastTarget === LAST_INDEX_10K ? 0 : LAST_INDEX_10K
    })

    bench('Move mid by 1 (1,000 items)', () => {
      const sortable = createPopulatedSortable(1000)
      sortable.move(MID_ID_1K, MID_INDEX_1K + 1)
    })

    bench('Move mid by 1 (10,000 items)', () => {
      sortable10kMoveMid.move(MID_ID_10K, moveMidTarget)
      moveMidTarget = moveMidTarget === MID_INDEX_10K + 1 ? MID_INDEX_10K : MID_INDEX_10K + 1
    })
  })

  // ===========================================================================
  // SWAP OPERATIONS - Two-position exchange via batched moves
  // 1K benches: fresh fixture per iteration (setup cost is acceptable)
  // 10K benches: shared fixture — swap is self-inverting (A↔B then B↔A =
  //   identity), isolating dual-move cost from O(n) onboard setup cost
  // ===========================================================================
  describe('swap operations', () => {
    const sortable10kSwap = createPopulatedSortable(10_000)

    bench('Swap two tickets (1,000 items)', () => {
      const sortable = createPopulatedSortable(1000)
      sortable.swap(SWAP_A_1K, SWAP_B_1K)
    })

    bench('Swap two tickets (10,000 items)', () => {
      sortable10kSwap.swap(SWAP_A_10K, SWAP_B_10K)
    })
  })

  // ===========================================================================
  // REORDER OPERATIONS - Bulk permutation: validation pass + full reindex
  // 1K benches: fresh fixture per iteration (setup cost is acceptable)
  // 10K benches: shared fixture with alternating permutations (reversed↔original
  //   is self-inverting), isolating reorder cost from O(n) onboard setup cost
  // ===========================================================================
  describe('reorder operations', () => {
    const PERMUTATION_10K_ORIG = ITEMS_10K.map(item => item.id)
    const sortable10kReorder = createPopulatedSortable(10_000)
    let reorderTarget = PERMUTATION_10K

    bench('Reorder reverse (1,000 items)', () => {
      const sortable = createPopulatedSortable(1000)
      sortable.reorder(PERMUTATION_1K)
    })

    bench('Reorder reverse (10,000 items)', () => {
      sortable10kReorder.reorder(reorderTarget)
      reorderTarget = reorderTarget === PERMUTATION_10K ? PERMUTATION_10K_ORIG : PERMUTATION_10K
    })
  })

  // ===========================================================================
  // BATCH OPERATIONS - Bulk register / register-then-move composite
  // Fresh fixture per iteration (required - mutations change state)
  // Measures: initial hydration cost and the drag-drop "insert at position" pattern
  // ===========================================================================
  describe('batch operations', () => {
    bench('Onboard 100 items', () => {
      const sortable = createSortable()
      sortable.onboard(ITEMS_100)
    })

    bench('Onboard 1,000 items', () => {
      const sortable = createSortable()
      sortable.onboard(ITEMS_1K)
    })

    bench('Onboard 10,000 items', () => {
      const sortable = createSortable()
      sortable.onboard(ITEMS_10K)
    })

    bench('Register then move to mid (1,000 items)', () => {
      const sortable = createPopulatedSortable(1000)
      const ticket = sortable.register({ value: 'inserted' })
      sortable.move(ticket.id, MID_INDEX_1K)
    })

    bench('Register then move to mid (10,000 items)', () => {
      const sortable = createPopulatedSortable(10_000)
      const ticket = sortable.register({ value: 'inserted' })
      sortable.move(ticket.id, MID_INDEX_10K)
    })
  })

  // ===========================================================================
  // EVENTS OVERHEAD - Quantifies move:ticket emit cost
  // 1K benches: fresh fixture per iteration (setup cost is acceptable)
  // 10K benches: shared fixtures with alternating move targets (self-inverting),
  //   isolating listener overhead from O(n) onboard setup cost
  // Note: events:true is hardcoded inside createSortable, so the meaningful
  // comparison is "no listeners attached" vs "one listener attached"
  // ===========================================================================
  describe('events overhead', () => {
    const sortable10kNoListener = createPopulatedSortable(10_000)
    let noListenerMidTarget = MID_INDEX_10K + 1

    const sortable10kWithListener = createPopulatedSortable(10_000)
    sortable10kWithListener.on('move:ticket', () => {})
    let withListenerMidTarget = MID_INDEX_10K + 1

    bench('Move with no listeners (1,000 items)', () => {
      const sortable = createPopulatedSortable(1000)
      sortable.move(MID_ID_1K, MID_INDEX_1K + 1)
    })

    bench('Move with listener attached (1,000 items)', () => {
      const sortable = createPopulatedSortable(1000)
      sortable.on('move:ticket', () => {})
      sortable.move(MID_ID_1K, MID_INDEX_1K + 1)
    })

    bench('Move with no listeners (10,000 items)', () => {
      sortable10kNoListener.move(MID_ID_10K, noListenerMidTarget)
      noListenerMidTarget = noListenerMidTarget === MID_INDEX_10K + 1 ? MID_INDEX_10K : MID_INDEX_10K + 1
    })

    bench('Move with listener attached (10,000 items)', () => {
      sortable10kWithListener.move(MID_ID_10K, withListenerMidTarget)
      withListenerMidTarget = withListenerMidTarget === MID_INDEX_10K + 1 ? MID_INDEX_10K : MID_INDEX_10K + 1
    })
  })
})
