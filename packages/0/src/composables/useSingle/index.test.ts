// Composables
import { useSingle } from './index'

// Utilities
import { describe, it, expect } from 'vitest'

describe('useSingle', () => {
  describe('single selection enforcement', () => {
    it('should only allow one item to be selected at a time', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      single.select('item-1')
      expect(single.selectedIds.size).toBe(1)
      expect(single.selectedIds.has('item-1')).toBe(true)

      // Selecting another item should clear the first
      single.select('item-2')
      expect(single.selectedIds.size).toBe(1)
      expect(single.selectedIds.has('item-1')).toBe(false)
      expect(single.selectedIds.has('item-2')).toBe(true)

      // Selecting a third item should clear the second
      single.select('item-3')
      expect(single.selectedIds.size).toBe(1)
      expect(single.selectedIds.has('item-2')).toBe(false)
      expect(single.selectedIds.has('item-3')).toBe(true)
    })

    it('should not affect selection when selecting already selected item', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      single.select('item-1')
      expect(single.selectedIds.size).toBe(1)

      single.select('item-1')
      expect(single.selectedIds.size).toBe(1)
      expect(single.selectedId.value).toBe('item-1')
    })
  })

  describe('computed singular properties', () => {
    it('should compute selectedId correctly', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(single.selectedId.value).toBeUndefined()

      single.select('item-1')
      expect(single.selectedId.value).toBe('item-1')

      single.select('item-2')
      expect(single.selectedId.value).toBe('item-2')
    })

    it('should compute selectedItem correctly', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(single.selectedItem.value).toBeUndefined()

      single.select('item-1')
      expect(single.selectedItem.value?.id).toBe('item-1')
      expect(single.selectedItem.value?.value).toBe('value-1')

      single.select('item-2')
      expect(single.selectedItem.value?.id).toBe('item-2')
      expect(single.selectedItem.value?.value).toBe('value-2')
    })

    it('should compute selectedIndex correctly', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      expect(single.selectedIndex.value).toBe(-1)

      single.select('item-1')
      expect(single.selectedIndex.value).toBe(0)

      single.select('item-2')
      expect(single.selectedIndex.value).toBe(1)

      single.select('item-3')
      expect(single.selectedIndex.value).toBe(2)
    })

    it('should compute selectedValue correctly', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(single.selectedValue.value).toBeUndefined()

      single.select('item-1')
      expect(single.selectedValue.value).toBe('value-1')

      single.select('item-2')
      expect(single.selectedValue.value).toBe('value-2')
    })
  })

  describe('unselect', () => {
    it('should unselect the selected item', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      single.select('item-1')
      expect(single.selectedId.value).toBe('item-1')

      single.unselect('item-1')
      expect(single.selectedId.value).toBeUndefined()
      expect(single.selectedIds.size).toBe(0)
    })

    it('should do nothing when unselecting non-selected item', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      single.select('item-1')
      single.unselect('item-2')

      expect(single.selectedId.value).toBe('item-1')
      expect(single.selectedIds.size).toBe(1)
    })
  })

  describe('toggle', () => {
    it('should toggle item on when not selected', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      single.toggle('item-1')
      expect(single.selectedIds.has('item-1')).toBe(true)
    })

    it('should toggle item off when selected', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      single.select('item-1')
      expect(single.selectedIds.has('item-1')).toBe(true)

      single.toggle('item-1')
      expect(single.selectedIds.has('item-1')).toBe(false)
    })

    it('should clear other selections when toggling on', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      single.select('item-1')
      single.toggle('item-2')

      expect(single.selectedIds.size).toBe(1)
      expect(single.selectedIds.has('item-1')).toBe(false)
      expect(single.selectedIds.has('item-2')).toBe(true)
    })
  })

  describe('mandatory mode', () => {
    it('should prevent deselection when mandatory is true', () => {
      const single = useSingle({ mandatory: true })

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      single.select('item-1')
      expect(single.selectedId.value).toBe('item-1')

      single.unselect('item-1')
      // Should still be selected due to mandatory
      expect(single.selectedId.value).toBe('item-1')
    })

    it('should prevent toggle off when mandatory is true', () => {
      const single = useSingle({ mandatory: true })

      single.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      single.select('item-1')
      single.toggle('item-1')

      // Should still be selected due to mandatory
      expect(single.selectedIds.has('item-1')).toBe(true)
    })

    it('should allow switching selections in mandatory mode', () => {
      const single = useSingle({ mandatory: true })

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      single.select('item-1')
      expect(single.selectedId.value).toBe('item-1')

      single.select('item-2')
      expect(single.selectedId.value).toBe('item-2')
    })

    it('should auto-select first item with mandatory force', () => {
      const single = useSingle({ mandatory: 'force' })

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(single.selectedId.value).toBe('item-1')
    })

    it('should skip disabled items with mandatory force', () => {
      const single = useSingle({ mandatory: 'force' })

      single.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(single.selectedId.value).toBe('item-2')
    })
  })

  describe('disabled items', () => {
    it('should not select disabled items', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      single.select('item-2')
      expect(single.selectedId.value).toBeUndefined()
    })

    it('should not switch to disabled item', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      single.select('item-1')
      expect(single.selectedId.value).toBe('item-1')

      single.select('item-2')
      // Should keep previous selection
      expect(single.selectedId.value).toBe('item-1')
    })
  })

  describe('enroll option', () => {
    it('should auto-select all non-disabled items with enroll', () => {
      const single = useSingle({ enroll: true })

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      // Enroll adds all items to selectedIds (inherits from useSelection)
      expect(single.selectedIds.size).toBe(2)
      // But selectedId returns the first one
      expect(single.selectedId.value).toBe('item-1')
    })

    it('should skip disabled items with enroll', () => {
      const single = useSingle({ enroll: true })

      single.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(single.selectedId.value).toBe('item-2')
    })
  })

  describe('edge cases', () => {
    it('should handle empty registry', () => {
      const single = useSingle()

      expect(single.selectedId.value).toBeUndefined()
      expect(single.selectedIndex.value).toBe(-1)
      expect(single.selectedItem.value).toBeUndefined()
      expect(single.selectedValue.value).toBeUndefined()
    })

    it('should handle selecting non-existent item', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      single.select('non-existent')
      expect(single.selectedId.value).toBeUndefined()
    })

    it('should handle all disabled items', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      single.select('item-1')
      expect(single.selectedId.value).toBeUndefined()
    })

    it('should handle all disabled items with mandatory force', () => {
      const single = useSingle({ mandatory: 'force' })

      single.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      expect(single.selectedId.value).toBeUndefined()
    })

    it('should maintain correct registry size after unregistering items', () => {
      const single = useSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      single.select('item-3')
      expect(single.selectedId.value).toBe('item-3')
      expect(single.size).toBe(3)

      single.unregister('item-1')
      // After unregistering, registry should have 2 items
      expect(single.size).toBe(2)
      // item-3 should still be selected
      expect(single.selectedId.value).toBe('item-3')
    })
  })
})
