import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { useFilter } from './index'

describe('useFilter', () => {
  const items = ref([
    { name: 'apple', color: 'green', type: 'fruit' },
    { name: 'apple', color: 'red', type: 'fruit' },
    { name: 'carrot', color: 'orange', type: 'vegetable' },
    { name: 'banana', color: 'yellow', type: 'fruit' },
    { name: 'apple juice', color: 'apple green', type: 'juice' },
  ])

  it('filters by default (mode: some)', () => {
    const { items: filtered } = useFilter('apple', items)
    expect(filtered.value).toHaveLength(3)
    expect(filtered.value.every(i => i.name.includes('apple'))).toBe(true)
  })

  it('filters using keys (mode: some)', () => {
    const { items: filtered } = useFilter('yellow', items, {
      keys: ['color'],
    })
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0].name).toBe('banana')
  })

  it('mode: every (all keys must match query)', () => {
    const { items: filtered } = useFilter('apple', items, {
      keys: ['name', 'color'],
      mode: 'every',
    })
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value).toEqual([{ color: 'apple green', name: 'apple juice', type: 'juice',
    }])
  })

  it('mode: union (any query matches any field)', () => {
    const { items: filtered } = useFilter(['banana', 'orange'], items, {
      keys: ['name', 'color'],
      mode: 'union',
    })
    expect(filtered.value).toHaveLength(2)
    expect(filtered.value.map(i => i.name)).toEqual(expect.arrayContaining(['carrot', 'banana']))
  })

  it('mode: intersection (all queries must be present)', () => {
    const { items: filtered } = useFilter(['apple', 'red'], items, {
      keys: ['name', 'color'],
      mode: 'intersection',
    })
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0].color).toBe('red')
  })

  it('returns all items if query is empty', () => {
    const { items: filtered } = useFilter('', items)
    expect(filtered.value).toHaveLength(5)
  })

  it('can handle primitive items', () => {
    const prim = ref(['apple', 'banana', 'carrot', 'apple pie'])
    const { items: filtered } = useFilter('apple', prim)
    expect(filtered.value).toEqual(['apple', 'apple pie'])
  })
})
