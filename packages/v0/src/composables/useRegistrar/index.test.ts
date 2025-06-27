import { describe, expect, it } from 'vitest'
import { useRegistrar } from './index'

describe('useRegistrar', () => {
  it('should register and unregister items', () => {
    const [, provideContext, state] = useRegistrar('test')

    const context = provideContext()

    // Register first item
    const ticket1 = context.register({ id: 'item1' })
    expect(ticket1.id).toBe('item1')
    expect(ticket1.index).toBe(0)
    expect(state.registeredItems.size).toBe(1)

    // Register second item with auto-generated ID
    const ticket2 = context.register()
    expect(ticket2.index).toBe(1)
    expect(state.registeredItems.size).toBe(2)

    // Register third item
    const ticket3 = context.register({ id: 'item3' })
    expect(ticket3.id).toBe('item3')
    expect(ticket3.index).toBe(2)
    expect(state.registeredItems.size).toBe(3)

    // Unregister first item
    context.unregister('item1')
    expect(state.registeredItems.size).toBe(2)
    expect(state.registeredItems.has('item1')).toBe(false)

    // Check that indices are recomputed
    const remainingItems = Array.from(state.registeredItems.values())
    expect(remainingItems[0].index).toBe(0)
    expect(remainingItems[1].index).toBe(1)
  })

  it('should auto-generate unique IDs', () => {
    const [, provideContext, state] = useRegistrar('test')

    const context = provideContext()

    const ticket1 = context.register()
    const ticket2 = context.register()

    expect(ticket1.id).not.toBe(ticket2.id)
    expect(state.registeredItems.size).toBe(2)
  })

  it('should maintain correct indices after reindexing', () => {
    const [, provideContext, state] = useRegistrar('test')

    const context = provideContext()

    // Register multiple items
    context.register({ id: 'item1' })
    context.register({ id: 'item2' })
    context.register({ id: 'item3' })

    // Remove middle item
    context.unregister('item2')

    // Check that remaining items have correct indices
    const item1 = state.registeredItems.get('item1')
    const item3 = state.registeredItems.get('item3')

    expect(item1?.index).toBe(0)
    expect(item3?.index).toBe(1)
  })
})
