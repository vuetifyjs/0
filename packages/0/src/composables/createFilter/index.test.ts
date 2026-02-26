import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide, ref, shallowRef } from 'vue'

// Types
import type { Primitive } from './index'

import { createFilter, createFilterContext, useFilter } from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)

describe('createFilter.apply', () => {
  const items = shallowRef([
    { name: 'apple', color: 'green', type: 'fruit' },
    { name: 'apple', color: 'red', type: 'fruit' },
    { name: 'carrot', color: 'orange', type: 'vegetable' },
    { name: 'banana', color: 'yellow', type: 'fruit' },
    { name: 'apple juice', color: 'apple green', type: 'juice' },
  ])

  it('should filter by default (mode: some)', () => {
    const filter = createFilter()
    const { items: filtered } = filter.apply('apple', items)
    expect(filtered.value).toHaveLength(3)
    expect(filtered.value.every(i => i.name.includes('apple'))).toBe(true)
  })

  it('should filter using keys (mode: some)', () => {
    const filter = createFilter({ keys: ['color'] })
    const { items: filtered } = filter.apply('yellow', items)
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0]?.name).toBe('banana')
  })

  it('should require all keys to match query with mode: every', () => {
    const filter = createFilter({ keys: ['name', 'color'], mode: 'every' })
    const { items: filtered } = filter.apply('apple', items)
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value).toEqual([{ color: 'apple green', name: 'apple juice', type: 'juice',
    }])
  })

  it('should match any query to any field with mode: union', () => {
    const filter = createFilter({ keys: ['name', 'color'], mode: 'union' })
    const { items: filtered } = filter.apply(['banana', 'orange'], items)
    expect(filtered.value).toHaveLength(2)
    expect(filtered.value.map(i => i.name)).toEqual(expect.arrayContaining(['carrot', 'banana']))
  })

  it('should require all queries to be present with mode: intersection', () => {
    const filter = createFilter({ keys: ['name', 'color'], mode: 'intersection' })
    const { items: filtered } = filter.apply(['apple', 'red'], items)
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0]?.color).toBe('red')
  })

  it('should return all items if query is empty', () => {
    const filter = createFilter()
    const { items: filtered } = filter.apply('', items)
    expect(filtered.value).toHaveLength(5)
  })

  it('should handle primitive items', () => {
    const prim = shallowRef(['apple', 'banana', 'carrot', 'apple pie'])
    const filter = createFilter()
    const { items: filtered } = filter.apply('apple', prim)
    expect(filtered.value).toEqual(['apple', 'apple pie'])
  })

  it('should work with getter functions for query', () => {
    const searchTerm = ref('apple')
    const filter = createFilter()
    const { items: filtered } = filter.apply(() => searchTerm.value, items)
    expect(filtered.value).toHaveLength(3)

    searchTerm.value = 'banana'
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0]?.name).toBe('banana')
  })

  it('should work with array getter functions for query', () => {
    const searchTerms = ref(['banana', 'orange'])
    const filter = createFilter({ keys: ['name', 'color'], mode: 'union' })
    const { items: filtered } = filter.apply(() => searchTerms.value, items)
    expect(filtered.value).toHaveLength(2)
    expect(filtered.value.map(i => i.name)).toEqual(expect.arrayContaining(['carrot', 'banana']))

    searchTerms.value = ['apple']
    expect(filtered.value).toHaveLength(3)
  })

  it('should handle case-insensitive filtering', () => {
    const filter = createFilter()
    const { items: filtered } = filter.apply('APPLE', items)
    expect(filtered.value).toHaveLength(3)
    expect(filtered.value.every(i => i.name.toLowerCase().includes('apple'))).toBe(true)
  })

  it('should handle numeric values in filter', () => {
    const numItems = shallowRef([
      { id: 1, name: 'item1' },
      { id: 2, name: 'item2' },
      { id: 12, name: 'item12' },
    ])
    const filter = createFilter({ keys: ['id'] })
    const { items: filtered } = filter.apply('1', numItems)
    expect(filtered.value).toHaveLength(2)
    expect(filtered.value.map(i => i.id)).toEqual(expect.arrayContaining([1, 12]))
  })

  it('should handle empty items array', () => {
    const emptyItems = shallowRef<Array<{ name: string }>>([])
    const filter = createFilter()
    const { items: filtered } = filter.apply('test', emptyItems)
    expect(filtered.value).toHaveLength(0)
  })

  it('should handle whitespace-only queries', () => {
    const filter = createFilter()
    const { items: filtered } = filter.apply('   ', items)
    expect(filtered.value).toHaveLength(5)
  })

  it('should return all items when query is null or undefined', () => {
    const filter = createFilter()
    // Test null query (cast to bypass type check - runtime safety test)
    const nullQuery = ref(null as unknown as string)
    const { items: filtered } = filter.apply(nullQuery, items)
    expect(filtered.value).toHaveLength(5)

    // Test undefined query
    const undefinedQuery = ref(undefined as unknown as string)
    const { items: filtered2 } = filter.apply(undefinedQuery, items)
    expect(filtered2.value).toHaveLength(5)
  })

  it('should handle multiple whitespace queries in array', () => {
    const filter = createFilter({ mode: 'union' })
    const { items: filtered } = filter.apply(['  ', '  ', 'apple'], items)
    expect(filtered.value).toHaveLength(3)
  })

  it('should use custom filter function when provided', () => {
    function customFilter (query: Primitive | Primitive[], item: any) {
      const q = Array.isArray(query) ? query[0] : query
      return item.name.startsWith(q!) as boolean
    }

    const filter = createFilter({ customFilter })
    const { items: filtered } = filter.apply('app', items)

    expect(filtered.value).toHaveLength(3)
    expect(filtered.value.every(i => i.name.startsWith('app'))).toBe(true)
  })

  it('should handle objects without specified keys', () => {
    const filter = createFilter()
    const { items: filtered } = filter.apply('fruit', items)
    expect(filtered.value).toHaveLength(3)
  })

  it('should require all keys to match with mode every', () => {
    const filter = createFilter({ keys: ['name', 'type'], mode: 'every' })
    const { items: filtered } = filter.apply('fruit', items)
    expect(filtered.value).toHaveLength(0)
  })

  it('should handle boolean values in items', () => {
    const boolItems = shallowRef([
      { name: 'item1', active: true },
      { name: 'item2', active: false },
    ])
    const filter = createFilter({ keys: ['active'] })
    const { items: filtered } = filter.apply('true', boolItems)
    expect(filtered.value).toHaveLength(1)
    expect(filtered.value[0]?.active).toBe(true)
  })

  it('should reactively update when items change', () => {
    const dynamicItems = shallowRef([
      { name: 'apple', color: 'red', type: 'fruit' },
    ])
    const filter = createFilter()
    const { items: filtered } = filter.apply('apple', dynamicItems)

    expect(filtered.value).toHaveLength(1)

    dynamicItems.value = [...dynamicItems.value, { name: 'apple pie', color: 'brown', type: 'dessert' }]

    expect(filtered.value).toHaveLength(2)
  })
})

