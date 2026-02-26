import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, ref } from 'vue'

// Types
import type { SelectionTicketInput } from './index'

import { createSelection, createSelectionContext, useSelection } from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const mockInject = vi.mocked(inject)

describe('createSelectionContext', () => {
  it('should return a trinity tuple', () => {
    const result = createSelectionContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(3)

    const [useContext, provideContext, defaultContext] = result

    expect(typeof useContext).toBe('function')
    expect(typeof provideContext).toBe('function')
    expect(defaultContext).toBeDefined()
  })

  it('should create a default context with selection methods', () => {
    const [, , defaultContext] = createSelectionContext()

    expect(defaultContext.selectedIds).toBeDefined()
    expect(typeof defaultContext.select).toBe('function')
    expect(typeof defaultContext.unselect).toBe('function')
    expect(typeof defaultContext.toggle).toBe('function')
    expect(typeof defaultContext.register).toBe('function')
  })

  it('should use custom namespace', () => {
    const [useContext, provideContext, defaultContext] = createSelectionContext({
      namespace: 'custom:selection',
    })

    expect(defaultContext).toBeDefined()
    expect(typeof useContext).toBe('function')
    expect(typeof provideContext).toBe('function')
  })

  it('should pass options to the selection instance', () => {
    const [, , defaultContext] = createSelectionContext({
      mandatory: true,
      multiple: true,
    })

    defaultContext.register({ id: 'item-1', value: 'value-1' })
    defaultContext.register({ id: 'item-2', value: 'value-2' })

    defaultContext.select('item-1')
    defaultContext.select('item-2')

    expect(defaultContext.selectedIds.size).toBe(2)

    defaultContext.unselect('item-1')
    expect(defaultContext.selectedIds.size).toBe(1)

    defaultContext.unselect('item-2')
    expect(defaultContext.selectedIds.size).toBe(1)
  })
})

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
      const selection = createSelection({ multiple: true })

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
      const selection = createSelection({ multiple: true })

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
      const selection = createSelection({ mandatory: true, multiple: true })

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
      const selection = createSelection({ enroll: true, multiple: true })

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

    it('should replace selection on enroll when multiple is false', () => {
      const selection = createSelection({ enroll: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      // Single-select: only last enrolled item should be selected
      expect(selection.selectedIds.size).toBe(1)
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
      const selection = createSelection({ multiple: true })

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
      const selection = createSelection({ multiple: true })

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
      const selection = createSelection({ multiple: true })

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

  describe('offboard', () => {
    it('should remove items from selectedIds when offboarding', () => {
      const selection = createSelection({ multiple: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      selection.select('item-1')
      selection.select('item-2')

      expect(selection.size).toBe(3)
      expect(selection.selectedIds.size).toBe(2)

      selection.offboard(['item-1', 'item-2'])

      expect(selection.size).toBe(1)
      expect(selection.selectedIds.size).toBe(0)
      expect(selection.selectedIds.has('item-1')).toBe(false)
      expect(selection.selectedIds.has('item-2')).toBe(false)
    })

    it('should handle offboard with non-existent IDs gracefully', () => {
      const selection = createSelection({ multiple: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      selection.select('item-1')

      selection.offboard(['item-1', 'non-existent', 'also-fake'])

      expect(selection.size).toBe(0)
      expect(selection.selectedIds.size).toBe(0)
    })

    it('should handle offboard of unselected items', () => {
      const selection = createSelection({ multiple: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
        { id: 'item-3', value: 'value-3' },
      ])

      selection.select('item-1')

      selection.offboard(['item-2', 'item-3'])

      expect(selection.size).toBe(1)
      expect(selection.selectedIds.size).toBe(1)
      expect(selection.selectedIds.has('item-1')).toBe(true)
    })
  })

  describe('context-level disabled', () => {
    it('should not select when context is disabled', () => {
      const selection = createSelection({ disabled: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      selection.select('item-1')

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should not unselect when context is disabled', () => {
      const selection = createSelection()

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      selection.select('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(true)

      // Now disable the context (simulating runtime change)
      const disabledSelection = createSelection({ disabled: true })
      disabledSelection.onboard([{ id: 'item-1', value: 'value-1' }])
      disabledSelection.selectedIds.add('item-1')

      disabledSelection.unselect('item-1')
      expect(disabledSelection.selectedIds.has('item-1')).toBe(true)
    })

    it('should not toggle when context is disabled', () => {
      const selection = createSelection({ disabled: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      selection.toggle('item-1')
      expect(selection.selectedIds.size).toBe(0)
    })

    it('should not mandate selection when context is disabled', () => {
      const selection = createSelection({ disabled: true, mandatory: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      selection.mandate()

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should not auto-enroll when context is disabled', () => {
      const selection = createSelection({ disabled: true, enroll: true })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should not auto-select with mandatory force when context is disabled', () => {
      const selection = createSelection({ disabled: true, mandatory: 'force' })

      selection.register({ id: 'item-1', value: 'value-1' })

      expect(selection.selectedIds.size).toBe(0)
    })

    it('should expose disabled property on context', () => {
      const selection = createSelection({ disabled: true })

      expect(selection.disabled).toBe(true)
    })

    it('should respect reactive disabled ref', () => {
      const disabledRef = ref(false)
      const selection = createSelection({ disabled: disabledRef })

      selection.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      // Should select when not disabled
      selection.select('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(true)

      // Disable the context
      disabledRef.value = true

      // Should not unselect when disabled
      selection.unselect('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(true)

      // Should not toggle when disabled
      selection.toggle('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(true)

      // Re-enable the context
      disabledRef.value = false

      // Should work again
      selection.unselect('item-1')
      expect(selection.selectedIds.has('item-1')).toBe(false)
    })

    it('should still allow ticket.select() to call context select which respects disabled', () => {
      const selection = createSelection({ disabled: true })

      const ticket = selection.register({ id: 'item-1', value: 'value-1' })

      ticket.select()
      expect(selection.selectedIds.has('item-1')).toBe(false)
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
      const selection = createSelection({ mandatory: true, enroll: true, multiple: true })

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

  describe('custom ticket types', () => {
    it('should allow extending SelectionTicketInput with custom properties', () => {
      interface MyTicket extends SelectionTicketInput {
        label: string
        icon?: string
      }

      const selection = createSelection<MyTicket>()

      // Register accepts input type with custom properties
      const ticket = selection.register({ label: 'Home', icon: 'mdi-home' })

      // Output has input properties
      expect(ticket.label).toBe('Home')
      expect(ticket.icon).toBe('mdi-home')

      // Output also has selection methods
      expect(ticket.isSelected.value).toBe(false)
      ticket.select()
      expect(ticket.isSelected.value).toBe(true)

      // selectedItems returns output type with custom properties
      const selected = Array.from(selection.selectedItems.value)[0]
      expect(selected?.label).toBe('Home')
      expect(selected?.isSelected.value).toBe(true)
    })

    it('should preserve custom properties through onboard', () => {
      interface TabTicket extends SelectionTicketInput {
        label: string
        closable?: boolean
      }

      const tabs = createSelection<TabTicket>({ multiple: true })

      const tickets = tabs.onboard([
        { label: 'Home', closable: false },
        { label: 'Settings', closable: true },
        { label: 'Profile' },
      ])

      expect(tickets[0]?.label).toBe('Home')
      expect(tickets[0]?.closable).toBe(false)
      expect(tickets[1]?.label).toBe('Settings')
      expect(tickets[1]?.closable).toBe(true)
      expect(tickets[2]?.label).toBe('Profile')
      expect(tickets[2]?.closable).toBeUndefined()

      // All have selection methods
      for (const ticket of tickets) {
        expect(typeof ticket.select).toBe('function')
        expect(typeof ticket.toggle).toBe('function')
      }
    })

    it('should preserve custom properties through get()', () => {
      interface ItemTicket extends SelectionTicketInput {
        name: string
        metadata: Record<string, unknown>
      }

      const selection = createSelection<ItemTicket>()

      selection.register({
        id: 'item-1',
        name: 'Test Item',
        metadata: { priority: 'high' },
      })

      const ticket = selection.get('item-1')

      expect(ticket?.name).toBe('Test Item')
      expect(ticket?.metadata).toEqual({ priority: 'high' })
      expect(ticket?.isSelected.value).toBe(false)
    })

    it('should work with createSelectionContext and custom types', () => {
      interface NavTicket extends SelectionTicketInput {
        path: string
        exact?: boolean
      }

      const [, , context] = createSelectionContext<NavTicket>()

      context.onboard([
        { path: '/home', exact: true },
        { path: '/about' },
      ])

      const tickets = context.values()
      expect(tickets[0]?.path).toBe('/home')
      expect(tickets[0]?.exact).toBe(true)
      expect(tickets[1]?.path).toBe('/about')
    })
  })
})

describe('useSelection consumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createSelection()
    mockInject.mockReturnValue(mockContext)

    const result = useSelection()

    expect(mockInject).toHaveBeenCalledWith('v0:selection', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createSelection()
    mockInject.mockReturnValue(mockContext)

    const result = useSelection('my-selection')

    expect(mockInject).toHaveBeenCalledWith('my-selection', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useSelection()).toThrow(
      'Context "v0:selection" not found. Ensure it\'s provided by an ancestor.',
    )
  })

  it('should throw with custom namespace in error message', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useSelection('custom-selection')).toThrow(
      'Context "custom-selection" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})
