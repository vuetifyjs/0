import { describe, expect, it } from 'vitest'

import { createRowSpanning } from './spanning'

// Utilities
import { computed } from 'vue'

describe('createRowSpanning', () => {
  it('should return an empty map when no span function is supplied', () => {
    const spans = createRowSpanning({
      items: computed(() => []),
      columns: ['a', 'b'],
    })
    expect(spans.value.size).toBe(0)
  })

  it('should compute span map for visible items', () => {
    const items = computed(() => [
      { id: 1, category: 'A', name: 'X' },
      { id: 2, category: 'A', name: 'Y' },
      { id: 3, category: 'B', name: 'Z' },
    ])

    const spans = createRowSpanning({
      items,
      columns: ['category', 'name'],
      itemKey: 'id',
      span: (item, column) => {
        if (column === 'category' && item.category === 'A') return 2
        return 1
      },
    })

    expect(spans.value.get(1)?.get('category')).toEqual({ rowSpan: 2, hidden: false })
    expect(spans.value.get(2)?.get('category')).toEqual({ rowSpan: 1, hidden: true })
    expect(spans.value.get(3)?.get('category')).toEqual({ rowSpan: 1, hidden: false })
    expect(spans.value.get(1)?.get('name')).toEqual({ rowSpan: 1, hidden: false })
  })

  it('should coerce a NaN span to 1 without hiding following rows', () => {
    const items = computed(() => [
      { id: 1, qty: 'x' },
      { id: 2, qty: 'y' },
    ])

    const spans = createRowSpanning({
      items,
      columns: ['qty'],
      itemKey: 'id',
      span: () => Number.NaN,
    })

    expect(spans.value.get(1)?.get('qty')).toEqual({ rowSpan: 1, hidden: false })
    expect(spans.value.get(2)?.get('qty')).toEqual({ rowSpan: 1, hidden: false })
  })

  it('should skip rows that lack a defined itemKey value', () => {
    const items = computed(() => [
      { id: 1, category: 'A', name: 'X' },
      { category: 'A', name: 'Y' },
      { id: 3, category: 'B', name: 'Z' },
    ])

    const spans = createRowSpanning({
      items,
      columns: ['category', 'name'],
      itemKey: 'id',
      span: (item, column) => {
        if (column === 'category' && item.category === 'A') return 2
        return 1
      },
    })

    // Only the two identifiable rows produce entries; the id-less row is skipped.
    expect(spans.value.size).toBe(2)
    expect(spans.value.has(undefined as never)).toBe(false)
    expect(spans.value.get(1)?.get('category')).toEqual({ rowSpan: 2, hidden: false })
    expect(spans.value.get(1)?.get('name')).toEqual({ rowSpan: 1, hidden: false })
    // Row 1's span of 2 covers the next physical (skipped) row, so row 3
    // inherits the leftover coverage for that column.
    expect(spans.value.get(3)?.get('category')).toEqual({ rowSpan: 1, hidden: true })
    expect(spans.value.get(3)?.get('name')).toEqual({ rowSpan: 1, hidden: false })
  })

  it('should not collapse multiple id-less rows onto one entry', () => {
    const items = computed(() => [
      { category: 'A' },
      { category: 'B' },
      { id: 3, category: 'C' },
    ])

    const spans = createRowSpanning({
      items,
      columns: ['category'],
      itemKey: 'id',
      span: () => 1,
    })

    expect(spans.value.size).toBe(1)
    expect(spans.value.has(undefined as never)).toBe(false)
    expect(spans.value.get(3)?.get('category')).toEqual({ rowSpan: 1, hidden: false })
  })

  it('should not span beyond visible items', () => {
    const items = computed(() => [
      { id: 1, category: 'A' },
      { id: 2, category: 'A' },
    ])

    const spans = createRowSpanning({
      items,
      columns: ['category'],
      itemKey: 'id',
      span: (item, column) => {
        if (column === 'category' && item.category === 'A') return 5
        return 1
      },
    })

    expect(spans.value.get(1)?.get('category')?.rowSpan).toBe(2)
  })

  describe('key projection', () => {
    // The grid passes a `key` that projects the registry ticket id, so the span
    // map shares identity with the rest of the grid rather than keying by the
    // value's own `id`. When `key` is present it must win over `itemKey`.
    it('should key by the projection and ignore itemKey', () => {
      const items = computed(() => [
        { id: 1, category: 'A' },
        { id: 2, category: 'B' },
      ])

      const spans = createRowSpanning({
        items,
        columns: ['category'],
        itemKey: 'id',
        key: (_item, index) => ['a', 'b'][index],
        span: () => 1,
      })

      expect(spans.value.get('a')?.get('category')).toEqual({ rowSpan: 1, hidden: false })
      expect(spans.value.get('b')?.get('category')).toEqual({ rowSpan: 1, hidden: false })
      // The value `id`s must not appear — the projection, not itemKey, drives the key.
      expect(spans.value.has(1)).toBe(false)
      expect(spans.value.has(2)).toBe(false)
    })

    it('should skip rows whose projected key is undefined', () => {
      const items = computed(() => [
        { id: 1, category: 'A' },
        { id: 2, category: 'B' },
        { id: 3, category: 'C' },
      ])

      const spans = createRowSpanning({
        items,
        columns: ['category'],
        // The middle row projects to undefined and must be skipped, mirroring
        // the itemKey-undefined behavior but driven by the projection.
        key: (_item, index) => (index === 1 ? undefined : ['a', undefined, 'c'][index]),
        span: () => 1,
      })

      expect(spans.value.size).toBe(2)
      expect(spans.value.has(undefined as never)).toBe(false)
      expect(spans.value.get('a')?.get('category')).toEqual({ rowSpan: 1, hidden: false })
      expect(spans.value.get('c')?.get('category')).toEqual({ rowSpan: 1, hidden: false })
    })
  })
})