describe('createFilter', () => {
  it('should create a filter context with apply method', () => {
    const filter = createFilter({
      keys: ['name'],
      mode: 'some',
    })

    expect(filter.apply).toBeDefined()
    expect(typeof filter.apply).toBe('function')
    expect(filter.mode).toBe('some')
    expect(filter.keys).toEqual(['name'])
  })

  it('should filter items using apply method', () => {
    const filter = createFilter({
      keys: ['name'],
    })
    const items = shallowRef([
      { name: 'apple', type: 'fruit' },
      { name: 'banana', type: 'fruit' },
      { name: 'carrot', type: 'vegetable' },
    ])

    const result = filter.apply('apple', items)
    expect(result.items.value).toHaveLength(1)
    expect(result.items.value[0]?.name).toBe('apple')
  })

  it('should default to mode some', () => {
    const filter = createFilter()
    expect(filter.mode).toBe('some')
  })
})

describe('createFilterContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a trinity tuple', () => {
    const result = createFilterContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function') // useFilter
    expect(typeof result[1]).toBe('function') // provideFilterContext
    expect(result[2]).toBeDefined() // default context
  })

  it('should create context with default namespace', () => {
    const [, provideFilterContext, context] = createFilterContext()

    provideFilterContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:filter', context)
  })

  it('should create context with custom namespace', () => {
    const [, provideFilterContext, context] = createFilterContext({
      namespace: 'my-search',
    })

    provideFilterContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-search', context)
  })

  it('should create a functional filter context', () => {
    const [,, context] = createFilterContext({
      keys: ['name'],
    })
    const items = shallowRef([
      { name: 'apple' },
      { name: 'banana' },
    ])

    const result = context.apply('apple', items)
    expect(result.items.value).toHaveLength(1)
  })

  it('should allow providing custom context', () => {
    const [, provideFilterContext] = createFilterContext()
    const customContext = createFilter({ mode: 'every' })

    provideFilterContext(customContext)

    expect(mockProvide).toHaveBeenCalledWith('v0:filter', customContext)
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = {
      provide: vi.fn(),
    } as any
    const [, provideFilterContext, context] = createFilterContext()

    provideFilterContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:filter', context)
  })
})

describe('useFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createFilter()
    mockInject.mockReturnValue(mockContext)

    const result = useFilter()

    expect(mockInject).toHaveBeenCalledWith('v0:filter', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createFilter()
    mockInject.mockReturnValue(mockContext)

    const result = useFilter('my-search')

    expect(mockInject).toHaveBeenCalledWith('my-search', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useFilter()).toThrow(
      'Context "v0:filter" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})
