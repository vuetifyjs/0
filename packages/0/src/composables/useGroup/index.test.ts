import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide, ref } from 'vue'

import { createGroup, createGroupContext, useGroup } from './index'

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

  describe('mixed state', () => {
    it('should set an item to mixed state', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      group.mix('item-1')

      expect(group.mixedIds.size).toBe(1)
      expect(group.mixedIds.has('item-1')).toBe(true)
      expect(group.mixed('item-1')).toBe(true)
    })

    it('should set multiple items to mixed state', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      group.mix(['item-1', 'item-3'])

      expect(group.mixedIds.size).toBe(2)
      expect(group.mixedIds.has('item-1')).toBe(true)
      expect(group.mixedIds.has('item-3')).toBe(true)
    })

    it('should clear mixed state with unmix', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      group.mix(['item-1', 'item-2'])
      expect(group.mixedIds.size).toBe(2)

      group.unmix('item-1')
      expect(group.mixedIds.size).toBe(1)
      expect(group.mixedIds.has('item-1')).toBe(false)
      expect(group.mixedIds.has('item-2')).toBe(true)
    })

    it('should clear mixed state when selecting', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      group.mix('item-1')
      expect(group.mixedIds.has('item-1')).toBe(true)
      expect(group.selectedIds.has('item-1')).toBe(false)

      group.select('item-1')
      expect(group.mixedIds.has('item-1')).toBe(false)
      expect(group.selectedIds.has('item-1')).toBe(true)
    })

    it('should clear selected state when mixing', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      group.select('item-1')
      expect(group.selectedIds.has('item-1')).toBe(true)

      group.mix('item-1')
      expect(group.selectedIds.has('item-1')).toBe(false)
      expect(group.mixedIds.has('item-1')).toBe(true)
    })

    it('should select a mixed item on toggle', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      group.mix('item-1')
      expect(group.mixed('item-1')).toBe(true)

      group.toggle('item-1')
      expect(group.mixed('item-1')).toBe(false)
      expect(group.selectedIds.has('item-1')).toBe(true)
    })

    it('should compute mixedItems correctly', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      group.mix(['item-1', 'item-3'])

      const items = Array.from(group.mixedItems.value)
      expect(items.length).toBe(2)
      expect(items.some(item => item.id === 'item-1')).toBe(true)
      expect(items.some(item => item.id === 'item-3')).toBe(true)
    })

    it('should ignore non-existent IDs when mixing', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      group.mix(['item-1', 'non-existent'])

      expect(group.mixedIds.size).toBe(1)
      expect(group.mixedIds.has('item-1')).toBe(true)
    })

    it('should allow mixing disabled items', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
      ])

      group.mix('item-1')

      expect(group.mixedIds.has('item-1')).toBe(true)
    })

    it('should clear mixedIds on reset', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      group.mix(['item-1', 'item-2'])
      expect(group.mixedIds.size).toBe(2)

      group.reset()
      expect(group.mixedIds.size).toBe(0)
    })

    it('should remove from mixedIds on unregister', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      group.mix(['item-1', 'item-2'])
      expect(group.mixedIds.size).toBe(2)

      group.unregister('item-1')
      expect(group.mixedIds.size).toBe(1)
      expect(group.mixedIds.has('item-1')).toBe(false)
    })

    it('should remove from mixedIds on offboard', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      group.mix(['item-1', 'item-2', 'item-3'])
      expect(group.mixedIds.size).toBe(3)

      group.offboard(['item-1', 'item-2'])
      expect(group.mixedIds.size).toBe(1)
      expect(group.mixedIds.has('item-3')).toBe(true)
    })
  })

  describe('ticket mixed methods', () => {
    it('should provide isMixed property on tickets', () => {
      const group = createGroup()

      const ticket = group.register({ id: 'item-1', value: 'value-1' })

      expect(ticket.isMixed.value).toBe(false)

      group.mix('item-1')
      expect(ticket.isMixed.value).toBe(true)

      group.unmix('item-1')
      expect(ticket.isMixed.value).toBe(false)
    })

    it('should provide mix() method on tickets', () => {
      const group = createGroup()

      const ticket = group.register({ id: 'item-1', value: 'value-1' })

      ticket.mix()
      expect(group.mixedIds.has('item-1')).toBe(true)
    })

    it('should provide unmix() method on tickets', () => {
      const group = createGroup()

      const ticket = group.register({ id: 'item-1', value: 'value-1' })

      ticket.mix()
      expect(group.mixedIds.has('item-1')).toBe(true)

      ticket.unmix()
      expect(group.mixedIds.has('item-1')).toBe(false)
    })
  })

  describe('initial indeterminate state', () => {
    it('should set initial mixed state when indeterminate is true', () => {
      const group = createGroup()

      const ticket = group.register({ id: 'item-1', indeterminate: true })

      expect(group.mixedIds.has('item-1')).toBe(true)
      expect(ticket.isMixed.value).toBe(true)
      expect(group.selectedIds.has('item-1')).toBe(false)
    })

    it('should not set mixed state when indeterminate is false', () => {
      const group = createGroup()

      group.register({ id: 'item-1', indeterminate: false })

      expect(group.mixedIds.has('item-1')).toBe(false)
    })

    it('should not set mixed state when indeterminate is undefined', () => {
      const group = createGroup()

      group.register({ id: 'item-1' })

      expect(group.mixedIds.has('item-1')).toBe(false)
    })

    it('should support ref for indeterminate', () => {
      const group = createGroup()
      const indeterminate = ref(true)

      group.register({ id: 'item-1', indeterminate })

      expect(group.mixedIds.has('item-1')).toBe(true)
    })

    it('should work with onboard for batch registration', () => {
      const group = createGroup()

      group.onboard([
        { id: 'item-1', indeterminate: true },
        { id: 'item-2', indeterminate: false },
        { id: 'item-3', indeterminate: true },
      ])

      expect(group.mixedIds.size).toBe(2)
      expect(group.mixedIds.has('item-1')).toBe(true)
      expect(group.mixedIds.has('item-2')).toBe(false)
      expect(group.mixedIds.has('item-3')).toBe(true)
    })
  })

  describe('context-level selection state', () => {
    describe('isNoneSelected', () => {
      it('should return true when nothing is selected', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        expect(group.isNoneSelected.value).toBe(true)
      })

      it('should return false when any item is selected', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        group.select('item-1')
        expect(group.isNoneSelected.value).toBe(false)
      })

      it('should return true when empty registry', () => {
        const group = createGroup()

        expect(group.isNoneSelected.value).toBe(true)
      })
    })

    describe('isAllSelected', () => {
      it('should return true when all non-disabled items are selected', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        group.select(['item-1', 'item-2'])
        expect(group.isAllSelected.value).toBe(true)
      })

      it('should return true when all non-disabled items are selected (ignoring disabled)', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2', disabled: true },
          { id: 'item-3', value: 'value-3' },
        ])

        group.select(['item-1', 'item-3'])
        expect(group.isAllSelected.value).toBe(true)
      })

      it('should return false when not all selectable items are selected', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        group.select('item-1')
        expect(group.isAllSelected.value).toBe(false)
      })

      it('should return false when registry is empty', () => {
        const group = createGroup()

        expect(group.isAllSelected.value).toBe(false)
      })

      it('should return false when all items are disabled', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1', disabled: true },
          { id: 'item-2', value: 'value-2', disabled: true },
        ])

        expect(group.isAllSelected.value).toBe(false)
      })
    })

    describe('isMixed', () => {
      it('should return true when some but not all are selected', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
          { id: 'item-3', value: 'value-3' },
        ])

        group.select('item-1')
        expect(group.isMixed.value).toBe(true)
      })

      it('should return false when none are selected', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        expect(group.isMixed.value).toBe(false)
      })

      it('should return false when all are selected', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        group.select(['item-1', 'item-2'])
        expect(group.isMixed.value).toBe(false)
      })
    })

    describe('selectAll', () => {
      it('should select all non-disabled items', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
          { id: 'item-3', value: 'value-3' },
        ])

        group.selectAll()

        expect(group.selectedIds.size).toBe(3)
        expect(group.isAllSelected.value).toBe(true)
      })

      it('should skip disabled items', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2', disabled: true },
          { id: 'item-3', value: 'value-3' },
        ])

        group.selectAll()

        expect(group.selectedIds.size).toBe(2)
        expect(group.selectedIds.has('item-1')).toBe(true)
        expect(group.selectedIds.has('item-2')).toBe(false)
        expect(group.selectedIds.has('item-3')).toBe(true)
      })

      it('should clear mixed state on selected items', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        group.mix(['item-1', 'item-2'])
        expect(group.mixedIds.size).toBe(2)

        group.selectAll()

        expect(group.mixedIds.size).toBe(0)
        expect(group.selectedIds.size).toBe(2)
      })
    })

    describe('unselectAll', () => {
      it('should unselect all items', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        group.select(['item-1', 'item-2'])
        expect(group.selectedIds.size).toBe(2)

        group.unselectAll()

        expect(group.selectedIds.size).toBe(0)
        expect(group.isNoneSelected.value).toBe(true)
      })

      it('should keep one item when mandatory is true', () => {
        const group = createGroup({ mandatory: true })

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        group.select(['item-1', 'item-2'])
        group.unselectAll()

        expect(group.selectedIds.size).toBe(1)
      })

      it('should not clear mixedIds', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        group.select('item-1')
        group.mix('item-2')

        group.unselectAll()

        expect(group.selectedIds.size).toBe(0)
        expect(group.mixedIds.size).toBe(1)
        expect(group.mixedIds.has('item-2')).toBe(true)
      })
    })

    describe('toggleAll', () => {
      it('should select all when not all are selected', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
          { id: 'item-3', value: 'value-3' },
        ])

        group.select('item-1')
        group.toggleAll()

        expect(group.isAllSelected.value).toBe(true)
        expect(group.selectedIds.size).toBe(3)
      })

      it('should unselect all when all are selected', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        group.selectAll()
        expect(group.isAllSelected.value).toBe(true)

        group.toggleAll()

        expect(group.isNoneSelected.value).toBe(true)
      })

      it('should select all when none are selected', () => {
        const group = createGroup()

        group.onboard([
          { id: 'item-1', value: 'value-1' },
          { id: 'item-2', value: 'value-2' },
        ])

        group.toggleAll()

        expect(group.isAllSelected.value).toBe(true)
      })
    })
  })
})

