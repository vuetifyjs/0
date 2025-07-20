import { describe, it, expect } from 'vitest'
import { useSingle } from './index'

describe('useSingle', () => {
  describe('basic functionality', () => {
    it('should initialize with empty state', () => {
      const state = useSingle('test')[2]

      expect(state.selectedIds.size).toBe(0)
      expect(state.selectedItems.value.size).toBe(0)
      expect(state.selectedValues.value.size).toBe(0)
      expect(state.tickets.size).toBe(0)
    })
  })

  describe('selection behavior', () => {
    it('should provide singular selectedId, selectedItem, and selectedValue', () => {
      const [, provideCtx, context] = useSingle('test')
      const groupContext = provideCtx()

      expect(context.selectedId.value).toBeUndefined()
      expect(context.selectedItem.value).toBeUndefined()
      expect(context.selectedValue.value).toBeUndefined()

      const ticket = groupContext.register({ id: 'item1', value: 'value1' })
      context.select('item1')

      expect(context.selectedId.value).toBe('item1')
      expect(context.selectedItem.value).toBe(ticket)
      expect(context.selectedValue.value).toBe('value1')
    })
  })
})
