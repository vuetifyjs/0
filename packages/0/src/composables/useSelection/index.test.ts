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
