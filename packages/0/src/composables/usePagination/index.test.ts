// Composables
import { createPagination } from './index'

// Utilities
import { describe, it, expect } from 'vitest'

describe('usePagination', () => {
  describe('page', () => {
    it('should return 1-based page number', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.first()

      expect(pagination.page.value).toBe(1)
      expect(pagination.selectedIndex.value).toBe(0)
    })

    it('should return 0 when no selection', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
      ])

      expect(pagination.page.value).toBe(0)
    })

    it('should update when navigating', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.first()
      expect(pagination.page.value).toBe(1)

      pagination.next()
      expect(pagination.page.value).toBe(2)

      pagination.next()
      expect(pagination.page.value).toBe(3)
    })
  })

  describe('length', () => {
    it('should return total number of pages', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      expect(pagination.length.value).toBe(3)
    })

    it('should return 0 when empty', () => {
      const pagination = createPagination()

      expect(pagination.length.value).toBe(0)
    })

    it('should reflect current page count', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
      ])

      expect(pagination.length.value).toBe(2)
    })
  })

  describe('count', () => {
    it('should use provided count value', () => {
      const pagination = createPagination({ count: 100, size: 10 })

      expect(pagination.count.value).toBe(100)
    })

    it('should estimate count from pages when not provided', () => {
      const pagination = createPagination({ size: 20 })

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      // 3 pages * 20 limit = 60
      expect(pagination.count.value).toBe(60)
    })
  })

  describe('from and to', () => {
    it('should calculate from and to for first page', () => {
      const pagination = createPagination({ size: 10 })

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.first()

      expect(pagination.from.value).toBe(1)
      expect(pagination.to.value).toBe(10)
    })

    it('should calculate from and to for middle page', () => {
      const pagination = createPagination({ size: 10 })

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.go(2)

      expect(pagination.from.value).toBe(11)
      expect(pagination.to.value).toBe(20)
    })

    it('should calculate from and to for last page', () => {
      const pagination = createPagination({ size: 10 })

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.last()

      expect(pagination.from.value).toBe(21)
      expect(pagination.to.value).toBe(30)
    })

    it('should cap to at count when on last page', () => {
      const pagination = createPagination({ size: 10, count: 25 })

      pagination.last()

      expect(pagination.from.value).toBe(21)
      expect(pagination.to.value).toBe(25) // Capped at count
    })

    it('should return 0 for from and to when no selection', () => {
      const pagination = createPagination({ size: 10 })

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
      ])

      expect(pagination.from.value).toBe(0)
      expect(pagination.to.value).toBe(0)
    })

    it('should handle different limit values', () => {
      const pagination = createPagination({ size: 25 })

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
      ])

      pagination.go(2)

      expect(pagination.from.value).toBe(26)
      expect(pagination.to.value).toBe(50)
    })
  })

  describe('hasNext', () => {
    it('should return true when not on last page', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.first()

      expect(pagination.hasNext.value).toBe(true)
    })

    it('should return false when on last page', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.last()

      expect(pagination.hasNext.value).toBe(false)
    })

    it('should return false when no selection', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
      ])

      expect(pagination.hasNext.value).toBe(false)
    })

    it('should return false when only one page and selected', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
      ])

      pagination.first()

      expect(pagination.hasNext.value).toBe(false)
    })
  })

  describe('hasPrev', () => {
    it('should return false when on first page', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.first()

      expect(pagination.hasPrev.value).toBe(false)
    })

    it('should return true when not on first page', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.go(2)

      expect(pagination.hasPrev.value).toBe(true)
    })

    it('should return false when no selection', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
      ])

      expect(pagination.hasPrev.value).toBe(false)
    })
  })

  describe('go', () => {
    it('should navigate to specific page', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.go(2)

      expect(pagination.page.value).toBe(2)
      expect(pagination.selectedId.value).toBe('page-2')
    })

    it('should navigate to first page', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.go(3)
      pagination.go(1)

      expect(pagination.page.value).toBe(1)
    })

    it('should navigate to last page', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.go(3)

      expect(pagination.page.value).toBe(3)
    })

    it('should do nothing for page 0', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
      ])

      pagination.first()
      pagination.go(0)

      expect(pagination.page.value).toBe(1)
    })

    it('should do nothing for negative page', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
      ])

      pagination.first()
      pagination.go(-1)

      expect(pagination.page.value).toBe(1)
    })

    it('should do nothing for page beyond length', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.first()
      pagination.go(10)

      expect(pagination.page.value).toBe(1)
    })

    it('should do nothing when navigating to disabled page', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2, disabled: true },
        { id: 'page-3', value: 3 },
      ])

      pagination.first()
      pagination.go(2)

      expect(pagination.page.value).toBe(1)
      expect(pagination.selectedId.value).toBe('page-1')
    })
  })

  describe('auto-generation from count', () => {
    it('should auto-generate pages from count and limit', () => {
      const pagination = createPagination({
        count: 100,
        size: 10,
      })

      expect(pagination.length.value).toBe(10)
    })

    it('should round up when count is not divisible by limit', () => {
      const pagination = createPagination({
        count: 95,
        size: 10,
      })

      expect(pagination.length.value).toBe(10)
    })

    it('should create single page for small counts', () => {
      const pagination = createPagination({
        count: 5,
        size: 10,
      })

      expect(pagination.length.value).toBe(1)
    })

    it('should create pages with correct IDs', () => {
      const pagination = createPagination({
        count: 30,
        size: 10,
      })

      expect(pagination.has('page-1')).toBe(true)
      expect(pagination.has('page-2')).toBe(true)
      expect(pagination.has('page-3')).toBe(true)
    })

    it('should allow navigation on auto-generated pages', () => {
      const pagination = createPagination({
        count: 50,
        size: 10,
      })

      pagination.first()
      expect(pagination.page.value).toBe(1)

      pagination.next()
      expect(pagination.page.value).toBe(2)

      pagination.last()
      expect(pagination.page.value).toBe(5)

      pagination.go(3)
      expect(pagination.page.value).toBe(3)
    })
  })

  describe('inheritance from useStep', () => {
    it('should have first, last, next, prev, step methods', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.first()
      expect(pagination.page.value).toBe(1)

      pagination.next()
      expect(pagination.page.value).toBe(2)

      pagination.prev()
      expect(pagination.page.value).toBe(1)

      pagination.last()
      expect(pagination.page.value).toBe(3)

      pagination.step(-2)
      expect(pagination.page.value).toBe(1)
    })

    it('should respect circular option', () => {
      const pagination = createPagination({ circular: true })

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.last()
      pagination.next()

      expect(pagination.page.value).toBe(1)
    })

    it('should not wrap by default (circular false)', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.last()
      pagination.next()

      expect(pagination.page.value).toBe(3)
    })

    it('should skip disabled pages', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2, disabled: true },
        { id: 'page-3', value: 3 },
      ])

      pagination.first()
      pagination.next()

      expect(pagination.page.value).toBe(3)
    })
  })

  describe('inheritance from useSingle', () => {
    it('should enforce single selection', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
      ])

      pagination.select('page-1')
      pagination.select('page-2')

      expect(pagination.selectedIds.size).toBe(1)
      expect(pagination.page.value).toBe(2)
    })

    it('should have useSingle computed properties', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
      ])

      pagination.first()

      expect(pagination.selectedId.value).toBe('page-1')
      expect(pagination.selectedItem.value?.id).toBe('page-1')
      expect(pagination.selectedIndex.value).toBe(0)
      expect(pagination.selectedValue.value).toBe(1)
    })
  })

  describe('edge cases', () => {
    it('should handle empty pagination', () => {
      const pagination = createPagination()

      expect(pagination.page.value).toBe(0)
      expect(pagination.length.value).toBe(0)
      expect(pagination.hasNext.value).toBe(false)
      expect(pagination.hasPrev.value).toBe(false)
      expect(pagination.from.value).toBe(0)
      expect(pagination.to.value).toBe(0)
    })

    it('should handle single page', () => {
      const pagination = createPagination({ size: 10 })

      pagination.onboard([
        { id: 'page-1', value: 1 },
      ])

      pagination.first()

      expect(pagination.page.value).toBe(1)
      expect(pagination.length.value).toBe(1)
      expect(pagination.hasNext.value).toBe(false)
      expect(pagination.hasPrev.value).toBe(false)
      expect(pagination.from.value).toBe(1)
      expect(pagination.to.value).toBe(10)
    })

    it('should handle count of 0', () => {
      const pagination = createPagination({
        count: 0,
        size: 10,
      })

      expect(pagination.length.value).toBe(0)
    })

    it('should handle page removal', () => {
      const pagination = createPagination()

      pagination.onboard([
        { id: 'page-1', value: 1 },
        { id: 'page-2', value: 2 },
        { id: 'page-3', value: 3 },
      ])

      pagination.first()
      expect(pagination.size).toBe(3)

      pagination.unregister('page-3')
      expect(pagination.size).toBe(2)
      expect(pagination.has('page-3')).toBe(false)

      pagination.unregister('page-2')
      expect(pagination.size).toBe(1)
      expect(pagination.has('page-2')).toBe(false)
      expect(pagination.has('page-1')).toBe(true)
    })
  })
})
