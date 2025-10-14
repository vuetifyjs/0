// Composables
import { useSelection } from './index'

// Utilities
import { describe, it, expect } from 'vitest'

describe('useSelection', () => {
  describe('mandate', () => {
    it('should select first item when mandatory is true and no selection exists', () => {
      const selection = useSelection({ mandatory: true })

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
      const selection = useSelection({ mandatory: false })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(selection.selectedIds.size).toBe(0)

      selection.mandate()

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should not select anything when registry is empty', () => {
      const selection = useSelection({ mandatory: true })

      expect(selection.size).toBe(0)
      expect(selection.selectedIds.size).toBe(0)

      selection.mandate()

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should not change selection when something is already selected', () => {
      const selection = useSelection({ mandatory: true })

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
      const selection = useSelection({ mandatory: 'force' })

      expect(selection.selectedIds.size).toBe(0)

      selection.register({ id: 'item-1', value: 'value-1' })

      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-1')).toBe(true)
    })

    it('should skip disabled items when mandating selection', () => {
      const selection = useSelection({ mandatory: true })

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
      const selection = useSelection({ mandatory: true })

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
      const selection = useSelection()

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
      const selection = useSelection({ mandatory: true })

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
      const selection = useSelection()

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
      const selection = useSelection()

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
      const selection = useSelection()

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
      const selection = useSelection()

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
      const selection = useSelection()

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
      const selection = useSelection()

      const first = selection.seek('first')
      const last = selection.seek('last')

      expect(first).toBeUndefined()
      expect(last).toBeUndefined()
    })

    it('should seek forward from specific index', () => {
      const selection = useSelection()

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
      const selection = useSelection()

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
      const selection = useSelection()

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
      const selection = useSelection()

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
      const selection = useSelection()

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
    it('should prevent deselection when mandatory is true and only one item selected', () => {
      const selection = useSelection({ mandatory: true })

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

    it('should not select disabled items', () => {
      const selection = useSelection()

      selection.register({ id: 'disabled-item', value: 'value', disabled: true })

      selection.select('disabled-item')

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should auto-enroll non-disabled items when enroll is true', () => {
      const selection = useSelection({ enroll: true })

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
  })
})
