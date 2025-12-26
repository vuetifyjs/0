import { describe, expect, it } from 'vitest'

// Utilities
import { ref } from 'vue'

// Types
import type { Primitive } from './index'

import { useFilter } from './index'

describe('useFilter', () => {
  const items = ref([
    { name: 'apple', color: 'green', type: 'fruit' },
    { name: 'apple', color: 'red', type: 'fruit' },
    { name: 'carrot', color: 'orange', type: 'vegetable' },
    { name: 'banana', color: 'yellow', type: 'fruit' },
    { name: 'apple juice', color: 'apple green', type: 'juice' },
  ])

  it('should filter by default (mode: some)', () => {
    const { items: filtered } = useFilter('apple', items)
    expect(filtered.value).toHaveLength(3)
    expect(filtered.value.every(i => i.name.includes('apple'))).toBe(true)
  })

  it('should filter using keys (mode: some)', () => {
    const { items: filtered } = useFilter('yellow', items, {
      keys: ['color'],
    })
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0]?.name).toBe('banana')
  })

  it('should require all keys to match query with mode: every', () => {
    const { items: filtered } = useFilter('apple', items, {
      keys: ['name', 'color'],
      mode: 'every',
    })
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value).toEqual([{ color: 'apple green', name: 'apple juice', type: 'juice',
    }])
  })

  it('should match any query to any field with mode: union', () => {
    const { items: filtered } = useFilter(['banana', 'orange'], items, {
      keys: ['name', 'color'],
      mode: 'union',
    })
    expect(filtered.value).toHaveLength(2)
    expect(filtered.value.map(i => i.name)).toEqual(expect.arrayContaining(['carrot', 'banana']))
  })

  it('should require all queries to be present with mode: intersection', () => {
    const { items: filtered } = useFilter(['apple', 'red'], items, {
      keys: ['name', 'color'],
      mode: 'intersection',
    })
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0]?.color).toBe('red')
  })

  it('should return all items if query is empty', () => {
    const { items: filtered } = useFilter('', items)
    expect(filtered.value).toHaveLength(5)
  })

  it('should handle primitive items', () => {
    const prim = ref(['apple', 'banana', 'carrot', 'apple pie'])
    const { items: filtered } = useFilter('apple', prim)
    expect(filtered.value).toEqual(['apple', 'apple pie'])
  })

  it('should work with getter functions for query', () => {
    const searchTerm = ref('apple')
    const { items: filtered } = useFilter(() => searchTerm.value, items)
    expect(filtered.value).toHaveLength(3)

    searchTerm.value = 'banana'
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0]?.name).toBe('banana')
  })

  it('should work with array getter functions for query', () => {
    const searchTerms = ref(['banana', 'orange'])
    const { items: filtered } = useFilter(() => searchTerms.value, items, {
      keys: ['name', 'color'],
      mode: 'union',
    })
    expect(filtered.value).toHaveLength(2)
    expect(filtered.value.map(i => i.name)).toEqual(expect.arrayContaining(['carrot', 'banana']))

    searchTerms.value = ['apple']
    expect(filtered.value).toHaveLength(3)
  })

  it('should handle case-insensitive filtering', () => {
    const { items: filtered } = useFilter('APPLE', items)
    expect(filtered.value).toHaveLength(3)
    expect(filtered.value.every(i => i.name.toLowerCase().includes('apple'))).toBe(true)
  })

  it('should handle numeric values in filter', () => {
    const numItems = ref([
      { id: 1, name: 'item1' },
      { id: 2, name: 'item2' },
      { id: 12, name: 'item12' },
    ])
    const { items: filtered } = useFilter('1', numItems, { keys: ['id'] })
    expect(filtered.value).toHaveLength(2)
    expect(filtered.value.map(i => i.id)).toEqual(expect.arrayContaining([1, 12]))
  })

  it('should handle empty items array', () => {
    const emptyItems = ref<Array<{ name: string }>>([])
    const { items: filtered } = useFilter('test', emptyItems)
    expect(filtered.value).toHaveLength(0)
  })

  it('should handle whitespace-only queries', () => {
    const { items: filtered } = useFilter('   ', items)
    expect(filtered.value).toHaveLength(5)
  })

  it('should return all items when query is null or undefined', () => {
    // Test null query (cast to bypass type check - runtime safety test)
    const nullQuery = ref(null as unknown as string)
    const { items: filtered } = useFilter(nullQuery, items)
    expect(filtered.value).toHaveLength(5)

    // Test undefined query
    const undefinedQuery = ref(undefined as unknown as string)
    const { items: filtered2 } = useFilter(undefinedQuery, items)
    expect(filtered2.value).toHaveLength(5)
  })

  it('should handle multiple whitespace queries in array', () => {
    const { items: filtered } = useFilter(['  ', '  ', 'apple'], items, {
      mode: 'union',
    })
    expect(filtered.value).toHaveLength(3)
  })

  it('should use custom filter function when provided', () => {
    function customFilter (query: Primitive | Primitive[], item: any) {
      const q = Array.isArray(query) ? query[0] : query
      return item.name.startsWith(q!) as boolean
    }

    const { items: filtered } = useFilter('app', items, {
      customFilter,
    })

    expect(filtered.value).toHaveLength(3)
    expect(filtered.value.every(i => i.name.startsWith('app'))).toBe(true)
  })

  it('should handle objects without specified keys', () => {
    const { items: filtered } = useFilter('fruit', items)
    expect(filtered.value).toHaveLength(3)
  })

  it('should require all keys to match with mode every', () => {
    const { items: filtered } = useFilter('fruit', items, {
      keys: ['name', 'type'],
      mode: 'every',
    })
    expect(filtered.value).toHaveLength(0)
  })

  it('should handle boolean values in items', () => {
    const boolItems = ref([
      { name: 'item1', active: true },
      { name: 'item2', active: false },
    ])
    const { items: filtered } = useFilter('true', boolItems, { keys: ['active'] })
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0]?.active).toBe(true)
  })

  it('should reactively update when items change', () => {
    const dynamicItems = ref([
      { name: 'apple', color: 'red', type: 'fruit' },
    ])
    const { items: filtered } = useFilter('apple', dynamicItems)

    expect(filtered.value).toHaveLength(1)

    dynamicItems.value.push({ name: 'apple pie', color: 'brown', type: 'dessert' })

    expect(filtered.value).toHaveLength(2)
  })
})
