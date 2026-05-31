import { describe, expect, it } from 'vitest'

import { createRowSpanning } from './spanning'

// Utilities
import { computed } from 'vue'

describe('createRowSpanning', () => {
  it('returns empty map when no rowSpanning function', () => {
    const spans = createRowSpanning({
      items: computed(() => []),
      columns: ['a', 'b'],
    })
    expect(spans.value.size).toBe(0)
  })

  it('computes span map for visible items', () => {
    const items = computed(() => [
      { id: 1, category: 'A', name: 'X' },
      { id: 2, category: 'A', name: 'Y' },
      { id: 3, category: 'B', name: 'Z' },
    ])

    const spans = createRowSpanning({
      items,
      columns: ['category', 'name'],
      itemKey: 'id',
      rowSpanning: (item, column) => {
        if (column === 'category' && item.category === 'A') return 2
        return 1
      },
    })

    expect(spans.value.get(1)?.get('category')).toEqual({ rowSpan: 2, hidden: false })
    expect(spans.value.get(2)?.get('category')).toEqual({ rowSpan: 1, hidden: true })
    expect(spans.value.get(3)?.get('category')).toEqual({ rowSpan: 1, hidden: false })
    expect(spans.value.get(1)?.get('name')).toEqual({ rowSpan: 1, hidden: false })
  })

  it('coerces a NaN span to 1 without hiding following rows', () => {
    const items = computed(() => [
      { id: 1, qty: 'x' },
      { id: 2, qty: 'y' },
    ])

    const spans = createRowSpanning({
      items,
      columns: ['qty'],
      itemKey: 'id',
      rowSpanning: () => Number.NaN,
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
      rowSpanning: (item, column) => {
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
      rowSpanning: () => 1,
    })

    expect(spans.value.size).toBe(1)
    expect(spans.value.has(undefined as never)).toBe(false)
    expect(spans.value.get(3)?.get('category')).toEqual({ rowSpan: 1, hidden: false })
  })

  it('does not span beyond visible items', () => {
    const items = computed(() => [
      { id: 1, category: 'A' },
      { id: 2, category: 'A' },
    ])

    const spans = createRowSpanning({
      items,
      columns: ['category'],
      itemKey: 'id',
      rowSpanning: (item, column) => {
        if (column === 'category' && item.category === 'A') return 5
        return 1
      },
    })

    expect(spans.value.get(1)?.get('category')?.rowSpan).toBe(2)
  })
})
