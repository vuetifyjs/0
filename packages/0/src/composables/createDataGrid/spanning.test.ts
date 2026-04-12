import { describe, expect, it } from 'vitest'

// Utilities
import { computed } from 'vue'

import { createRowSpanning } from './spanning'

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
