import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide } from 'vue'

// Types
import type { App } from 'vue'

import { createBreadcrumbs, createBreadcrumbsContext, useBreadcrumbs } from './index'

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

describe('createBreadcrumbs', () => {
  describe('initialization', () => {
    it('should create empty by default', () => {
      const breadcrumbs = createBreadcrumbs()

      expect(breadcrumbs.size).toBe(0)
      expect(breadcrumbs.depth.value).toBe(0)
      expect(breadcrumbs.isEmpty.value).toBe(true)
    })

    it('should register items and auto-select last', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.register({ text: 'Home' })

      expect(breadcrumbs.size).toBe(1)
      expect(breadcrumbs.depth.value).toBe(1)
      expect(breadcrumbs.isRoot.value).toBe(true)
      expect(breadcrumbs.selectedItem.value?.text).toBe('Home')
    })

    it('should onboard multiple items and select last', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
      ])

      expect(breadcrumbs.size).toBe(3)
      expect(breadcrumbs.selectedItem.value?.text).toBe('Electronics')
      expect(breadcrumbs.selectedIndex.value).toBe(2)
    })
  })

  describe('derived state', () => {
    describe('depth', () => {
      it('should return size', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.onboard([
          { text: 'A' },
          { text: 'B' },
          { text: 'C' },
        ])

        expect(breadcrumbs.depth.value).toBe(3)
      })

      it('should update when items are added', () => {
        const breadcrumbs = createBreadcrumbs()

        expect(breadcrumbs.depth.value).toBe(0)

        breadcrumbs.register({ text: 'Home' })
        expect(breadcrumbs.depth.value).toBe(1)

        breadcrumbs.register({ text: 'Products' })
        expect(breadcrumbs.depth.value).toBe(2)
      })

      it('should update when items are removed', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
          { text: 'Electronics' },
        ])

        expect(breadcrumbs.depth.value).toBe(3)

        breadcrumbs.prev()
        expect(breadcrumbs.depth.value).toBe(2)
      })
    })

    describe('isRoot', () => {
      it('should be true when depth <= 1', () => {
        const breadcrumbs = createBreadcrumbs()

        expect(breadcrumbs.isRoot.value).toBe(true)

        breadcrumbs.register({ text: 'Home' })
        expect(breadcrumbs.isRoot.value).toBe(true)

        breadcrumbs.register({ text: 'Products' })
        expect(breadcrumbs.isRoot.value).toBe(false)
      })

      it('should become true after navigating to root', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
          { text: 'Electronics' },
        ])

        expect(breadcrumbs.isRoot.value).toBe(false)

        breadcrumbs.first()
        expect(breadcrumbs.isRoot.value).toBe(true)
      })
    })

    describe('isEmpty', () => {
      it('should be true when empty', () => {
        const breadcrumbs = createBreadcrumbs()

        expect(breadcrumbs.isEmpty.value).toBe(true)

        breadcrumbs.register({ text: 'Home' })
        expect(breadcrumbs.isEmpty.value).toBe(false)
      })

      it('should be true after clearing', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.register({ text: 'Home' })
        expect(breadcrumbs.isEmpty.value).toBe(false)

        breadcrumbs.clear()
        expect(breadcrumbs.isEmpty.value).toBe(true)
      })
    })
  })

  describe('navigation', () => {
    describe('first', () => {
      it('should truncate to first item', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
          { text: 'Electronics' },
        ])

        breadcrumbs.first()

        expect(breadcrumbs.size).toBe(1)
        expect(breadcrumbs.selectedItem.value?.text).toBe('Home')
      })

      it('should do nothing when at root', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.register({ text: 'Home' })

        breadcrumbs.first()

        expect(breadcrumbs.size).toBe(1)
      })

      it('should do nothing when empty', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.first()

        expect(breadcrumbs.size).toBe(0)
      })

      it('should select the first item after truncation', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
          { text: 'Electronics' },
          { text: 'Phones' },
          { text: 'iPhone' },
        ])

        breadcrumbs.first()

        expect(breadcrumbs.selectedItem.value?.text).toBe('Home')
        expect(breadcrumbs.selectedIndex.value).toBe(0)
        expect(breadcrumbs.size).toBe(1)
      })
    })

    describe('prev', () => {
      it('should remove last item and select previous', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
          { text: 'Electronics' },
        ])

        breadcrumbs.prev()

        expect(breadcrumbs.size).toBe(2)
        expect(breadcrumbs.selectedItem.value?.text).toBe('Products')
      })

      it('should not remove when at root', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.register({ text: 'Home' })

        breadcrumbs.prev()

        expect(breadcrumbs.size).toBe(1)
      })

      it('should do nothing when empty', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.prev()

        expect(breadcrumbs.size).toBe(0)
      })

      it('should navigate up multiple levels consecutively', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
          { text: 'Electronics' },
          { text: 'Phones' },
        ])

        breadcrumbs.prev()
        expect(breadcrumbs.size).toBe(3)
        expect(breadcrumbs.selectedItem.value?.text).toBe('Electronics')

        breadcrumbs.prev()
        expect(breadcrumbs.size).toBe(2)
        expect(breadcrumbs.selectedItem.value?.text).toBe('Products')

        breadcrumbs.prev()
        expect(breadcrumbs.size).toBe(1)
        expect(breadcrumbs.selectedItem.value?.text).toBe('Home')

        breadcrumbs.prev()
        expect(breadcrumbs.size).toBe(1)
      })
    })

    describe('select', () => {
      it('should truncate to selected item by id', () => {
        const breadcrumbs = createBreadcrumbs()

        const items = breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
          { text: 'Electronics' },
          { text: 'Phones' },
        ])

        breadcrumbs.select(items[1]!.id)

        expect(breadcrumbs.size).toBe(2)
        expect(breadcrumbs.selectedItem.value?.text).toBe('Products')
      })

      it('should do nothing for unknown id', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
        ])

        breadcrumbs.select('unknown-id')

        expect(breadcrumbs.size).toBe(2)
      })

      it('should select the last item without truncation', () => {
        const breadcrumbs = createBreadcrumbs()

        const items = breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
          { text: 'Electronics' },
        ])

        breadcrumbs.select(items[2]!.id)

        expect(breadcrumbs.size).toBe(3)
        expect(breadcrumbs.selectedItem.value?.text).toBe('Electronics')
      })

      it('should select the first item and remove all others', () => {
        const breadcrumbs = createBreadcrumbs()

        const items = breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
          { text: 'Electronics' },
          { text: 'Phones' },
        ])

        breadcrumbs.select(items[0]!.id)

        expect(breadcrumbs.size).toBe(1)
        expect(breadcrumbs.selectedItem.value?.text).toBe('Home')
      })

      it('should select middle item correctly', () => {
        const breadcrumbs = createBreadcrumbs()

        const items = breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
          { text: 'Electronics' },
          { text: 'Phones' },
          { text: 'iPhone' },
        ])

        breadcrumbs.select(items[2]!.id)

        expect(breadcrumbs.size).toBe(3)
        expect(breadcrumbs.selectedItem.value?.text).toBe('Electronics')
        expect(breadcrumbs.has(items[3]!.id)).toBe(false)
        expect(breadcrumbs.has(items[4]!.id)).toBe(false)
      })
    })

    describe('register', () => {
      it('should add item and select it', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.register({ text: 'Home' })
        const product = breadcrumbs.register({ text: 'Products' })

        expect(breadcrumbs.size).toBe(2)
        expect(breadcrumbs.selectedId.value).toBe(product.id)
      })

      it('should return the registered ticket', () => {
        const breadcrumbs = createBreadcrumbs()

        const ticket = breadcrumbs.register({ text: 'Home' })

        expect(ticket.text).toBe('Home')
        expect(ticket.id).toBeDefined()
        expect(ticket.index).toBe(0)
      })

      it('should use provided id', () => {
        const breadcrumbs = createBreadcrumbs()

        const ticket = breadcrumbs.register({ id: 'custom-id', text: 'Home' })

        expect(ticket.id).toBe('custom-id')
      })
    })

    describe('unregister', () => {
      it('should remove item by id', () => {
        const breadcrumbs = createBreadcrumbs()

        const items = breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
        ])

        breadcrumbs.unregister(items[1]!.id)

        expect(breadcrumbs.size).toBe(1)
      })
    })

    describe('clear', () => {
      it('should remove all items', () => {
        const breadcrumbs = createBreadcrumbs()

        breadcrumbs.onboard([
          { text: 'Home' },
          { text: 'Products' },
        ])

        breadcrumbs.clear()

        expect(breadcrumbs.size).toBe(0)
        expect(breadcrumbs.isEmpty.value).toBe(true)
      })
    })
  })

  describe('inherited registry methods', () => {
    it('should provide get()', () => {
      const breadcrumbs = createBreadcrumbs()

      const ticket = breadcrumbs.register({ id: 'home', text: 'Home' })

      expect(breadcrumbs.get('home')).toBe(ticket)
    })

    it('should provide has()', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.register({ id: 'home', text: 'Home' })

      expect(breadcrumbs.has('home')).toBe(true)
      expect(breadcrumbs.has('unknown')).toBe(false)
    })

    it('should provide values()', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
      ])

      const values = breadcrumbs.values()
      expect(values).toHaveLength(2)
      expect(values[0]!.text).toBe('Home')
      expect(values[1]!.text).toBe('Products')
    })

    it('should provide keys()', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { id: 'a', text: 'Home' },
        { id: 'b', text: 'Products' },
      ])

      expect(breadcrumbs.keys()).toEqual(['a', 'b'])
    })

    it('should provide lookup()', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { id: 'a', text: 'Home' },
        { id: 'b', text: 'Products' },
      ])

      expect(breadcrumbs.lookup(0)).toBe('a')
      expect(breadcrumbs.lookup(1)).toBe('b')
    })

    it('should provide browse()', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.register({ text: 'Home', value: 'home-value' })

      const result = breadcrumbs.browse('home-value')
      expect(result).toBeDefined()
    })
  })

  describe('edge cases', () => {
    it('should handle empty items array', () => {
      const breadcrumbs = createBreadcrumbs()

      expect(breadcrumbs.size).toBe(0)
      expect(breadcrumbs.depth.value).toBe(0)
      expect(breadcrumbs.isEmpty.value).toBe(true)
      expect(breadcrumbs.isRoot.value).toBe(true)
    })

    it('should handle single item', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.register({ text: 'Home' })

      expect(breadcrumbs.size).toBe(1)
      expect(breadcrumbs.depth.value).toBe(1)
      expect(breadcrumbs.isRoot.value).toBe(true)
      expect(breadcrumbs.isEmpty.value).toBe(false)
    })

    it('should handle deeply nested paths', () => {
      const breadcrumbs = createBreadcrumbs()

      const items = Array.from({ length: 20 }, (_, i) => ({ text: `Level ${i}` }))
      breadcrumbs.onboard(items)

      expect(breadcrumbs.size).toBe(20)
      expect(breadcrumbs.depth.value).toBe(20)
      expect(breadcrumbs.selectedItem.value?.text).toBe('Level 19')
    })

    it('should handle select on already selected (last) item', () => {
      const breadcrumbs = createBreadcrumbs()

      const items = breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
      ])

      const lastId = items[1]!.id
      breadcrumbs.select(lastId)

      expect(breadcrumbs.size).toBe(2)
      expect(breadcrumbs.selectedItem.value?.text).toBe('Products')
    })

    it('should correctly track selection through multiple operations', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
      ])
      expect(breadcrumbs.selectedItem.value?.text).toBe('Electronics')

      breadcrumbs.first()
      expect(breadcrumbs.selectedItem.value?.text).toBe('Home')

      breadcrumbs.register({ text: 'Settings' })
      expect(breadcrumbs.selectedItem.value?.text).toBe('Settings')

      breadcrumbs.prev()
      expect(breadcrumbs.selectedItem.value?.text).toBe('Home')
    })

    it('should handle adding items after navigating back', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
      ])

      breadcrumbs.first()
      expect(breadcrumbs.size).toBe(1)

      breadcrumbs.register({ text: 'Settings' })
      expect(breadcrumbs.size).toBe(2)
      expect(breadcrumbs.selectedItem.value?.text).toBe('Settings')

      breadcrumbs.register({ text: 'Profile' })
      expect(breadcrumbs.size).toBe(3)
      expect(breadcrumbs.selectedItem.value?.text).toBe('Profile')
    })
  })
})

