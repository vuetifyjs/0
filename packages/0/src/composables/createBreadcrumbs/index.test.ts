import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide, shallowRef } from 'vue'

// Types
import type { BreadcrumbItem } from './index'

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

function createPath (...items: Array<{ id: string, text: string }>): BreadcrumbItem[] {
  return items.map(item => ({ ...item }))
}

describe('createBreadcrumbs', () => {
  describe('navigation', () => {
    describe('first', () => {
      it('should keep only the root item', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
            { id: 'phones', text: 'Phones' },
          ),
        })

        breadcrumbs.first()

        expect(breadcrumbs.path.value).toHaveLength(1)
        expect(breadcrumbs.path.value[0]!.id).toBe('home')
      })

      it('should do nothing when already at root', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath({ id: 'home', text: 'Home' }),
        })

        breadcrumbs.first()

        expect(breadcrumbs.path.value).toHaveLength(1)
      })

      it('should do nothing when path is empty', () => {
        const breadcrumbs = createBreadcrumbs({ path: [] })

        breadcrumbs.first()

        expect(breadcrumbs.path.value).toHaveLength(0)
      })
    })

    describe('prev', () => {
      it('should remove the last item', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
            { id: 'phones', text: 'Phones' },
          ),
        })

        breadcrumbs.prev()

        expect(breadcrumbs.path.value).toHaveLength(2)
        expect(breadcrumbs.current.value?.id).toBe('products')
      })

      it('should not go below root', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath({ id: 'home', text: 'Home' }),
        })

        breadcrumbs.prev()

        expect(breadcrumbs.path.value).toHaveLength(1)
        expect(breadcrumbs.current.value?.id).toBe('home')
      })

      it('should do nothing when path is empty', () => {
        const breadcrumbs = createBreadcrumbs({ path: [] })

        breadcrumbs.prev()

        expect(breadcrumbs.path.value).toHaveLength(0)
      })
    })

    describe('select', () => {
      it('should truncate path to specified index', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
            { id: 'phones', text: 'Phones' },
            { id: 'iphone', text: 'iPhone' },
          ),
        })

        breadcrumbs.select(1)

        expect(breadcrumbs.path.value).toHaveLength(2)
        expect(breadcrumbs.current.value?.id).toBe('products')
      })

      it('should do nothing when selecting current item', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
          ),
        })

        breadcrumbs.select(1)

        expect(breadcrumbs.path.value).toHaveLength(2)
      })

      it('should clear path when index is negative', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
          ),
        })

        breadcrumbs.select(-1)

        expect(breadcrumbs.path.value).toHaveLength(0)
      })

      it('should select root when index is 0', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
            { id: 'phones', text: 'Phones' },
          ),
        })

        breadcrumbs.select(0)

        expect(breadcrumbs.path.value).toHaveLength(1)
        expect(breadcrumbs.current.value?.id).toBe('home')
      })
    })

    describe('push', () => {
      it('should add item to end of path', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath({ id: 'home', text: 'Home' }),
        })

        breadcrumbs.push({ id: 'products', text: 'Products' })

        expect(breadcrumbs.path.value).toHaveLength(2)
        expect(breadcrumbs.current.value?.id).toBe('products')
      })

      it('should work on empty path', () => {
        const breadcrumbs = createBreadcrumbs({ path: [] })

        breadcrumbs.push({ id: 'home', text: 'Home' })

        expect(breadcrumbs.path.value).toHaveLength(1)
        expect(breadcrumbs.current.value?.id).toBe('home')
      })
    })

    describe('pop', () => {
      it('should remove and return the last item', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
          ),
        })

        const popped = breadcrumbs.pop()

        expect(popped?.id).toBe('products')
        expect(breadcrumbs.path.value).toHaveLength(1)
      })

      it('should return undefined on empty path', () => {
        const breadcrumbs = createBreadcrumbs({ path: [] })

        const popped = breadcrumbs.pop()

        expect(popped).toBeUndefined()
      })
    })

    describe('replace', () => {
      it('should replace entire path', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath({ id: 'home', text: 'Home' }),
        })

        breadcrumbs.replace(createPath(
          { id: 'dashboard', text: 'Dashboard' },
          { id: 'settings', text: 'Settings' },
        ))

        expect(breadcrumbs.path.value).toHaveLength(2)
        expect(breadcrumbs.root.value?.id).toBe('dashboard')
        expect(breadcrumbs.current.value?.id).toBe('settings')
      })
    })
  })

  describe('computed properties', () => {
    describe('depth', () => {
      it('should return path length', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
          ),
        })

        expect(breadcrumbs.depth.value).toBe(2)
      })

      it('should return 0 for empty path', () => {
        const breadcrumbs = createBreadcrumbs({ path: [] })

        expect(breadcrumbs.depth.value).toBe(0)
      })
    })

    describe('isEmpty', () => {
      it('should be true when path is empty', () => {
        const breadcrumbs = createBreadcrumbs({ path: [] })

        expect(breadcrumbs.isEmpty.value).toBe(true)
      })

      it('should be false when path has items', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath({ id: 'home', text: 'Home' }),
        })

        expect(breadcrumbs.isEmpty.value).toBe(false)
      })
    })

    describe('isRoot', () => {
      it('should be true when path has only root', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath({ id: 'home', text: 'Home' }),
        })

        expect(breadcrumbs.isRoot.value).toBe(true)
      })

      it('should be true when path is empty', () => {
        const breadcrumbs = createBreadcrumbs({ path: [] })

        expect(breadcrumbs.isRoot.value).toBe(true)
      })

      it('should be false when path has multiple items', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
          ),
        })

        expect(breadcrumbs.isRoot.value).toBe(false)
      })
    })

    describe('current', () => {
      it('should return last item', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
          ),
        })

        expect(breadcrumbs.current.value?.id).toBe('products')
      })

      it('should return undefined for empty path', () => {
        const breadcrumbs = createBreadcrumbs({ path: [] })

        expect(breadcrumbs.current.value).toBeUndefined()
      })
    })

    describe('parent', () => {
      it('should return second-to-last item', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
            { id: 'phones', text: 'Phones' },
          ),
        })

        expect(breadcrumbs.parent.value?.id).toBe('products')
      })

      it('should return undefined when at root', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath({ id: 'home', text: 'Home' }),
        })

        expect(breadcrumbs.parent.value).toBeUndefined()
      })
    })

    describe('root', () => {
      it('should return first item', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
          ),
        })

        expect(breadcrumbs.root.value?.id).toBe('home')
      })

      it('should return undefined for empty path', () => {
        const breadcrumbs = createBreadcrumbs({ path: [] })

        expect(breadcrumbs.root.value).toBeUndefined()
      })
    })
  })

  describe('items (visible tickets)', () => {
    it('should return all items when no collapse', () => {
      const breadcrumbs = createBreadcrumbs({
        path: createPath(
          { id: 'home', text: 'Home' },
          { id: 'products', text: 'Products' },
          { id: 'phones', text: 'Phones' },
        ),
      })

      expect(breadcrumbs.items.value).toHaveLength(3)
      expect(breadcrumbs.items.value.every(i => i.type === 'item')).toBe(true)
    })

    it('should include index in item tickets', () => {
      const breadcrumbs = createBreadcrumbs({
        path: createPath(
          { id: 'home', text: 'Home' },
          { id: 'products', text: 'Products' },
        ),
      })

      const items = breadcrumbs.items.value.filter((i): i is { type: 'item', value: BreadcrumbItem, index: number } => i.type === 'item')
      expect(items[0]!.index).toBe(0)
      expect(items[1]!.index).toBe(1)
    })

    describe('collapse behavior', () => {
      it('should collapse middle items when visible is set', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
            { id: 'electronics', text: 'Electronics' },
            { id: 'phones', text: 'Phones' },
            { id: 'iphone', text: 'iPhone' },
          ),
          visible: 4,
        })

        const items = breadcrumbs.items.value

        expect(items).toHaveLength(4)
        expect(items[0]!.type).toBe('item')
        expect((items[0] as { type: 'item', value: BreadcrumbItem }).value.id).toBe('home')
        expect(items[1]!.type).toBe('ellipsis')
        expect((items[1] as { type: 'ellipsis', collapsed: BreadcrumbItem[] }).collapsed).toHaveLength(2)
        expect(items[2]!.type).toBe('item')
        expect((items[2] as { type: 'item', value: BreadcrumbItem }).value.id).toBe('phones')
        expect(items[3]!.type).toBe('item')
        expect((items[3] as { type: 'item', value: BreadcrumbItem }).value.id).toBe('iphone')
      })

      it('should not collapse when path fits within visible', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
          ),
          visible: 4,
        })

        expect(breadcrumbs.items.value).toHaveLength(2)
        expect(breadcrumbs.items.value.every(i => i.type === 'item')).toBe(true)
      })

      it('should not collapse when visible is 0', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'products', text: 'Products' },
            { id: 'phones', text: 'Phones' },
            { id: 'iphone', text: 'iPhone' },
          ),
          visible: 0,
        })

        expect(breadcrumbs.items.value).toHaveLength(4)
      })

      it('should include collapsed items in ellipsis ticket', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'a', text: 'A' },
            { id: 'b', text: 'B' },
            { id: 'c', text: 'C' },
            { id: 'd', text: 'D' },
          ),
          visible: 3,
        })

        const ellipsis = breadcrumbs.items.value.find((i): i is { type: 'ellipsis', value: string, collapsed: BreadcrumbItem[] } => i.type === 'ellipsis')

        expect(ellipsis).toBeDefined()
        expect(ellipsis!.collapsed.map(i => i.id)).toEqual(['a', 'b', 'c'])
      })

      it('should use custom ellipsis character', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'a', text: 'A' },
            { id: 'b', text: 'B' },
            { id: 'c', text: 'C' },
          ),
          visible: 3,
          ellipsis: '...',
        })

        const ellipsis = breadcrumbs.items.value.find((i): i is { type: 'ellipsis', value: string, collapsed: BreadcrumbItem[] } => i.type === 'ellipsis')

        expect(ellipsis!.value).toBe('...')
      })

      it('should not include ellipsis when ellipsis is false', () => {
        const breadcrumbs = createBreadcrumbs({
          path: createPath(
            { id: 'home', text: 'Home' },
            { id: 'a', text: 'A' },
            { id: 'b', text: 'B' },
            { id: 'c', text: 'C' },
          ),
          visible: 3,
          ellipsis: false,
        })

        expect(breadcrumbs.items.value.every(i => i.type === 'item')).toBe(true)
      })
    })
  })

  describe('v-model support', () => {
    it('should accept a ref for path', () => {
      const path = shallowRef<BreadcrumbItem[]>([{ id: 'home', text: 'Home' }])
      const breadcrumbs = createBreadcrumbs({ path })

      breadcrumbs.push({ id: 'products', text: 'Products' })

      expect(path.value).toHaveLength(2)
      expect(path.value[1]!.id).toBe('products')
    })

    it('should sync when external ref changes', () => {
      const path = shallowRef<BreadcrumbItem[]>([{ id: 'home', text: 'Home' }])
      const breadcrumbs = createBreadcrumbs({ path })

      path.value = [{ id: 'dashboard', text: 'Dashboard' }]

      expect(breadcrumbs.current.value?.id).toBe('dashboard')
    })
  })

  describe('options', () => {
    it('should use default separator', () => {
      const breadcrumbs = createBreadcrumbs()

      expect(breadcrumbs.separator).toBe('/')
    })

    it('should use custom separator', () => {
      const breadcrumbs = createBreadcrumbs({ separator: '>' })

      expect(breadcrumbs.separator).toBe('>')
    })

    it('should use default ellipsis', () => {
      const breadcrumbs = createBreadcrumbs()

      expect(breadcrumbs.ellipsis).toBe('…')
    })

    it('should allow disabling ellipsis', () => {
      const breadcrumbs = createBreadcrumbs({ ellipsis: false })

      expect(breadcrumbs.ellipsis).toBe(false)
    })
  })
})

