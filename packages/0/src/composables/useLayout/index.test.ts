import { describe, it, expect } from 'vitest'
import { useLayout } from './index.ts'

describe('useLayout', () => {
  it('registers components', () => {
    const context = useLayout('layout')[2]
    context.register({ id: 'Component1', position: 'top', size: 32 })
    context.register({ id: 'Component2', position: 'bottom', size: 64 })
    expect(context.collection.has('Component1')).toEqual(true)
    expect(context.collection.has('Component2')).toEqual(true)
  })

  it('calculates bound', () => {
    const context = useLayout('layout')[2]
    context.register({ id: 'Component1', position: 'top', size: 32 })
    context.register({ id: 'Component2', position: 'bottom', size: 128 })
    context.register({ id: 'Component3', position: 'left', size: 64 })

    expect(context.bounds.top.value).toEqual(32)
    expect(context.bounds.bottom.value).toEqual(128)
    expect(context.bounds.left.value).toEqual(64)
  })
})