describe('createBreadcrumbsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return trinity tuple', () => {
    const [use, provideCtx, context] = createBreadcrumbsContext()

    expect(typeof use).toBe('function')
    expect(typeof provideCtx).toBe('function')
    expect(context).toBeDefined()
    expect(context.register).toBeDefined()
  })

  it('should provide context with default namespace', () => {
    const [, provideBreadcrumbs, context] = createBreadcrumbsContext()

    provideBreadcrumbs()

    expect(mockProvide).toHaveBeenCalledWith('v0:breadcrumbs', context)
  })

  it('should provide context with custom namespace', () => {
    const [, provideBreadcrumbs, context] = createBreadcrumbsContext({
      namespace: 'custom:breadcrumbs',
    })

    provideBreadcrumbs()

    expect(mockProvide).toHaveBeenCalledWith('custom:breadcrumbs', context)
  })

  it('should allow providing custom context', () => {
    const customContext = createBreadcrumbs()
    const [, provideBreadcrumbs] = createBreadcrumbsContext()

    provideBreadcrumbs(customContext)

    expect(mockProvide).toHaveBeenCalledWith('v0:breadcrumbs', customContext)
  })

  it('should provide to app when app is passed', () => {
    const mockApp = {
      provide: vi.fn(),
    } as unknown as App

    const [, provideBreadcrumbs, context] = createBreadcrumbsContext()

    provideBreadcrumbs(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:breadcrumbs', context)
    expect(mockProvide).not.toHaveBeenCalled()
  })

  it('should have functional default context', () => {
    const [, , context] = createBreadcrumbsContext()

    expect(context.size).toBe(0)
    expect(typeof context.register).toBe('function')
    expect(typeof context.first).toBe('function')
    expect(typeof context.prev).toBe('function')
    expect(typeof context.select).toBe('function')
  })
})

describe('useBreadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createBreadcrumbs()
    mockInject.mockReturnValue(mockContext)

    const result = useBreadcrumbs()

    expect(mockInject).toHaveBeenCalledWith('v0:breadcrumbs', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createBreadcrumbs()
    mockInject.mockReturnValue(mockContext)

    const result = useBreadcrumbs('custom:breadcrumbs')

    expect(mockInject).toHaveBeenCalledWith('custom:breadcrumbs', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useBreadcrumbs()).toThrow(
      'Context "v0:breadcrumbs" not found. Ensure it\'s provided by an ancestor.',
    )
  })

  it('should throw with custom namespace in error message', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useBreadcrumbs('my:breadcrumbs')).toThrow(
      'Context "my:breadcrumbs" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})
