import { describe, expect, it } from 'vitest'

// Utilities
import { shallowRef } from 'vue'

import { createPagination } from './index'

describe('usePagination', () => {
  describe('navigation', () => {
    describe('first', () => {
      it('should set page to 1', () => {
        const pagination = createPagination({ size: 100, page: 5 })

        pagination.first()

        expect(pagination.page.value).toBe(1)
      })
    })

    describe('last', () => {
      it('should set page to last page', () => {
        const pagination = createPagination({ size: 100, page: 1 })

        pagination.last()

        expect(pagination.page.value).toBe(10)
      })
    })

    describe('next', () => {
      it('should increment page by 1', () => {
        const pagination = createPagination({ size: 100, page: 1 })

        pagination.next()

        expect(pagination.page.value).toBe(2)
      })

      it('should not exceed page count', () => {
        const pagination = createPagination({ size: 100, page: 10 })

        pagination.next()

        expect(pagination.page.value).toBe(10)
      })
    })

    describe('prev', () => {
      it('should decrement page by 1', () => {
        const pagination = createPagination({ size: 100, page: 5 })

        pagination.prev()

        expect(pagination.page.value).toBe(4)
      })

      it('should not go below 1', () => {
        const pagination = createPagination({ size: 100, page: 1 })

        pagination.prev()

        expect(pagination.page.value).toBe(1)
      })
    })

    describe('select', () => {
      it('should go to specified page', () => {
        const pagination = createPagination({ size: 100, page: 1 })

        pagination.select(5)

        expect(pagination.page.value).toBe(5)
      })

      it('should clamp to 1 when value is less than 1', () => {
        const pagination = createPagination({ size: 100, page: 5 })

        pagination.select(0)
        expect(pagination.page.value).toBe(1)

        pagination.select(-5)
        expect(pagination.page.value).toBe(1)
      })

      it('should clamp to page count when value exceeds pages', () => {
        const pagination = createPagination({ size: 100, page: 1 })

        pagination.select(15)

        expect(pagination.page.value).toBe(10)
      })

      it('should handle going to first page', () => {
        const pagination = createPagination({ size: 100, page: 5 })

        pagination.select(1)

        expect(pagination.page.value).toBe(1)
      })

      it('should handle going to last page', () => {
        const pagination = createPagination({ size: 100, page: 1 })

        pagination.select(10)

        expect(pagination.page.value).toBe(10)
      })
    })
  })

  describe('boundary computed', () => {
    describe('isFirst', () => {
      it('should be true when page is 1', () => {
        const pagination = createPagination({ size: 100, page: 1 })

        expect(pagination.isFirst.value).toBe(true)
      })

      it('should be false when page is greater than 1', () => {
        const pagination = createPagination({ size: 100, page: 2 })

        expect(pagination.isFirst.value).toBe(false)
      })
    })

    describe('isLast', () => {
      it('should be true when page equals page count', () => {
        const pagination = createPagination({ size: 100, page: 10 })

        expect(pagination.isLast.value).toBe(true)
      })

      it('should be false when page is less than page count', () => {
        const pagination = createPagination({ size: 100, page: 9 })

        expect(pagination.isLast.value).toBe(false)
      })
    })
  })

  describe('pageStart and pageStop', () => {
    it('should calculate correct start and stop for page 1', () => {
      const pagination = createPagination({ size: 250, page: 1, itemsPerPage: 25 })

      expect(pagination.pageStart.value).toBe(0)
      expect(pagination.pageStop.value).toBe(25)
    })

    it('should calculate correct start and stop for page 2', () => {
      const pagination = createPagination({ size: 250, page: 2, itemsPerPage: 25 })

      expect(pagination.pageStart.value).toBe(25)
      expect(pagination.pageStop.value).toBe(50)
    })

    it('should clamp pageStop to total items on last page', () => {
      const pagination = createPagination({ size: 95, page: 4, itemsPerPage: 25 })

      expect(pagination.pageStart.value).toBe(75)
      expect(pagination.pageStop.value).toBe(95) // Clamped to total items, not 100
    })

    it('should update when itemsPerPage changes', () => {
      const itemsPerPage = shallowRef(10)
      const pagination = createPagination({ size: 100, page: 2, itemsPerPage })

      expect(pagination.pageStart.value).toBe(10)
      expect(pagination.pageStop.value).toBe(20)

      itemsPerPage.value = 25

      expect(pagination.pageStart.value).toBe(25)
      expect(pagination.pageStop.value).toBe(50)
    })
  })

  describe('items', () => {
    it('should return empty array when size is 0', () => {
      const pagination = createPagination({ size: 0 })

      expect(pagination.items.value).toEqual([])
    })

    it('should return empty array when visible is 0', () => {
      const pagination = createPagination({ size: 100, visible: 0 })

      expect(pagination.items.value).toEqual([])
    })

    it('should return current page when visible is 1 or 2', () => {
      const p1 = createPagination({ size: 100, page: 5, visible: 1 })
      expect(p1.items.value).toEqual([{ type: 'page', value: 5 }])

      const p2 = createPagination({ size: 100, page: 7, visible: 2 })
      expect(p2.items.value).toEqual([{ type: 'page', value: 7 }])
    })

    it('should return all pages when page count <= visible', () => {
      const pagination = createPagination({ size: 30, visible: 5 })

      expect(pagination.items.value).toEqual([
        { type: 'page', value: 1 },
        { type: 'page', value: 2 },
        { type: 'page', value: 3 },
      ])
    })

    it('should show ellipsis at end when at start of range', () => {
      // 1000 items / 10 per page = 100 pages
      // visible: 5 = 3 boundary pages + ellipsis + last page
      const pagination = createPagination({ size: 1000, page: 1, visible: 5 })

      expect(pagination.items.value).toEqual([
        { type: 'page', value: 1 },
        { type: 'page', value: 2 },
        { type: 'page', value: 3 },
        { type: 'ellipsis', value: '...' },
        { type: 'page', value: 100 },
      ])
    })

    it('should show ellipsis at start when at end of range', () => {
      // 1000 items / 10 per page = 100 pages
      // visible: 5 = first page + ellipsis + 3 boundary pages
      const pagination = createPagination({ size: 1000, page: 100, visible: 5 })

      expect(pagination.items.value).toEqual([
        { type: 'page', value: 1 },
        { type: 'ellipsis', value: '...' },
        { type: 'page', value: 98 },
        { type: 'page', value: 99 },
        { type: 'page', value: 100 },
      ])
    })

    it('should show ellipsis on both sides when in middle', () => {
      // 1000 items / 10 per page = 100 pages
      // visible: 5 = first + ellipsis + 1 middle page + ellipsis + last
      const pagination = createPagination({ size: 1000, page: 50, visible: 5 })

      expect(pagination.items.value).toEqual([
        { type: 'page', value: 1 },
        { type: 'ellipsis', value: '...' },
        { type: 'page', value: 50 },
        { type: 'ellipsis', value: '...' },
        { type: 'page', value: 100 },
      ])
    })

    it('should always show current page with small visible values', () => {
      // 1000 items / 10 per page = 100 pages
      // visible: 4, current in middle → [1, current, ..., 100]
      const pagination = createPagination({ size: 1000, page: 50, visible: 4 })

      expect(pagination.items.value).toEqual([
        { type: 'page', value: 1 },
        { type: 'page', value: 50 },
        { type: 'ellipsis', value: '...' },
        { type: 'page', value: 100 },
      ])
    })

    it('should position ellipsis based on current page proximity', () => {
      // page closer to end → ellipsis before current
      const pagination = createPagination({ size: 1000, page: 75, visible: 4 })

      expect(pagination.items.value).toEqual([
        { type: 'page', value: 1 },
        { type: 'ellipsis', value: '...' },
        { type: 'page', value: 75 },
        { type: 'page', value: 100 },
      ])
    })

    it('should show start boundary when current is near start', () => {
      // current=2 is within boundary (2), show start layout
      const pagination = createPagination({ size: 1000, page: 2, visible: 4 })

      expect(pagination.items.value).toEqual([
        { type: 'page', value: 1 },
        { type: 'page', value: 2 },
        { type: 'ellipsis', value: '...' },
        { type: 'page', value: 100 },
      ])
    })

    it('should show end boundary when current is near end', () => {
      // current=99 is within end boundary, show end layout
      const pagination = createPagination({ size: 1000, page: 99, visible: 4 })

      expect(pagination.items.value).toEqual([
        { type: 'page', value: 1 },
        { type: 'ellipsis', value: '...' },
        { type: 'page', value: 99 },
        { type: 'page', value: 100 },
      ])
    })

    it('should use custom ellipsis character', () => {
      const pagination = createPagination({ size: 1000, page: 50, visible: 5, ellipsis: '...' })

      const ellipsisItem = pagination.items.value.find(item => item.type === 'ellipsis')
      expect(ellipsisItem?.value).toBe('...')
    })

    it('should update items when page changes', () => {
      const pagination = createPagination({ size: 1000, page: 1, visible: 5 })

      expect(pagination.items.value[0]).toEqual({ type: 'page', value: 1 })

      pagination.page.value = 50

      expect(pagination.items.value).toContainEqual({ type: 'page', value: 50 })
    })

    it('should maintain consistent item count across all pages', () => {
      // 200 items / 10 per page = 20 pages
      const pagination = createPagination({ size: 200, page: 1, visible: 7 })

      // Test every page and verify item count stays constant
      for (let i = 1; i <= 20; i++) {
        pagination.page.value = i
        expect(pagination.items.value.length).toBe(7)
      }
    })
  })

  describe('v-model support', () => {
    it('should use provided ref for page', () => {
      const page = shallowRef(5)
      const pagination = createPagination({ page, size: 100 })

      expect(pagination.page.value).toBe(5)
      expect(pagination.page).toBe(page)
    })

    it('should sync when external ref changes', () => {
      const page = shallowRef(1)
      const pagination = createPagination({ page, size: 100 })

      page.value = 7

      expect(pagination.page.value).toBe(7)
    })

    it('should sync when pagination methods are called', () => {
      const page = shallowRef(1)
      const pagination = createPagination({ page, size: 100 })

      pagination.next()

      expect(page.value).toBe(2)
    })

    it('should use provided ref for itemsPerPage', () => {
      const itemsPerPage = shallowRef(25)
      const pagination = createPagination({ itemsPerPage, size: 100 })

      expect(pagination.itemsPerPage).toBe(25)

      itemsPerPage.value = 50
      expect(pagination.itemsPerPage).toBe(50)
    })
  })

  describe('defaults', () => {
    it('should have default page of 1', () => {
      const pagination = createPagination({ size: 100 })

      expect(pagination.page.value).toBe(1)
    })

    it('should have default itemsPerPage of 10', () => {
      const pagination = createPagination({ size: 100 })

      expect(pagination.itemsPerPage).toBe(10)
    })

    it('should have default visible of 7', () => {
      // 1000 items / 10 per page = 100 pages
      const pagination = createPagination({ size: 1000 })

      // With visible=7 at page 1: [1, 2, 3, 4, 5, ..., 100] = 7 items total
      expect(pagination.items.value.length).toBe(7)
      const pageItems = pagination.items.value.filter(item => item.type === 'page')
      expect(pageItems.length).toBe(6) // 1, 2, 3, 4, 5, 100
    })

    it('should have default ellipsis of "..."', () => {
      // 1000 items / 10 per page = 100 pages
      const pagination = createPagination({ size: 1000, page: 50 })

      const ellipsis = pagination.items.value.find(item => item.type === 'ellipsis')
      expect(ellipsis?.value).toBe('...')
    })
  })

  describe('size getter', () => {
    it('should return the total items count', () => {
      const pagination = createPagination({ size: 42 })

      expect(pagination.size).toBe(42)
    })
  })

  describe('pages getter', () => {
    it('should return the computed page count', () => {
      const pagination = createPagination({ size: 100 })

      expect(pagination.pages).toBe(10) // 100 items / 10 per page
    })

    it('should update when itemsPerPage changes', () => {
      const itemsPerPage = shallowRef(10)
      const pagination = createPagination({ size: 100, itemsPerPage })

      expect(pagination.pages).toBe(10)

      itemsPerPage.value = 25
      expect(pagination.pages).toBe(4) // ceil(100 / 25) = 4
    })
  })

  describe('edge cases', () => {
    it('should handle size of 1 item (single page)', () => {
      const pagination = createPagination({ size: 1 })

      expect(pagination.page.value).toBe(1)
      expect(pagination.pages).toBe(1)
      expect(pagination.isFirst.value).toBe(true)
      expect(pagination.isLast.value).toBe(true)

      pagination.next()
      expect(pagination.page.value).toBe(1)

      pagination.prev()
      expect(pagination.page.value).toBe(1)
    })

    it('should handle negative size', () => {
      const pagination = createPagination({ size: -5 })

      expect(pagination.items.value).toEqual([])
    })

    it('should handle NaN size', () => {
      const pagination = createPagination({ size: Number.NaN })

      expect(pagination.items.value).toEqual([])
    })

    it('should handle very large item counts efficiently', () => {
      // 10M items / 10 per page = 1M pages
      const pagination = createPagination({ size: 10_000_000, page: 500_000 })

      // Should not create 1M registry entries - just compute items
      expect(pagination.items.value.length).toBeLessThan(20)
      expect(pagination.page.value).toBe(500_000)
    })
  })
})
