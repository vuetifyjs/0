// Composables
import { useSelection } from './index'

// Utilities
import { describe, it, expect } from 'vitest'

describe('useSelection', () => {
  it('should add selection properties to registered items', () => {
    const context = useSelection()

    const ticket = context.register({ id: 'item1' })

    expect(ticket.disabled).toBe(false)
    expect(ticket.isActive).toBe(false)
    expect(ticket.valueIsIndex).toBe(true)
    expect(typeof ticket.toggle).toBe('function')
    expect(context.selectedIds.size).toBe(0)
  })

  it('should toggle selection state correctly', () => {
    const context = useSelection()

    const ticket1 = context.register({ id: 'item1' })
    const ticket2 = context.register({ id: 'item2' })

    expect(ticket1.isActive).toBe(false)
    expect(ticket2.isActive).toBe(false)
    expect(context.selectedIds.size).toBe(0)

    ticket1.toggle()
    expect(ticket1.isActive).toBe(true)
    expect(ticket2.isActive).toBe(false)
    expect(context.selectedIds.size).toBe(1)
    expect(context.selectedIds.has('item1')).toBe(true)

    ticket2.toggle()
    expect(ticket1.isActive).toBe(true)
    expect(ticket2.isActive).toBe(true)
    expect(context.selectedIds.size).toBe(2)
    expect(context.selectedIds.has('item2')).toBe(true)

    ticket1.toggle()
    expect(ticket1.isActive).toBe(false)
    expect(ticket2.isActive).toBe(true)
    expect(context.selectedIds.size).toBe(1)
    expect(context.selectedIds.has('item1')).toBe(false)
  })

  it('should clean up selectedIds when unregistering items', () => {
    const context = useSelection()

    const ticket1 = context.register({ id: 'item1' })
    const ticket2 = context.register({ id: 'item2' })

    ticket1.toggle()
    ticket2.toggle()
    expect(context.selectedIds.size).toBe(2)

    context.unregister('item1')
    expect(context.selectedIds.size).toBe(1)
    expect(context.selectedIds.has('item1')).toBe(false)
    expect(context.selectedIds.has('item2')).toBe(true)
  })

  it('should reset selection state and reindex', () => {
    const context = useSelection()

    const ticket1 = context.register({ id: 'item1' })
    const ticket2 = context.register({ id: 'item2' })
    const ticket3 = context.register({ id: 'item3' })

    ticket1.toggle()
    ticket3.toggle()
    expect(context.selectedIds.size).toBe(2)

    context.unregister('item2')
    context.reset()

    expect(context.selectedIds.size).toBe(0)
    expect(ticket1.isActive).toBe(false)
    expect(ticket3.isActive).toBe(false)
    expect(ticket1.index).toBe(0)
    expect(ticket3.index).toBe(1)
  })

  it('should handle disabled state in registration', () => {
    const context = useSelection()

    const ticket1 = context.register({ id: 'item1', disabled: true })
    const ticket2 = context.register({ id: 'item2', disabled: false })

    expect(ticket1.disabled).toBe(true)
    expect(ticket2.disabled).toBe(false)
  })

  it('should handle valueIsIndex property correctly', () => {
    const context = useSelection()

    const ticket1 = context.register({ id: 'item1' })
    const ticket2 = context.register({ id: 'item2', value: 'custom' })

    expect(ticket1.valueIsIndex).toBe(true)
    expect(ticket2.valueIsIndex).toBe(false)
  })

  it('should maintain reactive isActive state', () => {
    const context = useSelection()

    const ticket = context.register({ id: 'item1' })

    expect(ticket.isActive).toBe(false)

    context.selectedIds.add('item1')
    expect(ticket.isActive).toBe(true)

    context.selectedIds.delete('item1')
    expect(ticket.isActive).toBe(false)
  })
})
