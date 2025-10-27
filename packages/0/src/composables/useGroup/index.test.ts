// Composables
import { createGroup } from './index'

// Utilities
import { describe, it, expect } from 'vitest'

describe('useGroup', () => {
  describe('single ID selection', () => {
    it('should select a single item by ID', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      group.select('item-1')

      expect(group.selectedIds.size).toBe(1)
      expect(group.selectedIds.has('item-1')).toBe(true)
    })

    it('should unselect a single item by ID', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      group.select('item-1')
      group.select('item-2')
      expect(group.selectedIds.size).toBe(2)

      group.unselect('item-1')
      expect(group.selectedIds.size).toBe(1)
      expect(group.selectedIds.has('item-1')).toBe(false)
      expect(group.selectedIds.has('item-2')).toBe(true)
    })

    it('should toggle a single item by ID', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      group.toggle('item-1')
      expect(group.selectedIds.has('item-1')).toBe(true)

      group.toggle('item-1')
      expect(group.selectedIds.has('item-1')).toBe(false)
    })
  })

  describe('array ID selection', () => {
    it('should select multiple items by array of IDs', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      group.select(['item-1', 'item-2'])

      expect(group.selectedIds.size).toBe(2)
      expect(group.selectedIds.has('item-1')).toBe(true)
      expect(group.selectedIds.has('item-2')).toBe(true)
      expect(group.selectedIds.has('item-3')).toBe(false)
    })

    it('should unselect multiple items by array of IDs', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      group.select(['item-1', 'item-2', 'item-3'])
      expect(group.selectedIds.size).toBe(3)

      group.unselect(['item-1', 'item-2'])
      expect(group.selectedIds.size).toBe(1)
      expect(group.selectedIds.has('item-3')).toBe(true)
    })

    it('should toggle multiple items by array of IDs', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      group.toggle(['item-1', 'item-2'])
      expect(group.selectedIds.size).toBe(2)
      expect(group.selectedIds.has('item-1')).toBe(true)
      expect(group.selectedIds.has('item-2')).toBe(true)

      group.toggle(['item-1', 'item-3'])
      expect(group.selectedIds.size).toBe(2)
      expect(group.selectedIds.has('item-1')).toBe(false)
      expect(group.selectedIds.has('item-2')).toBe(true)
      expect(group.selectedIds.has('item-3')).toBe(true)
    })

    it('should handle empty array', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      group.select([])
      expect(group.selectedIds.size).toBe(0)

      group.select('item-1')
      group.unselect([])
      expect(group.selectedIds.size).toBe(1)
    })
  })

  describe('mixed operations', () => {
    it('should support mixed single and array operations', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
        { id: 'item-4', value: 'value-4' },
      ])

      group.select('item-1')
      expect(group.selectedIds.size).toBe(1)

      group.select(['item-2', 'item-3'])
      expect(group.selectedIds.size).toBe(3)

      group.unselect('item-2')
      expect(group.selectedIds.size).toBe(2)

      group.toggle(['item-3', 'item-4'])
      expect(group.selectedIds.size).toBe(2)
      expect(group.selectedIds.has('item-1')).toBe(true)
      expect(group.selectedIds.has('item-4')).toBe(true)
    })

    it('should accumulate selections over multiple calls', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      group.select('item-1')
      group.select('item-2')
      group.select('item-3')

      expect(group.selectedIds.size).toBe(3)
    })
  })

  describe('selectedIndexes', () => {
    it('should compute selectedIndexes correctly', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      group.select(['item-1', 'item-3'])

      const indexes = Array.from(group.selectedIndexes.value)
      expect(indexes.length).toBe(2)
      expect(indexes).toContain(0)
      expect(indexes).toContain(2)
    })

    it('should update selectedIndexes reactively', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(group.selectedIndexes.value.size).toBe(0)

      group.select('item-1')
      expect(group.selectedIndexes.value.size).toBe(1)
      expect(group.selectedIndexes.value.has(0)).toBe(true)

      group.select('item-2')
      expect(group.selectedIndexes.value.size).toBe(2)
      expect(group.selectedIndexes.value.has(1)).toBe(true)

      group.unselect('item-1')
      expect(group.selectedIndexes.value.size).toBe(1)
      expect(group.selectedIndexes.value.has(0)).toBe(false)
    })
  })

  describe('disabled items', () => {
    it('should not select disabled items', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2', disabled: true },
        { id: 'item-3', value: 'value-3' },
      ])

      group.select(['item-1', 'item-2', 'item-3'])

      expect(group.selectedIds.size).toBe(2)
      expect(group.selectedIds.has('item-1')).toBe(true)
      expect(group.selectedIds.has('item-2')).toBe(false)
      expect(group.selectedIds.has('item-3')).toBe(true)
    })

    it('should skip disabled items in array operations', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3', disabled: true },
      ])

      group.select(['item-1', 'item-2', 'item-3'])

      expect(group.selectedIds.size).toBe(1)
      expect(group.selectedIds.has('item-2')).toBe(true)
    })
  })

  describe('mandatory mode', () => {
    it('should prevent deselection of last item with mandatory', () => {
      const group = createGroup({ mandatory: true })

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      group.select('item-1')
      expect(group.selectedIds.size).toBe(1)

      group.unselect('item-1')
      // Should still be selected due to mandatory
      expect(group.selectedIds.size).toBe(1)
      expect(group.selectedIds.has('item-1')).toBe(true)
    })

    it('should allow deselection when multiple items selected', () => {
      const group = createGroup({ mandatory: true })

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      group.select(['item-1', 'item-2'])
      expect(group.selectedIds.size).toBe(2)

      group.unselect('item-1')
      expect(group.selectedIds.size).toBe(1)
      expect(group.selectedIds.has('item-2')).toBe(true)
    })

    it('should prevent deselecting all items in array operation', () => {
      const group = createGroup({ mandatory: true })

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      group.select(['item-1', 'item-2'])
      group.unselect(['item-1', 'item-2'])

      // At least one should remain due to mandatory
      expect(group.selectedIds.size).toBe(1)
    })

    it('should auto-select with mandatory force', () => {
      const group = createGroup({ mandatory: 'force' })

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(group.selectedIds.size).toBe(1)
      expect(group.selectedIds.has('item-1')).toBe(true)
    })
  })

  describe('enroll option', () => {
    it('should auto-select all non-disabled items with enroll', () => {
      const group = createGroup({ enroll: true })

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2', disabled: true },
        { id: 'item-3', value: 'value-3' },
      ])

      expect(group.selectedIds.size).toBe(2)
      expect(group.selectedIds.has('item-1')).toBe(true)
      expect(group.selectedIds.has('item-2')).toBe(false)
      expect(group.selectedIds.has('item-3')).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle empty registry', () => {
      const group = createGroup()

      expect(group.size).toBe(0)
      expect(group.selectedIds.size).toBe(0)

      group.select(['item-1', 'item-2'])
      expect(group.selectedIds.size).toBe(0)
    })

    it('should handle non-existent IDs in array', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      group.select(['item-1', 'non-existent', 'also-missing'])

      expect(group.selectedIds.size).toBe(1)
      expect(group.selectedIds.has('item-1')).toBe(true)
    })

    it('should handle duplicate IDs in array', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      group.select(['item-1', 'item-1', 'item-2', 'item-1'])

      expect(group.selectedIds.size).toBe(2)
    })

    it('should handle all disabled items', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      group.select(['item-1', 'item-2'])
      expect(group.selectedIds.size).toBe(0)
    })

    it('should handle unselecting already unselected items', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      group.select('item-1')
      group.unselect(['item-1', 'item-2'])

      expect(group.selectedIds.size).toBe(0)
    })
  })
})
