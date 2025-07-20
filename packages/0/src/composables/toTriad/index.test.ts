import { describe, it, expect, vi } from 'vitest'
import { toTriad } from '../index'

describe('toTriad', () => {
  it('should create a triad with use, provide, and context', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const triad = toTriad(mockUseContext, mockProvideContext, mockContext)

    expect(triad).toHaveLength(3)
    expect(typeof triad[0]).toBe('function') // useContext
    expect(typeof triad[1]).toBe('function') // provideContext wrapper
    expect(triad[2]).toBe(mockContext) // context
  })

  it('should call the original useContext function', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const [useContext] = toTriad(mockUseContext, mockProvideContext, mockContext)

    const result = useContext()

    expect(mockUseContext).toHaveBeenCalledOnce()
    expect(result).toBe(mockContext)
  })

  it('should wrap provideContext with default context handling', () => {
    const mockContext = { value: 'test' }
    const customContext = { value: 'custom' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const [, provideContext] = toTriad(mockUseContext, mockProvideContext, mockContext)

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

    const [, provideContext] = toTriad(mockUseContext, mockProvideContext, mockContext)

    provideContext(undefined, mockApp)

    expect(mockProvideContext).toHaveBeenCalledWith(mockContext, mockApp)
  })

  it('should return readonly tuple', () => {
    const mockContext = { value: 'test' }
    const mockUseContext = vi.fn(() => mockContext)
    const mockProvideContext = vi.fn(context => context)

    const triad = toTriad(mockUseContext, mockProvideContext, mockContext)

    // Should be read-only, but we can't directly test this in runtime
    // The type system ensures it's readonly
    expect(Array.isArray(triad)).toBe(true)
    expect(Object.isFrozen(triad)).toBe(false) // as const doesn't freeze, just makes readonly at type level
  })
})