describe('createGroupContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a trinity tuple', () => {
    const result = createGroupContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function') // useGroupContext
    expect(typeof result[1]).toBe('function') // provideGroupContext
    expect(result[2]).toBeDefined() // default context
  })

  it('should create context with default namespace', () => {
    const [, provideGroupContext, context] = createGroupContext()

    provideGroupContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:group', context)
  })

  it('should create context with custom namespace', () => {
    const [, provideGroupContext, context] = createGroupContext({
      namespace: 'my-selection',
    })

    provideGroupContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-selection', context)
  })

  it('should create a functional group context', () => {
    const [,, context] = createGroupContext()

    context.onboard([
      { id: 'item-1', value: 'Item 1' },
      { id: 'item-2', value: 'Item 2' },
      { id: 'item-3', value: 'Item 3' },
    ])

    context.selectAll()
    expect(context.selectedIds.size).toBe(3)

    context.unselectAll()
    expect(context.selectedIds.size).toBe(0)
  })

  it('should allow providing custom context', () => {
    const [, provideGroupContext] = createGroupContext()
    const customContext = createGroup({ mandatory: true })

    provideGroupContext(customContext)

    expect(mockProvide).toHaveBeenCalledWith('v0:group', customContext)
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = {
      provide: vi.fn(),
    } as any
    const [, provideGroupContext, context] = createGroupContext()

    provideGroupContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:group', context)
  })
})

describe('useGroup consumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createGroup()
    mockInject.mockReturnValue(mockContext)

    const result = useGroup()

    expect(mockInject).toHaveBeenCalledWith('v0:group', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createGroup()
    mockInject.mockReturnValue(mockContext)

    const result = useGroup('my-selection')

    expect(mockInject).toHaveBeenCalledWith('my-selection', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useGroup()).toThrow(
      'Context "v0:group" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})