describe('createBreadcrumbsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a trinity tuple', () => {
    const [use, provide, context] = createBreadcrumbsContext()

    expect(typeof use).toBe('function')
    expect(typeof provide).toBe('function')
    expect(context).toBeDefined()
    expect(context.path).toBeDefined()
  })

  it('should use default namespace', () => {
    const [, provideBreadcrumbsContext, context] = createBreadcrumbsContext()

    provideBreadcrumbsContext()

    expect(mockProvide).toHaveBeenCalledWith('v0:breadcrumbs', context)
  })

  it('should use custom namespace', () => {
    const [, provideBreadcrumbsContext, context] = createBreadcrumbsContext({
      namespace: 'custom:breadcrumbs',
    })

    provideBreadcrumbsContext()

    expect(mockProvide).toHaveBeenCalledWith('custom:breadcrumbs', context)
  })

  it('should pass options to createBreadcrumbs', () => {
    const [, , context] = createBreadcrumbsContext({
      path: [{ id: 'home', text: 'Home' }],
      separator: '>',
    })

    expect(context.path.value).toHaveLength(1)
    expect(context.separator).toBe('>')
  })
})

describe('useBreadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject with default namespace', () => {
    const mockContext = createBreadcrumbs()
    mockInject.mockReturnValue(mockContext)

    useBreadcrumbs()

    expect(mockInject).toHaveBeenCalledWith('v0:breadcrumbs', undefined)
  })

  it('should inject with custom namespace', () => {
    const mockContext = createBreadcrumbs()
    mockInject.mockReturnValue(mockContext)

    useBreadcrumbs('custom:breadcrumbs')

    expect(mockInject).toHaveBeenCalledWith('custom:breadcrumbs', undefined)
  })
})
