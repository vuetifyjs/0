import { describe, expect, it } from 'vitest'

import { createRowOrdering } from './ordering'

describe('createRowOrdering', () => {
  it('starts with empty order', () => {
    const ordering = createRowOrdering()
    expect(ordering.order.value).toEqual([])
  })

  it('move sets order', () => {
    const ordering = createRowOrdering()
    ordering.initialize([1, 2, 3, 4])
    ordering.move(0, 2)
    expect(ordering.order.value).toEqual([2, 3, 1, 4])
  })

  it('reset clears order', () => {
    const ordering = createRowOrdering()
    ordering.initialize([1, 2, 3])
    ordering.move(0, 2)
    ordering.reset()
    expect(ordering.order.value).toEqual([])
  })

  it('apply reorders items according to order', () => {
    const ordering = createRowOrdering()
    const items = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]
    ordering.initialize([1, 2, 3])
    ordering.move(0, 2) // [2, 3, 1]

    const result = ordering.apply(items, 'id')
    expect(result.map(i => i.id)).toEqual([2, 3, 1])
  })

  it('apply returns original items when order is empty', () => {
    const ordering = createRowOrdering()
    const items = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]
    expect(ordering.apply(items, 'id')).toEqual(items)
  })
})
