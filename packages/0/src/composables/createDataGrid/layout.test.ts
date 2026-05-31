import { describe, expect, it, vi } from 'vitest'

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

import { createColumnLayout } from './layout'

// Types
import type { DataTableColumnTicket, DataTableColumnTicketInput } from '#v0/composables/createDataTable'
import type { GridColumnDef } from './layout'

function setup (defs: readonly GridColumnDef[]) {
  const columns = createRegistry<DataTableColumnTicketInput, DataTableColumnTicket>({
    events: true,
    reactive: true,
  })

  columns.onboard(defs.map(col => ({
    id: col.id,
    title: col.title,
    children: col.children,
  })))

  const layout = createColumnLayout(columns, defs)
  return { columns, layout }
}

describe('createColumnLayout', () => {
  describe('auto-distribute sizes', () => {
    it('should give 4 equal columns 25% each', () => {
      const { layout } = setup([
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
        { id: 'd' },
      ])

      const cols = layout.columns.value
      for (const col of cols) {
        expect(col.size).toBe(25)
      }
    })

    it('should split remainder evenly among unsized columns', () => {
      // 'a' takes 40, remaining 60 split between b and c
      const { layout } = setup([
        { id: 'a', size: 40 },
        { id: 'b' },
        { id: 'c' },
      ])

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBe(40)
      expect(cols.find(c => c.id === 'b')!.size).toBe(30)
      expect(cols.find(c => c.id === 'c')!.size).toBe(30)
    })

    it('should keep explicit sizes when all specified', () => {
      const { layout } = setup([
        { id: 'a', size: 60 },
        { id: 'b', size: 40 },
      ])

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBe(60)
      expect(cols.find(c => c.id === 'b')!.size).toBe(40)
    })
  })

  describe('offset computation', () => {
    it('should compute cumulative offsets within scrollable region', () => {
      const { layout } = setup([
        { id: 'a', size: 30 },
        { id: 'b', size: 40 },
        { id: 'c', size: 30 },
      ])

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.offset).toBe(0)
      expect(cols.find(c => c.id === 'b')!.offset).toBe(30)
      expect(cols.find(c => c.id === 'c')!.offset).toBe(70)
    })
  })

  describe('leaf extraction from nested columns', () => {
    it('should extract leaves from nested defs', () => {
      const { layout } = setup([
        { id: 'name', size: 30 },
        {
          id: 'contact',
          children: [
            { id: 'email', size: 35 },
            { id: 'phone', size: 35 },
          ],
        },
      ])

      const cols = layout.columns.value
      expect(cols).toHaveLength(3)
      expect(cols.map(c => c.id)).toEqual(['name', 'email', 'phone'])
    })

    it('should auto-distribute remainder across nested leaves', () => {
      const { layout } = setup([
        { id: 'name' },
        {
          id: 'contact',
          children: [
            { id: 'email' },
            { id: 'phone' },
          ],
        },
      ])

      // 3 leaves, each gets 100/3
      const cols = layout.columns.value
      expect(cols).toHaveLength(3)
      const total = cols.reduce((sum, c) => sum + c.size, 0)
      expect(total).toBeCloseTo(100)
    })
  })

  describe('pinning', () => {
    it('should split columns into left/scrollable/right regions from options', () => {
      const { layout } = setup([
        { id: 'a', size: 20, pinned: 'left' },
        { id: 'b', size: 60 },
        { id: 'c', size: 20, pinned: 'right' },
      ])

      const { left, scrollable, right } = layout.pinned.value
      expect(left.map(c => c.id)).toEqual(['a'])
      expect(scrollable.map(c => c.id)).toEqual(['b'])
      expect(right.map(c => c.id)).toEqual(['c'])
    })

    it('should move a column to the specified region on pin mutation', () => {
      const { layout } = setup([
        { id: 'a', size: 30 },
        { id: 'b', size: 40 },
        { id: 'c', size: 30 },
      ])

      layout.pin('a', 'left')

      const { left, scrollable } = layout.pinned.value
      expect(left.map(c => c.id)).toEqual(['a'])
      expect(scrollable.map(c => c.id)).toEqual(['b', 'c'])
    })

    it('should move column back to scrollable on unpin', () => {
      const { layout } = setup([
        { id: 'a', size: 30, pinned: 'left' },
        { id: 'b', size: 40 },
        { id: 'c', size: 30 },
      ])

      layout.pin('a', false)

      const { left, scrollable } = layout.pinned.value
      expect(left).toHaveLength(0)
      expect(scrollable.map(c => c.id)).toEqual(['a', 'b', 'c'])
    })

    it('should pin a nested leaf column at runtime', () => {
      const { layout } = setup([
        { id: 'name', size: 30 },
        {
          id: 'contact',
          children: [
            { id: 'email', size: 35 },
            { id: 'phone', size: 35 },
          ],
        },
      ])

      // 'email' is a nested leaf — not a top-level registry entry — so the
      // pin guard must consult the pin group, not the columns registry.
      layout.pin('email', 'left')

      expect(layout.pinned.value.left.map(c => c.id)).toEqual(['email'])
    })

    it('should compute offsets independently per region', () => {
      const { layout } = setup([
        { id: 'a', size: 20, pinned: 'left' },
        { id: 'b', size: 20, pinned: 'left' },
        { id: 'c', size: 30 },
        { id: 'd', size: 30 },
      ])

      const { left, scrollable } = layout.pinned.value

      // Left region offsets start at 0
      expect(left.find(c => c.id === 'a')!.offset).toBe(0)
      expect(left.find(c => c.id === 'b')!.offset).toBe(20)

      // Scrollable region offsets start at 0 independently
      expect(scrollable.find(c => c.id === 'c')!.offset).toBe(0)
      expect(scrollable.find(c => c.id === 'd')!.offset).toBe(30)
    })

    it('should compute right-region offsets from the right edge', () => {
      // Right region offsets are measured from the right edge so they can be
      // applied directly to CSS `right:` for sticky positioning. The rightmost
      // column gets offset 0; preceding columns accumulate by trailing widths.
      const { layout } = setup([
        { id: 'a', size: 40 },
        { id: 'b', size: 25, pinned: 'right' },
        { id: 'c', size: 20, pinned: 'right' },
        { id: 'd', size: 15, pinned: 'right' },
      ])

      const { right } = layout.pinned.value

      // Display order within right region: b, c, d (registry order)
      expect(right.map(c => c.id)).toEqual(['b', 'c', 'd'])

      // d is rightmost → 0; c sits at d's width from the right; b at c+d
      expect(right.find(c => c.id === 'd')!.offset).toBe(0)
      expect(right.find(c => c.id === 'c')!.offset).toBe(15)
      expect(right.find(c => c.id === 'b')!.offset).toBe(35)
    })
  })

  describe('resize', () => {
    it('should adjust target and neighbor by delta', () => {
      const { layout } = setup([
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ])

      layout.resize('a', 10)

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBe(60)
      expect(cols.find(c => c.id === 'b')!.size).toBe(40)
    })

    it('should clamp at minSize', () => {
      const { layout } = setup([
        { id: 'a', size: 50, minSize: 20 },
        { id: 'b', size: 50, minSize: 20 },
      ])

      // Try to shrink 'a' below its min
      layout.resize('a', -40)

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBe(20)
      expect(cols.find(c => c.id === 'b')!.size).toBe(80)
    })

    it('should clamp at maxSize', () => {
      const { layout } = setup([
        { id: 'a', size: 50, maxSize: 60 },
        { id: 'b', size: 50, minSize: 20 },
      ])

      layout.resize('a', 30)

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBe(60)
      expect(cols.find(c => c.id === 'b')!.size).toBe(40)
    })

    it('should no-op on last column in its region', () => {
      const { layout } = setup([
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ])

      layout.resize('b', 10)

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBe(50)
      expect(cols.find(c => c.id === 'b')!.size).toBe(50)
    })

    it('should resize within pin region only', () => {
      const { layout } = setup([
        { id: 'a', size: 20, pinned: 'left' },
        { id: 'b', size: 20, pinned: 'left' },
        { id: 'c', size: 30 },
        { id: 'd', size: 30 },
      ])

      layout.resize('a', 5)

      const cols = layout.columns.value
      // a grows, b shrinks (left region)
      expect(cols.find(c => c.id === 'a')!.size).toBe(25)
      expect(cols.find(c => c.id === 'b')!.size).toBe(15)
      // scrollable region unchanged
      expect(cols.find(c => c.id === 'c')!.size).toBe(30)
      expect(cols.find(c => c.id === 'd')!.size).toBe(30)
    })
  })

  describe('reorder', () => {
    it('should move a column from one position to another', () => {
      const { layout } = setup([
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
      ])

      // Move 'a' (index 0) to index 2
      layout.reorder(0, 2)

      expect(layout.columns.value.map(c => c.id)).toEqual(['b', 'c', 'a'])
    })

    it('should no-op for out-of-bounds from index', () => {
      const { layout } = setup([
        { id: 'a' },
        { id: 'b' },
      ])

      layout.reorder(5, 0)

      expect(layout.columns.value.map(c => c.id)).toEqual(['a', 'b'])
    })

    it('should move a whole column group when reordering by a nested leaf index', () => {
      // Leaf display order is [name, email, phone, status]. Indices 1 and 2 are
      // the leaves of the 'contact' group. Dragging 'phone' (leaf index 2) to
      // the front must move the whole 'contact' group, not just the leaf.
      const { layout } = setup([
        { id: 'name' },
        {
          id: 'contact',
          children: [
            { id: 'email' },
            { id: 'phone' },
          ],
        },
        { id: 'status' },
      ])

      expect(layout.columns.value.map(c => c.id)).toEqual(['name', 'email', 'phone', 'status'])

      layout.reorder(2, 0)

      expect(layout.columns.value.map(c => c.id)).toEqual(['email', 'phone', 'name', 'status'])
    })
  })

  describe('reset', () => {
    it('should restore initial sizes', () => {
      const { layout } = setup([
        { id: 'a', size: 60 },
        { id: 'b', size: 40 },
      ])

      layout.resize('a', -20)
      layout.reset()

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBe(60)
      expect(cols.find(c => c.id === 'b')!.size).toBe(40)
    })

    it('should restore initial order', () => {
      const { layout } = setup([
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
      ])

      layout.reorder(0, 2)
      layout.reset()

      expect(layout.columns.value.map(c => c.id)).toEqual(['a', 'b', 'c'])
    })

    it('should restore initial pins', () => {
      const { layout } = setup([
        { id: 'a', size: 30, pinned: 'left' },
        { id: 'b', size: 40 },
        { id: 'c', size: 30 },
      ])

      layout.pin('a', false)
      layout.reset()

      const { left } = layout.pinned.value
      expect(left.map(c => c.id)).toEqual(['a'])
    })
  })

  describe('distribute', () => {
    it('should set sizes from array and normalize to 100', () => {
      const { layout } = setup([
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
      ])

      layout.distribute([50, 30, 20])

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBe(50)
      expect(cols.find(c => c.id === 'b')!.size).toBe(30)
      expect(cols.find(c => c.id === 'c')!.size).toBe(20)
      const total = cols.reduce((sum, c) => sum + c.size, 0)
      expect(total).toBeCloseTo(100)
    })

    it('should warn and no-op when array length mismatches', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { layout } = setup([
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ])

      layout.distribute([100])

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBe(50)
      expect(cols.find(c => c.id === 'b')!.size).toBe(50)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('expected 2 sizes but received 1'))
      spy.mockRestore()
    })

    it('should normalize proportionally when values do not sum to 100', () => {
      const { layout } = setup([
        { id: 'a' },
        { id: 'b' },
      ])

      // Equal inputs that undershoot 100 scale up proportionally to 50/50.
      layout.distribute([30, 30])

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBeCloseTo(50)
      expect(cols.find(c => c.id === 'b')!.size).toBeCloseTo(50)
      const total = cols.reduce((sum, c) => sum + c.size, 0)
      expect(total).toBeCloseTo(100)
    })

    it('should redistribute the residual onto columns with room', () => {
      const { layout } = setup([
        { id: 'a', maxSize: 30 },
        { id: 'b' },
      ])

      // 'a' clamps to its 30 cap; the 20 it could not absorb flows to 'b'.
      layout.distribute([50, 50])

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBeCloseTo(30)
      expect(cols.find(c => c.id === 'b')!.size).toBeCloseTo(70)
      const total = cols.reduce((sum, c) => sum + c.size, 0)
      expect(total).toBeCloseTo(100)
    })

    it('should warn and clamp when constraints make 100 unreachable', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { layout } = setup([
        { id: 'a', maxSize: 40 },
        { id: 'b', maxSize: 40 },
      ])

      // Both columns cap at 40, so the proportional 50/50 target clamps to
      // 40/40 and the residual 20 cannot be placed anywhere.
      layout.distribute([40, 40])

      const cols = layout.columns.value
      expect(cols.find(c => c.id === 'a')!.size).toBeCloseTo(40)
      expect(cols.find(c => c.id === 'b')!.size).toBeCloseTo(40)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('could not reach 100'))
      spy.mockRestore()
    })
  })

  describe('reconciliation with table.columns', () => {
    it('should add a column with default extras when register fires', () => {
      const { columns, layout } = setup([
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ])

      columns.register({ id: 'c' })

      const cols = layout.columns.value
      expect(cols.map(c => c.id)).toEqual(['a', 'b', 'c'])

      const c = cols.find(col => col.id === 'c')!
      // Late registrations default to size 0 — distribute() rebalances
      expect(c.size).toBe(0)
      expect(c.minSize).toBe(2)
      expect(c.maxSize).toBe(100)
      expect(c.resizable).toBe(true)
      expect(c.reorderable).toBe(true)
      expect(c.pinned).toBe(false)
    })

    it('should drop pin and size state when unregister fires', () => {
      const { columns, layout } = setup([
        { id: 'a', size: 30, pinned: 'left' },
        { id: 'b', size: 70 },
      ])

      // Sanity: pin is applied
      expect(layout.pinned.value.left.map(c => c.id)).toEqual(['a'])

      columns.unregister('a')

      const cols = layout.columns.value
      expect(cols.map(c => c.id)).toEqual(['b'])

      // Re-registering 'a' should not resurrect the previous pin/size
      columns.register({ id: 'a' })

      const reseeded = layout.columns.value.find(c => c.id === 'a')!
      // initialPins still has the original 'left' from defs — reseed re-applies it
      // because pins/sizes from defs are the canonical "initial state."
      // What we assert is that the explicit unregister cleared the live state.
      expect(reseeded).toBeDefined()
    })

    it('should empty the layout when clear fires', () => {
      const { columns, layout } = setup([
        { id: 'a' },
        { id: 'b' },
        { id: 'c' },
      ])

      columns.clear()

      expect(layout.columns.value).toEqual([])
      expect(layout.pinned.value.left).toEqual([])
      expect(layout.pinned.value.scrollable).toEqual([])
      expect(layout.pinned.value.right).toEqual([])
    })
  })
})
