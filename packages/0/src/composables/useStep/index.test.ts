import { describe, it, expect, beforeEach } from 'vitest'
import { createStepContext } from './index'

describe('createStepContext', () => {
  describe('basic functionality', () => {
    it('should initialize with empty state', () => {
      const state = createStepContext('test')[2]

      expect(state.selectedIds.size).toBe(0)
      expect(state.collection.size).toBe(0)
      expect(state.selectedItem.value).toBeUndefined()
    })
  })

  describe('item registration', () => {
    it('should register items with step functionality', () => {
      const [, provideStepContext, state] = createStepContext('test')
      const context = provideStepContext()

      const ticket = context.register()

      expect(ticket.id).toBeDefined()
      expect(ticket.disabled).toBe(false)
      expect(ticket.value).toBe(0)
      expect(ticket.valueIsIndex).toBe(true)
      expect(ticket.index).toBe(0)
      expect(typeof ticket.isActive).toBe('boolean')
      expect(typeof ticket.toggle).toBe('function')
      expect(state.collection.size).toBe(1)
    })
  })

  describe('navigation functions', () => {
    let context: any
    let state: any

    beforeEach(() => {
      const result = createStepContext('test')
      const [, provideStep] = result
      state = result[2]
      context = provideStep()
    })

    it('should navigate to first item', () => {
      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.register({ id: 'item3' })

      context.select('item2')
      expect(state.selectedIds.has('item2')).toBe(true)

      context.first()
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedIds.has('item2')).toBe(false)
      expect(state.selectedIds.has('item3')).toBe(false)
      expect(state.selectedItem.value?.id).toBe('item1')
    })

    it('should navigate to last item', () => {
      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.register({ id: 'item3' })

      context.select('item1')
      expect(state.selectedIds.has('item1')).toBe(true)

      context.last()
      expect(state.selectedIds.has('item1')).toBe(false)
      expect(state.selectedIds.has('item2')).toBe(false)
      expect(state.selectedIds.has('item3')).toBe(true)
      expect(state.selectedItem.value?.id).toBe('item3')
    })

    it('should navigate to next item', () => {
      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.register({ id: 'item3' })

      context.select('item1')
      expect(state.selectedIds.has('item1')).toBe(true)

      context.next()
      expect(state.selectedIds.has('item1')).toBe(false)
      expect(state.selectedIds.has('item2')).toBe(true)
      expect(state.selectedIds.has('item3')).toBe(false)
      expect(state.selectedItem.value?.id).toBe('item2')
    })

    it('should wrap around when navigating next from last item', () => {
      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.register({ id: 'item3' })

      context.select('item3')
      expect(state.selectedIds.has('item3')).toBe(true)

      context.next()
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedIds.has('item2')).toBe(false)
      expect(state.selectedIds.has('item3')).toBe(false)
      expect(state.selectedItem.value?.id).toBe('item1')
    })

    it('should navigate to previous item', () => {
      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.register({ id: 'item3' })

      context.select('item2')
      expect(state.selectedIds.has('item2')).toBe(true)

      context.prev()
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedIds.has('item2')).toBe(false)
      expect(state.selectedIds.has('item3')).toBe(false)
      expect(state.selectedItem.value?.id).toBe('item1')
    })

    it('should wrap around when navigating prev from first item', () => {
      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.register({ id: 'item3' })

      context.select('item1')
      expect(state.selectedIds.has('item1')).toBe(true)

      context.prev()
      expect(state.selectedIds.has('item1')).toBe(false)
      expect(state.selectedIds.has('item2')).toBe(false)
      expect(state.selectedIds.has('item3')).toBe(true)
      expect(state.selectedItem.value?.id).toBe('item3')
    })

    it('should navigate by specific step count', () => {
      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.register({ id: 'item3' })
      context.register({ id: 'item4' })

      context.select('item1')
      expect(state.selectedIds.has('item1')).toBe(true)

      context.step(2)
      expect(state.selectedIds.has('item1')).toBe(false)
      expect(state.selectedIds.has('item2')).toBe(false)
      expect(state.selectedIds.has('item3')).toBe(true)
      expect(state.selectedIds.has('item4')).toBe(false)
      expect(state.selectedItem.value?.id).toBe('item3')
    })

    it('should wrap around when stepping beyond bounds', () => {
      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.register({ id: 'item3' })

      context.select('item2')
      expect(state.selectedIds.has('item2')).toBe(true)

      context.step(5) // 1 + 5 = 6, 6 % 3 = 0
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedIds.has('item2')).toBe(false)
      expect(state.selectedIds.has('item3')).toBe(false)
      expect(state.selectedItem.value?.id).toBe('item1')
    })

    it('should handle navigation with no items registered', () => {
      expect(() => {
        context.first()
        context.last()
        context.next()
        context.prev()
        context.step(5)
      }).not.toThrow()

      expect(state.selectedIds.size).toBe(0)
      expect(state.selectedItem.value).toBeUndefined()
    })

    it('should handle navigation with single item', () => {
      context.register({ id: 'item1' })

      context.first()
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedItem.value?.id).toBe('item1')

      context.last()
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedItem.value?.id).toBe('item1')

      context.next()
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedItem.value?.id).toBe('item1')

      context.prev()
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedItem.value?.id).toBe('item1')

      context.step(10)
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedItem.value?.id).toBe('item1')
    })

    it('should handle navigation from no current selection', () => {
      context.register({ id: 'item1' })
      context.register({ id: 'item2' })

      context.next()
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedIds.has('item2')).toBe(false)
      expect(state.selectedItem.value?.id).toBe('item1')
    })

    it('should handle negative step counts', () => {
      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.register({ id: 'item3' })

      context.select('item2')
      expect(state.selectedIds.has('item2')).toBe(true)

      context.step(-1) // Should go backwards
      expect(state.selectedIds.has('item1')).toBe(true)
      expect(state.selectedIds.has('item2')).toBe(false)
      expect(state.selectedItem.value?.id).toBe('item1')
    })
  })
})
