// Composables
import { createGroupContext } from './index'

// Utilities
import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick } from 'vue'

describe('createGroupContext', () => {
  describe('basic functionality', () => {
    it('should return createContext, provideContext, and context', () => {
      const [useContext, provideContext, context] = createGroupContext('test')

      expect(typeof useContext).toBe('function')
      expect(typeof provideContext).toBe('function')
      expect(context).toHaveProperty('selectedIds')
      expect(context).toHaveProperty('selectedItems')
      expect(context).toHaveProperty('selectedValues')
      expect(context).toHaveProperty('collection')
    })

    it('should initialize with empty context', () => {
      const context = createGroupContext('test')[2]

      expect(context.selectedIds.size).toBe(0)
      expect(context.selectedItems.value.size).toBe(0)
      expect(context.selectedValues.value.size).toBe(0)
      expect(context.collection.size).toBe(0)
    })
  })

  describe('item registration', () => {
    it('should register items with default values', () => {
      const context = createGroupContext('test')[2]

      const ticket = context.register()

      expect(ticket.id).toBeDefined()
      expect(ticket.disabled).toBe(false)
      expect(ticket.value).toBe(0)
      expect(ticket.valueIsIndex).toBe(true)
      expect(ticket.index).toBe(0)
      expect(typeof ticket.isActive).toBe('boolean') // Ref
      expect(typeof ticket.toggle).toBe('function')
      expect(context.collection.size).toBe(1)
    })

    it('should register items with custom values', () => {
      const context = createGroupContext('test')[2]

      const ticket = context.register({
        id: 'custom-id',
        disabled: true,
        value: 'custom-value',
      })

      expect(ticket.id).toBe('custom-id')
      expect(ticket.disabled).toBe(true)
      expect(ticket.value).toBe('custom-value')
      expect(ticket.valueIsIndex).toBe(false)
      expect(context.collection.size).toBe(1)
    })

    it('should unregister items', () => {
      const context = createGroupContext('test')[2]

      context.register({ id: 'test-item' })
      expect(context.collection.size).toBe(1)

      context.unregister('test-item')
      expect(context.collection.size).toBe(0)
    })

    it('should remove from selectedIds when unregistering', () => {
      const context = createGroupContext('test')[2]

      context.register({ id: 'test-item' })
      context.select('test-item')
      expect(context.selectedIds.has('test-item')).toBe(true)

      context.unregister('test-item')
      expect(context.selectedIds.has('test-item')).toBe(false)
    })
  })

  describe('selection behavior', () => {
    it('should select and deselect items', () => {
      const context = createGroupContext('test')[2]

      const ticket1 = context.register({ id: 'item1' })
      context.register({ id: 'item2' })

      context.select('item1')
      expect(context.selectedIds.has('item1')).toBe(true)
      expect(ticket1.isActive).toBe(true)

      context.select('item1') // Toggle off
      expect(context.selectedIds.has('item1')).toBe(false)
      expect(ticket1.isActive).toBe(false)
    })

    it('should handle multiple selection array', async () => {
      const context = createGroupContext('test', { multiple: true })[2]

      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.register({ id: 'item3' })

      context.select(['item1', 'item3'])

      console.log(context.selectedIds)

      expect(context.selectedIds.has('item1')).toBe(true)
      expect(context.selectedIds.has('item3')).toBe(true)
      expect(context.selectedIds.has('item2')).toBe(false)
    })

    it('should skip disabled items during selection', () => {
      const context = createGroupContext('test')[2]

      context.register({ id: 'item1', disabled: true })
      context.register({ id: 'item2' })

      context.select('item1')
      expect(context.selectedIds.has('item1')).toBe(false)

      context.select('item2')
      expect(context.selectedIds.has('item2')).toBe(true)
    })

    it('should toggle items via ticket.toggle()', () => {
      const context = createGroupContext('test')[2]

      const ticket = context.register({ id: 'item1' })

      ticket.toggle()
      expect(context.selectedIds.has('item1')).toBe(true)

      ticket.toggle()
      expect(context.selectedIds.has('item1')).toBe(false)
    })
  })

  describe('single selection mode (default)', () => {
    it('should clear previous selection when selecting new item', () => {
      const context = createGroupContext('test')[2]

      context.register({ id: 'item1' })
      context.register({ id: 'item2' })

      context.select('item1')
      expect(context.selectedIds.has('item1')).toBe(true)

      context.select('item2')
      expect(context.selectedIds.has('item1')).toBe(false)
      expect(context.selectedIds.has('item2')).toBe(true)
      expect(context.selectedIds.size).toBe(1)
    })
  })

  describe('multiple selection mode', () => {
    it('should allow multiple selections', () => {
      const context = createGroupContext('test-multiple', { multiple: true })[2]

      context.register({ id: 'item1' })
      context.register({ id: 'item2' })

      context.select('item1')
      context.select('item2')

      expect(context.selectedIds.has('item1')).toBe(true)
      expect(context.selectedIds.has('item2')).toBe(true)
      expect(context.selectedIds.size).toBe(2)
    })
  })

  describe('mandatory mode', () => {
    it('should auto-select first non-disabled item with mandatory: true', () => {
      const context = createGroupContext('test-mandatory', { mandatory: true })[2]

      context.register({ id: 'item1' })
      context.register({ id: 'item2' })

      context.mandate()

      expect(context.selectedIds.has('item1')).toBe(true)
    })

    it('should auto-select first item with mandatory: "force"', () => {
      const context = createGroupContext('test-force', { mandatory: 'force' })[2]

      context.register({ id: 'item1', disabled: true })
      context.register({ id: 'item2' })

      expect(context.selectedIds.has('item2')).toBe(true)
    })

    it('should prevent deselection in single selection mandatory mode', () => {
      const context = createGroupContext('test-mandatory-single', { mandatory: true })[2]

      context.register({ id: 'item1' })
      context.select('item1')

      // Try to deselect - should not work
      context.select('item1')

      expect(context.selectedIds.has('item1')).toBe(true)
    })

    it('should prevent deselection of last item in multiple selection mandatory mode', () => {
      const context = createGroupContext('test-mandatory-multiple', {
        mandatory: true,
        multiple: true,
      })[2]

      context.register({ id: 'item1' })
      context.register({ id: 'item2' })

      context.select('item1')
      expect(context.selectedIds.size).toBe(1)

      context.select('item1')
      expect(context.selectedIds.has('item1')).toBe(true)

      context.select('item2')
      expect(context.selectedIds.size).toBe(2)

      context.select('item1')
      expect(context.selectedIds.has('item1')).toBe(false)
      expect(context.selectedIds.has('item2')).toBe(true)
    })
  })

  describe('computed values', () => {
    it('should compute selectedItems correctly', () => {
      const context = createGroupContext('test')[2]

      context.register({ id: 'item1', value: 'value1' })
      context.register({ id: 'item2', value: 'value2' })

      context.select('item1')

      const selectedItems = Array.from(context.selectedItems.value)
      expect(selectedItems).toHaveLength(1)
      expect(selectedItems[0]?.id).toBe('item1')
      expect(selectedItems[0]?.value).toBe('value1')
    })

    it('should compute selectedValues correctly', () => {
      const context = createGroupContext('test', { multiple: true })[2]

      context.register({ id: 'item1', value: 'value1' })
      context.register({ id: 'item2', value: 'value2' })

      context.select(['item1', 'item2'])

      const selectedValues = Array.from(context.selectedValues.value)
      // Values are stored as refs, so we need to check the actual ref values
      expect(selectedValues.some(v => (v as any) === 'value1')).toBe(true)
      expect(selectedValues.some(v => (v as any) === 'value2')).toBe(true)
      expect(selectedValues).toHaveLength(2)
    })
  })

  describe('reset functionality', () => {
    it('should clear all selections and reindex', () => {
      const context = createGroupContext('test', { multiple: true })[2]

      context.register({ id: 'item1' })
      context.register({ id: 'item2' })
      context.select(['item1', 'item2'])

      expect(context.selectedIds.size).toBe(2)
      context.reset()
      expect(context.selectedIds.size).toBe(0)
    })
  })

  describe('model binding', () => {
    it('should sync with single model value', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const model = ref('value1')
      const [, provideContext] = createGroupContext('test-model')
      const context = provideContext(model)

      context.register({ id: 'item1', value: 'value1' })
      context.register({ id: 'item2', value: 'value2' })

      expect(context.selectedIds.has('item1')).toBe(true)

      model.value = 'value2'

      expect(context.selectedIds.has('item1')).toBe(true)
      expect(context.selectedIds.has('item2')).toBe(false)

      context.select('item2')

      await nextTick()

      expect((model.value)).toBe('value2')
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('provide() can only be used inside setup()'),
      )
      warnSpy.mockRestore()
    })

    // Silence expected Vue warning for provide() outside setup()
    it('should sync with multiple model values', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const model = ref(['value1', 'value2'])
      const [, provideContext] = createGroupContext('test-model-multiple', { multiple: true })
      const context = provideContext(model)

      context.register({ id: 'item1', value: 'value1' })
      context.register({ id: 'item2', value: 'value2' })
      context.register({ id: 'item3', value: 'value3' })

      expect(context.selectedIds.has('item1')).toBe(true)
      expect(context.selectedIds.has('item2')).toBe(true)
      expect(context.selectedIds.has('item3')).toBe(false)

      model.value = ['value3']

      expect(context.selectedIds.has('item1')).toBe(true)
      expect(context.selectedIds.has('item2')).toBe(true)
      expect(context.selectedIds.has('item3')).toBe(false)

      context.select(['item1', 'item3'])

      await nextTick()

      expect((model.value)).toEqual(expect.arrayContaining(['value2', 'value3']))
      expect(model.value).toHaveLength(2)
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('provide() can only be used inside setup()'),
      )
      warnSpy.mockRestore()
    })

    it('should return objects when returnObject is true', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const model = ref(null)
      const [, provideContext] = createGroupContext('test-return-object', { returnObject: true })
      const context = provideContext(model)

      context.register({ id: 'item1', value: 'value1' })

      context.select('item1')

      await nextTick()

      expect(model.value).toEqual(expect.objectContaining({
        id: 'item1',
        value: 'value1',
      }))
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('provide() can only be used inside setup()'),
      )
      warnSpy.mockRestore()
    })
  })

  describe('edge cases', () => {
    it('should handle selecting non-existent items', () => {
      const context = createGroupContext('test')[2]

      context.register({ id: 'item1' })
      context.select('non-existent')

      expect(context.selectedIds.size).toBe(0)
    })

    it('should handle empty arrays in select', () => {
      const context = createGroupContext('test')[2]

      context.register({ id: 'item1' })
      context.select([])

      expect(context.selectedIds.size).toBe(0)
    })

    it('should handle null/undefined values in select', () => {
      const context = createGroupContext('test')[2]

      context.register({ id: 'item1' })
      context.select([null, undefined, 'item1'] as any)

      expect(context.selectedIds.has('item1')).toBe(true)
      expect(context.selectedIds.size).toBe(1)
    })

    it('should not mandate when items already selected', () => {
      const context = createGroupContext('test-no-mandate', { mandatory: true })[2]

      context.register({ id: 'item1' })
      context.register({ id: 'item2' })

      context.select('item2')
      context.mandate()

      expect(context.selectedIds.has('item2')).toBe(true)
      expect(context.selectedIds.has('item1')).toBe(false)
      expect(context.selectedIds.size).toBe(1)
    })

    it('should not mandate when no items registered', () => {
      const context = createGroupContext('test-no-items', { mandatory: true })[2]

      context.mandate()

      expect(context.selectedIds.size).toBe(0)
    })

    it('should return ID for registered value and undefined for non-existent value', () => {
      const group = createGroupContext('test-group')[2]

      const ticket = group.register({ value: 'test-value' })

      expect(group.browse('test-value')).toBe(ticket.id)
      expect(group.browse('non-existent')).toBeUndefined()
    })
  })
})
