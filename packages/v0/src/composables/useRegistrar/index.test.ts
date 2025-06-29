import { describe, it, expect } from 'vitest'
import { useRegistrar } from './index'

describe('useRegistrar', () => {
  it('should register and unregister items', () => {
    const [, provideContext, state] = useRegistrar('test')

    const context = provideContext()

    const ticket1 = context.register({ id: 'item1' })
    expect(ticket1.id).toBe('item1')
    expect(ticket1.index.value).toBe(0)
    expect(state.registeredItems.size).toBe(1)

    const ticket2 = context.register()
    expect(ticket2.index.value).toBe(1)
    expect(state.registeredItems.size).toBe(2)

    const ticket3 = context.register({ id: 'item3' })
    expect(ticket3.id).toBe('item3')
    expect(ticket3.index.value).toBe(2)
    expect(state.registeredItems.size).toBe(3)

    context.unregister('item1')
    expect(state.registeredItems.size).toBe(2)
    expect(state.registeredItems.has('item1')).toBe(false)

    expect(state.registeredItems.has(ticket2.id)).toBe(true)
    expect(state.registeredItems.has('item3')).toBe(true)
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

    const ticket1 = context.register({ id: 'item1' })
    const ticket2 = context.register({ id: 'item2' })
    const ticket3 = context.register({ id: 'item3' })

    expect(ticket1.index.value).toBe(0)
    expect(ticket2.index.value).toBe(1)
    expect(ticket3.index.value).toBe(2)

    context.unregister('item2')

    const ticket4 = context.register({ id: 'item4' })
    expect(ticket4.index.value).toBe(2)

    expect(state.registeredItems.has('item1')).toBe(true)
    expect(state.registeredItems.has('item2')).toBe(false)
    expect(state.registeredItems.has('item3')).toBe(true)
    expect(state.registeredItems.has('item4')).toBe(true)
  })
})
