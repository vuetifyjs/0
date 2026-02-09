import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide } from 'vue'

// Types
import type { SingleTicketInput } from './index'

import { createSingle, createSingleContext, useSingle } from './index'

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

describe('useSingle', () => {
  describe('single selection enforcement', () => {
    it('should only allow one item to be selected at a time', () => {
      const single = createSingle()

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
      const single = createSingle()

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
      const single = createSingle()

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
      const single = createSingle()

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
      const single = createSingle()

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
      const single = createSingle()

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
      const single = createSingle()

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
      const single = createSingle()

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
      const single = createSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      single.toggle('item-1')
      expect(single.selectedIds.has('item-1')).toBe(true)
    })

    it('should toggle item off when selected', () => {
      const single = createSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      single.select('item-1')
      expect(single.selectedIds.has('item-1')).toBe(true)

      single.toggle('item-1')
      expect(single.selectedIds.has('item-1')).toBe(false)
    })

    it('should clear other selections when toggling on', () => {
      const single = createSingle()

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
      const single = createSingle({ mandatory: true })

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
      const single = createSingle({ mandatory: true })

      single.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      single.select('item-1')
      single.toggle('item-1')

      // Should still be selected due to mandatory
      expect(single.selectedIds.has('item-1')).toBe(true)
    })

    it('should allow switching selections in mandatory mode', () => {
      const single = createSingle({ mandatory: true })

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
      const single = createSingle({ mandatory: 'force' })

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(single.selectedId.value).toBe('item-1')
    })

    it('should skip disabled items with mandatory force', () => {
      const single = createSingle({ mandatory: 'force' })

      single.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(single.selectedId.value).toBe('item-2')
    })
  })

  describe('disabled items', () => {
    it('should not select disabled items', () => {
      const single = createSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      single.select('item-2')
      expect(single.selectedId.value).toBeUndefined()
    })

    it('should not switch to disabled item', () => {
      const single = createSingle()

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
    it('should auto-select last non-disabled item with enroll (single-select)', () => {
      const single = createSingle({ enroll: true })

      single.onboard([
        { id: 'item-1', value: 'value-1' },
        { id: 'item-2', value: 'value-2' },
      ])

      // Single-select: enroll replaces selection, so only last item is selected
      expect(single.selectedIds.size).toBe(1)
      expect(single.selectedId.value).toBe('item-2')
    })

    it('should skip disabled items with enroll', () => {
      const single = createSingle({ enroll: true })

      single.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2' },
      ])

      expect(single.selectedId.value).toBe('item-2')
    })
  })

  describe('edge cases', () => {
    it('should handle empty registry', () => {
      const single = createSingle()

      expect(single.selectedId.value).toBeUndefined()
      expect(single.selectedIndex.value).toBe(-1)
      expect(single.selectedItem.value).toBeUndefined()
      expect(single.selectedValue.value).toBeUndefined()
    })

    it('should handle selecting non-existent item', () => {
      const single = createSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1' },
      ])

      single.select('non-existent')
      expect(single.selectedId.value).toBeUndefined()
    })

    it('should handle all disabled items', () => {
      const single = createSingle()

      single.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      single.select('item-1')
      expect(single.selectedId.value).toBeUndefined()
    })

    it('should handle all disabled items with mandatory force', () => {
      const single = createSingle({ mandatory: 'force' })

      single.onboard([
        { id: 'item-1', value: 'value-1', disabled: true },
        { id: 'item-2', value: 'value-2', disabled: true },
      ])

      expect(single.selectedId.value).toBeUndefined()
    })

    it('should maintain correct registry size after unregistering items', () => {
      const single = createSingle()

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

describe('createSingleContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a trinity tuple', () => {
    const result = createSingleContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function') // useSingleContext
    expect(typeof result[1]).toBe('function') // provideSingleContext
    expect(result[2]).toBeDefined() // default context
  })

  it('should create context with default namespace', () => {
    const [, provideSingleContext, context] = createSingleContext()

    provideSingleContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:single', context)
  })

  it('should create context with custom namespace', () => {
    const [, provideSingleContext, context] = createSingleContext({
      namespace: 'my-tabs',
    })

    provideSingleContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-tabs', context)
  })

  it('should create a functional single selection context', () => {
    const [,, context] = createSingleContext()

    context.onboard([
      { id: 'tab-1', value: 'Tab 1' },
      { id: 'tab-2', value: 'Tab 2' },
    ])

    context.select('tab-1')
    expect(context.selectedId.value).toBe('tab-1')

    context.select('tab-2')
    expect(context.selectedId.value).toBe('tab-2')
    expect(context.selectedIds.size).toBe(1)
  })

  it('should allow providing custom context', () => {
    const [, provideSingleContext] = createSingleContext()
    const customContext = createSingle({ mandatory: true })

    provideSingleContext(customContext)

    expect(mockProvide).toHaveBeenCalledWith('v0:single', customContext)
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = {
      provide: vi.fn(),
    } as any
    const [, provideSingleContext, context] = createSingleContext()

    provideSingleContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:single', context)
    expect(mockProvide).not.toHaveBeenCalled()
  })

  it('should pass options to createSingle', () => {
    const [,, context] = createSingleContext({
      mandatory: true,
    })

    context.onboard([
      { id: 'item-1', value: 'Item 1' },
    ])

    context.select('item-1')
    context.unselect('item-1')

    // Should still be selected due to mandatory
    expect(context.selectedId.value).toBe('item-1')
  })
})

describe('useSingle consumer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createSingle()
    mockInject.mockReturnValue(mockContext)

    const result = useSingle()

    expect(mockInject).toHaveBeenCalledWith('v0:single', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createSingle()
    mockInject.mockReturnValue(mockContext)

    const result = useSingle('my-tabs')

    expect(mockInject).toHaveBeenCalledWith('my-tabs', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useSingle()).toThrow(
      'Context "v0:single" not found. Ensure it\'s provided by an ancestor.',
    )
  })

  it('should throw with custom namespace in error message', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useSingle('custom-single')).toThrow(
      'Context "custom-single" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})

describe('custom ticket types', () => {
  it('should allow extending SingleTicketInput with custom properties', () => {
    interface TabTicket extends SingleTicketInput {
      label: string
      icon?: string
    }

    const tabs = createSingle<TabTicket>()

    // Register accepts input type with custom properties
    const ticket = tabs.register({ label: 'Home', icon: 'mdi-home' })

    // Output has input properties
    expect(ticket.label).toBe('Home')
    expect(ticket.icon).toBe('mdi-home')

    // Output has selection methods
    expect(ticket.isSelected.value).toBe(false)
    ticket.select()
    expect(ticket.isSelected.value).toBe(true)
  })

  it('should preserve custom properties in singular computed properties', () => {
    interface AccordionTicket extends SingleTicketInput {
      title: string
      content: string
    }

    const accordion = createSingle<AccordionTicket>()

    accordion.onboard([
      { id: 'panel-1', title: 'Section 1', content: 'Content 1' },
      { id: 'panel-2', title: 'Section 2', content: 'Content 2' },
    ])

    accordion.select('panel-1')

    // selectedItem has custom properties
    expect(accordion.selectedItem.value?.title).toBe('Section 1')
    expect(accordion.selectedItem.value?.content).toBe('Content 1')
    expect(accordion.selectedItem.value?.isSelected.value).toBe(true)
  })

  it('should work with createSingleContext and custom types', () => {
    interface DropdownTicket extends SingleTicketInput {
      label: string
      disabled?: boolean
    }

    const [, , context] = createSingleContext<DropdownTicket>()

    context.onboard([
      { label: 'Option A' },
      { label: 'Option B', disabled: true },
      { label: 'Option C' },
    ])

    const tickets = context.values()
    expect(tickets[0]?.label).toBe('Option A')
    expect(tickets[1]?.label).toBe('Option B')
    expect(tickets[1]?.disabled).toBe(true)
  })
})
