// Composables
import { createSelection } from './index'

// Utilities
import { describe, it, expect } from 'vitest'

describe('useSelection', () => {
  describe('mandate', () => {
    it('should select first item when mandatory is true and no selection exists', () => {
      const selection = createSelection({ mandatory: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      expect(selection.selectedIds.size).toBe(0)

      selection.mandate()

      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-1')).toBe(true)
    })

    it('should not select anything when mandatory is false', () => {
      const selection = createSelection({ mandatory: false })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(selection.selectedIds.size).toBe(0)

      selection.mandate()

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should not select anything when registry is empty', () => {
      const selection = createSelection({ mandatory: true })

      expect(selection.size).toBe(0)
      expect(selection.selectedIds.size).toBe(0)

      selection.mandate()

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should not change selection when something is already selected', () => {
      const selection = createSelection({ mandatory: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      selection.select('item-2')

      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-2')).toBe(true)

      selection.mandate()

      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-2')).toBe(true)
      expect(selection.selectedIds.has('item-1')).toBe(false)
    })

    it('should auto-select first item during registration when mandatory is "force"', () => {
      const selection = createSelection({ mandatory: 'force' })

      expect(selection.selectedIds.size).toBe(0)

      selection.register({ id: 'item-1', value: 'value-1' })

      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-1')).toBe(true)
    })

    it('should skip disabled items when mandating selection', () => {
      const selection = createSelection({ mandatory: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2' },
      ])

      selection.mandate()

      // mandate() should skip the disabled item-1 and select item-2
      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-2')).toBe(true)
    })

    it('should not select anything when all items are disabled', () => {
      const selection = createSelection({ mandatory: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2', disabled: true },
        { id: 'item-3', value: 'value-3', disabled: true },
      ])

      selection.mandate()

      // All items are disabled, so nothing should be selected
      expect(selection.selectedIds.size).toBe(0)
    })
  })

  describe('reset', () => {
    it('should clear registry and selectedIds', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      selection.select('item-1')
      selection.select('item-2')

      // Verify selectedIds has items before reset
      expect(selection.selectedIds.size).toBe(2)
      expect(selection.selectedIds.has('item-1')).toBe(true)
      expect(selection.selectedIds.has('item-2')).toBe(true)

      selection.reset()

      // After reset, everything should be cleared
      expect(selection.size).toBe(0)
      expect(selection.selectedIds.size).toBe(0)
    })

    it('should clear selectedIds and call mandate when mandatory is true', () => {
      const selection = createSelection({ mandatory: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      selection.select('item-2')

      // Verify selectedIds before reset
      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-2')).toBe(true)

      selection.reset()

      // After reset, registry is empty, selectedIds is cleared, mandate does nothing
      expect(selection.size).toBe(0)
      expect(selection.selectedIds.size).toBe(0)
    })
  })

  describe('seek', () => {
    it('should find first non-disabled item', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      const result = selection.seek('first')

      expect(result).toBeDefined()
      expect(result?.id).toBe('item-1')
    })

    it('should find last non-disabled item', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      const result = selection.seek('last')

      expect(result).toBeDefined()
      expect(result?.id).toBe('item-3')
    })

    it('should skip disabled items when seeking first', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2', disabled: true },
        { id: 'item-3', value: 'value-3' },
      ])

      const result = selection.seek('first')

      expect(result).toBeDefined()
      expect(result?.id).toBe('item-3')
    })

    it('should skip disabled items when seeking last', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2', disabled: true },
        { id: 'item-3', value: 'value-3', disabled: true },
      ])

      const result = selection.seek('last')

      expect(result).toBeDefined()
      expect(result?.id).toBe('item-1')
    })

    it('should return undefined when all items are disabled', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      const first = selection.seek('first')
      const last = selection.seek('last')

      expect(first).toBeUndefined()
      expect(last).toBeUndefined()
    })

    it('should return undefined when registry is empty', () => {
      const selection = createSelection()

      const first = selection.seek('first')
      const last = selection.seek('last')

      expect(first).toBeUndefined()
      expect(last).toBeUndefined()
    })

    it('should seek forward from specific index', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
        { id: 'item-4', value: 'value-4' },
      ])

      const result = selection.seek('first', 2)

      expect(result).toBeDefined()
      expect(result?.id).toBe('item-3')
      expect(result?.index).toBe(2)
    })

    it('should seek backward from specific index', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
        { id: 'item-4', value: 'value-4' },
      ])

      const result = selection.seek('last', 2)

      expect(result).toBeDefined()
      expect(result?.id).toBe('item-3')
      expect(result?.index).toBe(2)
    })

    it('should skip disabled items when seeking from index', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2', disabled: true },
        { id: 'item-3', value: 'value-3', disabled: true },
        { id: 'item-4', value: 'value-4' },
      ])

      const forward = selection.seek('first', 1)
      const backward = selection.seek('last', 2)

      expect(forward).toBeDefined()
      expect(forward?.id).toBe('item-4')
      expect(backward).toBeDefined()
      expect(backward?.id).toBe('item-1')
    })

    it('should clamp from index to valid range', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      // Index beyond bounds should clamp to last item
      const beyondEnd = selection.seek('first', 999)
      expect(beyondEnd).toBeDefined()
      expect(beyondEnd?.id).toBe('item-2')

      // Negative index should clamp to first item
      const negative = selection.seek('first', -1)
      expect(negative).toBeDefined()
      expect(negative?.id).toBe('item-1')
    })

    it('should handle item removal scenario - find next from removed position', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2', disabled: true },
        { id: 'item-3', value: 'value-3' },
        { id: 'item-4', value: 'value-4' },
      ])

      // Simulate: item at index 2 (item-3) was selected and removed
      // We want to find the next non-disabled item from that position
      const nextItem = selection.seek('first', 2)

      // Should find item-4 (which is now at index 3)
      expect(nextItem).toBeDefined()
      expect(nextItem?.id).toBe('item-3')
    })
  })

  describe('selection', () => {
    it('should select an item', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      selection.select('item-1')

      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-1')).toBe(true)
    })

    it('should unselect an item', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      selection.select('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(true)

      selection.unselect('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(false)
    })

    it('should toggle an item on and off', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      selection.toggle('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(true)

      selection.toggle('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(false)
    })

    it('should allow multiple selections', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      selection.select('item-1')
      selection.select('item-2')
      selection.select('item-3')

      expect(selection.selectedIds.size).toBe(3)
      expect(selection.selectedIds.has('item-1')).toBe(true)
      expect(selection.selectedIds.has('item-2')).toBe(true)
      expect(selection.selectedIds.has('item-3')).toBe(true)
    })

    it('should prevent deselection when mandatory is true and only one item selected', () => {
      const selection = createSelection({ mandatory: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      selection.select('item-1')

      expect(selection.selectedIds.size).toBe(1)

      selection.unselect('item-1')

      // Should still be selected due to mandatory
      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-1')).toBe(true)
    })

    it('should allow deselection when mandatory is true but multiple items selected', () => {
      const selection = createSelection({ mandatory: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      selection.select('item-1')
      selection.select('item-2')
      expect(selection.selectedIds.size).toBe(2)

      selection.unselect('item-1')
      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-2')).toBe(true)
    })

    it('should not select disabled items', () => {
      const selection = createSelection()

      selection.register({ id: 'disabled-item', value: 'value', disabled: true })

      selection.select('disabled-item')

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should not select non-existent items', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      selection.select('non-existent')

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should auto-enroll non-disabled items when enroll is true', () => {
      const selection = createSelection({ enroll: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2', disabled: true },
        { id: 'item-3', value: 'value-3' },
      ])

      expect(selection.selectedIds.size).toBe(2)
      expect(selection.selectedIds.has('item-1')).toBe(true)
      expect(selection.selectedIds.has('item-2')).toBe(false)
      expect(selection.selectedIds.has('item-3')).toBe(true)
    })

    it('should check if an item is selected with selected()', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      expect(selection.selected('item-1')).toBe(false)

      selection.select('item-1')
      expect(selection.selected('item-1')).toBe(true)

      selection.unselect('item-1')
      expect(selection.selected('item-1')).toBe(false)
    })
  })

  describe('selectedItems and selectedValues', () => {
    it('should compute selectedItems correctly', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      selection.select('item-1')
      selection.select('item-3')

      const items = Array.from(selection.selectedItems.value)
      expect(items.length).toBe(2)
      expect(items.some(item => item.id === 'item-1')).toBe(true)
      expect(items.some(item => item.id === 'item-3')).toBe(true)
    })

    it('should compute selectedValues correctly', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      selection.select('item-1')
      selection.select('item-3')

      const values = Array.from(selection.selectedValues.value)
      expect(values.length).toBe(2)
      expect(values).toContain('value-1')
      expect(values).toContain('value-3')
    })

    it('should update selectedItems and selectedValues reactively', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(selection.selectedItems.value.size).toBe(0)
      expect(selection.selectedValues.value.size).toBe(0)

      selection.select('item-1')
      expect(selection.selectedItems.value.size).toBe(1)
      expect(selection.selectedValues.value.size).toBe(1)

      selection.select('item-2')
      expect(selection.selectedItems.value.size).toBe(2)
      expect(selection.selectedValues.value.size).toBe(2)

      selection.unselect('item-1')
      expect(selection.selectedItems.value.size).toBe(1)
      expect(selection.selectedValues.value.size).toBe(1)
    })
  })

  describe('ticket methods', () => {
    it('should provide select() method on each ticket', () => {
      const selection = createSelection()

      const ticket = selection.register({ id: 'item-1', value: 'value-1' })

      expect(typeof ticket.select).toBe('function')

      ticket.select()
      expect(selection.selectedIds.has('item-1')).toBe(true)
    })

    it('should provide unselect() method on each ticket', () => {
      const selection = createSelection()

      const ticket = selection.register({ id: 'item-1', value: 'value-1' })
      ticket.select()
      expect(selection.selectedIds.has('item-1')).toBe(true)

      ticket.unselect()
      expect(selection.selectedIds.has('item-1')).toBe(false)
    })

    it('should provide toggle() method on each ticket', () => {
      const selection = createSelection()

      const ticket = selection.register({ id: 'item-1', value: 'value-1' })

      ticket.toggle()
      expect(selection.selectedIds.has('item-1')).toBe(true)

      ticket.toggle()
      expect(selection.selectedIds.has('item-1')).toBe(false)
    })

    it('should provide reactive isSelected property on each ticket', () => {
      const selection = createSelection()

      const ticket = selection.register({ id: 'item-1', value: 'value-1' })

      expect(ticket.isSelected.value).toBe(false)

      ticket.select()
      expect(ticket.isSelected.value).toBe(true)

      ticket.unselect()
      expect(ticket.isSelected.value).toBe(false)
    })
  })

  describe('unregister', () => {
    it('should remove item from selectedIds when unregistering', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      selection.select('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(true)

      selection.unregister('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(false)
      expect(selection.size).toBe(1)
    })
  })

  describe('edge cases', () => {
    it('should handle empty registry gracefully', () => {
      const selection = createSelection()

      expect(selection.size).toBe(0)
      expect(selection.selectedIds.size).toBe(0)

      selection.select('non-existent')
      expect(selection.selectedIds.size).toBe(0)
    })

    it('should handle mandatory with enroll', () => {
      const selection = createSelection({ mandatory: true, enroll: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      // Both should be enrolled
      expect(selection.selectedIds.size).toBe(2)

      // Should still prevent deselection when only one remains
      selection.unselect('item-1')
      expect(selection.selectedIds.size).toBe(1)

      selection.unselect('item-2')
      // Mandatory prevents last deselection
      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-2')).toBe(true)
    })

    it('should handle all disabled items with enroll', () => {
      const selection = createSelection({ enroll: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should handle mandatory force with all disabled items', () => {
      const selection = createSelection({ mandatory: 'force' })

      selection.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      expect(selection.selectedIds.size).toBe(0)
    })
  })
})
