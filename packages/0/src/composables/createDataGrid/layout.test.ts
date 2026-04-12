import { describe, expect, it } from 'vitest'

import { createColumnLayout } from './layout'

describe('createColumnLayout', () => {
  describe('auto-distribute sizes', () => {
    it('gives 4 equal columns 25% each', () => {
      const layout = createColumnLayout([
        { key: 'a' },
        { key: 'b' },
        { key: 'c' },
        { key: 'd' },
      ])

      const cols = layout.columns.value
      for (const col of cols) {
        expect(col.size).toBe(25)
      }
    })

    it('splits remainder evenly among unsized columns', () => {
      // 'a' takes 40, remaining 60 split between b and c
      const layout = createColumnLayout([
        { key: 'a', size: 40 },
        { key: 'b' },
        { key: 'c' },
      ])

      const cols = layout.columns.value
      expect(cols.find(c => c.key === 'a')!.size).toBe(40)
      expect(cols.find(c => c.key === 'b')!.size).toBe(30)
      expect(cols.find(c => c.key === 'c')!.size).toBe(30)
    })

    it('keeps explicit sizes when all specified', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 60 },
        { key: 'b', size: 40 },
      ])

      const cols = layout.columns.value
      expect(cols.find(c => c.key === 'a')!.size).toBe(60)
      expect(cols.find(c => c.key === 'b')!.size).toBe(40)
    })
  })

  describe('offset computation', () => {
    it('computes cumulative offsets within scrollable region', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 30 },
        { key: 'b', size: 40 },
        { key: 'c', size: 30 },
      ])

      const cols = layout.columns.value
      expect(cols.find(c => c.key === 'a')!.offset).toBe(0)
      expect(cols.find(c => c.key === 'b')!.offset).toBe(30)
      expect(cols.find(c => c.key === 'c')!.offset).toBe(70)
    })
  })

  describe('leaf extraction from nested columns', () => {
    it('extracts leaves from nested defs', () => {
      const layout = createColumnLayout([
        { key: 'name', size: 30 },
        {
          key: 'contact',
          children: [
            { key: 'email', size: 35 },
            { key: 'phone', size: 35 },
          ],
        },
      ])

      const cols = layout.columns.value
      expect(cols).toHaveLength(3)
      expect(cols.map(c => c.key)).toEqual(['name', 'email', 'phone'])
    })

    it('auto-distributes remainder across nested leaves', () => {
      const layout = createColumnLayout([
        { key: 'name' },
        {
          key: 'contact',
          children: [
            { key: 'email' },
            { key: 'phone' },
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
    it('splits columns into left/scrollable/right regions from options', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 20, pinned: 'left' },
        { key: 'b', size: 60 },
        { key: 'c', size: 20, pinned: 'right' },
      ])

      const { left, scrollable, right } = layout.pinned.value
      expect(left.map(c => c.key)).toEqual(['a'])
      expect(scrollable.map(c => c.key)).toEqual(['b'])
      expect(right.map(c => c.key)).toEqual(['c'])
    })

    it('pin mutation moves a column to the specified region', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 30 },
        { key: 'b', size: 40 },
        { key: 'c', size: 30 },
      ])

      layout.pin('a', 'left')

      const { left, scrollable } = layout.pinned.value
      expect(left.map(c => c.key)).toEqual(['a'])
      expect(scrollable.map(c => c.key)).toEqual(['b', 'c'])
    })

    it('unpin moves column back to scrollable', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 30, pinned: 'left' },
        { key: 'b', size: 40 },
        { key: 'c', size: 30 },
      ])

      layout.pin('a', false)

      const { left, scrollable } = layout.pinned.value
      expect(left).toHaveLength(0)
      expect(scrollable.map(c => c.key)).toEqual(['a', 'b', 'c'])
    })

    it('computes offsets independently per region', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 20, pinned: 'left' },
        { key: 'b', size: 20, pinned: 'left' },
        { key: 'c', size: 30 },
        { key: 'd', size: 30 },
      ])

      const { left, scrollable } = layout.pinned.value

      // Left region offsets start at 0
      expect(left.find(c => c.key === 'a')!.offset).toBe(0)
      expect(left.find(c => c.key === 'b')!.offset).toBe(20)

      // Scrollable region offsets start at 0 independently
      expect(scrollable.find(c => c.key === 'c')!.offset).toBe(0)
      expect(scrollable.find(c => c.key === 'd')!.offset).toBe(30)
    })
  })

  describe('resize', () => {
    it('adjusts target and neighbor by delta', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 50 },
        { key: 'b', size: 50 },
      ])

      layout.resize('a', 10)

      const cols = layout.columns.value
      expect(cols.find(c => c.key === 'a')!.size).toBe(60)
      expect(cols.find(c => c.key === 'b')!.size).toBe(40)
    })

    it('clamps at minSize', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 50, minSize: 20 },
        { key: 'b', size: 50, minSize: 20 },
      ])

      // Try to shrink 'a' below its min
      layout.resize('a', -40)

      const cols = layout.columns.value
      expect(cols.find(c => c.key === 'a')!.size).toBe(20)
      expect(cols.find(c => c.key === 'b')!.size).toBe(80)
    })

    it('clamps at maxSize', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 50, maxSize: 60 },
        { key: 'b', size: 50, minSize: 20 },
      ])

      layout.resize('a', 30)

      const cols = layout.columns.value
      expect(cols.find(c => c.key === 'a')!.size).toBe(60)
      expect(cols.find(c => c.key === 'b')!.size).toBe(40)
    })

    it('no-op on last column in its region', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 50 },
        { key: 'b', size: 50 },
      ])

      layout.resize('b', 10)

      const cols = layout.columns.value
      expect(cols.find(c => c.key === 'a')!.size).toBe(50)
      expect(cols.find(c => c.key === 'b')!.size).toBe(50)
    })

    it('resizes within pin region only', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 20, pinned: 'left' },
        { key: 'b', size: 20, pinned: 'left' },
        { key: 'c', size: 30 },
        { key: 'd', size: 30 },
      ])

      layout.resize('a', 5)

      const cols = layout.columns.value
      // a grows, b shrinks (left region)
      expect(cols.find(c => c.key === 'a')!.size).toBe(25)
      expect(cols.find(c => c.key === 'b')!.size).toBe(15)
      // scrollable region unchanged
      expect(cols.find(c => c.key === 'c')!.size).toBe(30)
      expect(cols.find(c => c.key === 'd')!.size).toBe(30)
    })
  })

  describe('reorder', () => {
    it('moves a column from one position to another', () => {
      const layout = createColumnLayout([
        { key: 'a' },
        { key: 'b' },
        { key: 'c' },
      ])

      // Move 'a' (index 0) to index 2
      layout.reorder(0, 2)

      expect(layout.columns.value.map(c => c.key)).toEqual(['b', 'c', 'a'])
    })

    it('no-op for out-of-bounds from index', () => {
      const layout = createColumnLayout([
        { key: 'a' },
        { key: 'b' },
      ])

      layout.reorder(5, 0)

      expect(layout.columns.value.map(c => c.key)).toEqual(['a', 'b'])
    })
  })

  describe('reset', () => {
    it('restores initial sizes', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 60 },
        { key: 'b', size: 40 },
      ])

      layout.resize('a', -20)
      layout.reset()

      const cols = layout.columns.value
      expect(cols.find(c => c.key === 'a')!.size).toBe(60)
      expect(cols.find(c => c.key === 'b')!.size).toBe(40)
    })

    it('restores initial order', () => {
      const layout = createColumnLayout([
        { key: 'a' },
        { key: 'b' },
        { key: 'c' },
      ])

      layout.reorder(0, 2)
      layout.reset()

      expect(layout.columns.value.map(c => c.key)).toEqual(['a', 'b', 'c'])
    })

    it('restores initial pins', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 30, pinned: 'left' },
        { key: 'b', size: 40 },
        { key: 'c', size: 30 },
      ])

      layout.pin('a', false)
      layout.reset()

      const { left } = layout.pinned.value
      expect(left.map(c => c.key)).toEqual(['a'])
    })
  })

  describe('distribute', () => {
    it('sets sizes from array and normalizes to 100', () => {
      const layout = createColumnLayout([
        { key: 'a' },
        { key: 'b' },
        { key: 'c' },
      ])

      layout.distribute([50, 30, 20])

      const cols = layout.columns.value
      expect(cols.find(c => c.key === 'a')!.size).toBe(50)
      expect(cols.find(c => c.key === 'b')!.size).toBe(30)
      expect(cols.find(c => c.key === 'c')!.size).toBe(20)
      const total = cols.reduce((sum, c) => sum + c.size, 0)
      expect(total).toBeCloseTo(100)
    })

    it('no-op when array length mismatches', () => {
      const layout = createColumnLayout([
        { key: 'a', size: 50 },
        { key: 'b', size: 50 },
      ])

      layout.distribute([100])

      const cols = layout.columns.value
      expect(cols.find(c => c.key === 'a')!.size).toBe(50)
      expect(cols.find(c => c.key === 'b')!.size).toBe(50)
    })

    it('normalizes values that do not sum to 100', () => {
      const layout = createColumnLayout([
        { key: 'a' },
        { key: 'b' },
      ])

      layout.distribute([30, 30])

      const cols = layout.columns.value
      const total = cols.reduce((sum, c) => sum + c.size, 0)
      expect(total).toBeCloseTo(100)
    })
  })
})
