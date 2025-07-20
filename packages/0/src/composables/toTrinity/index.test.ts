import { describe, it, expect, vi } from 'vitest'
import { toTrinity } from '../index'

describe('toTrinity', () => {
  it('should create a trinity with use, provide, and context', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const trinity = toTrinity(mockUseContext, mockProvideContext, mockContext)

    expect(trinity).toHaveLength(3)
    expect(typeof trinity[0]).toBe('function') // useContext
    expect(typeof trinity[1]).toBe('function') // provideContext wrapper
    expect(trinity[2]).toBe(mockContext) // context
  })

  it('should call the original useContext function', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const [useContext] = toTrinity(mockUseContext, mockProvideContext, mockContext)

    const result = useContext()

    expect(mockUseContext).toHaveBeenCalledOnce()
    expect(result).toBe(mockContext)
  })

  it('should wrap provideContext with default context handling', () => {
    const mockContext = { value: 'test' }
    const customContext = { value: 'custom' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const [, provideContext] = toTrinity(mockUseContext, mockProvideContext, mockContext)

    // Call with default context
    const result1 = provideContext()
    expect(mockProvideContext).toHaveBeenCalledWith(mockContext, undefined)
    expect(result1).toBe(mockContext)

    // Call with custom context
    const result2 = provideContext(customContext)
    expect(mockProvideContext).toHaveBeenCalledWith(customContext, undefined)
    expect(result2).toBe(customContext)
  })

  it('should pass app parameter to provideContext', () => {
    const mockContext = { value: 'test' }
    const mockApp = { version: '3.0.0' } as any
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const [, provideContext] = toTrinity(mockUseContext, mockProvideContext, mockContext)

    provideContext(undefined, mockApp)

    expect(mockProvideContext).toHaveBeenCalledWith(mockContext, mockApp)
  })

  it('should return readonly tuple', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const trinity = toTrinity(mockUseContext, mockProvideContext, mockContext)

    // Should be read-only, but we can't directly test this in runtime
    // The type system ensures it's readonly
    expect(Array.isArray(trinity)).toBe(true)
    expect(Object.isFrozen(trinity)).toBe(false) // as const doesn't freeze, just makes readonly at type level
  })
})
