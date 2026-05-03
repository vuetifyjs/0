import { describe, expect, it } from 'vitest'

import { createModel } from './index'

// Utilities
import { ref } from 'vue'

describe('createModel', () => {
  describe('register', () => {
    it('should register a ticket with auto-generated id', () => {
      const model = createModel()
      const ticket = model.register()

      expect(ticket).toBeDefined()
      expect(ticket.id).toBeDefined()
      expect(ticket.disabled).toBe(false)
      expect(ticket.isSelected.value).toBe(true)
    })

    it('should register a ticket with a custom id', () => {
      const model = createModel()
      const ticket = model.register({ id: 'custom-id' })

      expect(ticket.id).toBe('custom-id')
    })

    it('should register a ticket with a custom value', () => {
      const model = createModel()
      const ticket = model.register({ id: 'item-1', value: 'val-1' })

      expect(ticket.value).toBe('val-1')
    })

    it('should register a ticket with disabled state', () => {
      const model = createModel()
      const ticket = model.register({ id: 'item-1', disabled: true })

      expect(ticket.disabled).toBe(true)
    })

    it('should default disabled to false when not provided', () => {
      const model = createModel()
      const ticket = model.register({ id: 'item-1' })

      expect(ticket.disabled).toBe(false)
    })
  })

  describe('unregister', () => {
    it('should remove a ticket from the registry', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })

      expect(model.size).toBe(1)

      model.unregister('item-1')

      expect(model.size).toBe(0)
    })

    it('should remove the id from selectedIds', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.select('item-1')

      expect(model.selectedIds.has('item-1')).toBe(true)

      model.unregister('item-1')

      expect(model.selectedIds.has('item-1')).toBe(false)
    })
  })

  describe('offboard', () => {
    it('should remove multiple tickets and their selected ids', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })
      model.register({ id: 'item-3', value: 'val-3' })

      model.select('item-1')

      model.offboard(['item-1', 'item-2'])

      expect(model.size).toBe(1)
      expect(model.selectedIds.has('item-1')).toBe(false)
      expect(model.selectedIds.has('item-2')).toBe(false)
    })

    it('should handle offboard of unselected items', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })

      model.offboard(['item-2'])

      expect(model.size).toBe(1)
      expect(model.selectedIds.size).toBe(0)
    })
  })

  describe('clear', () => {
    it('should clear registry and selectedIds', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })
      model.select('item-1')

      expect(model.size).toBe(2)
      expect(model.selectedIds.size).toBe(1)

      model.clear()

      expect(model.size).toBe(0)
      expect(model.selectedIds.size).toBe(0)
    })
  })

  describe('onboard', () => {
    it('should register multiple tickets with model fields', () => {
      const model = createModel()
      const tickets = model.onboard([
        { id: 'item-1', value: 'val-1' },
        { id: 'item-2', value: 'val-2' },
        { id: 'item-3', value: 'val-3' },
      ])

      expect(tickets.length).toBe(3)
      expect(model.size).toBe(3)

      for (const ticket of tickets) {
        expect(ticket.disabled).toBe(false)
      }
      // Single-value enrollment: only last ticket is active
      expect(tickets[0]!.isSelected.value).toBe(false)
      expect(tickets[1]!.isSelected.value).toBe(false)
      expect(tickets[2]!.isSelected.value).toBe(true)
    })

    it('should produce reactive isSelected on onboarded tickets', () => {
      const model = createModel()
      const tickets = model.onboard([
        { id: 'item-1', value: 'val-1' },
        { id: 'item-2', value: 'val-2' },
      ])

      model.select('item-1')

      expect(tickets[0]!.isSelected.value).toBe(true)
      expect(tickets[1]!.isSelected.value).toBe(false)
    })
  })

  describe('reset', () => {
    it('should clear selectedIds but preserve registry', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })
      model.select('item-1')

      expect(model.size).toBe(2)
      expect(model.selectedIds.size).toBe(1)

      model.reset()

      expect(model.size).toBe(2)
      expect(model.selectedIds.size).toBe(0)
    })
  })

  describe('select', () => {
    it('should select a ticket by id', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })

      model.select('item-1')

      expect(model.selectedIds.has('item-1')).toBe(true)
    })

    it('should clear previous selection before adding (single-value)', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })

      model.select('item-1')
      model.select('item-2')

      expect(model.selectedIds.size).toBe(1)
      expect(model.selectedIds.has('item-1')).toBe(false)
      expect(model.selectedIds.has('item-2')).toBe(true)
    })

    it('should not select when instance disabled is true', () => {
      const model = createModel({ disabled: true })
      model.register({ id: 'item-1', value: 'val-1' })

      model.select('item-1')

      expect(model.selectedIds.size).toBe(0)
    })

    it('should not select when instance disabled is a ref that is true', () => {
      const disabled = ref(false)
      const model = createModel({ disabled })
      model.register({ id: 'item-1', value: 'val-1' })

      model.select('item-1')
      expect(model.selectedIds.has('item-1')).toBe(true)

      model.selectedIds.clear()
      disabled.value = true

      model.select('item-1')
      expect(model.selectedIds.size).toBe(0)
    })

    it('should not select a disabled ticket', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1', disabled: true })

      model.select('item-1')

      expect(model.selectedIds.size).toBe(0)
    })

    it('should not select a ticket with a reactive disabled ref', () => {
      const model = createModel()
      const disabled = ref(true)
      model.register({ id: 'item-1', value: 'val-1', disabled })

      model.select('item-1')

      expect(model.selectedIds.size).toBe(0)
    })

    it('should not select a non-existent ticket', () => {
      const model = createModel({ enroll: false })
      model.register({ id: 'item-1', value: 'val-1' })

      model.select('non-existent')

      expect(model.selectedIds.size).toBe(0)
    })
  })

  describe('unselect', () => {
    it('should unselect a ticket by id', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.select('item-1')

      model.unselect('item-1')

      expect(model.selectedIds.has('item-1')).toBe(false)
    })

    it('should not unselect when instance disabled is true', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.select('item-1')

      expect(model.selectedIds.has('item-1')).toBe(true)

      const disabledModel = createModel({ disabled: true })
      disabledModel.register({ id: 'item-1', value: 'val-1' })
      disabledModel.selectedIds.add('item-1')

      disabledModel.unselect('item-1')

      expect(disabledModel.selectedIds.has('item-1')).toBe(true)
    })
  })

  describe('toggle', () => {
    it('should toggle a ticket on', () => {
      const model = createModel({ enroll: false })
      model.register({ id: 'item-1', value: 'val-1' })

      model.toggle('item-1')

      expect(model.selectedIds.has('item-1')).toBe(true)
    })

    it('should toggle a ticket off', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.select('item-1')

      model.toggle('item-1')

      expect(model.selectedIds.has('item-1')).toBe(false)
    })

    it('should not toggle when instance disabled is true', () => {
      const model = createModel({ disabled: true })
      model.register({ id: 'item-1', value: 'val-1' })

      model.toggle('item-1')

      expect(model.selectedIds.size).toBe(0)
    })

    it('should not toggle off when instance disabled is true', () => {
      const disabled = ref(false)
      const model = createModel({ disabled })
      model.register({ id: 'item-1', value: 'val-1' })
      model.select('item-1')

      disabled.value = true

      model.toggle('item-1')

      expect(model.selectedIds.has('item-1')).toBe(true)
    })
  })

  describe('selected', () => {
    it('should return true when ticket is selected', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.select('item-1')

      expect(model.selected('item-1')).toBe(true)
    })

    it('should return false when ticket is not selected', () => {
      const model = createModel({ enroll: false })
      model.register({ id: 'item-1', value: 'val-1' })

      expect(model.selected('item-1')).toBe(false)
    })

    it('should return false for non-existent ticket', () => {
      const model = createModel()

      expect(model.selected('non-existent')).toBe(false)
    })
  })

  describe('isSelected', () => {
    it('should be reactive on ticket', () => {
      const model = createModel({ enroll: false })
      const ticket = model.register({ id: 'item-1', value: 'val-1' })

      expect(ticket.isSelected.value).toBe(false)

      model.select('item-1')
      expect(ticket.isSelected.value).toBe(true)

      model.unselect('item-1')
      expect(ticket.isSelected.value).toBe(false)
    })
  })

  describe('selectedItems', () => {
    it('should compute selected items', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })

      model.select('item-1')

      const items = Array.from(model.selectedItems.value)
      expect(items.length).toBe(1)
      expect(items[0]!.id).toBe('item-1')
    })

    it('should filter out ids that no longer exist in registry', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.select('item-1')

      // Manually add an id that does not exist
      model.selectedIds.add('ghost')

      const items = Array.from(model.selectedItems.value)
      expect(items.length).toBe(1)
      expect(items[0]!.id).toBe('item-1')
    })

    it('should return empty set when nothing selected', () => {
      const model = createModel({ enroll: false })
      model.register({ id: 'item-1', value: 'val-1' })

      expect(model.selectedItems.value.size).toBe(0)
    })
  })

  describe('selectedValues', () => {
    it('should compute selected values', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })

      model.select('item-2')

      const values = Array.from(model.selectedValues.value)
      expect(values).toContain('val-2')
      expect(values.length).toBe(1)
    })

    it('should unwrap ref values', () => {
      const model = createModel()
      const valueRef = ref('ref-value')
      model.register({ id: 'item-1', value: valueRef })
      model.select('item-1')

      const values = Array.from(model.selectedValues.value)
      expect(values).toContain('ref-value')
    })

    it('should return empty set when nothing selected', () => {
      const model = createModel()

      expect(model.selectedValues.value.size).toBe(0)
    })
  })

  describe('apply', () => {
    it('should update ref value directly when selected ticket has a ref value', () => {
      const model = createModel()
      const valueRef = ref('original')
      model.register({ id: 'item-1', value: valueRef })
      model.select('item-1')

      model.apply(['updated'])

      expect(valueRef.value).toBe('updated')
      // After ref write, apply still falls through to browse/clear
      // Browse resolves by raw value, not ref — so selectedIds is cleared
      expect(model.selectedIds.size).toBe(0)
    })

    it('should resolve by browse for static values', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })

      model.apply(['val-2'])

      expect(model.selectedIds.size).toBe(1)
      expect(model.selectedIds.has('item-2')).toBe(true)
    })

    it('should clear selectedIds and not add any when value is undefined', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.select('item-1')

      expect(model.selectedIds.size).toBe(1)

      model.apply([undefined])

      expect(model.selectedIds.size).toBe(0)
    })

    it('should clear previous selection before browse resolution', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })

      model.select('item-1')
      expect(model.selectedIds.has('item-1')).toBe(true)

      model.apply(['val-2'])

      expect(model.selectedIds.has('item-1')).toBe(false)
      expect(model.selectedIds.has('item-2')).toBe(true)
    })

    it('should handle value not found in browse', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.select('item-1')

      model.apply(['non-existent'])

      expect(model.selectedIds.size).toBe(0)
    })

    it('should skip non-ref item and fall through to browse resolution', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'static' })
      model.select('item-1')

      // item-1 is selected but its value is not a ref,
      // so the for loop completes without returning,
      // falling through to browse resolution
      model.apply(['static'])

      expect(model.selectedIds.size).toBe(1)
      expect(model.selectedIds.has('item-1')).toBe(true)
    })
  })

  describe('size', () => {
    it('should return the registry size', () => {
      const model = createModel()

      expect(model.size).toBe(0)

      model.register({ id: 'item-1', value: 'val-1' })
      expect(model.size).toBe(1)

      model.register({ id: 'item-2', value: 'val-2' })
      expect(model.size).toBe(2)
    })
  })

  describe('enroll', () => {
    it('should auto-select on register by default', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })

      expect(model.selectedIds.has('item-1')).toBe(true)
      expect(model.selectedIds.size).toBe(1)
    })

    it('should select only the last registered ticket (single-value)', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })

      expect(model.selectedIds.has('item-1')).toBe(false)
      expect(model.selectedIds.has('item-2')).toBe(true)
      expect(model.selectedIds.size).toBe(1)
    })

    it('should not enroll when enroll is false', () => {
      const model = createModel({ enroll: false })
      model.register({ id: 'item-1', value: 'val-1' })

      expect(model.selectedIds.size).toBe(0)
    })

    it('should not enroll when instance is disabled', () => {
      const model = createModel({ disabled: true })
      model.register({ id: 'item-1', value: 'val-1' })

      expect(model.selectedIds.size).toBe(0)
    })

    it('should not enroll a disabled ticket', () => {
      const model = createModel()
      model.register({ id: 'item-1', value: 'val-1', disabled: true })

      expect(model.selectedIds.size).toBe(0)
    })

    it('should respect reactive enroll option', () => {
      const enroll = ref(false)
      const model = createModel({ enroll })
      model.register({ id: 'item-1', value: 'val-1' })

      expect(model.selectedIds.size).toBe(0)

      enroll.value = true
      model.register({ id: 'item-2', value: 'val-2' })

      expect(model.selectedIds.has('item-2')).toBe(true)
    })
  })

  describe('multiple', () => {
    it('should accumulate selections without clearing', () => {
      const model = createModel({ multiple: true, enroll: false })
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })
      model.register({ id: 'item-3', value: 'val-3' })

      model.select('item-1')
      model.select('item-2')
      model.select('item-3')

      expect(model.selectedIds.size).toBe(3)
      expect(model.selectedIds.has('item-1')).toBe(true)
      expect(model.selectedIds.has('item-2')).toBe(true)
      expect(model.selectedIds.has('item-3')).toBe(true)
    })

    it('should enroll all registered tickets when combined with enroll', () => {
      const model = createModel({ multiple: true })
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })
      model.register({ id: 'item-3', value: 'val-3' })

      expect(model.selectedIds.size).toBe(3)
      expect(model.selectedIds.has('item-1')).toBe(true)
      expect(model.selectedIds.has('item-2')).toBe(true)
      expect(model.selectedIds.has('item-3')).toBe(true)
    })

    it('should default to single-value behavior when multiple is false', () => {
      const model = createModel({ multiple: false })
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })

      expect(model.selectedIds.size).toBe(1)
      expect(model.selectedIds.has('item-2')).toBe(true)
    })

    it('should preserve existing selections during apply', () => {
      const model = createModel({ multiple: true, enroll: false })
      model.register({ id: 'item-1', value: 'val-1' })
      model.register({ id: 'item-2', value: 'val-2' })

      model.select('item-1')
      model.apply(['val-2'])

      expect(model.selectedIds.has('item-1')).toBe(true)
      expect(model.selectedIds.has('item-2')).toBe(true)
    })
  })

  describe('disabled', () => {
    it('should expose disabled property on context', () => {
      const model = createModel({ disabled: true })

      expect(model.disabled).toBe(true)
    })

    it('should default disabled to false', () => {
      const model = createModel()

      expect(model.disabled).toBe(false)
    })

    it('should accept a ref for disabled', () => {
      const disabled = ref(false)
      const model = createModel({ disabled })

      expect(model.disabled).toBe(disabled)
    })
  })
})
