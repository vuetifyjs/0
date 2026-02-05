import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide } from 'vue'

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
    })

    describe('isEmpty', () => {
      it('should be true when empty', () => {
        const breadcrumbs = createBreadcrumbs()

        expect(breadcrumbs.isEmpty.value).toBe(true)

        breadcrumbs.register({ text: 'Home' })
        expect(breadcrumbs.isEmpty.value).toBe(false)
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

  describe('tickets (rendering)', () => {
    it('should return empty array when empty', () => {
      const breadcrumbs = createBreadcrumbs()

      expect(breadcrumbs.tickets.value).toEqual([])
    })

    it('should return all items as crumbs when no collapse needed', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(2)
      expect(breadcrumbs.tickets.value[0]!.type).toBe('crumb')
      expect(breadcrumbs.tickets.value[1]!.type).toBe('crumb')

      if (breadcrumbs.tickets.value[0]!.type === 'crumb') {
        expect(breadcrumbs.tickets.value[0]!.value.text).toBe('Home')
        expect(breadcrumbs.tickets.value[0]!.index).toBe(0)
      }
    })

    it('should collapse middle items when exceeding visible', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 3 })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
        { text: 'Phones' },
        { text: 'iPhone' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(3)
      expect(breadcrumbs.tickets.value[0]!.type).toBe('crumb')
      expect(breadcrumbs.tickets.value[1]!.type).toBe('ellipsis')
      expect(breadcrumbs.tickets.value[2]!.type).toBe('crumb')

      // Check ellipsis contains collapsed items
      const ellipsis = breadcrumbs.tickets.value[1]!
      if (ellipsis.type === 'ellipsis') {
        expect(ellipsis.collapsed).toHaveLength(3)
        expect(ellipsis.collapsed[0]!.text).toBe('Products')
        expect(ellipsis.collapsed[1]!.text).toBe('Electronics')
        expect(ellipsis.collapsed[2]!.text).toBe('Phones')
      }
    })

    it('should show more tail items with larger visible', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 4 })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
        { text: 'Phones' },
        { text: 'iPhone' },
        { text: 'Cases' },
      ])

      // visible=4: [Home] [...] [iPhone] [Cases]
      expect(breadcrumbs.tickets.value).toHaveLength(4)
      expect(breadcrumbs.tickets.value[0]!.type).toBe('crumb')
      expect(breadcrumbs.tickets.value[1]!.type).toBe('ellipsis')
      expect(breadcrumbs.tickets.value[2]!.type).toBe('crumb')
      expect(breadcrumbs.tickets.value[3]!.type).toBe('crumb')

      if (breadcrumbs.tickets.value[2]!.type === 'crumb') {
        expect(breadcrumbs.tickets.value[2]!.value.text).toBe('iPhone')
        expect(breadcrumbs.tickets.value[2]!.index).toBe(4)
      }
    })

    it('should return all items when ellipsis is disabled', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 2, ellipsis: false })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
        { text: 'Phones' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(4)
      expect(breadcrumbs.tickets.value.every(t => t.type === 'crumb')).toBe(true)
    })

    it('should use custom ellipsis character', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 2, ellipsis: '...' })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
      ])

      const ellipsis = breadcrumbs.tickets.value.find(t => t.type === 'ellipsis')
      expect(ellipsis?.value).toBe('...')
    })

    it('should return empty when visible is 0', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 0 })

      breadcrumbs.register({ text: 'Home' })

      expect(breadcrumbs.tickets.value).toEqual([])
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

  it('should pass options to createBreadcrumbs', () => {
    const [, , context] = createBreadcrumbsContext({
      visible: 3,
    })

    expect(context.ellipsis).toBe('…')
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
})
