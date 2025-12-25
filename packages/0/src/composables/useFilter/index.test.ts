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

  // Edge case tests for optimized union/intersection modes
  describe('union mode edge cases', () => {
    it('should match when last query matches last field', () => {
      const testItems = ref([
        { a: 'no', b: 'match', c: 'here' },
        { a: 'found', b: 'it', c: 'last' },
      ])
      const { items: filtered } = useFilter(['notfound', 'last'], testItems, {
        mode: 'union',
        keys: ['a', 'b', 'c'],
      })
      expect(filtered.value).toHaveLength(1)
      expect(filtered.value[0]?.c).toBe('last')
    })

    it('should handle single-character queries', () => {
      const testItems = ref([{ name: 'a' }, { name: 'ab' }, { name: 'b' }])
      const { items: filtered } = useFilter(['a'], testItems, { mode: 'union' })
      expect(filtered.value).toHaveLength(2)
    })

    it('should handle large query arrays', () => {
      const testItems = ref([{ name: 'target' }])
      const queries = Array.from({ length: 100 }, (_, i) => `query${i}`)
      queries.push('target')
      const { items: filtered } = useFilter(queries, testItems, { mode: 'union' })
      expect(filtered.value).toHaveLength(1)
    })

    it('should return empty when no queries match', () => {
      const { items: filtered } = useFilter(['xyz', '123'], items, {
        mode: 'union',
        keys: ['name'],
      })
      expect(filtered.value).toHaveLength(0)
    })

    it('should handle primitive items with multiple queries', () => {
      const prim = ref(['apple', 'banana', 'cherry', 'date'])
      const { items: filtered } = useFilter(['apple', 'cherry'], prim, { mode: 'union' })
      expect(filtered.value).toEqual(['apple', 'cherry'])
    })

    it('should handle single key with multiple queries', () => {
      const { items: filtered } = useFilter(['red', 'yellow'], items, {
        mode: 'union',
        keys: ['color'],
      })
      expect(filtered.value).toHaveLength(2)
      expect(filtered.value.map(i => i.color)).toEqual(expect.arrayContaining(['red', 'yellow']))
    })
  })

  describe('intersection mode edge cases', () => {
    it('should fail when any query has no match', () => {
      const testItems = ref([
        { name: 'apple', color: 'red' },
      ])
      const { items: filtered } = useFilter(['apple', 'blue'], testItems, {
        mode: 'intersection',
        keys: ['name', 'color'],
      })
      expect(filtered.value).toHaveLength(0)
    })

    it('should allow queries to match different fields', () => {
      const { items: filtered } = useFilter(['apple', 'red'], items, {
        mode: 'intersection',
        keys: ['name', 'color'],
      })
      expect(filtered.value).toHaveLength(1)
      expect(filtered.value[0]?.name).toBe('apple')
      expect(filtered.value[0]?.color).toBe('red')
    })

    it('should behave like some mode with single query', () => {
      const { items: intersection } = useFilter(['apple'], items, { mode: 'intersection' })
      const { items: some } = useFilter('apple', items, { mode: 'some' })
      expect(intersection.value).toEqual(some.value)
    })

    it('should handle primitive items with multiple queries', () => {
      const prim = ref(['apple pie', 'banana split', 'apple banana'])
      const { items: filtered } = useFilter(['apple', 'banana'], prim, { mode: 'intersection' })
      expect(filtered.value).toEqual(['apple banana'])
    })

    it('should handle single key with multiple queries (all must match same field)', () => {
      const testItems = ref([
        { name: 'apple pie delicious' },
        { name: 'apple cake' },
        { name: 'banana pie' },
      ])
      const { items: filtered } = useFilter(['apple', 'pie'], testItems, {
        mode: 'intersection',
        keys: ['name'],
      })
      expect(filtered.value).toHaveLength(1)
      expect(filtered.value[0]?.name).toBe('apple pie delicious')
    })

    it('should handle large query arrays where all must match', () => {
      const testItems = ref([{ name: 'abc def ghi jkl mno' }])
      const queries = ['abc', 'def', 'ghi', 'jkl', 'mno']
      const { items: filtered } = useFilter(queries, testItems, { mode: 'intersection' })
      expect(filtered.value).toHaveLength(1)
    })

    it('should return empty when one query in large array fails', () => {
      const testItems = ref([{ name: 'abc def ghi jkl' }])
      const queries = ['abc', 'def', 'ghi', 'jkl', 'xyz']
      const { items: filtered } = useFilter(queries, testItems, { mode: 'intersection' })
      expect(filtered.value).toHaveLength(0)
    })
  })
})
