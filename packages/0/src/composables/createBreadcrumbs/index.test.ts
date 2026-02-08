import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide, ref } from 'vue'

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

    it('should accept custom visible option', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 3 })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
        { text: 'Phones' },
        { text: 'iPhone' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(3)
    })

    it('should accept custom ellipsis option', () => {
      const breadcrumbs = createBreadcrumbs({ ellipsis: '...' })

      expect(breadcrumbs.ellipsis).toBe('...')
    })

    it('should default ellipsis to unicode ellipsis', () => {
      const breadcrumbs = createBreadcrumbs()

      expect(breadcrumbs.ellipsis).toBe('\u2026')
    })

    it('should accept ellipsis: false to disable collapsing', () => {
      const breadcrumbs = createBreadcrumbs({ ellipsis: false })

      expect(breadcrumbs.ellipsis).toBe(false)
    })

    it('should default visible to Infinity', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { text: 'A' },
        { text: 'B' },
        { text: 'C' },
        { text: 'D' },
        { text: 'E' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(5)
      expect(breadcrumbs.tickets.value.every(t => t.type === 'crumb')).toBe(true)
    })

    it('should accept reactive visible option', () => {
      const visible = ref(Infinity)
      const breadcrumbs = createBreadcrumbs({ visible })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
        { text: 'Phones' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(4)

      visible.value = 3
      // visible=3 with 4 items: [Home] [...] [Phones]
      expect(breadcrumbs.tickets.value).toHaveLength(3)
      expect(breadcrumbs.tickets.value[1]!.type).toBe('ellipsis')
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

    it('should handle visible=1 with multiple items', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 1 })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
      ])

      const tickets = breadcrumbs.tickets.value
      // visible=1: tailCount = max(1, 1-2) = 1, collapseEnd = 3-1 = 2
      // head(0) + ellipsis(1..2) + tail(2) = 3 render tickets
      expect(tickets.length).toBeGreaterThan(0)
      expect(tickets[0]!.type).toBe('crumb')
    })

    it('should handle visible=2 with 3 items', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 2 })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
      ])

      // visible=2: tailCount = max(1, 2-2) = 1, collapseEnd = 3-1 = 2
      // head(0) + ellipsis(1..2) + tail(2) = 3 render tickets
      // The minimum collapsed output always includes head + ellipsis + 1 tail
      expect(breadcrumbs.tickets.value).toHaveLength(3)
      expect(breadcrumbs.tickets.value[0]!.type).toBe('crumb')
      expect(breadcrumbs.tickets.value[1]!.type).toBe('ellipsis')
      expect(breadcrumbs.tickets.value[2]!.type).toBe('crumb')
    })

    it('should handle single item with visible constraint', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 2 })

      breadcrumbs.register({ text: 'Home' })

      expect(breadcrumbs.tickets.value).toHaveLength(1)
      expect(breadcrumbs.tickets.value[0]!.type).toBe('crumb')
    })

    it('should handle visible equal to item count (no collapse)', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 3 })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(3)
      expect(breadcrumbs.tickets.value.every(t => t.type === 'crumb')).toBe(true)
    })

    it('should update tickets when items are added dynamically', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 3 })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(2)

      breadcrumbs.register({ text: 'Electronics' })
      expect(breadcrumbs.tickets.value).toHaveLength(3)

      breadcrumbs.register({ text: 'Phones' })
      expect(breadcrumbs.tickets.value).toHaveLength(3)
      expect(breadcrumbs.tickets.value[1]!.type).toBe('ellipsis')
    })

    it('should update tickets when items are removed via navigation', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 3 })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
        { text: 'Phones' },
        { text: 'iPhone' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(3)
      expect(breadcrumbs.tickets.value[1]!.type).toBe('ellipsis')

      breadcrumbs.prev()
      breadcrumbs.prev()
      expect(breadcrumbs.tickets.value).toHaveLength(3)
      expect(breadcrumbs.tickets.value.every(t => t.type === 'crumb')).toBe(true)
    })

    it('should include correct index in crumb tickets', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
      ])

      const tickets = breadcrumbs.tickets.value
      for (const [i, ticket_] of tickets.entries()) {
        const ticket = ticket_!
        if (ticket.type === 'crumb') {
          expect(ticket.index).toBe(i)
        }
      }
    })

    it('should handle deeply nested paths with collapse', () => {
      const breadcrumbs = createBreadcrumbs({ visible: 3 })

      const items = Array.from({ length: 20 }, (_, i) => ({ text: `Level ${i}` }))
      breadcrumbs.onboard(items)

      const tickets = breadcrumbs.tickets.value
      expect(tickets).toHaveLength(3)
      expect(tickets[0]!.type).toBe('crumb')
      expect(tickets[1]!.type).toBe('ellipsis')
      expect(tickets[2]!.type).toBe('crumb')

      if (tickets[1]!.type === 'ellipsis') {
        expect(tickets[1]!.collapsed).toHaveLength(18)
      }

      if (tickets[2]!.type === 'crumb') {
        expect(tickets[2]!.value.text).toBe('Level 19')
      }
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
      expect(breadcrumbs.tickets.value).toEqual([])
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
      expect(breadcrumbs.tickets.value).toHaveLength(1)
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

  describe('reactive updates', () => {
    it('should reflect added items in tickets', () => {
      const breadcrumbs = createBreadcrumbs()

      expect(breadcrumbs.tickets.value).toHaveLength(0)

      breadcrumbs.register({ text: 'Home' })
      expect(breadcrumbs.tickets.value).toHaveLength(1)

      breadcrumbs.register({ text: 'Products' })
      expect(breadcrumbs.tickets.value).toHaveLength(2)
    })

    it('should reflect removed items in tickets after navigation', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(3)

      breadcrumbs.prev()
      expect(breadcrumbs.tickets.value).toHaveLength(2)
    })

    it('should reflect cleared items', () => {
      const breadcrumbs = createBreadcrumbs()

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(2)

      breadcrumbs.clear()
      expect(breadcrumbs.tickets.value).toHaveLength(0)
    })

    it('should update reactive visible and reflect in tickets', () => {
      const visible = ref(Infinity)
      const breadcrumbs = createBreadcrumbs({ visible })

      breadcrumbs.onboard([
        { text: 'Home' },
        { text: 'Products' },
        { text: 'Electronics' },
        { text: 'Phones' },
      ])

      expect(breadcrumbs.tickets.value).toHaveLength(4)
      expect(breadcrumbs.tickets.value.every(t => t.type === 'crumb')).toBe(true)

      visible.value = 3
      expect(breadcrumbs.tickets.value).toHaveLength(3)
      expect(breadcrumbs.tickets.value[1]!.type).toBe('ellipsis')

      visible.value = Infinity
      expect(breadcrumbs.tickets.value).toHaveLength(4)
      expect(breadcrumbs.tickets.value.every(t => t.type === 'crumb')).toBe(true)
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

    expect(context.ellipsis).toBe('\u2026')
  })

  it('should pass visible option through', () => {
    const [, , context] = createBreadcrumbsContext({
      visible: 3,
    })

    context.onboard([
      { text: 'Home' },
      { text: 'Products' },
      { text: 'Electronics' },
      { text: 'Phones' },
      { text: 'iPhone' },
    ])

    // visible=3 with 5 items: [Home] [...] [iPhone]
    expect(context.tickets.value).toHaveLength(3)
    expect(context.tickets.value[1]!.type).toBe('ellipsis')
  })

  it('should pass ellipsis option through', () => {
    const [, , context] = createBreadcrumbsContext({
      ellipsis: '...',
    })

    expect(context.ellipsis).toBe('...')
  })

  it('should allow providing custom context', () => {
    const customContext = createBreadcrumbs({ visible: 5 })
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
