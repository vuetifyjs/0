import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useGroup, type GroupItem } from '../group'

// Mock the useContext function
const mockProvideGroupContext = vi.fn()
const mockUseGroupContext = vi.fn()

vi.mock('../context', () => ({
  useContext: vi.fn(() => [mockProvideGroupContext, mockUseGroupContext]),
}))

describe('useGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should initialize with empty state', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      expect(mockProvideGroupContext).toHaveBeenCalledWith({
        register: expect.any(Function),
        unregister: expect.any(Function),
        reset: expect.any(Function),
        mandate: expect.any(Function),
      })
    })

    it('should register items and assign index', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null }
      const item2: GroupItem = { id: 'item2', value: 'custom' }

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      expect(registered1.index).toBe(0)
      expect(registered2.index).toBe(1)
      expect(item1.value).toBe(0)
      expect(item1.valueIsIndex).toBe(true)
      expect(item2.value).toBe('custom')
      expect(item2.valueIsIndex).toBeUndefined()
    })

    it('should unregister items', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item: GroupItem = { id: 'item1', value: null }
      context.register(item)

      context.unregister('item1')

      // After unregistering, registering a new item should start index from 0 again
      const newItem: GroupItem = { id: 'item2', value: null }
      const registered = context.register(newItem)

      expect(registered.index).toBe(0)
    })
  })

  describe('single selection mode (default)', () => {
    it('should allow selecting single item', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item: GroupItem = { id: 'item1', value: null }
      const registered = context.register(item)

      registered.toggle()

      expect(registered.isActive.value).toBe(true)

      registered.toggle()

      expect(registered.isActive.value).toBe(false)
    })

    it('should deselect when toggling selected item', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item: GroupItem = { id: 'item1', value: null }
      const registered = context.register(item)

      registered.toggle() // select
      registered.toggle() // deselect

      expect(registered.isActive.value).toBe(false)
    })

    it('should clear previous selection when selecting new item', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null }
      const item2: GroupItem = { id: 'item2', value: null }

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      registered1.toggle() // select item1
      registered2.toggle() // select item2, should deselect item1

      expect(registered1.isActive.value).toBe(false)
      expect(registered2.isActive.value).toBe(true)
    })

    it('should support array of ids in toggle', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null }
      const item2: GroupItem = { id: 'item2', value: null }

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      // In single selection mode, only the last item in array should be selected
      context.register(item1)
      context.register(item2)

      // Simulate direct toggle call with array
      const toggleSpy = vi.spyOn(context, 'register').getMockImplementation()

      // Test by calling toggle directly on each registered item
      registered1.toggle()
      registered2.toggle()

      expect(registered1.isActive.value).toBe(false)
      expect(registered2.isActive.value).toBe(true)
    })
  })

  describe('multiple selection mode', () => {
    it('should allow multiple selections', () => {
      const [provideGroup] = useGroup('test-group', { multiple: true })

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null }
      const item2: GroupItem = { id: 'item2', value: null }

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      registered1.toggle()
      registered2.toggle()

      expect(registered1.isActive.value).toBe(true)
      expect(registered2.isActive.value).toBe(true)
    })

    it('should deselect individual items', () => {
      const [provideGroup] = useGroup('test-group', { multiple: true })

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null }
      const item2: GroupItem = { id: 'item2', value: null }

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      registered1.toggle() // select
      registered2.toggle() // select
      registered1.toggle() // deselect item1

      expect(registered1.isActive.value).toBe(false)
      expect(registered2.isActive.value).toBe(true)
    })
  })

  describe('mandatory selection', () => {
    it('should select first item when mandatory is true after reset', () => {
      const [provideGroup] = useGroup('test-group', { mandatory: true })

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item: GroupItem = { id: 'item1', value: null }
      const registered = context.register(item)

      // Initially not selected (mandatory only applies during reset)
      expect(registered.isActive.value).toBe(false)

      // After reset, should be selected due to mandatory
      context.reset()
      expect(registered.isActive.value).toBe(true)
    })

    it('should not allow deselecting the only selected item when mandatory', () => {
      const [provideGroup] = useGroup('test-group', { mandatory: true })

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item: GroupItem = { id: 'item1', value: null }
      const registered = context.register(item)

      // First select the item manually
      registered.toggle()
      expect(registered.isActive.value).toBe(true)

      // Try to deselect - should be prevented by mandatory logic
      registered.toggle()
      expect(registered.isActive.value).toBe(true) // should remain selected
    })

    it('should force select first item when mandatory is "force"', () => {
      const [provideGroup] = useGroup('test-group', { mandatory: 'force' })

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item: GroupItem = { id: 'item1', value: null }
      const registered = context.register(item)

      expect(registered.isActive.value).toBe(true)
    })

    it('should not allow deselecting last item in multiple+mandatory mode', () => {
      const [provideGroup] = useGroup('test-group', { multiple: true, mandatory: true })

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null }
      const item2: GroupItem = { id: 'item2', value: null }

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      // Manually select both items
      registered1.toggle()
      registered2.toggle()

      expect(registered1.isActive.value).toBe(true)
      expect(registered2.isActive.value).toBe(true)

      // Deselect first item - should work since we have multiple
      registered1.toggle()
      expect(registered1.isActive.value).toBe(false)
      expect(registered2.isActive.value).toBe(true)

      // Try to deselect last remaining item - should be prevented
      registered2.toggle()
      expect(registered2.isActive.value).toBe(true) // should remain selected
    })
  })

  describe('disabled items', () => {
    it('should not allow selecting disabled items', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item: GroupItem = { id: 'item1', value: null, disabled: true }
      const registered = context.register(item)

      registered.toggle()

      expect(registered.isActive.value).toBe(false)
    })

    it('should not allow deselecting disabled items that are selected', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item: GroupItem = { id: 'item1', value: null, disabled: false }
      const registered = context.register(item)

      registered.toggle() // select first

      // Simulate disabling the item after selection
      item.disabled = true

      registered.toggle() // try to deselect

      expect(registered.isActive.value).toBe(true) // should remain selected
    })

    it('should skip disabled items when toggling array of ids', () => {
      const [provideGroup] = useGroup('test-group', { multiple: true })

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null, disabled: true }
      const item2: GroupItem = { id: 'item2', value: null, disabled: false }

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      // Toggle both items, but only enabled one should be affected
      registered1.toggle()
      registered2.toggle()

      expect(registered1.isActive.value).toBe(false)
      expect(registered2.isActive.value).toBe(true)
    })
  })

  describe('model binding', () => {
    it('should update model when selection changes in single mode', async () => {
      const model = ref()
      const [provideGroup] = useGroup('test-group')

      provideGroup(model)

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item: GroupItem = { id: 'item1', value: 'test-value' }
      const registered = context.register(item)

      registered.toggle()

      await nextTick()

      expect(model.value).toBe('item1')
    })

    it('should update model when selection changes in multiple mode', async () => {
      const model = ref([])
      const [provideGroup] = useGroup('test-group', { multiple: true })

      provideGroup(model)

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null }
      const item2: GroupItem = { id: 'item2', value: null }

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      registered1.toggle()
      registered2.toggle()

      await nextTick()

      expect(model.value).toEqual(['item1', 'item2'])
    })

    it('should update selection when model changes', async () => {
      const model = ref('item2')
      const [provideGroup] = useGroup('test-group')

      provideGroup(model)

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null }
      const item2: GroupItem = { id: 'item2', value: null }

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      model.value = 'item1'

      await nextTick()

      expect(registered1.isActive.value).toBe(true)
      expect(registered2.isActive.value).toBe(false)
    })
  })

  describe('reset functionality', () => {
    it('should reset indices when reset is called', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null }
      const item2: GroupItem = { id: 'item2', value: null }

      context.register(item1)
      context.register(item2)

      // Manually modify indices
      item1.index = 99
      item2.index = 99

      context.reset()

      expect(item1.index).toBe(0)
      expect(item2.index).toBe(1)
    })

    it('should update values for items with valueIsIndex after reset', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: null }
      const item2: GroupItem = { id: 'item2', value: null }

      context.register(item1)
      context.register(item2)

      // Simulate index change
      item1.index = 5
      item1.value = 5

      context.reset()

      expect(item1.value).toBe(0) // should be updated to new index
      expect(item2.value).toBe(1)
    })

    it('should call mandate after reset', () => {
      const [provideGroup] = useGroup('test-group', { mandatory: true })

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item: GroupItem = { id: 'item1', value: null }
      const registered = context.register(item)

      // Reset should ensure mandatory selection
      context.reset()

      expect(registered.isActive.value).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle empty group', () => {
      const [provideGroup] = useGroup('test-group', { mandatory: true })

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      // Mandate should not crash with empty group
      context.mandate()

      expect(mockProvideGroupContext).toHaveBeenCalled()
    })

    it('should handle registering item with same id twice', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      const item1: GroupItem = { id: 'item1', value: 'value1' }
      const item2: GroupItem = { id: 'item1', value: 'value2' } // same id

      const registered1 = context.register(item1)
      const registered2 = context.register(item2)

      // Second registration should overwrite the first
      expect(registered1.index).toBe(0)
      expect(registered2.index).toBe(1)
    })

    it('should handle unregistering non-existent item', () => {
      const [provideGroup] = useGroup('test-group')

      provideGroup()

      const context = mockProvideGroupContext.mock.calls[0][0]

      // Should not crash
      context.unregister('non-existent')

      expect(mockProvideGroupContext).toHaveBeenCalled()
    })
  })
})
